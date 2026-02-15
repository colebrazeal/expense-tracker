import React from 'react';
import './TransactionList.css';

function TransactionList({ transactions, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-container">
        <h2>Transaction History</h2>
        <div className="empty-state">
          <p>No transactions yet. Start by adding your first transaction!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <h2>Transaction History</h2>
      <div className="transaction-count">
        Total Transactions: {transactions.length}
      </div>
      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`transaction-item ${transaction.type}`}
          >
            <div className="transaction-info">
              <div className="transaction-header">
                <span className="transaction-category">
                  {transaction.category_name}
                </span>
                <span className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatAmount(transaction.amount)}
                </span>
              </div>
              <div className="transaction-details">
                <span className="transaction-date">
                  {formatDate(transaction.date)}
                </span>
                {transaction.description && (
                  <span className="transaction-description">
                    {transaction.description}
                  </span>
                )}
              </div>
            </div>
            <div className="transaction-actions">
              <button
                className="btn-edit"
                onClick={() => onEdit(transaction)}
                title="Edit transaction"
              >
                ✏️
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(transaction.id)}
                title="Delete transaction"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;