const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);

const app = require('../server/server');
const { TransactionModel, CategoryModel } = require('../server/models/BaseModel');

describe('Personal Expense Tracker - Backend Tests', function() {
  this.timeout(5000);

  before(function(done) {
    console.log('Setting up test environment...');
    setTimeout(done, 1000);
  });

  after(function() {
    console.log('Test suite completed');
  });

  // ==========================================
  // MODEL LAYER TESTS
  // ==========================================

  describe('TransactionModel Tests', function() {
    const transactionModel = new TransactionModel();
    let testCategoryId;
    let testTransactionId;

    before(async function() {
      const categories = await transactionModel._executeQuery('SELECT * FROM categories LIMIT 1');
      testCategoryId = categories[0].id;
    });

    describe('TM-001: Create Valid Transaction', function() {
      it('should create a transaction with valid data', async function() {
        const transactionData = {
          type: 'expense',
          amount: 50.00,
          category_id: testCategoryId,
          description: 'Test transaction',
          date: '2026-02-08'
        };

        const result = await transactionModel.create(transactionData);
        testTransactionId = result.lastID;

        expect(result).to.have.property('lastID');
        expect(result.lastID).to.be.a('number');
        expect(result.lastID).to.be.greaterThan(0);
      });
    });

    describe('TM-002: Validation - Invalid Amount', function() {
      it('should reject negative amount', async function() {
        const transactionData = {
          type: 'expense',
          amount: -50.00,
          category_id: testCategoryId,
          description: 'Invalid transaction',
          date: '2026-02-08'
        };

        try {
          await transactionModel.create(transactionData);
          expect.fail('Should have thrown validation error');
        } catch (error) {
          expect(error.message).to.include('positive number');
        }
      });

      it('should reject zero amount', async function() {
        const transactionData = {
          type: 'expense',
          amount: 0,
          category_id: testCategoryId,
          description: 'Invalid transaction',
          date: '2026-02-08'
        };

        try {
          await transactionModel.create(transactionData);
          expect.fail('Should have thrown validation error');
        } catch (error) {
          expect(error.message).to.include('positive number');
        }
      });
    });

    describe('TM-003: Validation - Invalid Type', function() {
      it('should reject invalid transaction type', async function() {
        const transactionData = {
          type: 'invalid',
          amount: 50.00,
          category_id: testCategoryId,
          description: 'Invalid type',
          date: '2026-02-08'
        };

        try {
          await transactionModel.create(transactionData);
          expect.fail('Should have thrown validation error');
        } catch (error) {
          expect(error.message).to.include('income');
          expect(error.message).to.include('expense');
        }
      });
    });

    describe('TM-004: Find All Transactions', function() {
      it('should retrieve all transactions with category info', async function() {
        const transactions = await transactionModel.findAll();

        expect(transactions).to.be.an('array');
        if (transactions.length > 0) {
          expect(transactions[0]).to.have.property('category_name');
          expect(transactions[0]).to.have.property('type');
          expect(transactions[0]).to.have.property('amount');
        }
      });
    });

    describe('TM-005: Find Transaction by ID', function() {
      it('should retrieve a single transaction', async function() {
        const transaction = await transactionModel.findById(testTransactionId);

        expect(transaction).to.be.an('object');
        expect(transaction).to.have.property('id');
        expect(transaction.id).to.equal(testTransactionId);
        expect(transaction).to.have.property('category_name');
      });
    });

    describe('TM-006: Update Transaction', function() {
      it('should update an existing transaction', async function() {
        const updateData = {
          type: 'expense',
          amount: 75.00,
          category_id: testCategoryId,
          description: 'Updated transaction',
          date: '2026-02-08'
        };

        const result = await transactionModel.update(testTransactionId, updateData);

        expect(result).to.have.property('changes');
        expect(result.changes).to.equal(1);

        const updated = await transactionModel.findById(testTransactionId);
        expect(updated.amount).to.equal(75.00);
        expect(updated.description).to.equal('Updated transaction');
      });
    });

    describe('TM-007: Search Transactions', function() {
      it('should search by description', async function() {
        const results = await transactionModel.search('Updated', {});

        expect(results).to.be.an('array');
        expect(results.length).to.be.greaterThan(0);
        expect(results[0].description).to.include('Updated');
      });

      it('should filter by type', async function() {
        const results = await transactionModel.search('', { type: 'expense' });

        expect(results).to.be.an('array');
        results.forEach(txn => {
          expect(txn.type).to.equal('expense');
        });
      });
    });

    describe('TM-008: Monthly Summary', function() {
      it('should generate monthly summary', async function() {
        const summary = await transactionModel.getMonthlySummary('2026', '2');

        expect(summary).to.be.an('array');
        if (summary.length > 0) {
          expect(summary[0]).to.have.property('type');
          expect(summary[0]).to.have.property('total');
          expect(summary[0]).to.have.property('count');
        }
      });
    });

    describe('TM-009: Delete Transaction', function() {
      it('should delete a transaction', async function() {
        const result = await transactionModel.delete(testTransactionId);

        expect(result).to.have.property('changes');
        expect(result.changes).to.equal(1);

        const deleted = await transactionModel.findById(testTransactionId);
        expect(deleted).to.be.undefined;
      });
    });

    describe('TM-010: Date Validation', function() {
      it('should reject invalid date format', async function() {
        const transactionData = {
          type: 'expense',
          amount: 50.00,
          category_id: testCategoryId,
          description: 'Invalid date',
          date: 'not-a-date'
        };

        try {
          await transactionModel.create(transactionData);
          expect.fail('Should have thrown validation error');
        } catch (error) {
          expect(error.message).to.include('date');
        }
      });
    });
  });

  describe('CategoryModel Tests', function() {
    const categoryModel = new CategoryModel();
    let testCategoryId;

    describe('CM-001: Create Category', function() {
      it('should create a category with valid data', async function() {
        const categoryData = {
          name: 'Test Category ' + Date.now(),
          type: 'expense'
        };

        const result = await categoryModel.create(categoryData);
        testCategoryId = result.lastID;

        expect(result).to.have.property('lastID');
        expect(result.lastID).to.be.a('number');
        expect(result.lastID).to.be.greaterThan(0);
      });
    });

    describe('CM-002: Duplicate Category Name', function() {
      it('should reject duplicate category name', async function() {
        const categoryData = {
          name: 'Salary', 
          type: 'income'
        };

        try {
          await categoryModel.create(categoryData);
          expect.fail('Should have thrown unique constraint error');
        } catch (error) {
          expect(error.message).to.include('UNIQUE constraint failed');
        }
      });
    });

    describe('CM-003: Find All Categories', function() {
      it('should retrieve all categories', async function() {
        const categories = await categoryModel.findAll();

        expect(categories).to.be.an('array');
        expect(categories.length).to.be.greaterThan(0);
        expect(categories[0]).to.have.property('name');
        expect(categories[0]).to.have.property('type');
      });
    });

    describe('CM-004: Filter by Type', function() {
      it('should filter categories by type', async function() {
        const incomeCategories = await categoryModel.findAll('income');

        expect(incomeCategories).to.be.an('array');
        incomeCategories.forEach(cat => {
          expect(cat.type).to.equal('income');
        });
      });
    });

    describe('CM-005: Update Category', function() {
      it('should update category name', async function() {
        const updateData = {
          name: 'Updated Test Category',
          type: 'expense'
        };

        const result = await categoryModel.update(testCategoryId, updateData);

        expect(result).to.have.property('changes');
        expect(result.changes).to.equal(1);
      });
    });

    describe('CM-006: Validation - Empty Name', function() {
      it('should reject empty category name', async function() {
        const categoryData = {
          name: '',
          type: 'expense'
        };

        try {
          await categoryModel.create(categoryData);
          expect.fail('Should have thrown validation error');
        } catch (error) {
          expect(error.message).to.include('required');
        }
      });
    });

    describe('CM-007: Validation - Invalid Type', function() {
      it('should reject invalid category type', async function() {
        const categoryData = {
          name: 'Invalid Type Category',
          type: 'invalid'
        };

        try {
          await categoryModel.create(categoryData);
          expect.fail('Should have thrown validation error');
        } catch (error) {
          expect(error.message).to.include('income');
          expect(error.message).to.include('expense');
        }
      });
    });

    describe('CM-008: Delete Unused Category', function() {
      it('should delete category with no transactions', async function() {
        const result = await categoryModel.delete(testCategoryId);

        expect(result).to.have.property('changes');
        expect(result.changes).to.equal(1);
      });
    });

    describe('CM-009: Cannot Delete Used Category', function() {
      it('should prevent deleting category in use', async function() {
        const transactionModel = new TransactionModel();
        const categories = await categoryModel.findAll();
        const categoryId = categories[0].id;

        const txnData = {
          type: 'expense',
          amount: 25.00,
          category_id: categoryId,
          description: 'Test for deletion',
          date: '2026-02-08'
        };

        await transactionModel.create(txnData);

        try {
          await categoryModel.delete(categoryId);
          expect.fail('Should have thrown error about category in use');
        } catch (error) {
          expect(error.message).to.include('Cannot delete category');
        }
      });
    });

    describe('CM-010: Name Length Validation', function() {
      it('should reject names over 100 characters', async function() {
        const longName = 'A'.repeat(101);
        const categoryData = {
          name: longName,
          type: 'expense'
        };

        try {
          await categoryModel.create(categoryData);
          expect.fail('Should have thrown validation error');
        } catch (error) {
          expect(error.message).to.include('100 characters');
        }
      });
    });
  });

  // ==========================================
  // API ENDPOINT TESTS
  // ==========================================

  describe('Transaction API Endpoints', function() {
    let testTransactionId;
    let testCategoryId;

    before(async function() {
      const res = await chai.request(app).get('/api/categories');
      testCategoryId = res.body.categories[0].id;
    });

    describe('TC-001: GET /api/transactions', function() {
      it('should return all transactions', function(done) {
        chai.request(app)
          .get('/api/transactions')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('transactions');
            expect(res.body.transactions).to.be.an('array');
            done();
          });
      });
    });

    describe('TC-002: POST /api/transactions', function() {
      it('should create a new transaction', function(done) {
        const transaction = {
          type: 'income',
          amount: 1000.00,
          category_id: testCategoryId,
          description: 'API Test Transaction',
          date: '2026-02-08'
        };

        chai.request(app)
          .post('/api/transactions')
          .send(transaction)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('id');
            testTransactionId = res.body.id;
            done();
          });
      });
    });

    describe('TC-003: POST with Invalid Data', function() {
      it('should reject transaction with missing fields', function(done) {
        const transaction = {
          type: 'income',
          amount: 100
        };

        chai.request(app)
          .post('/api/transactions')
          .send(transaction)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('should reject transaction with negative amount', function(done) {
        const transaction = {
          type: 'expense',
          amount: -50,
          category_id: testCategoryId,
          date: '2026-02-08'
        };

        chai.request(app)
          .post('/api/transactions')
          .send(transaction)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });

    describe('TC-004: GET /api/transactions/:id', function() {
      it('should return a specific transaction', function(done) {
        chai.request(app)
          .get(`/api/transactions/${testTransactionId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('transaction');
            expect(res.body.transaction.id).to.equal(testTransactionId);
            done();
          });
      });

      it('should return 404 for non-existent transaction', function(done) {
        chai.request(app)
          .get('/api/transactions/99999')
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });

    describe('TC-005: PUT /api/transactions/:id', function() {
      it('should update an existing transaction', function(done) {
        const updates = {
          type: 'income',
          amount: 1500.00,
          category_id: testCategoryId,
          description: 'Updated API Test Transaction',
          date: '2026-02-08'
        };

        chai.request(app)
          .put(`/api/transactions/${testTransactionId}`)
          .send(updates)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            done();
          });
      });

      it('should return 404 for updating non-existent transaction', function(done) {
        const updates = {
          type: 'income',
          amount: 100,
          category_id: testCategoryId,
          date: '2026-02-08'
        };

        chai.request(app)
          .put('/api/transactions/99999')
          .send(updates)
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });
    });

    describe('TC-006: GET /api/transactions/summary', function() {
      it('should return monthly summary', function(done) {
        chai.request(app)
          .get('/api/transactions/summary?year=2026&month=2')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('summary');
            expect(res.body.summary).to.have.property('income');
            expect(res.body.summary).to.have.property('expenses');
            expect(res.body.summary).to.have.property('balance');
            done();
          });
      });
    });

    describe('TC-007: GET /api/transactions/search', function() {
      it('should search transactions', function(done) {
        chai.request(app)
          .get('/api/transactions/search?q=API')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('results');
            expect(res.body).to.have.property('count');
            expect(res.body.results).to.be.an('array');
            done();
          });
      });

      it('should filter search by type', function(done) {
        chai.request(app)
          .get('/api/transactions/search?type=income')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.results).to.be.an('array');
            if (res.body.results.length > 0) {
              res.body.results.forEach(txn => {
                expect(txn.type).to.equal('income');
              });
            }
            done();
          });
      });
    });

    describe('TC-008: DELETE /api/transactions/:id', function() {
      it('should delete a transaction', function(done) {
        chai.request(app)
          .delete(`/api/transactions/${testTransactionId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            done();
          });
      });

      it('should return 404 when deleting non-existent transaction', function(done) {
        chai.request(app)
          .delete('/api/transactions/99999')
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });
    });
  });

  describe('Category API Endpoints', function() {
    let testCategoryId;

    describe('CC-001: GET /api/categories', function() {
      it('should return all categories', function(done) {
        chai.request(app)
          .get('/api/categories')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('categories');
            expect(res.body.categories).to.be.an('array');
            expect(res.body.categories.length).to.be.greaterThan(0);
            done();
          });
      });
    });

    describe('CC-002: GET /api/categories?type=income', function() {
      it('should filter categories by type', function(done) {
        chai.request(app)
          .get('/api/categories?type=income')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.categories).to.be.an('array');
            res.body.categories.forEach(cat => {
              expect(cat.type).to.equal('income');
            });
            done();
          });
      });
    });

    describe('CC-003: POST /api/categories', function() {
      it('should create a new category', function(done) {
        const category = {
          name: 'API Test Category ' + Date.now(),
          type: 'expense'
        };

        chai.request(app)
          .post('/api/categories')
          .send(category)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('id');
            testCategoryId = res.body.id;
            done();
          });
      });

      it('should reject duplicate category name', function(done) {
        const category = {
          name: 'Salary',
          type: 'income'
        };

        chai.request(app)
          .post('/api/categories')
          .send(category)
          .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });

    describe('CC-004: PUT /api/categories/:id', function() {
      it('should update a category', function(done) {
        const updates = {
          name: 'Updated API Test Category',
          type: 'expense'
        };

        chai.request(app)
          .put(`/api/categories/${testCategoryId}`)
          .send(updates)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            done();
          });
      });
    });

    describe('CC-005: DELETE /api/categories/:id', function() {
      it('should delete an unused category', function(done) {
        chai.request(app)
          .delete(`/api/categories/${testCategoryId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            done();
          });
      });
    });
  });

  // ==========================================
  // SECURITY MIDDLEWARE TESTS
  // ==========================================

  describe('Security Middleware Tests', function() {
    describe('SM-001: SQL Injection Prevention', function() {
      it('should block SQL injection in POST request', function(done) {
        const maliciousData = {
          type: 'expense',
          amount: 50,
          category_id: 1,
          description: "'; DROP TABLE transactions; --",
          date: '2026-02-08'
        };

        chai.request(app)
          .post('/api/transactions')
          .send(maliciousData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.error).to.include('Invalid input detected');
            done();
          });
      });

      it('should block SQL injection in query params', function(done) {
        chai.request(app)
          .get('/api/transactions/search?q=test\' OR 1=1 --')
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.error).to.include('Invalid input detected');
            done();
          });
      });
    });

    describe('SM-002: XSS Prevention', function() {
      it('should sanitize script tags from input', function(done) {
        const xssData = {
          type: 'expense',
          amount: 50,
          category_id: 1,
          description: '<script>alert("XSS")</script>Test',
          date: '2026-02-08'
        };

        chai.request(app)
          .post('/api/transactions')
          .send(xssData)
          .end((err, res) => {
            if (res.status === 201) {
              chai.request(app)
                .get(`/api/transactions/${res.body.id}`)
                .end((err2, res2) => {
                  expect(res2.body.transaction.description).to.not.include('<script>');
                  done();
                });
            } else {
              expect(res).to.have.status(400);
              done();
            }
          });
      });
    });

    describe('SM-003: Request Size Validation', function() {
      it('should reject oversized payload', function(done) {
        const largeDescription = 'A'.repeat(2 * 1024 * 1024);
        
        const largeData = {
          type: 'expense',
          amount: 50,
          category_id: 1,
          description: largeDescription,
          date: '2026-02-08'
        };

        chai.request(app)
          .post('/api/transactions')
          .send(largeData)
          .end((err, res) => {
            expect(res).to.have.status(413);
            done();
          });
      });
    });

    describe('SM-004: Content-Type Validation', function() {
      it('should require application/json for POST', function(done) {
        chai.request(app)
          .post('/api/transactions')
          .set('Content-Type', 'text/plain')
          .send('not json')
          .end((err, res) => {
            expect(res).to.have.status(415);
            done();
          });
      });
    });

    describe('SM-005: Security Headers', function() {
      it('should include security headers in response', function(done) {
        chai.request(app)
          .get('/health')
          .end((err, res) => {
            expect(res).to.have.header('x-frame-options');
            expect(res).to.have.header('x-content-type-options');
            expect(res).to.have.header('x-xss-protection');
            done();
          });
      });
    });
  });
});