const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /api/reports/financial - Generate detailed financial report
router.get('/financial', reportController.generateReport);

// GET /api/reports/category - Generate category summary report
router.get('/category', reportController.generateCategoryReport);

// GET /api/reports/yearly - Generate yearly comparison report
router.get('/yearly', reportController.generateYearlyReport);

module.exports = router;