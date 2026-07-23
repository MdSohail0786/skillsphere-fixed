const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'User profile', data: user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'phone', 'location'];
  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, message: 'Profile updated', data: user });
});

const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path }, { new: true });
  res.json({ success: true, message: 'Avatar updated', data: { avatar: user.avatar } });
});

const updateCoverImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const user = await User.findByIdAndUpdate(req.user._id, { coverImage: req.file.path }, { new: true });
  res.json({ success: true, message: 'Cover image updated', data: { coverImage: user.coverImage } });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user.password) return res.status(400).json({ success: false, message: 'No password set (OAuth account)' });
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully' });
});

const searchUsers = asyncHandler(async (req, res) => {
  const { q, role, city, state, country, pincode, page = 1, limit = 20 } = req.query;
  const query = { isActive: true, isBanned: false };
  if (role) query.role = role;
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (state) query['location.state'] = new RegExp(state, 'i');
  if (country) query['location.country'] = new RegExp(country, 'i');
  if (pincode) query['location.pincode'] = pincode;
  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([User.find(query).skip(skip).limit(Number(limit)), User.countDocuments(query)]);
  res.json({ success: true, message: 'Users found', data: users, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
});

const getNearbyUsers = asyncHandler(async (req, res) => {
  const { lng, lat, maxDistance = 50000, role } = req.query;
  if (!lng || !lat) return res.status(400).json({ success: false, message: 'Coordinates required' });
  const query = { isActive: true, 'location.coordinates': { $near: { $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] }, $maxDistance: Number(maxDistance) } } };
  if (role) query.role = role;
  const users = await User.find(query).limit(50);
  res.json({ success: true, message: 'Nearby users', data: users });
});

module.exports = { getUserProfile, updateProfile, updateAvatar, updateCoverImage, changePassword, searchUsers, getNearbyUsers };
