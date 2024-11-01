const express = require('express');
const { getRecommendations } = require('../controllers/recommendationController');
const requireAuth = require('../middleware/requireAuth');  // Protect route with auth middleware

const router = express.Router();

router.get('/', requireAuth, getRecommendations);  // Fetch recommendations for logged-in user

module.exports = router;
