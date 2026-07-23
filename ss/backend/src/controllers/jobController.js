const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const asyncHandler = require('../utils/asyncHandler');

const getAllJobs = asyncHandler(async (req, res) => {
  const { q, category, skills, budgetType, minBudget, maxBudget, duration, experience, location, city, state, page = 1, limit = 20, sort = '-createdAt' } = req.query;
  const query = { status: 'open' };
  if (q) query.$text = { $search: q };
  if (category) query.category = category;
  if (skills) query.skills = { $in: skills.split(',').map(s => new RegExp(s.trim(), 'i')) };
  if (budgetType) query['budget.type'] = budgetType;
  if (minBudget) query['budget.min'] = { $gte: Number(minBudget) };
  if (maxBudget) query['budget.max'] = { $lte: Number(maxBudget) };
  if (duration) query.duration = duration;
  if (experience) query.experienceLevel = experience;
  if (location) query['location.preference'] = location;
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (state) query['location.state'] = new RegExp(state, 'i');
  const skip = (Number(page) - 1) * Number(limit);
  const [jobs, total] = await Promise.all([Job.find(query).populate('client', 'name avatar location').sort(sort).skip(skip).limit(Number(limit)), Job.countDocuments(query)]);
  res.json({ success: true, message: 'Jobs found', data: jobs, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('client', 'name avatar bio location');
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.json({ success: true, message: 'Job details', data: job });
});

const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ client: req.user._id }).sort('-createdAt');
  res.json({ success: true, message: 'My jobs', data: jobs });
});

const createJob = asyncHandler(async (req, res) => {
  const { title, description, category, subcategory, skills, budget, duration, experienceLevel, location, deadline } = req.body;
  const job = await Job.create({
    client: req.user._id, title, description, category, subcategory,
    skills: typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : (skills || []),
    budget: typeof budget === 'string' ? JSON.parse(budget) : budget,
    duration, experienceLevel,
    location: typeof location === 'string' ? JSON.parse(location) : (location || {}),
    deadline,
  });
  res.status(201).json({ success: true, message: 'Job posted', data: job });
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, client: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
  const allowed = ['title', 'description', 'category', 'skills', 'budget', 'duration', 'experienceLevel', 'location', 'deadline'];
  allowed.forEach(f => { if (req.body[f] !== undefined) job[f] = req.body[f]; });
  await job.save();
  res.json({ success: true, message: 'Job updated', data: job });
});

const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, client: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
  job.status = 'closed';
  await job.save();
  res.json({ success: true, message: 'Job closed' });
});

const getJobProposals = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, client: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
  const proposals = await Proposal.find({ job: req.params.id }).populate('freelancer', 'name avatar bio location').sort('-createdAt');
  res.json({ success: true, message: 'Proposals', data: proposals });
});

module.exports = { getAllJobs, getJobById, getMyJobs, createJob, updateJob, deleteJob, getJobProposals };
