const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const pool = require('./database');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// ========== Tạo / tìm user từ OAuth ==========
async function findOrCreateOAuthUser({ provider, providerId, email, name }) {
    const oauthEmail = email || `${provider}_${providerId}@fashionhub.local`;

    // Kiểm tra có user với email này không
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [oauthEmail]);
    if (existing.length > 0) return existing[0];

    // Tạo mới user (không có password vì đăng nhập qua OAuth)
    const [result, extra] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name || 'User', oauthEmail, '', 'customer']
    );
    const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [extra.insertId]);
    return newUser[0];
}

// ========== Google Strategy ==========
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        const user = await findOrCreateOAuthUser({
            provider: 'google',
            providerId: profile.id,
            email,
            name: profile.displayName
        });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// ========== Facebook Strategy ==========
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        const user = await findOrCreateOAuthUser({
            provider: 'facebook',
            providerId: profile.id,
            email,
            name: profile.displayName
        });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

module.exports = passport;
