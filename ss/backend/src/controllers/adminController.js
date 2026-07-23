const User = require('../models/User');
const Job = require('../models/Job');
const Gig = require('../models/Gig');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const Report = require('../models/Report');
const FreelancerProfile = require('../models/FreelancerProfile');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalFreelancers, totalClients, activeProjects, completedProjects, openJobs, pendingReports, revenueAgg, monthlyAgg] = await Promise.all([
    User.countDocuments({ isBanned: false }),
    User.countDocuments({ role: 'freelancer', isBanned: false }),
    User.countDocuments({ role: 'client', isBanned: false }),
    Project.countDocuments({ status: 'active' }),
    Project.countDocuments({ status: 'completed' }),
    Job.countDocuments({ status: 'open' }),
    Report.countDocuments({ status: 'pending' }),
    Transaction.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$platformFee' } } }]),
    Transaction.aggregate([{ $match: { status: 'completed', createdAt: { $gte: new Date(new Date().setDate(1)) } } }, { $group: { _id: null, total: { $sum: '$platformFee' } } }]),
  ]);
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({ success: true, message: 'Admin dashboard', data: { stats: { totalUsers, totalFreelancers, totalClients, activeProjects, completedProjects, openJobs, pendingReports, totalRevenue: revenueAgg[0]?.total || 0, monthlyRevenue: monthlyAgg[0]?.total || 0 }, userGrowth } });
});

const getUsers = asyncHandler(async (req, res) => {
  const { role, status, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (status === 'banned') query.isBanned = true;
  if (status === 'active') query.isBanned = false;
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([User.find(query).sort('-createdAt').skip(skip).limit(Number(limit)), User.countDocuments(query)]);
  res.json({ success: true, message: 'Users', data: users, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
});

const banUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot ban admin' });
  user.isBanned = true;
  user.banReason = req.body.reason || 'Violated terms of service';
  await user.save();
  res.json({ success: true, message: 'User banned', data: user });
});

const unbanUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false, banReason: '' }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'User unbanned', data: user });
});

const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['freelancer', 'client', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'Role updated', data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false, isBanned: true }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'User deactivated' });
});

const getReports = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [reports, total] = await Promise.all([Report.find(query).populate('reporter', 'name email').populate('reportedUser', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)), Report.countDocuments(query)]);
  res.json({ success: true, message: 'Reports', data: reports, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
});

const resolveReport = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status || 'resolved', adminNote: req.body.note, resolvedBy: req.user._id, resolvedAt: new Date() }, { new: true });
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
  res.json({ success: true, message: 'Report updated', data: report });
});

const verifyFreelancer = asyncHandler(async (req, res) => {
  const profile = await FreelancerProfile.findOneAndUpdate({ user: req.params.id }, { isVerified: true, verifiedAt: new Date() }, { new: true });
  if (!profile) return res.status(404).json({ success: false, message: 'Freelancer profile not found' });
  res.json({ success: true, message: 'Freelancer verified', data: profile });
});

const getAdminTransactions = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [transactions, total] = await Promise.all([Transaction.find(query).populate('client', 'name email').populate('freelancer', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)), Transaction.countDocuments(query)]);
  res.json({ success: true, message: 'Transactions', data: transactions, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
});

module.exports = { getDashboard, getUsers, banUser, unbanUser, changeUserRole, deleteUser, getReports, resolveReport, verifyFreelancer, getAdminTransactions };
