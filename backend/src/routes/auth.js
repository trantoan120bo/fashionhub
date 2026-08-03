const router = require('express').Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

// ===== Mock OAuth (dùng khi chưa có Client ID thật) =====
async function mockOAuthLogin(provider, fakeEmail, fakeName, res) {
    try {
        let user;
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [fakeEmail]);
        if (existing.length > 0) {
            user = existing[0];
        } else {
            const [result] = await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [fakeName, fakeEmail, '', 'customer']
            );
            const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            user = newUser[0];
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Mock OAuth error:', err);
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

router.post('/google/mock', (req, res) => {
    mockOAuthLogin('google', 'google_demo@fashionhub.local', 'Google Demo User', res);
});

router.post('/facebook/mock', (req, res) => {
    mockOAuthLogin('facebook', 'facebook_demo@fashionhub.local', 'Facebook Demo User', res);
});

// ===== Google OAuth =====
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user.id, email: req.user.email, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        const user = encodeURIComponent(JSON.stringify({ id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role }));
        res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&user=${user}`);
    }
);

// ===== Facebook OAuth =====
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));
router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook_failed` }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user.id, email: req.user.email, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        const user = encodeURIComponent(JSON.stringify({ id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role }));
        res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&user=${user}`);
    }
);

module.exports = router;
