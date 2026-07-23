const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

const notify = async (data) => { try { await Notification.create(data); } catch {} };

const getMyProjects = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = {};
  if (req.user.role === 'freelancer') query.freelancer = req.user._id;
  else query.client = req.user._id;
  if (status) query.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [projects, total] = await Promise.all([
    Project.find(query).populate('client', 'name avatar').populate('freelancer', 'name avatar').populate('job', 'title').sort('-updatedAt').skip(skip).limit(Number(limit)),
    Project.countDocuments(query),
  ]);
  res.json({ success: true, message: 'Projects', data: projects, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('client', 'name avatar email').populate('freelancer', 'name avatar email').populate('job', 'title description');
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  const isParticipant = [project.client._id, project.freelancer._id].some(id => id.toString() === req.user._id.toString());
  if (!isParticipant && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied' });
  res.json({ success: true, message: 'Project details', data: project });
});

const submitMilestone = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  if (project.freelancer.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Only the freelancer can submit milestones' });
  const milestone = project.milestones.id(req.params.milestoneId);
  if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
  const deliverables = req.files?.map(f => f.path) || [];
  milestone.status = 'submitted';
  milestone.deliverables = [...(milestone.deliverables || []), ...deliverables];
  milestone.submittedAt = new Date();
  milestone.feedback = req.body.feedback || '';
  await project.save();
  await notify({ recipient: project.client, sender: req.user._id, type: 'milestone_submitted', title: 'Milestone Submitted', body: `Freelancer submitted: ${milestone.title}`, link: `/projects/${project._id}` });
  res.json({ success: true, message: 'Milestone submitted', data: milestone });
});

const approveMilestone = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  if (project.client.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Only the client can approve milestones' });
  const milestone = project.milestones.id(req.params.milestoneId);
  if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
  if (milestone.status !== 'submitted') return res.status(400).json({ success: false, message: 'Milestone not yet submitted' });
  milestone.status = 'approved';
  milestone.approvedAt = new Date();
  const total = project.milestones.length;
  const done = project.milestones.filter(m => ['approved', 'paid'].includes(m.status)).length;
  project.progress = Math.round((done / total) * 100);
  if (project.progress === 100) project.status = 'completed';
  await project.save();
  await notify({ recipient: project.freelancer, sender: req.user._id, type: 'milestone_approved', title: 'Milestone Approved! ✅', body: `Client approved: ${milestone.title}`, link: `/projects/${project._id}` });
  res.json({ success: true, message: 'Milestone approved', data: { milestone, progress: project.progress } });
});

const uploadProjectFile = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  const isParticipant = [project.client, project.freelancer].some(id => id.toString() === req.user._id.toString());
  if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });
  project.files.push({ name: req.file.originalname, url: req.file.path, uploadedBy: req.user._id });
  await project.save();
  res.json({ success: true, message: 'File uploaded', data: project.files });
});

const getClientStats = asyncHandler(async (req, res) => {
  const [activeProjects, completedProjects, postedJobs] = await Promise.all([
    Project.countDocuments({ client: req.user._id, status: 'active' }),
    Project.countDocuments({ client: req.user._id, status: 'completed' }),
    Job.countDocuments({ client: req.user._id }),
  ]);
  const spendAgg = await Transaction.aggregate([{ $match: { client: req.user._id, status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
  res.json({ success: true, message: 'Client stats', data: { activeProjects, completedProjects, totalSpend: spendAgg[0]?.total || 0, postedJobs } });
});

module.exports = { getMyProjects, getProjectById, submitMilestone, approveMilestone, uploadProjectFile, getClientStats };
