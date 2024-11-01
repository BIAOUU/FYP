const express = require('express');

const {
  createFAQ,
  getFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
  createInquiry,
  deleteInquiry,
  answerFAQ
} = require('../controllers/faqController');

const router = express.Router();

// FAQ routes
router.post('/', createFAQ);
router.get('/', getFAQs);
router.get('/:id', getFAQById);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);

// Inquiry routes
router.post('/inquiry', createInquiry);
router.delete('/inquiry/:id', deleteInquiry);
router.post('/:id/answer', answerFAQ);

module.exports = router;
