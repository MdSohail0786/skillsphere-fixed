const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Access token required' });
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (!user.isActive || user.isBanned) return res.status(403).json({ success: false, message: 'Account suspended' });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token expired' });
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Not authorized' });
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.userId);
    }
  } catch {}
  next();
};

// Aliases for backward compatibility
exports.authenticate = authenticate;
exports.authorize = authorize;
exports.optionalAuth = optionalAuth;
exports.protect = authenticate;
exports.restrictTo = authorize;
