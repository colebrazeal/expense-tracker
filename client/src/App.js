import React, { useState, useEffect } from 'react';
import './App.css';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import CategoryManager from './components/CategoryManager';
import Search from './components/Search';
import Reports from './components/Reports';
import { transactionAPI, categoryAPI } from './services/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Failed to fetch transactions');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    }
  };

  // Fetch monthly summary
  const fetchSummary = async (year, month) => {
    try {
      const response = await transactionAPI.getSummary(year, month);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      alert('Failed to fetch summary');
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSummary(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, transactions]);

  // Handle transaction creation
  const handleCreateTransaction = async (transactionData) => {
    try {
      await transactionAPI.create(transactionData);
      await fetchTransactions();
      alert('Transaction created successfully!');
    } catch (error) {
      console.error('Error creating transaction:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create transaction';
      alert(errorMessage);
    }
  };

  // Handle transaction update
  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      await transactionAPI.update(id, transactionData);
      await fetchTransactions();
      setEditingTransaction(null);
      alert('Transaction updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update transaction';
      alert(errorMessage);
    }
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        await fetchTransactions();
        alert('Transaction deleted successfully!');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('add');
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Personal Expense & Budget Tracker</h1>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => {
            setActiveTab('add');
            setEditingTransaction(null);
          }}
        >
          Add Transaction
        </button>
        <button
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <Dashboard
            summary={summary}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        )}

        {activeTab === 'add' && (
          <TransactionForm
            categories={categories}
            onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
            editingTransaction={editingTransaction}
            onCancelEdit={handleCancelEdit}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionList
            transactions={transactions}
            onEdit={handleEditClick}
            onDelete={handleDeleteTransaction}
          />
        )}

        {activeTab === 'search' && (
          <Search categories={categories} />
        )}

        {activeTab === 'reports' && (
          <Reports />
        )}

        {activeTab === 'categories' && (
          <CategoryManager
            categories={categories}
            onCategoriesChange={fetchCategories}
          />
        )}
      </main>
    </div>
  );
}

export default App;