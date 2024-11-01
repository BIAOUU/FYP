const { getCollaborativeRecommendations } = require('../services/recommendationService');

// Controller function to handle recommendations for a user
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;  // Get user ID from request (requires authentication)
    const recommendations = await getCollaborativeRecommendations(userId);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};
