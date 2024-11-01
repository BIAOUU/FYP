const mongoose = require('mongoose');

// track the user making the interaction and the producst being interacted
const userInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  interactionType: { type: String, enum: ['view', 'like', 'purchase'], required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserInteraction', userInteractionSchema);