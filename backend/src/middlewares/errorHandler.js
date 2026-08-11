// Middleware Xử lý Lỗi Tập Trung (Global Error Handler)
exports.errorHandler = (err, req, res, next) => {
  console.error(`[ERROR HANDLER EXCEPTION] ${new Date().toLocaleString('vi-VN')} | Route: ${req.originalUrl} | Error:`, err);

  const statusCode = err.statusCode || err.status || (res.statusCode >= 400 ? res.statusCode : 500);

  let message = err.message || 'Đã xảy ra lỗi nội bộ hệ thống';
  let details = err.details || null;

  // Xử lý các ngữ cảnh lỗi phổ biến
  if (err.name === 'ValidationError') {
    message = 'Dữ liệu không đáp ứng yêu cầu xác thực';
    details = err.errors ? Object.values(err.errors).map(e => e.message) : err.message;
  } else if (err.name === 'UnauthorizedError' || statusCode === 401) {
    message = 'Chưa xác thực hoặc Token đã hết hạn';
  } else if (statusCode === 403) {
    message = 'Bạn không có quyền truy cập chức năng này';
  } else if (statusCode === 404) {
    message = 'Tài nguyên hoặc đường dẫn yêu cầu không tồn tại';
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details: details || err.details || undefined,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
};
