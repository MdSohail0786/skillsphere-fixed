const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['new_proposal','proposal_accepted','proposal_rejected','new_message','milestone_submitted','milestone_approved','payment_released','new_review','project_completed','system'], required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  link: String,
  isRead: { type: Boolean, default: false },
  readAt: Date,
  data: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
module.exports = mongoose.model('Notification', notificationSchema);
