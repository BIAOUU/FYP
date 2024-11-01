const express = require('express');
const requireAuth = require('../middleware/requireAuth')

const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByUserId
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/',requireAuth, createReview);
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
// Route to get all reviews for a specific user
router.get('/user/:userId', getReviewsByUserId);

module.exports = router
