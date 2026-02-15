const db = require('../database/init');

/**
 * Base Model Class - Demonstrates Encapsulation
 * Encapsulates common database operations and properties
 */
class BaseModel {
  constructor(tableName) {
    this._tableName = tableName; // Private-like property (encapsulation)
    this._db = db;
  }

  // Getter method (encapsulation)
  get tableName() {
    return this._tableName;
  }

  // Protected method for executing queries
  _executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      this._db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Protected method for single query execution
  _executeOne(query, params = []) {
    return new Promise((resolve, reject) => {
      this._db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Protected method for insert/update/delete
  _executeRun(query, params = []) {
    return new Promise((resolve, reject) => {
      this._db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  // Polymorphic method - can be overridden by child classes
  async findAll() {
    const query = `SELECT * FROM ${this._tableName}`;
    return await this._executeQuery(query);
  }

  // Polymorphic method - can be overridden by child classes
  async findById(id) {
    const query = `SELECT * FROM ${this._tableName} WHERE id = ?`;
    return await this._executeOne(query, [id]);
  }

  // Polymorphic method - can be overridden by child classes
  async delete(id) {
    const query = `DELETE FROM ${this._tableName} WHERE id = ?`;
    return await this._executeRun(query, [id]);
  }

  // Abstract method - must be implemented by child classes
  validate(data) {
    throw new Error('validate() must be implemented by child class');
  }
}

/**
 * Transaction Model - Demonstrates Inheritance
 * Inherits from BaseModel and adds transaction-specific functionality
 */
class TransactionModel extends BaseModel {
  constructor() {
    super('transactions'); // Call parent constructor
  }

  // Override parent method (Polymorphism)
  async findAll() {
    const query = `
      SELECT t.*, c.name as category_name, c.type as category_type
      FROM ${this._tableName} t
      JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC, t.created_at DESC
    `;
    return await this._executeQuery(query);
  }

  // Override parent method (Polymorphism)
  async findById(id) {
    const query = `
      SELECT t.*, c.name as category_name, c.type as category_type
      FROM ${this._tableName} t
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `;
    return await this._executeOne(query, [id]);
  }

  // Transaction-specific method
  async create(data) {
    this.validate(data);
    const query = `
      INSERT INTO ${this._tableName} (type, amount, category_id, description, date)
      VALUES (?, ?, ?, ?, ?)
    `;
    return await this._executeRun(query, [
      data.type,
      data.amount,
      data.category_id,
      data.description || '',
      data.date
    ]);
  }

  // Transaction-specific method
  async update(id, data) {
    this.validate(data);
    const query = `
      UPDATE ${this._tableName}
      SET type = ?, amount = ?, category_id = ?, description = ?, date = ?
      WHERE id = ?
    `;
    return await this._executeRun(query, [
      data.type,
      data.amount,
      data.category_id,
      data.description || '',
      data.date,
      id
    ]);
  }

  // Search transactions (for search functionality requirement)
  async search(searchTerm, filters = {}) {
    let query = `
      SELECT t.*, c.name as category_name, c.type as category_type
      FROM ${this._tableName} t
      JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Search in description and category name
    if (searchTerm) {
      query += ` AND (t.description LIKE ? OR c.name LIKE ?)`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    // Filter by type
    if (filters.type) {
      query += ` AND t.type = ?`;
      params.push(filters.type);
    }

    // Filter by date range
    if (filters.startDate) {
      query += ` AND t.date >= ?`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ` AND t.date <= ?`;
      params.push(filters.endDate);
    }

    // Filter by category
    if (filters.categoryId) {
      query += ` AND t.category_id = ?`;
      params.push(filters.categoryId);
    }

    // Filter by amount range
    if (filters.minAmount) {
      query += ` AND t.amount >= ?`;
      params.push(filters.minAmount);
    }
    if (filters.maxAmount) {
      query += ` AND t.amount <= ?`;
      params.push(filters.maxAmount);
    }

    query += ` ORDER BY t.date DESC, t.created_at DESC`;

    return await this._executeQuery(query, params);
  }

// Get monthly summary
// Get monthly summary
async getMonthlySummary(year, month) {
  let query = `
    SELECT 
      t.type,
      t.category_id,
      c.name as category_name,
      SUM(t.amount) as total,
      COUNT(*) as count
    FROM ${this._tableName} t
    JOIN categories c ON t.category_id = c.id
  `;
  const params = [];

  if (year && month) {
    query += ` WHERE strftime('%Y', t.date) = ? AND strftime('%m', t.date) = ?`;
    params.push(year, month.toString().padStart(2, '0'));
  }

  query += ` GROUP BY t.type, t.category_id, c.name ORDER BY total DESC`;

  return await this._executeQuery(query, params);
}

  // Implementation of abstract validate method
  validate(data) {
    const errors = [];

    if (!data.type || !['income', 'expense'].includes(data.type)) {
      errors.push('Type must be either "income" or "expense"');
    }

    if (!data.amount || isNaN(data.amount) || parseFloat(data.amount) <= 0) {
      errors.push('Amount must be a positive number');
    }

    if (!data.category_id || isNaN(data.category_id)) {
      errors.push('Valid category ID is required');
    }

    if (!data.date || !this._isValidDate(data.date)) {
      errors.push('Valid date is required (YYYY-MM-DD)');
    }

    if (data.description && data.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return true;
  }

  // Private validation helper
  _isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
}

/**
 * Category Model - Demonstrates Inheritance
 * Inherits from BaseModel and adds category-specific functionality
 */
class CategoryModel extends BaseModel {
  constructor() {
    super('categories'); // Call parent constructor
  }

  // Override parent method (Polymorphism)
  async findAll(type = null) {
    let query = `SELECT * FROM ${this._tableName}`;
    const params = [];

    if (type) {
      query += ` WHERE type = ?`;
      params.push(type);
    }

    query += ` ORDER BY type, name`;
    return await this._executeQuery(query, params);
  }

  // Category-specific method
  async create(data) {
    this.validate(data);
    const query = `INSERT INTO ${this._tableName} (name, type) VALUES (?, ?)`;
    return await this._executeRun(query, [data.name, data.type]);
  }

  // Category-specific method
  async update(id, data) {
    this.validate(data);
    const query = `UPDATE ${this._tableName} SET name = ?, type = ? WHERE id = ?`;
    return await this._executeRun(query, [data.name, data.type, id]);
  }

  // Override delete to check for dependencies
  async delete(id) {
    // Check if category is used in transactions
    const checkQuery = 'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?';
    const result = await this._executeOne(checkQuery, [id]);

    if (result.count > 0) {
      throw new Error('Cannot delete category that is used in transactions');
    }

    return await super.delete(id);
  }

  // Implementation of abstract validate method
  validate(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Category name is required');
    }

    if (data.name && data.name.length > 100) {
      errors.push('Category name must be less than 100 characters');
    }

    if (!data.type || !['income', 'expense'].includes(data.type)) {
      errors.push('Type must be either "income" or "expense"');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return true;
  }
}

// Export models
module.exports = {
  BaseModel,
  TransactionModel,
  CategoryModel
};