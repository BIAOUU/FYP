const AppReview = require('../models/appReviewModel');
const User = require('../models/userModel');

exports.createAppReview = async (req, res) => {
    const { feedback, rating, uiSatisfaction, outfitSatisfaction, aiSatisfaction, uxSatisfaction } = req.body;
    const userId = req.user?._id;  // Get the user ID from the authenticated request

    try {
        // Check if the user is logged in
        if (!userId) {
            return res.status(401).json({ error: 'You must be logged in to submit feedback.' });
        }

        // Ensure all required fields are provided
        if (!feedback || !rating || !uiSatisfaction || !outfitSatisfaction || !aiSatisfaction || !uxSatisfaction) {
            return res.status(400).json({ error: 'All fields including feedback, rating, and satisfaction levels must be provided' });
        }

        // Create a new review entry
        const newReview = await AppReview.create({
            user: userId,  // Store the logged-in user's ID as the reviewer
            feedback,
            rating,
            uiSatisfaction,
            outfitSatisfaction,
            aiSatisfaction,
            uxSatisfaction
        });

        res.status(201).json(newReview);  // Return the new review
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// READ all reviews with rating >= 3 and sorted by rating (highest to lowest)
exports.getAppReviews = async (req, res) => {
    try {
        // Fetch reviews with rating >= 3, sorted by rating (highest to lowest)
        const reviews = await AppReview.find({ rating: { $gte: 3 } })
            .populate('user', 'profile.name') // Populate the user's name
            .sort({ rating: -1 }); // Sort by highest rating first

        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// READ reviews by a specific user (optional)
exports.getAppReviewsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const userReviews = await AppReview.find({ user: userId })
            .populate('user', 'profile.name') // Populate user data
            .sort({ createdAt: -1 });

        if (!userReviews.length) {
            return res.status(404).json({ message: 'No reviews found for this user.' });
        }

        res.status(200).json(userReviews);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
