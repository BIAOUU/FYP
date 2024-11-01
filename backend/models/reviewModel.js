const mongoose = require('mongoose');

const Schema = mongoose.Schema

const reviewSchema = new Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User who made the review
  reviewedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User being reviewed
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String
});

module.exports = mongoose.model('Review', reviewSchema);
