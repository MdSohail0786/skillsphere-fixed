const Review = require('../models/Review');
const Project = require('../models/Project');
const FreelancerProfile = require('../models/FreelancerProfile');
const asyncHandler = require('../utils/asyncHandler');

const createReview = asyncHandler(async (req, res) => {
  const { projectId, rating, comment } = req.body;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  if (project.status !== 'completed') return res.status(400).json({ success: false, message: 'Project must be completed before reviewing' });
  const isClient = project.client.toString() === req.user._id.toString();
  const isFreelancer = project.freelancer.toString() === req.user._id.toString();
  if (!isClient && !isFreelancer) return res.status(403).json({ success: false, message: 'Not a project participant' });
  const type = isClient ? 'client-to-freelancer' : 'freelancer-to-client';
  const reviewee = isClient ? project.freelancer : project.client;
  const existing = await Review.findOne({ project: projectId, reviewer: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this project' });
  const review = await Review.create({ project: projectId, reviewer: req.user._id, reviewee, rating: Number(rating), comment, type });
  if (isClient) {
    project.isClientReviewed = true;
    await project.save();
    const allReviews = await Review.find({ reviewee, type: 'client-to-freelancer' });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await FreelancerProfile.findOneAndUpdate({ user: reviewee }, { averageRating: Math.round(avg * 10) / 10, totalReviews: allReviews.length });
  } else {
    project.isFreelancerReviewed = true;
    await project.save();
  }
  res.status(201).json({ success: true, message: 'Review submitted', data: review });
});

const getUserReviews = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 10 } = req.query;
  const query = { reviewee: req.params.userId, isPublic: true };
  if (type) query.type = type;
  const skip = (Number(page) - 1) * Number(limit);
  const [reviews, total] = await Promise.all([
    Review.find(query).populate('reviewer', 'name avatar').sort('-createdAt').skip(skip).limit(Number(limit)),
    Review.countDocuments(query),
  ]);
  res.json({ success: true, message: 'Reviews', data: reviews, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
});

const respondToReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, reviewee: req.user._id });
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  review.response = req.body.response;
  await review.save();
  res.json({ success: true, message: 'Response added', data: review });
});

module.exports = { createReview, getUserReviews, respondToReview };
