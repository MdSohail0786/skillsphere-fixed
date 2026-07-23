const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

const notify = async (data) => { try { await Notification.create(data); } catch {} };

const submitProposal = asyncHandler(async (req, res) => {
  const { jobId, coverLetter, bidAmount, bidType, estimatedDays, milestones } = req.body;
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  if (job.status !== 'open') return res.status(400).json({ success: false, message: 'Job is not accepting proposals' });
  const existing = await Proposal.findOne({ job: jobId, freelancer: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: 'You already submitted a proposal for this job' });
  const proposal = await Proposal.create({
    job: jobId, freelancer: req.user._id, coverLetter,
    bidAmount: Number(bidAmount), bidType: bidType || job.budget.type,
    estimatedDays: Number(estimatedDays),
    milestones: milestones ? (typeof milestones === 'string' ? JSON.parse(milestones) : milestones) : [],
  });
  await Job.findByIdAndUpdate(jobId, { $push: { proposals: proposal._id }, $inc: { proposalCount: 1 } });
  await notify({ recipient: job.client, sender: req.user._id, type: 'new_proposal', title: 'New Proposal Received', body: `${req.user.name} submitted a proposal for: ${job.title}`, link: `/jobs/${jobId}/proposals`, data: { proposalId: proposal._id } });
  res.status(201).json({ success: true, message: 'Proposal submitted', data: proposal });
});

const getMyProposals = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find({ freelancer: req.user._id }).populate('job', 'title budget status client').sort('-createdAt');
  res.json({ success: true, message: 'My proposals', data: proposals });
});

const getProposalById = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate('freelancer', 'name avatar bio').populate('job', 'title budget client');
  if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });
  res.json({ success: true, message: 'Proposal', data: proposal });
});

const acceptProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate('job');
  if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });
  if (proposal.job.client.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Unauthorized' });
  if (proposal.status !== 'pending') return res.status(400).json({ success: false, message: 'Proposal already processed' });
  proposal.status = 'accepted';
  await proposal.save();
  await Proposal.updateMany({ job: proposal.job._id, _id: { $ne: proposal._id }, status: 'pending' }, { status: 'rejected' });
  await Job.findByIdAndUpdate(proposal.job._id, { status: 'in-progress', hiredFreelancer: proposal.freelancer });
  const project = await Project.create({
    job: proposal.job._id, proposal: proposal._id,
    client: req.user._id, freelancer: proposal.freelancer,
    title: proposal.job.title,
    totalAmount: proposal.bidAmount,
    milestones: (proposal.milestones || []).map(m => ({ ...m.toObject ? m.toObject() : m, status: 'pending' })),
    deadline: new Date(Date.now() + proposal.estimatedDays * 24 * 60 * 60 * 1000),
  });
  await notify({ recipient: proposal.freelancer, sender: req.user._id, type: 'proposal_accepted', title: 'Proposal Accepted! 🎉', body: `Your proposal for "${proposal.job.title}" was accepted`, link: `/projects/${project._id}` });
  res.json({ success: true, message: 'Proposal accepted', data: { proposal, project } });
});

const rejectProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate('job', 'client title');
  if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });
  if (proposal.job.client.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Unauthorized' });
  proposal.status = 'rejected';
  proposal.clientNote = req.body.reason || '';
  await proposal.save();
  await notify({ recipient: proposal.freelancer, sender: req.user._id, type: 'proposal_rejected', title: 'Proposal Update', body: `Your proposal for "${proposal.job.title}" was not selected` });
  res.json({ success: true, message: 'Proposal rejected', data: proposal });
});

const withdrawProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findOne({ _id: req.params.id, freelancer: req.user._id });
  if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });
  if (proposal.status !== 'pending') return res.status(400).json({ success: false, message: 'Cannot withdraw processed proposal' });
  proposal.status = 'withdrawn';
  await proposal.save();
  await Job.findByIdAndUpdate(proposal.job, { $inc: { proposalCount: -1 } });
  res.json({ success: true, message: 'Proposal withdrawn' });
});

module.exports = { submitProposal, getMyProposals, getProposalById, acceptProposal, rejectProposal, withdrawProposal };
