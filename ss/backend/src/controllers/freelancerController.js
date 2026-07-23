const FreelancerProfile = require('../models/FreelancerProfile');
const User = require('../models/User');
const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');

const getAllFreelancers = asyncHandler(async (req, res) => {
  const { skills, minRate, maxRate, rating, availability, level, city, state, country, page = 1, limit = 20, sort = '-averageRating' } = req.query;
  const profileQuery = {};
  if (skills) profileQuery['skills.name'] = { $in: skills.split(',').map(s => new RegExp(s.trim(), 'i')) };
  if (minRate) profileQuery.hourlyRate = { ...profileQuery.hourlyRate, $gte: Number(minRate) };
  if (maxRate) profileQuery.hourlyRate = { ...profileQuery.hourlyRate, $lte: Number(maxRate) };
  if (rating) profileQuery.averageRating = { $gte: Number(rating) };
  if (availability) profileQuery.availability = availability;
  if (level) profileQuery.level = level;
  const userQuery = { role: 'freelancer', isActive: true, isBanned: false };
  if (city) userQuery['location.city'] = new RegExp(city, 'i');
  if (state) userQuery['location.state'] = new RegExp(state, 'i');
  if (country) userQuery['location.country'] = new RegExp(country, 'i');
  const users = await User.find(userQuery).select('_id');
  profileQuery.user = { $in: users.map(u => u._id) };
  const skip = (Number(page) - 1) * Number(limit);
  const [profiles, total] = await Promise.all([
    FreelancerProfile.find(profileQuery).populate('user', 'name avatar location isOnline lastSeen').sort(sort).skip(skip).limit(Number(limit)),
    FreelancerProfile.countDocuments(profileQuery),
  ]);
  res.json({ success: true, message: 'Freelancers found', data: profiles, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
});

const getMyProfile = asyncHandler(async (req, res) => {
  let profile = await FreelancerProfile.findOne({ user: req.user._id }).populate('user', 'name email avatar coverImage location bio');
  if (!profile) profile = await FreelancerProfile.create({ user: req.user._id, title: 'Freelancer' });
  res.json({ success: true, message: 'Freelancer profile', data: profile });
});

const getFreelancerById = asyncHandler(async (req, res) => {
  const profile = await FreelancerProfile.findOne({ user: req.params.userId }).populate('user', 'name email avatar coverImage location bio isOnline lastSeen');
  if (!profile) return res.status(404).json({ success: false, message: 'Freelancer profile not found' });
  res.json({ success: true, message: 'Freelancer profile', data: profile });
});

const updateFreelancerProfile = asyncHandler(async (req, res) => {
  const allowed = ['title', 'overview', 'skills', 'experience', 'education', 'hourlyRate', 'availability', 'languages', 'certifications'];
  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  const profile = await FreelancerProfile.findOneAndUpdate({ user: req.user._id }, updates, { new: true, upsert: true, runValidators: true }).populate('user', 'name email avatar');
  res.json({ success: true, message: 'Profile updated', data: profile });
});

const addPortfolioItem = asyncHandler(async (req, res) => {
  const { title, description, githubLink, liveLink, technologies } = req.body;
  const images = req.files?.map(f => f.path) || [];
  const profile = await FreelancerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $push: { portfolio: { title, description, images, githubLink, liveLink, technologies: Array.isArray(technologies) ? technologies : technologies?.split(',') || [] } } },
    { new: true, upsert: true }
  );
  res.json({ success: true, message: 'Portfolio item added', data: profile.portfolio });
});

const deletePortfolioItem = asyncHandler(async (req, res) => {
  const profile = await FreelancerProfile.findOneAndUpdate({ user: req.user._id }, { $pull: { portfolio: { _id: req.params.itemId } } }, { new: true });
  res.json({ success: true, message: 'Portfolio item removed', data: profile.portfolio });
});

const getFreelancerStats = asyncHandler(async (req, res) => {
  const profile = await FreelancerProfile.findOne({ user: req.user._id });
  const [activeProjects, completedProjects, pendingProposals] = await Promise.all([
    Project.countDocuments({ freelancer: req.user._id, status: 'active' }),
    Project.countDocuments({ freelancer: req.user._id, status: 'completed' }),
    Proposal.countDocuments({ freelancer: req.user._id, status: 'pending' }),
  ]);
  res.json({ success: true, message: 'Stats', data: { totalEarnings: profile?.totalEarnings || 0, averageRating: profile?.averageRating || 0, totalReviews: profile?.totalReviews || 0, activeProjects, completedProjects, pendingProposals, level: profile?.level || 'rising-talent' } });
});

module.exports = { getAllFreelancers, getMyProfile, getFreelancerById, updateFreelancerProfile, addPortfolioItem, deletePortfolioItem, getFreelancerStats };
