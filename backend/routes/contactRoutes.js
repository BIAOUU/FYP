const express = require('express');
const { getContactInfo } = require('../controllers/contactController');

const router = express.Router();

// Route to get contact info
router.get('/', getContactInfo);

module.exports = router;