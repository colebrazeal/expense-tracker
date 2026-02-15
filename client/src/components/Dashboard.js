import React from 'react';
import './Dashboard.css';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Dashboard({
  summary,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'
  ];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Handle loading and error states
  if (!summary) {
    return (
      <div className="dashboard-container">
        <h2>Loading dashboard...</h2>
        <p>If this persists, check that the backend server is running on port 5001.</p>
      </div>
    );
  }

  // Prepare data for charts - handle empty data
  const expenseData = (summary.categoryBreakdown || [])
    .filter((item) => item.type === 'expense')
    .map((item) => ({
      name: item.category_name,
      value: item.total,
    }));

  const incomeData = (summary.categoryBreakdown || [])
    .filter((item) => item.type === 'income')
    .map((item) => ({
      name: item.category_name,
      value: item.total,
    }));

  const comparisonData = [
    { name: 'Income', amount: summary.income || 0, fill: '#4CAF50' },
    { name: 'Expenses', amount: summary.expenses || 0, fill: '#F44336' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Financial Dashboard</h2>
        <div className="date-selector">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p className="amount">{formatAmount(summary.income)}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Expenses</h3>
          <p className="amount">{formatAmount(summary.expenses)}</p>
        </div>
        <div className={`summary-card balance ${(summary.balance || 0) >= 0 ? 'positive' : 'negative'}`}>
          <h3>Balance</h3>
          <p className="amount">{formatAmount(summary.balance)}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h3>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatAmount(value)} />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8">
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

{expenseData.length > 0 && (
  <div className="chart-section">
    <h3>Expense Breakdown</h3>
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={expenseData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) =>
            `${(percent * 100).toFixed(0)}%`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {expenseData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => formatAmount(value)}
          contentStyle={{ fontSize: '14px' }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
)}

{incomeData.length > 0 && (
  <div className="chart-section">
    <h3>Income Breakdown</h3>
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={incomeData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) =>
            `${(percent * 100).toFixed(0)}%`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {incomeData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => formatAmount(value)}
          contentStyle={{ fontSize: '14px' }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
)}
    </div>

      {(summary.categoryBreakdown || []).length === 0 && (
        <div className="empty-state">
          <p>No transactions for the selected period.</p>
          <p>Click "Add Transaction" to get started!</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;