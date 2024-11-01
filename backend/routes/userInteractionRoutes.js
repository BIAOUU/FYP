const express = require('express');
const { trackInteraction } = require('../controllers/userInteractionController');
const requireAuth = require('../middleware/requireAuth');  // Ensure user is authenticated

const router = express.Router();

router.post('/', requireAuth, trackInteraction);  // Record user interaction

module.exports = router;
