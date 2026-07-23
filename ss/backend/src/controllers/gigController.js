const Gig = require('../models/Gig');
const asyncHandler = require('../utils/asyncHandler');

const getAllGigs = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, deliveryTime, rating, page = 1, limit = 20, sort = '-createdAt' } = req.query;
  const query = { status: 'active' };
  if (q) query.$text = { $search: q };
  if (category) query.category = category;
  if (minPrice) query['packages.basic.price'] = { $gte: Number(minPrice) };
  if (maxPrice) query['packages.basic.price'] = { ...query['packages.basic.price'], $lte: Number(maxPrice) };
  if (rating) query.averageRating = { $gte: Number(rating) };
  const skip = (Number(page) - 1) * Number(limit);
  const [gigs, total] = await Promise.all([Gig.find(query).populate('freelancer', 'name avatar location').sort(sort).skip(skip).limit(Number(limit)), Gig.countDocuments(query)]);
  res.json({ success: true, message: 'Gigs found', data: gigs, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
});

const getGigById = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id).populate('freelancer', 'name avatar bio location');
  if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
  await Gig.findByIdAndUpdate(req.params.id, { $inc: { impressions: 1 } });
  res.json({ success: true, message: 'Gig details', data: gig });
});

const getMyGigs = asyncHandler(async (req, res) => {
  const gigs = await Gig.find({ freelancer: req.user._id, status: { $ne: 'deleted' } }).sort('-createdAt');
  res.json({ success: true, message: 'My gigs', data: gigs });
});

const createGig = asyncHandler(async (req, res) => {
  const { title, description, category, subcategory, tags, packages, faqs } = req.body;
  const images = req.files?.map(f => f.path) || [];
  const gig = await Gig.create({
    freelancer: req.user._id, title, description, category, subcategory,
    tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : (tags || []),
    packages: typeof packages === 'string' ? JSON.parse(packages) : packages,
    faqs: faqs ? (typeof faqs === 'string' ? JSON.parse(faqs) : faqs) : [],
    media: { images },
  });
  res.status(201).json({ success: true, message: 'Gig created', data: gig });
});

const updateGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findOne({ _id: req.params.id, freelancer: req.user._id });
  if (!gig) return res.status(404).json({ success: false, message: 'Gig not found or unauthorized' });
  const allowed = ['title', 'description', 'category', 'subcategory', 'tags', 'packages', 'faqs', 'status'];
  allowed.forEach(f => { if (req.body[f] !== undefined) gig[f] = req.body[f]; });
  await gig.save();
  res.json({ success: true, message: 'Gig updated', data: gig });
});

const deleteGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findOne({ _id: req.params.id, freelancer: req.user._id });
  if (!gig) return res.status(404).json({ success: false, message: 'Gig not found or unauthorized' });
  gig.status = 'deleted';
  await gig.save();
  res.json({ success: true, message: 'Gig deleted' });
});

const toggleGigStatus = asyncHandler(async (req, res) => {
  const gig = await Gig.findOne({ _id: req.params.id, freelancer: req.user._id });
  if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
  gig.status = gig.status === 'active' ? 'paused' : 'active';
  await gig.save();
  res.json({ success: true, message: `Gig ${gig.status}`, data: { status: gig.status } });
});

module.exports = { getAllGigs, getGigById, getMyGigs, createGig, updateGig, deleteGig, toggleGigStatus };
