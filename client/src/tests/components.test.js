import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';

import App from '../App';
import Dashboard from '../components/Dashboard';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Search from '../components/Search';
import CategoryManager from '../components/CategoryManager';
import { transactionAPI } from '../services/api';

beforeAll(() => {
  window.alert = jest.fn();
  window.confirm = jest.fn(() => true);
});


jest.mock('axios');

describe('Frontend Component Tests', () => {
  
  // ==========================================
  // APP COMPONENT TESTS
  // ==========================================
  
  describe('App Component', () => {
    beforeEach(() => {
      axios.get.mockImplementation((url) => {
        if (url.includes('/api/transactions')) {
          return Promise.resolve({ data: { transactions: [] } });
        }
        if (url.includes('/api/categories')) {
          return Promise.resolve({ data: { categories: mockCategories } });
        }
        if (url.includes('/api/transactions/summary')) {
          return Promise.resolve({ 
            data: { 
              summary: {
                income: 0,
                expenses: 0,
                balance: 0,
                categoryBreakdown: []
              }
            }
          });
        }
        return Promise.resolve({ data: {} });
      });
    });

    test('APP-001: App renders without crashing', () => {
      render(<App />);
      expect(screen.getByText(/Personal Expense & Budget Tracker/i)).toBeInTheDocument();
    });

    test('APP-002: All navigation tabs are present', () => {
      render(<App />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Add Transaction')).toBeInTheDocument();
      expect(screen.getByText('Transactions')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    test('APP-003: Tab navigation works', async () => {
      render(<App />);
      
      const dashboardTab = screen.getByText('Dashboard');
      const addTab = screen.getByText('Add Transaction');
      
      fireEvent.click(addTab);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // DASHBOARD COMPONENT TESTS
  // ==========================================
  
  describe('Dashboard Component', () => {
    const mockSummary = {
      income: 3000,
      expenses: 2000,
      balance: 1000,
      categoryBreakdown: [
        { type: 'income', category_name: 'Salary', total: 3000, count: 1 },
        { type: 'expense', category_name: 'Food & Dining', total: 500, count: 5 }
      ]
    };

    test('DASH-001: Dashboard displays summary cards', () => {
      render(
        <Dashboard 
          summary={mockSummary}
          selectedMonth={2}
          selectedYear={2026}
          onMonthChange={() => {}}
          onYearChange={() => {}}
        />
      );

      expect(screen.getByText('Total Income')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses')).toBeInTheDocument();
      expect(screen.getByText('Balance')).toBeInTheDocument();
    });

    test('DASH-002: Dashboard displays correct amounts', () => {
      render(
        <Dashboard 
          summary={mockSummary}
          selectedMonth={2}
          selectedYear={2026}
          onMonthChange={() => {}}
          onYearChange={() => {}}
        />
      );

      expect(screen.getByText(/\$3,000.00/)).toBeInTheDocument(); // Income
      expect(screen.getByText(/\$2,000.00/)).toBeInTheDocument(); // Expenses
      expect(screen.getByText(/\$1,000.00/)).toBeInTheDocument(); // Balance
    });

    test('DASH-003: Month selector works', () => {
      const mockMonthChange = jest.fn();
      
      render(
        <Dashboard 
          summary={mockSummary}
          selectedMonth={2}
          selectedYear={2026}
          onMonthChange={mockMonthChange}
          onYearChange={() => {}}
        />
      );

      const monthSelect = screen.getAllByRole('combobox')[0];
      fireEvent.change(monthSelect, { target: { value: '3' } });
      
      expect(mockMonthChange).toHaveBeenCalledWith(3);
    });

    test('DASH-004: Shows empty state when no data', () => {
      const emptySummary = {
        income: 0,
        expenses: 0,
        balance: 0,
        categoryBreakdown: []
      };

      render(
        <Dashboard 
          summary={emptySummary}
          selectedMonth={2}
          selectedYear={2026}
          onMonthChange={() => {}}
          onYearChange={() => {}}
        />
      );

      expect(screen.getByText(/No transactions for the selected period/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // TRANSACTION FORM TESTS
  // ==========================================
  
  describe('TransactionForm Component', () => {
    const mockCategories = [
      { id: 1, name: 'Salary', type: 'income' },
      { id: 2, name: 'Food & Dining', type: 'expense' }
    ];

    test('FORM-001: Form renders all fields', () => {
      render(
        <TransactionForm 
          categories={mockCategories}
          onSubmit={() => {}}
          editingTransaction={null}
          onCancelEdit={() => {}}
        />
      );

      expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });

    test('FORM-002: Type selection filters categories', () => {
      render(
        <TransactionForm 
          categories={mockCategories}
          onSubmit={() => {}}
          editingTransaction={null}
          onCancelEdit={() => {}}
        />
      );

      const typeSelect = screen.getByLabelText(/Type/i);
      
      fireEvent.change(typeSelect, { target: { value: 'income' } });
      
      const categorySelect = screen.getByLabelText(/Category/i);
      const options = Array.from(categorySelect.options).map(opt => opt.text);
      
      expect(options).toContain('Salary');
      expect(options).not.toContain('Food & Dining');
    });

    test('FORM-003: Form submission with valid data', async () => {
      const mockSubmit = jest.fn();
      
      render(
        <TransactionForm 
          categories={mockCategories}
          onSubmit={mockSubmit}
          editingTransaction={null}
          onCancelEdit={() => {}}
        />
      );

      fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'expense' } });
      fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '50.00' } });
      fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2026-02-08' } });
      fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test transaction' } });

      fireEvent.click(screen.getByText(/Add Transaction/i));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
    });

    test('FORM-004: Validation prevents empty submission', () => {
      const mockSubmit = jest.fn();
      
      render(
        <TransactionForm 
          categories={mockCategories}
          onSubmit={mockSubmit}
          editingTransaction={null}
          onCancelEdit={() => {}}
        />
      );

      fireEvent.click(screen.getByText(/Add Transaction/i));

      expect(mockSubmit).not.toHaveBeenCalled();
    });

    test('FORM-005: Edit mode pre-fills form', () => {
      const editingTransaction = {
        id: 1,
        type: 'expense',
        amount: 100,
        category_id: 2,
        description: 'Existing transaction',
        date: '2026-02-08'
      };

      render(
        <TransactionForm 
          categories={mockCategories}
          onSubmit={() => {}}
          editingTransaction={editingTransaction}
          onCancelEdit={() => {}}
        />
      );

      expect(screen.getByLabelText(/Type/i)).toHaveValue('expense');
      expect(screen.getByLabelText(/Amount/i)).toHaveValue(100);
      expect(screen.getByLabelText(/Category/i)).toHaveValue('2');
      expect(screen.getByLabelText(/Description/i)).toHaveValue('Existing transaction');
    });

    test('FORM-006: Cancel edit clears form', () => {
      const mockCancelEdit = jest.fn();
      const editingTransaction = {
        id: 1,
        type: 'expense',
        amount: 100,
        category_id: 2,
        description: 'Existing transaction',
        date: '2026-02-08'
      };

      render(
        <TransactionForm 
          categories={mockCategories}
          onSubmit={() => {}}
          editingTransaction={editingTransaction}
          onCancelEdit={mockCancelEdit}
        />
      );

      fireEvent.click(screen.getByText(/Cancel/i));
      expect(mockCancelEdit).toHaveBeenCalled();
    });
  });

  // ==========================================
  // TRANSACTION LIST TESTS
  // ==========================================
  
  describe('TransactionList Component', () => {
    const mockTransactions = [
      {
        id: 1,
        type: 'income',
        amount: 3000,
        category_name: 'Salary',
        description: 'Monthly salary',
        date: '2026-02-01',
        created_at: '2026-02-01 10:00:00'
      },
      {
        id: 2,
        type: 'expense',
        amount: 50,
        category_name: 'Food & Dining',
        description: 'Grocery shopping',
        date: '2026-02-08',
        created_at: '2026-02-08 14:00:00'
      }
    ];

    test('LIST-001: Displays all transactions', () => {
      render(
        <TransactionList 
          transactions={mockTransactions}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );

      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Food & Dining')).toBeInTheDocument();
    });

    test('LIST-002: Shows transaction count', () => {
      render(
        <TransactionList 
          transactions={mockTransactions}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );

      expect(screen.getByText(/Total Transactions: 2/i)).toBeInTheDocument();
    });

    test('LIST-003: Edit button calls handler', () => {
      const mockEdit = jest.fn();
      
      render(
        <TransactionList 
          transactions={mockTransactions}
          onEdit={mockEdit}
          onDelete={() => {}}
        />
      );

      const editButtons = screen.getAllByText(/✏️|Edit/i);
      fireEvent.click(editButtons[0]);

      expect(mockEdit).toHaveBeenCalledWith(mockTransactions[0]);
    });

test('LIST-004: Delete button calls onDelete with correct id', () => {
  const mockDelete = jest.fn();

  render(
    <TransactionList
      transactions={mockTransactions}
      onEdit={() => {}}
      onDelete={mockDelete}
    />
  );

  const deleteButtons = screen.getAllByTitle('Delete transaction');

  fireEvent.click(deleteButtons[0]);

  expect(mockDelete).toHaveBeenCalledTimes(1);

  expect(mockDelete).toHaveBeenCalledWith(mockTransactions[0].id);
});


    test('LIST-005: Empty state message', () => {
      render(
        <TransactionList 
          transactions={[]}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );

      expect(screen.getByText(/No transactions yet/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // SEARCH COMPONENT TESTS
  // ==========================================
  
  describe('Search Component', () => {
    const mockCategories = [
      { id: 1, name: 'Salary', type: 'income' },
      { id: 2, name: 'Food & Dining', type: 'expense' }
    ];

    beforeEach(() => {
      window.alert = jest.fn();
      
      axios.get.mockResolvedValue({
        data: {
          results: [],
          count: 0
        }
      });
    });

    test('SEARCH-001: Search form renders', () => {
      render(<Search categories={mockCategories} />);

      expect(screen.getByPlaceholderText(/Search by description or category/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

  test('SEARCH-002: Filters are available', () => {
    const { container } = render(<Search categories={mockCategories} />);

    const typeSelect = container.querySelector('select[name="type"]');
    const categorySelect = container.querySelector('select[name="categoryId"]');

    const startDateInput = container.querySelector('input[name="startDate"]');
    const endDateInput = container.querySelector('input[name="endDate"]');

    const minAmountInput = container.querySelector('input[name="minAmount"]');
    const maxAmountInput = container.querySelector('input[name="maxAmount"]');

    expect(typeSelect).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
    expect(minAmountInput).toBeInTheDocument();
    expect(maxAmountInput).toBeInTheDocument();
  });



test('SEARCH-003: Search triggers API call', async () => {
  transactionAPI.search = jest.fn().mockResolvedValueOnce({
    data: {
      results: [
        {
          id: 1,
          type: 'expense',
          amount: 50,
          category_name: 'Food & Dining',
          description: 'Grocery shopping',
          date: '2026-02-08'
        }
      ],
      count: 1
    }
  });

  render(<Search categories={mockCategories} />);

  const searchInput = screen.getByPlaceholderText(/search by description or category/i);
  const searchButton = screen.getByRole('button', { name: /search/i });

  fireEvent.change(searchInput, { target: { value: 'grocery' } });

  fireEvent.click(searchButton);

  await waitFor(() => {
    expect(transactionAPI.search).toHaveBeenCalledWith(
      'grocery',
      expect.objectContaining({
        type: '',
        startDate: '',
        endDate: '',
        categoryId: '',
        minAmount: '',
        maxAmount: ''
      })
    );
  });

  expect(await screen.findByText(/Grocery shopping/i)).toBeInTheDocument();
});



    test('SEARCH-004: Clear filters resets form', () => {
      render(<Search categories={mockCategories} />);

      const searchInput = screen.getByPlaceholderText(/Search by description or category/i);
      const typeSelect = document.querySelector('select[name="type"]');
      
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.change(typeSelect, { target: { value: 'expense' } });

      fireEvent.click(screen.getByText(/Clear All Filters/i));

      expect(searchInput).toHaveValue('');
      expect(typeSelect).toHaveValue('');
    });
  });

  // ==========================================
  // CATEGORY MANAGER TESTS
  // ==========================================
  
  describe('CategoryManager Component', () => {
    const mockCategories = [
      { id: 1, name: 'Salary', type: 'income' },
      { id: 2, name: 'Food & Dining', type: 'expense' }
    ];

    const mockOnChange = jest.fn();

    test('CAT-001: Displays income and expense sections', () => {
      render(
        <CategoryManager 
          categories={mockCategories}
          onCategoriesChange={mockOnChange}
        />
      );

      expect(screen.getByText(/Income Categories/i)).toBeInTheDocument();
      expect(screen.getByText(/Expense Categories/i)).toBeInTheDocument();
    });

    test('CAT-002: Shows all categories', () => {
      render(
        <CategoryManager 
          categories={mockCategories}
          onCategoriesChange={mockOnChange}
        />
      );

      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Food & Dining')).toBeInTheDocument();
    });

    test('CAT-003: Add new category button exists', () => {
      render(
        <CategoryManager 
          categories={mockCategories}
          onCategoriesChange={mockOnChange}
        />
      );

      expect(screen.getByText(/Add New Category/i)).toBeInTheDocument();
    });
  });
});

const mockCategories = [
  { id: 1, name: 'Salary', type: 'income' },
  { id: 2, name: 'Freelance', type: 'income' },
  { id: 3, name: 'Investment', type: 'income' },
  { id: 4, name: 'Other Income', type: 'income' },
  { id: 5, name: 'Food & Dining', type: 'expense' },
  { id: 6, name: 'Transportation', type: 'expense' },
  { id: 7, name: 'Housing', type: 'expense' },
  { id: 8, name: 'Utilities', type: 'expense' },
  { id: 9, name: 'Healthcare', type: 'expense' },
  { id: 10, name: 'Entertainment', type: 'expense' },
  { id: 11, name: 'Shopping', type: 'expense' },
  { id: 12, name: 'Other Expense', type: 'expense' }
];