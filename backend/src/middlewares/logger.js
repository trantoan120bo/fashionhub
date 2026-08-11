const recentLogs = [];
const MAX_LOGS = 100;

exports.requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      id: Date.now() + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleString('vi-VN'),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip: clientIp,
      userAgent: req.headers['user-agent'] || 'Unknown'
    };

    // Ghi log ra Terminal Console
    console.log(`[REQUEST LOG] ${logEntry.timestamp} | ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms) - IP: ${clientIp}`);

    // Lưu vào bộ nhớ log để trả về cho Admin Page
    recentLogs.unshift(logEntry);
    if (recentLogs.length > MAX_LOGS) {
      recentLogs.pop();
    }
  });

  next();
};

exports.getRecentLogs = () => recentLogs;
