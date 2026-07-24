const crypto = require("crypto");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateCryptoToken,
  hashToken,
  setRefreshCookie,
  clearRefreshCookie,
} = require("../utils/tokenUtils");
const { sendEmail } = require("../utils/email");
const asyncHandler = require("../utils/asyncHandler");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing)
    return res
      .status(400)
      .json({ success: false, message: "Email already registered" });
  const verifyToken = generateCryptoToken();
  const user = await User.create({
    name,
    email,
    password,
    role: role === "freelancer" ? "freelancer" : "client",
    emailVerificationToken: hashToken(verifyToken),
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
  });
  user.isEmailVerified = true;
  await user.save();
  const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
  await sendEmail({
    to: email,
    subject: "Verify Your SkillSphere Account",
    html: `<p>Hi ${name},</p><p><a href="${verifyLink}">Click here to verify your email</a></p><p>Link expires in 24 hours.</p>`,
  });
  res
    .status(201)
    .json({
      success: true,
      message: "Registration successful. Please verify your email.",
      data: { userId: user._id },
    });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(400).json({ success: false, message: "Token required" });
  const hashed = hashToken(token);
  const user = await User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: Date.now() },
  }).select("+emailVerificationToken +emailVerificationExpires");
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  res.json({ success: true, message: "Email verified successfully" });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password +refreshTokens");
  if (!user || !user.password)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  if (!user.isEmailVerified)
    return res
      .status(401)
      .json({ success: false, message: "Please verify your email first" });
  if (user.isBanned)
    return res
      .status(403)
      .json({
        success: false,
        message: "Account suspended: " + user.banReason,
      });
  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  const payload = { userId: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  if (!user.refreshTokens) user.refreshTokens = [];
  user.refreshTokens = [
    ...user.refreshTokens.slice(-4),
    hashToken(refreshToken),
  ];
  user.lastSeen = new Date();
  user.isOnline = true;
  await user.save();
  setRefreshCookie(res, refreshToken);
  const userObj = user.toJSON();
  res.json({
    success: true,
    message: "Login successful",
    data: { accessToken, user: userObj },
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Refresh token required" });
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
  const user = await User.findById(decoded.userId).select("+refreshTokens");
  if (!user)
    return res.status(401).json({ success: false, message: "User not found" });
  const hashed = hashToken(token);
  if (!user.refreshTokens?.includes(hashed))
    return res
      .status(401)
      .json({ success: false, message: "Refresh token reuse detected" });
  const newAccess = generateAccessToken({ userId: user._id, role: user.role });
  const newRefresh = generateRefreshToken({
    userId: user._id,
    role: user.role,
  });
  user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed);
  user.refreshTokens.push(hashToken(newRefresh));
  await user.save();
  setRefreshCookie(res, newRefresh);
  res.json({
    success: true,
    message: "Token refreshed",
    data: { accessToken: newAccess },
  });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const user = await User.findById(req.user._id).select("+refreshTokens");
    if (user) {
      user.refreshTokens = (user.refreshTokens || []).filter(
        (t) => t !== hashToken(token),
      );
      user.isOnline = false;
      user.lastSeen = new Date();
      await user.save();
    }
  }
  clearRefreshCookie(res);
  res.json({ success: true, message: "Logged out successfully" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.json({
      success: true,
      message: "If that email exists, a reset link has been sent",
    });
  const resetToken = generateCryptoToken();
  user.passwordResetToken = hashToken(resetToken);
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  await user.save();
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: "Reset Your SkillSphere Password",
    html: `<p><a href="${resetLink}">Click here to reset your password</a></p><p>Expires in 1 hour.</p>`,
  });
  res.json({
    success: true,
    message: "If that email exists, a reset link has been sent",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res
      .status(400)
      .json({ success: false, message: "Token and password required" });
  const hashed = hashToken(token);
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires +refreshTokens");
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired reset token" });
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = [];
  await user.save();
  clearRefreshCookie(res);
  res.json({
    success: true,
    message: "Password reset successfully. Please login.",
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, message: "User profile", data: user });
});

const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const payload = { userId: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const dbUser = await User.findById(user._id).select("+refreshTokens");
  if (!dbUser.refreshTokens) dbUser.refreshTokens = [];
  dbUser.refreshTokens = [
    ...dbUser.refreshTokens.slice(-4),
    hashToken(refreshToken),
  ];
  await dbUser.save();
  setRefreshCookie(res, refreshToken);
  res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${accessToken}`);
});

module.exports = {
  signup,
  verifyEmail,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  googleCallback,
};
