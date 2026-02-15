import React, { useState } from 'react';
import './Reports.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://expense-tracker-i1qc.onrender.com/api';

function Reports() {
  const [reportType, setReportType] = useState('financial');
  const [reportParams, setReportParams] = useState({
    startDate: '',
    endDate: '',
    type: '',
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString()
  });
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setReportParams({
      ...reportParams,
      [name]: value
    });
  };

  const generateReport = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      let endpoint = '';
      let params = {};

      switch (reportType) {
        case 'financial':
          endpoint = '/reports/financial';
          params = {
            startDate: reportParams.startDate,
            endDate: reportParams.endDate,
            type: reportParams.type
          };
          break;
        case 'category':
          endpoint = '/reports/category';
          params = {
            year: reportParams.year,
            month: reportParams.month
          };
          break;
        case 'yearly':
          endpoint = '/reports/yearly';
          params = {
            year: reportParams.year
          };
          break;
        default:
          throw new Error('Invalid report type');
      }

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
      setGeneratedReport(response.data.report || response.data);
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Failed to generate report. Please check your parameters.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReportAsJSON = () => {
    const dataStr = JSON.stringify(generatedReport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedReport.reportId}.json`;
    link.click();
  };

  const printReport = () => {
    window.print();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="reports-container">
      <h2>📊 Report Generator</h2>

      <div className="report-generator">
        <form onSubmit={generateReport} className="report-form">
          <div className="form-group">
            <label>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
            >
              <option value="financial">Detailed Financial Report</option>
              <option value="category">Category Summary Report</option>
              <option value="yearly">Annual Comparison Report</option>
            </select>
          </div>

          {reportType === 'financial' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={reportParams.startDate}
                    onChange={handleParamChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={reportParams.endDate}
                    onChange={handleParamChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  name="type"
                  value={reportParams.type}
                  onChange={handleParamChange}
                >
                  <option value="">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expenses Only</option>
                </select>
              </div>
            </>
          )}

          {reportType === 'category' && (
            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={reportParams.year}
                  onChange={handleParamChange}
                  min="2000"
                  max="2100"
                />
              </div>
              <div className="form-group">
                <label>Month</label>
                <select
                  name="month"
                  value={reportParams.month}
                  onChange={handleParamChange}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {reportType === 'yearly' && (
            <div className="form-group">
              <label>Year *</label>
              <input
                type="number"
                name="year"
                value={reportParams.year}
                onChange={handleParamChange}
                min="2000"
                max="2100"
                required
              />
            </div>
          )}

          <button type="submit" className="btn-generate" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : '📄 Generate Report'}
          </button>
        </form>

        {generatedReport && (
          <div className="report-display" id="printable-report">
            <div className="report-header">
              <h3>{generatedReport.title}</h3>
              <p className="report-subtitle">{generatedReport.subtitle}</p>
              <div className="report-meta">
                <span><strong>Report ID:</strong> {generatedReport.reportId}</span>
                <span><strong>Generated:</strong> {formatDate(generatedReport.generatedAt)}</span>
              </div>
            </div>

            <div className="report-actions no-print">
              <button onClick={downloadReportAsJSON} className="btn-download">
                📥 Download JSON
              </button>
              <button onClick={printReport} className="btn-print">
                🖨️ Print Report
              </button>
            </div>

            {/* Financial Report */}
            {reportType === 'financial' && (
              <>
                <div className="report-section">
                  <h4>Summary</h4>
                  <table className="report-table">
                    <tbody>
                      <tr>
                        <td><strong>Total Income</strong></td>
                        <td className="amount-positive">{formatAmount(generatedReport.summary.totalIncome)}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Expenses</strong></td>
                        <td className="amount-negative">{formatAmount(generatedReport.summary.totalExpenses)}</td>
                      </tr>
                      <tr className="total-row">
                        <td><strong>Net Balance</strong></td>
                        <td className={generatedReport.summary.netBalance >= 0 ? 'amount-positive' : 'amount-negative'}>
                          {formatAmount(generatedReport.summary.netBalance)}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Total Transactions</strong></td>
                        <td>{generatedReport.summary.transactionCount}</td>
                      </tr>
                      <tr>
                        <td><strong>Average Transaction</strong></td>
                        <td>{formatAmount(generatedReport.summary.averageTransaction)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="report-section">
                  <h4>Category Breakdown</h4>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Total</th>
                        <th>Count</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReport.categoryBreakdown.map((cat, idx) => (
                        <tr key={idx}>
                          <td>{cat.category}</td>
                          <td><span className={`type-badge ${cat.type}`}>{cat.type}</span></td>
                          <td className={cat.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                            {formatAmount(cat.total)}
                          </td>
                          <td>{cat.count}</td>
                          <td>{formatAmount(cat.average)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="report-section">
                  <h4>Transaction Details ({generatedReport.transactions.length} transactions)</h4>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReport.transactions.slice(0, 50).map((txn) => (
                        <tr key={txn.id}>
                          <td>{txn.date}</td>
                          <td>{txn.category}</td>
                          <td><span className={`type-badge ${txn.type}`}>{txn.type}</span></td>
                          <td className={txn.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                            {formatAmount(txn.amount)}
                          </td>
                          <td>{txn.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {generatedReport.transactions.length > 50 && (
                    <p className="note">Showing first 50 transactions. Download for complete data.</p>
                  )}
                </div>
              </>
            )}

            {/* Category Report */}
            {reportType === 'category' && (
              <>
                <div className="report-section">
                  <h4>Summary</h4>
                  <table className="report-table">
                    <tbody>
                      <tr>
                        <td><strong>Total Income</strong></td>
                        <td className="amount-positive">{formatAmount(generatedReport.totalIncome)}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Expenses</strong></td>
                        <td className="amount-negative">{formatAmount(generatedReport.totalExpenses)}</td>
                      </tr>
                      <tr className="total-row">
                        <td><strong>Net Balance</strong></td>
                        <td className={generatedReport.netBalance >= 0 ? 'amount-positive' : 'amount-negative'}>
                          {formatAmount(generatedReport.netBalance)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="report-section">
                  <h4>Categories</h4>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Total</th>
                        <th>Transactions</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReport.categories.map((cat, idx) => (
                        <tr key={idx}>
                          <td>{cat.category}</td>
                          <td><span className={`type-badge ${cat.type}`}>{cat.type}</span></td>
                          <td className={cat.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                            {formatAmount(cat.total)}
                          </td>
                          <td>{cat.transactionCount}</td>
                          <td>{formatAmount(cat.average)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Yearly Report */}
            {reportType === 'yearly' && generatedReport.monthlyBreakdown && (
              <>
                <div className="report-section">
                  <h4>Annual Summary</h4>
                  <table className="report-table">
                    <tbody>
                      <tr>
                        <td><strong>Total Income</strong></td>
                        <td className="amount-positive">{formatAmount(generatedReport.annualSummary.totalIncome)}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Expenses</strong></td>
                        <td className="amount-negative">{formatAmount(generatedReport.annualSummary.totalExpenses)}</td>
                      </tr>
                      <tr className="total-row">
                        <td><strong>Net Balance</strong></td>
                        <td className={generatedReport.annualSummary.netBalance >= 0 ? 'amount-positive' : 'amount-negative'}>
                          {formatAmount(generatedReport.annualSummary.netBalance)}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Total Transactions</strong></td>
                        <td>{generatedReport.annualSummary.totalTransactions}</td>
                      </tr>
                      <tr>
                        <td><strong>Avg Monthly Income</strong></td>
                        <td>{formatAmount(generatedReport.annualSummary.averageMonthlyIncome)}</td>
                      </tr>
                      <tr>
                        <td><strong>Avg Monthly Expenses</strong></td>
                        <td>{formatAmount(generatedReport.annualSummary.averageMonthlyExpenses)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="report-section">
                  <h4>Monthly Breakdown</h4>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Income</th>
                        <th>Expenses</th>
                        <th>Balance</th>
                        <th>Transactions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReport.monthlyBreakdown.map((month, idx) => (
                        <tr key={idx}>
                          <td><strong>{month.month}</strong></td>
                          <td className="amount-positive">{formatAmount(month.income)}</td>
                          <td className="amount-negative">{formatAmount(month.expenses)}</td>
                          <td className={month.balance >= 0 ? 'amount-positive' : 'amount-negative'}>
                            {formatAmount(month.balance)}
                          </td>
                          <td>{month.transactionCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;