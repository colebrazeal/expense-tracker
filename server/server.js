require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database/init');
const security = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(security.securityHeaders);
app.use(security.rateLimiter);
app.use(security.validateRequest);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(security.sanitizeInput);
app.use(security.preventSqlInjection);

app.use(security.auditLogger);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const transactionRoutes = require('./routes/transactions');
const categoryRoutes = require('./routes/categories');
const reportRoutes = require('./routes/reports');

app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Personal Expense & Budget Tracker API',
    version: '1.0.0',
    endpoints: {
      transactions: '/api/transactions',
      categories: '/api/categories',
      reports: '/api/reports',
      search: '/api/transactions/search'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use(security.errorHandler);

let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
    console.log(`Listening on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('Security features enabled:');
    console.log('  - Rate limiting (100 req/min)');
    console.log('  - Input sanitization');
    console.log('  - SQL injection prevention');
    console.log('  - XSS protection');
    console.log('  - Security headers');
    console.log('  - Audit logging');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
      console.error('Try changing the PORT in your .env file');
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    server.close(() => {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
        process.exit(0);
      });
    });
  });
}