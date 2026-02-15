const { TransactionModel } = require('../models/BaseModel');
const transactionModel = new TransactionModel();

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.findAll();
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await transactionModel.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, category_id, description, date } = req.body;

    const transactionData = {
      type,
      amount: parseFloat(amount),
      category_id: parseInt(category_id),
      description,
      date
    };

    const result = await transactionModel.create(transactionData);
    
    res.status(201).json({ 
      message: 'Transaction created successfully',
      id: result.lastID 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category_id, description, date } = req.body;

    const transactionData = {
      type,
      amount: parseFloat(amount),
      category_id: parseInt(category_id),
      description,
      date
    };

    const result = await transactionModel.update(id, transactionData);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await transactionModel.delete(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get monthly summary
exports.getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    const rows = await transactionModel.getMonthlySummary(year, month);

    // Calculate totals
    const income = rows
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.total, 0);
    
    const expenses = rows
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.total, 0);

    res.json({
      summary: {
        income,
        expenses,
        balance: income - expenses,
        categoryBreakdown: rows
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search transactions - NEW for search requirement
exports.searchTransactions = async (req, res) => {
  try {
    const { q, type, startDate, endDate, categoryId, minAmount, maxAmount } = req.query;
    
    const filters = {
      type,
      startDate,
      endDate,
      categoryId: categoryId ? parseInt(categoryId) : null,
      minAmount: minAmount ? parseFloat(minAmount) : null,
      maxAmount: maxAmount ? parseFloat(maxAmount) : null
    };

    const results = await transactionModel.search(q || '', filters);
    
    res.json({ 
      results,
      count: results.length,
      searchTerm: q || '',
      filters
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};