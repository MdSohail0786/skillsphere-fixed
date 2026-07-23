const mongoose = require('mongoose');
const gigSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 5000 },
  category: { type: String, required: true },
  subcategory: String,
  tags: [String],
  packages: {
    basic: { name: { type: String, default: 'Basic' }, description: String, price: { type: Number, required: true, min: 1 }, deliveryTime: { type: Number, required: true }, revisions: { type: Number, default: 1 }, features: [String] },
    standard: { name: { type: String, default: 'Standard' }, description: String, price: Number, deliveryTime: Number, revisions: { type: Number, default: 3 }, features: [String] },
    premium: { name: { type: String, default: 'Premium' }, description: String, price: Number, deliveryTime: Number, revisions: { type: Number, default: -1 }, features: [String] },
  },
  media: { images: [String], videos: [String] },
  faqs: [{ question: String, answer: String }],
  status: { type: String, enum: ['active', 'paused', 'draft', 'deleted'], default: 'active' },
  orders: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true });
gigSchema.index({ freelancer: 1 });
gigSchema.index({ category: 1 });
gigSchema.index({ status: 1 });
gigSchema.index({ title: 'text', description: 'text', tags: 'text' });
module.exports = mongoose.model('Gig', gigSchema);
