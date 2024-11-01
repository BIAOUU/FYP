const express = require('express');

const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportsByUser 
} = require('../controllers/productReportController');

const router = express.Router();

router.post('/', createReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);
router.get('/user/:userId', getReportsByUser);

module.exports = router;
