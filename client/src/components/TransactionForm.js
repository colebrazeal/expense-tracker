import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

function TransactionForm({ categories, onSubmit, editingTransaction, onCancelEdit }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category_id: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount,
        category_id: editingTransaction.category_id,
        description: editingTransaction.description || '',
        date: editingTransaction.date,
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category_id || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (editingTransaction) {
      onSubmit(editingTransaction.id, transactionData);
    } else {
      onSubmit(transactionData);
    }

    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      category_id: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

const filteredCategories = (categories || []).filter(
  (cat) => cat.type === formData.type
);

  return (
    <div className="transaction-form-container">
      <h2>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="type">Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount ($) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category_id">Category *</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Add a note about this transaction..."
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </button>
          {editingTransaction && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;