const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { requestLogger, getRecentLogs } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { authenticate, isAdmin } = require('./middlewares/auth');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fix UTF-8 encoding cho tiếng Việt
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return originalJson(data);
  };
  next();
});

// Custom Middleware: Request Logger
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', userRoutes);

// Route riêng dành cho Admin xem Log Hệ thống Request
app.get('/api/admin/logs', authenticate, isAdmin, (req, res) => {
  res.json({
    success: true,
    totalLogs: getRecentLogs().length,
    logs: getRecentLogs()
  });
});

app.get('/', (req, res) => res.json({ message: 'FashionHub Backend API is running!', health: '/api/health' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Custom Middleware: Global Error Handler tập trung xử lý lỗi
app.use(errorHandler);

module.exports = app;
