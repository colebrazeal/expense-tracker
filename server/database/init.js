const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'expense_tracker.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  // Create categories table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating categories table:', err.message);
    } else {
      console.log('Categories table ready');
      insertDefaultCategories();
    }
  });

  // Create transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount REAL NOT NULL CHECK(amount > 0),
      category_id INTEGER NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating transactions table:', err.message);
    } else {
      console.log('Transactions table ready');
    }
  });
}

function insertDefaultCategories() {
  const defaultCategories = [
    // Income categories
    { name: 'Salary', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Investment', type: 'income' },
    { name: 'Other Income', type: 'income' },
    
    // Expense categories
    { name: 'Food & Dining', type: 'expense' },
    { name: 'Transportation', type: 'expense' },
    { name: 'Housing', type: 'expense' },
    { name: 'Utilities', type: 'expense' },
    { name: 'Healthcare', type: 'expense' },
    { name: 'Entertainment', type: 'expense' },
    { name: 'Shopping', type: 'expense' },
    { name: 'Other Expense', type: 'expense' }
  ];

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO categories (name, type) VALUES (?, ?)
  `);

  defaultCategories.forEach(category => {
    insertStmt.run(category.name, category.type);
  });

  insertStmt.finalize();
}

module.exports = db;