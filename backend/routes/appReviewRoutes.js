const express = require('express');
const { createAppReview, getAppReviews, getAppReviewsByUser } = require('../controllers/appReviewController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// App feedback routes
router.post('/', requireAuth, createAppReview);  // App reviews route
router.get('/', getAppReviews);
router.get('/user/:userId', getAppReviewsByUser);

module.exports = router;
