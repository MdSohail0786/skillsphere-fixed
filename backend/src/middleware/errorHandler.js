const logger = require('../utils/logger');
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field} already exists`;
  }
  if (err.name === 'CastError') { statusCode = 400; message = `Invalid ${err.path}`; }
  if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired'; }
  logger.error(`${statusCode} - ${message} - ${req.method} ${req.originalUrl}`);
  res.status(statusCode).json({ success: false, message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) });
};
module.exports = errorHandler;
