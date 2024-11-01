const Review = require('../models/reviewModel');
const User = require('../models/userModel');

// CREATE Review
exports.createReview = async (req, res) => {
  try {
    const { reviewer, reviewedUser, rating, comment } = req.body;

    // Validate inputs
    if (!reviewer || !reviewedUser) {
      return res.status(400).json({ error: 'Reviewer and Reviewed User must be provided' });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Ensure that the reviewer and reviewedUser are different
    if (reviewer === reviewedUser) {
      return res.status(400).json({ error: 'You cannot review yourself' });
    }

    // Check if the reviewed user exists
    const reviewedUserExists = await User.findById(reviewedUser);
    if (!reviewedUserExists) {
      return res.status(404).json({ error: 'The user you are trying to review does not exist' });
    }

    const review = new Review({
      reviewer,
      reviewedUser,
      rating,
      comment,
    });

    // Save the review
    await review.save();

    // Update the reviewer's reviewsGiven array
    await User.findByIdAndUpdate(
      reviewer,
      { $push: { reviewsGiven: review._id } },
      { new: true }
    );

    // Update the reviewed user's reviewsReceived array
    await User.findByIdAndUpdate(
      reviewedUser,
      { $push: { reviewsReceived: review._id } },
      { new: true }
    );

    // Return the created review with populated reviewer details
    const savedReview = await Review.findById(review._id).populate('reviewer', 'profile.name');
    
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ALL Reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('reviewer', 'profile.name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ONE Review
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('reviewer', 'profile.name');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE Review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Ensure rating is valid
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id, 
      { rating, comment }, 
      { new: true }
    ).populate('reviewer', 'profile.name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Remove the review ID from the reviewer's reviewsGiven array
    await User.findByIdAndUpdate(
      review.reviewer,
      { $pull: { reviewsGiven: review._id } },
      { new: true }
    );

    // Remove the review ID from the reviewed user's reviewsReceived array
    await User.findByIdAndUpdate(
      review.reviewedUser,
      { $pull: { reviewsReceived: review._id } },
      { new: true }
    );

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch reviews received by userId (reviews written for the user)
exports.getReviewsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Ensure that the reviewed user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find reviews where the user is the reviewedUser (reviews received by this user)
    const reviews = await Review.find({ reviewedUser: userId })
      .populate('reviewer', 'profile.name');  // Populate the reviewer's profile

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
