const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /api/transactions/search - Search transactions (must be before /:id)
router.get('/search', transactionController.searchTransactions);

// GET /api/transactions/summary - Get monthly summary
router.get('/summary', transactionController.getMonthlySummary);

// GET /api/transactions - Get all transactions
router.get('/', transactionController.getAllTransactions);

// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', transactionController.getTransactionById);

// POST /api/transactions - Create new transaction
router.post('/', transactionController.createTransaction);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', transactionController.updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;