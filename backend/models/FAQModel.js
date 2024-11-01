const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: String,
  inquiries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' }]
});

const inquirySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: { type: String, required: true }
});

module.exports = {
  FAQ: mongoose.model('FAQ', faqSchema),
  Inquiry: mongoose.model('Inquiry', inquirySchema)
};
