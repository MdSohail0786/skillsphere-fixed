const FreelancerProfile = require('../models/FreelancerProfile');
const Job = require('../models/Job');
const Gig = require('../models/Gig');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const calcMatchScore = (fSkills, jSkills, fRate, jBudget, fRating, fLoc, jLoc) => {
  let score = 0;
  if (jSkills?.length && fSkills?.length) {
    const fs = fSkills.map(s => (s.name || s).toLowerCase());
    const js = jSkills.map(s => s.toLowerCase());
    const matched = js.filter(j => fs.some(f => f.includes(j) || j.includes(f)));
    score += (matched.length / js.length) * 40;
  } else { score += 20; }
  if (fRate && jBudget) {
    const { min, max } = jBudget;
    if (fRate >= min && fRate <= max) score += 25;
    else if (fRate < min) score += 15;
    else if (fRate <= max * 1.2) score += 10;
  } else { score += 15; }
  if (fRating) score += (fRating / 5) * 20;
  if (jLoc?.preference === 'remote') { score += 15; }
  else if (fLoc && jLoc) {
    if (fLoc.city?.toLowerCase() === jLoc.city?.toLowerCase()) score += 15;
    else if (fLoc.state?.toLowerCase() === jLoc.state?.toLowerCase()) score += 10;
    else if (fLoc.country?.toLowerCase() === jLoc.country?.toLowerCase()) score += 5;
  }
  return Math.min(Math.round(score), 100);
};

const matchFreelancersForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  const profiles = await FreelancerProfile.find({ availability: { $ne: 'not-available' } }).populate('user', 'name avatar location isOnline lastSeen').limit(100);
  const scored = profiles.map(p => ({ profile: p, matchScore: calcMatchScore(p.skills, job.skills, p.hourlyRate, job.budget, p.averageRating, p.user?.location, job.location) }))
    .filter(i => i.matchScore >= 30).sort((a, b) => b.matchScore - a.matchScore).slice(0, 20);
  res.json({ success: true, message: 'Best matched freelancers', data: scored });
});

const getRecommendedJobs = asyncHandler(async (req, res) => {
  const profile = await FreelancerProfile.findOne({ user: req.user._id });
  if (!profile) return res.status(400).json({ success: false, message: 'Complete your freelancer profile first' });
  const user = await User.findById(req.user._id);
  const jobs = await Job.find({ status: 'open' }).populate('client', 'name avatar').limit(100);
  const scored = jobs.map(j => ({ job: j, matchScore: calcMatchScore(profile.skills, j.skills, profile.hourlyRate, j.budget, profile.averageRating, user?.location, j.location) }))
    .filter(i => i.matchScore >= 25).sort((a, b) => b.matchScore - a.matchScore).slice(0, 20);
  res.json({ success: true, message: 'Recommended jobs', data: scored });
});

const getRecommendedGigs = asyncHandler(async (req, res) => {
  const { skills, budget } = req.query;
  const skillArr = skills ? skills.split(',').map(s => s.trim()) : [];
  const query = { status: 'active' };
  if (skillArr.length) query.$or = [{ tags: { $in: skillArr.map(s => new RegExp(s, 'i')) } }, { title: { $in: skillArr.map(s => new RegExp(s, 'i')) } }];
  if (budget) query['packages.basic.price'] = { $lte: Number(budget) };
  const gigs = await Gig.find(query).populate('freelancer', 'name avatar location').sort('-averageRating -orders').limit(20);
  res.json({ success: true, message: 'Recommended gigs', data: gigs });
});

const getNearbyFreelancers = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 25, skills } = req.query;
  if (!lat || !lng) return res.status(400).json({ success: false, message: 'Location coordinates required' });
  const userQuery = { role: 'freelancer', isActive: true, 'location.coordinates': { $near: { $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] }, $maxDistance: Number(radius) * 1000 } } };
  const users = await User.find(userQuery).select('_id').limit(50);
  const profileQuery = { user: { $in: users.map(u => u._id) }, availability: { $ne: 'not-available' } };
  if (skills) profileQuery['skills.name'] = { $in: skills.split(',').map(s => new RegExp(s.trim(), 'i')) };
  const profiles = await FreelancerProfile.find(profileQuery).populate('user', 'name avatar location isOnline').sort('-averageRating').limit(20);
  res.json({ success: true, message: 'Nearby freelancers', data: profiles });
});

module.exports = { matchFreelancersForJob, getRecommendedJobs, getRecommendedGigs, getNearbyFreelancers };
