const db = require('../database/init');

// Get all categories
exports.getAllCategories = (req, res) => {
  const { type } = req.query;
  
  let query = 'SELECT * FROM categories';
  let params = [];
  
  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }
  
  query += ' ORDER BY type, name';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ categories: rows });
  });
};

// Get category by ID
exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM categories WHERE id = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ category: row });
  });
};

// Create new category
exports.createCategory = (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Name and type are required' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ error: 'Type must be either "income" or "expense"' });
  }

  const query = 'INSERT INTO categories (name, type) VALUES (?, ?)';

  db.run(query, [name, type], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Category name already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      message: 'Category created successfully',
      id: this.lastID 
    });
  });
};

// Update category
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Name and type are required' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ error: 'Type must be either "income" or "expense"' });
  }

  const query = 'UPDATE categories SET name = ?, type = ? WHERE id = ?';

  db.run(query, [name, type, id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Category name already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category updated successfully' });
  });
};

// Delete category
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  
  // First check if category is used in any transactions
  const checkQuery = 'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?';
  
  db.get(checkQuery, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (row.count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category that is used in transactions' 
      });
    }
    
    const deleteQuery = 'DELETE FROM categories WHERE id = ?';
    db.run(deleteQuery, [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully' });
    });
  });
};