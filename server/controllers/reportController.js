const { TransactionModel } = require('../models/BaseModel');
const transactionModel = new TransactionModel();

/**
 * Generate detailed financial report
 * Includes: multiple columns, multiple rows, date-time stamps, title
 */
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, type, format = 'json' } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Start date and end date are required' 
      });
    }

    // Get transactions for the period
    const filters = {
      startDate,
      endDate,
      type
    };

    const transactions = await transactionModel.search('', filters);

    // Calculate statistics
    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: transactions.length,
      incomeCount: 0,
      expenseCount: 0,
      averageTransaction: 0,
      categoryBreakdown: {}
    };

    transactions.forEach(t => {
      if (t.type === 'income') {
        stats.totalIncome += t.amount;
        stats.incomeCount++;
      } else {
        stats.totalExpenses += t.amount;
        stats.expenseCount++;
      }

      if (!stats.categoryBreakdown[t.category_name]) {
        stats.categoryBreakdown[t.category_name] = {
          type: t.type,
          total: 0,
          count: 0
        };
      }
      stats.categoryBreakdown[t.category_name].total += t.amount;
      stats.categoryBreakdown[t.category_name].count++;
    });

    stats.netBalance = stats.totalIncome - stats.totalExpenses;
    stats.averageTransaction = transactions.length > 0 
      ? (stats.totalIncome + stats.totalExpenses) / transactions.length 
      : 0;

    // Generate report object
    const report = {
      title: 'Financial Report',
      subtitle: `Period: ${startDate} to ${endDate}`,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Expense Tracker System',
      reportId: `RPT-${Date.now()}`,
      filters: {
        startDate,
        endDate,
        type: type || 'all'
      },
      summary: {
        totalIncome: parseFloat(stats.totalIncome.toFixed(2)),
        totalExpenses: parseFloat(stats.totalExpenses.toFixed(2)),
        netBalance: parseFloat(stats.netBalance.toFixed(2)),
        transactionCount: stats.transactionCount,
        incomeTransactions: stats.incomeCount,
        expenseTransactions: stats.expenseCount,
        averageTransaction: parseFloat(stats.averageTransaction.toFixed(2))
      },
      categoryBreakdown: Object.entries(stats.categoryBreakdown).map(([name, data]) => ({
        category: name,
        type: data.type,
        total: parseFloat(data.total.toFixed(2)),
        count: data.count,
        average: parseFloat((data.total / data.count).toFixed(2))
      })).sort((a, b) => b.total - a.total),
      transactions: transactions.map(t => ({
        id: t.id,
        date: t.date,
        type: t.type,
        category: t.category_name,
        amount: parseFloat(t.amount.toFixed(2)),
        description: t.description || 'N/A',
        createdAt: t.created_at
      }))
    };

    // Return in requested format
    if (format === 'csv') {
      return res.json({
        report,
        csv: generateCSV(report)
      });
    }

    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Generate summary report by category
 */
exports.generateCategoryReport = async (req, res) => {
  try {
    const { year, month } = req.query;

    const summary = await transactionModel.getMonthlySummary(year, month);

    const report = {
      title: 'Category Summary Report',
      subtitle: month && year 
        ? `Period: ${getMonthName(parseInt(month))} ${year}`
        : 'All Time',
      generatedAt: new Date().toISOString(),
      reportId: `CAT-RPT-${Date.now()}`,
      categories: summary.map(cat => ({
        category: cat.category_name,
        type: cat.type,
        total: parseFloat(cat.total.toFixed(2)),
        transactionCount: cat.count,
        average: parseFloat((cat.total / cat.count).toFixed(2))
      })),
      totalIncome: parseFloat(
        summary
          .filter(c => c.type === 'income')
          .reduce((sum, c) => sum + c.total, 0)
          .toFixed(2)
      ),
      totalExpenses: parseFloat(
        summary
          .filter(c => c.type === 'expense')
          .reduce((sum, c) => sum + c.total, 0)
          .toFixed(2)
      )
    };

    report.netBalance = parseFloat((report.totalIncome - report.totalExpenses).toFixed(2));

    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Generate yearly comparison report
 */
exports.generateYearlyReport = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ error: 'Year is required' });
    }

    const monthlyData = [];

    // Get data for each month
    for (let month = 1; month <= 12; month++) {
      const summary = await transactionModel.getMonthlySummary(
        year, 
        month.toString()
      );

      const income = summary
        .filter(s => s.type === 'income')
        .reduce((sum, s) => sum + s.total, 0);

      const expenses = summary
        .filter(s => s.type === 'expense')
        .reduce((sum, s) => sum + s.total, 0);

      monthlyData.push({
        month: getMonthName(month),
        monthNumber: month,
        income: parseFloat(income.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        balance: parseFloat((income - expenses).toFixed(2)),
        transactionCount: summary.reduce((sum, s) => sum + s.count, 0)
      });
    }

    const report = {
      title: `Annual Financial Report - ${year}`,
      generatedAt: new Date().toISOString(),
      reportId: `ANNUAL-${year}-${Date.now()}`,
      year: parseInt(year),
      monthlyBreakdown: monthlyData,
      annualSummary: {
        totalIncome: parseFloat(
          monthlyData.reduce((sum, m) => sum + m.income, 0).toFixed(2)
        ),
        totalExpenses: parseFloat(
          monthlyData.reduce((sum, m) => sum + m.expenses, 0).toFixed(2)
        ),
        netBalance: parseFloat(
          monthlyData.reduce((sum, m) => sum + m.balance, 0).toFixed(2)
        ),
        totalTransactions: monthlyData.reduce((sum, m) => sum + m.transactionCount, 0),
        averageMonthlyIncome: parseFloat(
          (monthlyData.reduce((sum, m) => sum + m.income, 0) / 12).toFixed(2)
        ),
        averageMonthlyExpenses: parseFloat(
          (monthlyData.reduce((sum, m) => sum + m.expenses, 0) / 12).toFixed(2)
        )
      }
    };

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to generate CSV format
function generateCSV(report) {
  let csv = `"${report.title}"\n`;
  csv += `"${report.subtitle}"\n`;
  csv += `"Generated: ${report.generatedAt}"\n`;
  csv += `"Report ID: ${report.reportId}"\n\n`;

  csv += '"SUMMARY"\n';
  csv += `"Total Income","${report.summary.totalIncome}"\n`;
  csv += `"Total Expenses","${report.summary.totalExpenses}"\n`;
  csv += `"Net Balance","${report.summary.netBalance}"\n`;
  csv += `"Transaction Count","${report.summary.transactionCount}"\n\n`;

  csv += '"TRANSACTIONS"\n';
  csv += '"Date","Type","Category","Amount","Description","Created At"\n';
  
  report.transactions.forEach(t => {
    csv += `"${t.date}","${t.type}","${t.category}","${t.amount}","${t.description}","${t.createdAt}"\n`;
  });

  return csv;
}

// Helper function to get month name
function getMonthName(monthNumber) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1];
}

module.exports = exports;