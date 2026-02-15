import React, { useState } from 'react';
import './Search.css';
import { transactionAPI } from '../services/api';

function Search({ categories }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

const handleSearch = async (e) => {
  e.preventDefault();
  setIsSearching(true);
  setHasSearched(true);  // ← ADD THIS LINE

  try {
    const params = {};
    
    if (searchTerm) params.q = searchTerm;
    if (filters.type) params.type = filters.type;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.minAmount) params.minAmount = filters.minAmount;
    if (filters.maxAmount) params.maxAmount = filters.maxAmount;

    const response = await transactionAPI.search(params);
    
    setResults(response.data.results || []);
    setResultCount(response.data.count || 0);
  } catch (error) {
    console.error('Search error:', error);
    alert('Search failed. Please try again.');
  } finally {
    setIsSearching(false);
  }
};

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      startDate: '',
      endDate: '',
      categoryId: '',
      minAmount: '',
      maxAmount: ''
    });
    setResults([]);
    setHasSearched(false);
  };

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

  return (
    <div className="search-container">
      <h2>🔍 Search Transactions</h2>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search by description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="filters-section">
          <h3>Advanced Filters</h3>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label>Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Min Amount ($)</label>
              <input
                type="number"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                step="0.01"
                min="0"
              />
            </div>

            <div className="filter-group">
              <label>Max Amount ($)</label>
              <input
                type="number"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <button
            type="button"
            className="btn-clear-filters"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </button>
        </div>
      </form>

      <div className="search-results">
        <h3>
          Search Results
          {hasSearched && ` (${results.length} found)`}
        </h3>

        {hasSearched && results.length === 0 && (
          <div className="no-results">
            <p>No transactions found matching your search criteria.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="results-list">
            {results.map((transaction) => (
              <div
                key={transaction.id}
                className={`result-item ${transaction.type}`}
              >
                <div className="result-info">
                  <div className="result-header">
                    <span className="result-category">
                      {transaction.category_name}
                    </span>
                    <span className={`result-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatAmount(transaction.amount)}
                    </span>
                  </div>
                  <div className="result-details">
                    <span className="result-date">
                      {formatDate(transaction.date)}
                    </span>
                    <span className="result-type-badge">{transaction.type}</span>
                    {transaction.description && (
                      <span className="result-description">
                        {transaction.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;