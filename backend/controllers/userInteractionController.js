const UserInteraction = require('../models/userInteractionModel');

// Track user interactions with products (view/like/purchase)
exports.trackInteraction = async (req, res) => {
  try {
    const { productId, interactionType } = req.body;
    const userId = req.user._id;  // Get logged-in user's ID

    const newInteraction = new UserInteraction({
      userId,
      productId,
      interactionType
    });

    await newInteraction.save();
    res.status(201).json({ message: 'Interaction recorded successfully.' });
  } catch (error) {
    console.error('Error recording interaction:', error);
    res.status(500).json({ error: 'Failed to record interaction' });
  }
};
