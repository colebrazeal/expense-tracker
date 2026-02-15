# Design Document
## Personal Expense & Budget Tracker

**Project:** SE Capstone Task 2  
**Developer:** Cole Brazeal  
**Date:** February 2026  
**Version:** 1.0

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Class Diagram](#class-diagram)
4. [Database Design](#database-design)
5. [Component Diagram](#component-diagram)
6. [Sequence Diagrams](#sequence-diagrams)
7. [Security Architecture](#security-architecture)

---

## 1. System Overview

### Purpose
The Personal Expense & Budget Tracker is a full-stack web application designed to help users manage their personal finances by tracking income and expenses, categorizing transactions, and visualizing spending patterns through interactive reports and dashboards.

### Technology Stack
- **Frontend:** React.js, Recharts, Axios, CSS3
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Security:** Custom middleware (rate limiting, input sanitization, SQL injection prevention)
- **Architecture:** RESTful API, Object-Oriented Programming (OOP)

---

## 2. Architecture Design

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Application                        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │Dashboard │  │ Add Txn  │  │  Search  │  │ Reports  │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  │  ┌──────────┐  ┌──────────┐                               │ │
│  │  │   List   │  │Categories│                               │ │
│  │  └──────────┘  └──────────┘                               │ │
│  │                        ▲                                    │ │
│  │                        │                                    │ │
│  │                 ┌──────▼──────┐                            │ │
│  │                 │ API Service │                            │ │
│  │                 └─────────────┘                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP/HTTPS (Port 3000 → 5001)
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      MIDDLEWARE LAYER                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Security Pipeline                                          │ │
│  │  1. Security Headers                                        │ │
│  │  2. Rate Limiter (100 req/min)                             │ │
│  │  3. Request Validator                                       │ │
│  │  4. Input Sanitizer                                         │ │
│  │  5. SQL Injection Prevention                                │ │
│  │  6. Audit Logger                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                       Express Server                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │   Routes     │  │ Controllers  │  │   Models     │    │ │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤    │ │
│  │  │transactions  │→ │Transaction   │→ │Transaction   │    │ │
│  │  │              │  │Controller    │  │Model         │    │ │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤    │ │
│  │  │categories    │→ │Category      │→ │Category      │    │ │
│  │  │              │  │Controller    │  │Model         │    │ │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤    │ │
│  │  │reports       │→ │Report        │→ │BaseModel     │    │ │
│  │  │              │  │Controller    │  │(Abstract)    │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    SQLite Database                          │ │
│  │  ┌──────────────────┐        ┌──────────────────┐         │ │
│  │  │   transactions   │        │   categories     │         │ │
│  │  ├──────────────────┤        ├──────────────────┤         │ │
│  │  │ id (PK)          │   ┌───→│ id (PK)          │         │ │
│  │  │ type             │   │    │ name (UNIQUE)    │         │ │
│  │  │ amount           │   │    │ type             │         │ │
│  │  │ category_id (FK) ├───┘    │ created_at       │         │ │
│  │  │ description      │        └──────────────────┘         │ │
│  │  │ date             │                                      │ │
│  │  │ created_at       │                                      │ │
│  │  └──────────────────┘                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Three-Tier Architecture

1. **Presentation Tier (Frontend)**
   - React components for user interface
   - Client-side validation
   - State management
   - API service layer for backend communication

2. **Application Tier (Backend)**
   - Express.js server
   - RESTful API endpoints
   - Business logic in controllers
   - Security middleware pipeline
   - Data validation in models

3. **Data Tier (Database)**
   - SQLite database
   - Normalized schema
   - Foreign key relationships
   - Transaction integrity

---

## 3. Class Diagram

### Backend Class Structure (OOP Implementation)

```
┌─────────────────────────────────────────────────────────────────┐
│                         BaseModel                                │
│                      (Abstract Class)                            │
├─────────────────────────────────────────────────────────────────┤
│ # _tableName: string                                             │
│ # _db: Database                                                  │
├─────────────────────────────────────────────────────────────────┤
│ + constructor(tableName: string)                                 │
│ + get tableName(): string                                        │
│ # _executeQuery(query: string, params: array): Promise          │
│ # _executeOne(query: string, params: array): Promise            │
│ # _executeRun(query: string, params: array): Promise            │
│ + findAll(): Promise<array>                                      │
│ + findById(id: number): Promise<object>                          │
│ + delete(id: number): Promise<object>                            │
│ + validate(data: object): boolean (abstract)                    │
└─────────────────────────────────────────────────────────────────┘
                              △
                              │
                    ┌─────────┴─────────┐
                    │                   │
    ┌───────────────▼─────────┐  ┌──────▼──────────────────┐
    │   TransactionModel      │  │   CategoryModel         │
    ├─────────────────────────┤  ├─────────────────────────┤
    │ Inherits: BaseModel     │  │ Inherits: BaseModel     │
    ├─────────────────────────┤  ├─────────────────────────┤
    │ + constructor()         │  │ + constructor()         │
    │ + findAll(): Promise    │  │ + findAll(type): Promise│
    │   (Override)            │  │   (Override)            │
    │ + findById(id): Promise │  │ + create(data): Promise │
    │   (Override)            │  │ + update(id, data)      │
    │ + create(data): Promise │  │   : Promise             │
    │ + update(id, data)      │  │ + delete(id): Promise   │
    │   : Promise             │  │   (Override)            │
    │ + search(term, filters) │  │ + validate(data)        │
    │   : Promise             │  │   : boolean (Implement) │
    │ + getMonthlySummary()   │  └─────────────────────────┘
    │   : Promise             │
    │ + validate(data)        │
    │   : boolean (Implement) │
    │ - _isValidDate(date)    │
    │   : boolean             │
    └─────────────────────────┘
```

### Detailed Class Specifications

#### BaseModel (Abstract Class)

**Purpose:** Provides common database operations and enforces consistent structure for all data models.

**Properties:**
- `_tableName` (protected): Name of the database table
- `_db` (protected): Database connection instance

**Methods:**
- `constructor(tableName)`: Initializes table name and database connection
- `get tableName()`: Getter for table name (encapsulation)
- `_executeQuery(query, params)`: Executes SELECT queries returning multiple rows
- `_executeOne(query, params)`: Executes SELECT queries returning single row
- `_executeRun(query, params)`: Executes INSERT/UPDATE/DELETE operations
- `findAll()`: Retrieves all records (polymorphic - can be overridden)
- `findById(id)`: Retrieves single record by ID (polymorphic)
- `delete(id)`: Deletes record by ID (polymorphic)
- `validate(data)`: Abstract method - must be implemented by child classes

**Design Patterns:**
- **Encapsulation:** Private properties, protected methods, public interface
- **Template Method:** Common operations defined, specifics in child classes
- **Abstract Factory:** Enforces implementation of validate() in children

---

#### TransactionModel (extends BaseModel)

**Purpose:** Manages transaction data with validation and specialized queries.

**Inheritance:**
- Inherits all properties and methods from BaseModel
- Overrides methods for transaction-specific behavior

**Methods:**
- `constructor()`: Calls parent with 'transactions' table name
- `findAll()`: **Override** - Joins with categories, orders by date
- `findById(id)`: **Override** - Includes category information
- `create(data)`: Validates and inserts new transaction
- `update(id, data)`: Validates and updates existing transaction
- `search(searchTerm, filters)`: Advanced search with multiple criteria
- `getMonthlySummary(year, month)`: Aggregates data by category
- `validate(data)`: **Implementation** - Validates transaction data
- `_isValidDate(dateString)`: Private helper for date validation

**Polymorphism Examples:**
```javascript
// BaseModel version (generic)
async findAll() {
  return await this._executeQuery(`SELECT * FROM ${this._tableName}`);
}

// TransactionModel version (specialized)
async findAll() {
  return await this._executeQuery(`
    SELECT t.*, c.name as category_name, c.type as category_type
    FROM ${this._tableName} t
    JOIN categories c ON t.category_id = c.id
    ORDER BY t.date DESC
  `);
}
```

---

#### CategoryModel (extends BaseModel)

**Purpose:** Manages category data with validation and dependency checking.

**Inheritance:**
- Inherits all properties and methods from BaseModel
- Overrides methods for category-specific behavior

**Methods:**
- `constructor()`: Calls parent with 'categories' table name
- `findAll(type)`: **Override** - Optionally filters by income/expense type
- `create(data)`: Validates and creates new category
- `update(id, data)`: Validates and updates category
- `delete(id)`: **Override** - Checks for dependencies before deleting
- `validate(data)`: **Implementation** - Validates category data

**Polymorphism Examples:**
```javascript
// Specialized delete with dependency check
async delete(id) {
  const checkQuery = 'SELECT COUNT(*) FROM transactions WHERE category_id = ?';
  const result = await this._executeOne(checkQuery, [id]);
  
  if (result.count > 0) {
    throw new Error('Cannot delete category in use');
  }
  
  return await super.delete(id); // Call parent's delete
}
```

---

### Controller Classes (Non-OOP, Functional)

```
┌──────────────────────────┐
│  TransactionController   │
├──────────────────────────┤
│ + getAllTransactions()   │
│ + getTransactionById()   │
│ + createTransaction()    │
│ + updateTransaction()    │
│ + deleteTransaction()    │
│ + getMonthlySummary()    │
│ + searchTransactions()   │
└──────────────────────────┘

┌──────────────────────────┐
│   CategoryController     │
├──────────────────────────┤
│ + getAllCategories()     │
│ + getCategoryById()      │
│ + createCategory()       │
│ + updateCategory()       │
│ + deleteCategory()       │
└──────────────────────────┘

┌──────────────────────────┐
│    ReportController      │
├──────────────────────────┤
│ + generateReport()       │
│ + generateCategoryReport()│
│ + generateYearlyReport() │
└──────────────────────────┘
```

---

### Frontend Component Hierarchy

```
┌────────────────────────────────────────────┐
│               App (Root)                    │
│  ┌──────────────────────────────────────┐  │
│  │ State:                                │  │
│  │ - transactions: array                 │  │
│  │ - categories: array                   │  │
│  │ - summary: object                     │  │
│  │ - activeTab: string                   │  │
│  │ - selectedMonth: number               │  │
│  │ - selectedYear: number                │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┬──────────────┬──────────────┬──────────────┐
        ▼                       ▼              ▼              ▼              ▼
┌───────────────┐      ┌───────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│  Dashboard    │      │TransactionForm│ │  Search  │ │ Reports  │ │CategoryMgr   │
├───────────────┤      ├───────────────┤ ├──────────┤ ├──────────┤ ├──────────────┤
│Props:         │      │Props:         │ │Props:    │ │Props:    │ │Props:        │
│- summary      │      │- categories   │ │-categories│ │  none    │ │- categories  │
│- selectedMonth│      │- onSubmit     │ │          │ │          │ │- onChange    │
│- selectedYear │      │- editing      │ │          │ │          │ │              │
│- onMonthChg   │      │- onCancel     │ │          │ │          │ │              │
│- onYearChg    │      └───────────────┘ └──────────┘ └──────────┘ └──────────────┘
└───────────────┘
        │
        ├─ Charts (Recharts components)
        │  ├─ BarChart
        │  ├─ PieChart (Expenses)
        │  └─ PieChart (Income)
        │
        └─ Summary Cards
```

---

## 4. Database Design

### Entity-Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                        categories                                │
├─────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER                                      │
│     name            TEXT (UNIQUE, NOT NULL)                      │
│     type            TEXT ('income' | 'expense', NOT NULL)        │
│     created_at      DATETIME (DEFAULT CURRENT_TIMESTAMP)         │
└─────────────────────────────────────────────────────────────────┘
                              △
                              │ 1
                              │
                              │ has many
                              │
                              │ N
┌─────────────────────────────┼───────────────────────────────────┐
│                        transactions                              │
├─────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER                                      │
│     type            TEXT ('income' | 'expense', NOT NULL)        │
│     amount          REAL (> 0, NOT NULL)                         │
│ FK  category_id     INTEGER (NOT NULL, REFERENCES categories.id)│
│     description     TEXT                                         │
│     date            DATE (NOT NULL)                              │
│     created_at      DATETIME (DEFAULT CURRENT_TIMESTAMP)         │
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema (SQL)

```sql
-- Categories Table
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  amount REAL NOT NULL CHECK(amount > 0),
  category_id INTEGER NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Normalization

**Third Normal Form (3NF):**
-    **1NF:** All columns contain atomic values
-    **2NF:** No partial dependencies (all non-key attributes depend on entire primary key)
-    **3NF:** No transitive dependencies (category data stored separately, not duplicated)

**Benefits:**
- Eliminates data redundancy
- Ensures data integrity
- Simplifies updates (change category name once, affects all transactions)
- Supports referential integrity via foreign keys

---

## 5. Component Diagram

### System Components and Dependencies

```
┌──────────────────────────── FRONTEND ────────────────────────────┐
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   React Components                          │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │  │
│  │  │Dashboard│ │  Form   │ │ Search  │ │ Reports │          │  │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │  │
│  │       │           │           │           │                 │  │
│  │       └───────────┴───────────┴───────────┘                 │  │
│  │                        │                                     │  │
│  │                        ▼                                     │  │
│  │            ┌───────────────────────┐                        │  │
│  │            │   API Service Layer   │                        │  │
│  │            │   (axios wrapper)     │                        │  │
│  │            └───────────┬───────────┘                        │  │
│  └────────────────────────┼────────────────────────────────────┘  │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                       HTTP/HTTPS
                            │
┌───────────────────────────▼───────────────────────────────────────┐
│                        BACKEND                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │               Express Server (server.js)                    │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │            Middleware Pipeline                        │  │  │
│  │  │  1. securityHeaders                                   │  │  │
│  │  │  2. rateLimiter                                       │  │  │
│  │  │  3. validateRequest                                   │  │  │
│  │  │  4. cors                                              │  │  │
│  │  │  5. express.json                                      │  │  │
│  │  │  6. sanitizeInput                                     │  │  │
│  │  │  7. preventSqlInjection                               │  │  │
│  │  │  8. auditLogger                                       │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                        │                                    │  │
│  │                        ▼                                    │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │                 Route Handlers                        │  │  │
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐       │  │  │
│  │  │  │transactions│ │ categories │ │  reports   │       │  │  │
│  │  │  │  routes    │ │   routes   │ │   routes   │       │  │  │
│  │  │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘       │  │  │
│  │  └────────┼──────────────┼──────────────┼──────────────┘  │  │
│  │           │              │              │                  │  │
│  │           ▼              ▼              ▼                  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │              Controllers                            │  │  │
│  │  │  ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │  │  │
│  │  │  │Transaction   │ │  Category    │ │   Report   │ │  │  │
│  │  │  │ Controller   │ │  Controller  │ │ Controller │ │  │  │
│  │  │  └──────┬───────┘ └──────┬───────┘ └─────┬──────┘ │  │  │
│  │  └─────────┼────────────────┼─────────────────┼────────┘  │  │
│  │            │                │                 │            │  │
│  │            ▼                ▼                 ▼            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │               Models (OOP)                          │  │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  │          BaseModel (Abstract)                 │  │  │
│  │  │  │  - _executeQuery()                            │  │  │
│  │  │  │  - _executeOne()                              │  │  │
│  │  │  │  - _executeRun()                              │  │  │
│  │  │  │  - findAll(), findById(), delete()           │  │  │
│  │  │  │  - validate() (abstract)                      │  │  │
│  │  │  └───────────────┬──────────────────────────────┘  │  │  │
│  │  │                  △                                  │  │  │
│  │  │         ┌────────┴────────┐                        │  │  │
│  │  │         │                 │                        │  │  │
│  │  │  ┌──────▼───────┐  ┌──────▼───────┐              │  │  │
│  │  │  │Transaction   │  │  Category    │              │  │  │
│  │  │  │   Model      │  │    Model     │              │  │  │
│  │  │  └──────┬───────┘  └──────┬───────┘              │  │  │
│  │  └─────────┼────────────────┼─────────────────────────┘  │  │
│  └────────────┼────────────────┼────────────────────────────┘  │
│               │                │                                │
│               └────────┬───────┘                                │
│                        ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Database Abstraction                       │    │
│  │               (database/init.js)                        │    │
│  │  - SQLite connection                                    │    │
│  │  - Schema initialization                                │    │
│  │  - Default data seeding                                 │    │
│  └────────────────────┬───────────────────────────────────┘    │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │   SQLite Database      │
              │  expense_tracker.db    │
              │                        │
              │  - transactions table  │
              │  - categories table    │
              └────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Dependencies |
|-----------|---------------|--------------|
| React Components | User interface, user interaction | API Service, CSS |
| API Service | HTTP communication with backend | Axios |
| Express Server | Route handling, middleware orchestration | Routes, Middleware |
| Middleware | Security, validation, logging | None |
| Routes | Map URLs to controller methods | Controllers |
| Controllers | Business logic, request/response handling | Models |
| Models (OOP) | Data validation, database operations | Database |
| Database Init | Database connection, schema setup | SQLite3 |
| SQLite | Data persistence | File system |

---

## 6. Sequence Diagrams

### Sequence 1: Create Transaction Flow

```
User          React           API           Express         Middleware      Controller       Model         Database
 │            Component      Service        Server          Pipeline                                        
 │                │             │              │                │                │              │              │
 │─Fill Form────→│             │              │                │                │              │              │
 │                │             │              │                │                │              │              │
 │─Click Submit─→│             │              │                │                │              │              │
 │                │             │              │                │                │              │              │
 │                │─Validate───→│              │                │                │              │              │
 │                │  (client)   │              │                │                │              │              │
 │                │             │              │                │                │              │              │
 │                │             │─POST────────→│                │                │              │              │
 │                │             │ /api/txns    │                │                │              │              │
 │                │             │              │                │                │              │              │
 │                │             │              │─Security──────→│                │              │              │
 │                │             │              │  Headers       │                │              │              │
 │                │             │              │                │                │              │              │
 │                │             │              │                │─Rate Limit────→│              │              │
 │                │             │              │                │  Check         │              │              │
 │                │             │              │                │                │              │              │
 │                │             │              │                │─Validate───────│              │              │
 │                │             │              │                │  Request       │              │              │
 │                │             │              │                │                │              │              │
 │                │             │              │                │─Sanitize───────│              │              │
 │                │             │              │                │  Input         │              │              │
 │                │             │              │                │                │              │              │
 │                │             │              │                │─SQL Injection──│              │              │
 │                │             │              │                │  Check         │              │              │
 │                │             │              │                │                │              │              │
 │                │             │              │                │─Audit Log──────│              │              │
 │                │             │              │                │                │              │              │
 │                │             │              │←───────────────┘                │              │              │
 │                │             │              │                                 │              │              │
 │                │             │              │─createTransaction()────────────→│              │              │
 │                │             │              │                                 │              │              │
 │                │             │              │                                 │─validate()──→│              │
 │                │             │              │                                 │              │              │
 │                │             │              │                                 │              │─create()────→│
 │                │             │              │                                 │              │              │
 │                │             │              │                                 │              │              │─INSERT
 │                │             │              │                                 │              │              │
 │                │             │              │                                 │              │←─────────────│
 │                │             │              │                                 │              │ {lastID: 1}  │
 │                │             │              │                                 │←─────────────│              │
 │                │             │              │←────────────────────────────────┘              │              │
 │                │             │              │ {id: 1, message: "Success"}                   │              │
 │                │             │←─────────────│                                                │              │
 │                │←────────────│ 201 Created  │                                                │              │
 │←───────────────│             │              │                                                │              │
 │  Show Success  │             │              │                                                │              │
 │    Message     │             │              │                                                │              │
```

### Sequence 2: Dashboard Load with Summary

```
User        Dashboard      API           Express        Controller      Model         Database
 │          Component     Service         Server                                        
 │              │            │              │                │             │              │
 │─Navigate────→│            │              │                │             │              │
 │  to Dashboard│            │              │                │             │              │
 │              │            │              │                │             │              │
 │              │─useEffect─→│              │                │             │              │
 │              │  (mount)   │              │                │             │              │
 │              │            │              │                │             │              │
 │              │            │─GET─────────→│                │             │              │
 │              │            │ /api/txns/   │                │             │              │
 │              │            │  summary?    │                │             │              │
 │              │            │  year=2026&  │                │             │              │
 │              │            │  month=2     │                │             │              │
 │              │            │              │                │             │              │
 │              │            │              │─[Middleware]──→│             │              │
 │              │            │              │                │             │              │
 │              │            │              │─getSummary()──→│             │              │
 │              │            │              │                │             │              │
 │              │            │              │                │─getMonthly─→│              │
 │              │            │              │                │  Summary()  │              │
 │              │            │              │                │             │              │
 │              │            │              │                │             │─SELECT──────→│
 │              │            │              │                │             │  SUM(amount) │
 │              │            │              │                │             │  GROUP BY... │
 │              │            │              │                │             │              │
 │              │            │              │                │             │←─────────────│
 │              │            │              │                │             │ [rows]       │
 │              │            │              │                │←────────────│              │
 │              │            │              │←───────────────┘              │              │
 │              │            │              │ {summary: {...}}              │              │
 │              │            │←─────────────│                               │              │
 │              │←───────────│ 200 OK       │                               │              │
 │              │            │              │                               │              │
 │              │─setState──→│              │                               │              │
 │              │ (summary)  │              │                               │              │
 │              │            │              │                               │              │
 │              │─Render────→│              │                               │              │
 │              │  Charts    │              │                               │              │
 │              │            │              │                               │              │
 │←─────────────│            │              │                               │              │
 │  Display     │            │              │                               │              │
 │  Dashboard   │            │              │                               │              │
```

### Sequence 3: Search Transactions

```
User         Search        API           Express        Controller       Model        Database
             Component    Service         Server                                        
 │              │            │              │                │              │             │
 │─Enter "food"→│            │              │                │              │             │
 │              │            │              │                │              │             │
 │─Select Filters│           │              │                │              │             │
 │  Type=expense│            │              │                │              │             │
 │  Date Range  │            │              │                │              │             │
 │              │            │              │                │              │             │
 │─Click Search→│            │              │                │              │             │
 │              │            │              │                │              │             │
 │              │─Build Query→              │                │              │             │
 │              │            │              │                │              │             │
 │              │            │─GET─────────→│                │              │             │
 │              │            │ /api/txns/   │                │              │             │
 │              │            │  search?q=   │                │              │             │
 │              │            │  food&type=  │                │              │             │
 │              │            │  expense&... │                │              │             │
 │              │            │              │                │              │             │
 │              │            │              │─[Middleware]──→│              │             │
 │              │            │              │                │              │             │
 │              │            │              │─searchTxns()──→│              │             │
 │              │            │              │                │              │             │
 │              │            │              │                │─search()────→│             │
 │              │            │              │                │              │             │
 │              │            │              │                │              │─SELECT─────→│
 │              │            │              │                │              │  WHERE      │
 │              │            │              │                │              │  description│
 │              │            │              │                │              │  LIKE '%food│
 │              │            │              │                │              │  AND type=  │
 │              │            │              │                │              │  'expense'  │
 │              │            │              │                │              │             │
 │              │            │              │                │              │←────────────│
 │              │            │              │                │              │ [matching   │
 │              │            │              │                │              │  rows]      │
 │              │            │              │                │←─────────────│             │
 │              │            │              │←───────────────┘              │             │
 │              │            │              │ {results: [...],              │             │
 │              │            │              │  count: 5}                    │             │
 │              │            │←─────────────│                               │             │
 │              │←───────────│              │                               │             │
 │              │            │              │                               │             │
 │              │─Display────│              │                               │             │
 │              │  Results   │              │                               │             │
 │              │  (5 found) │              │                               │             │
 │←─────────────│            │              │                               │             │
 │  View Results│            │              │                               │             │
```

---

## 7. Security Architecture

### Security Layer Diagram

```
┌──────────────────────────── CLIENT REQUEST ─────────────────────────────┐
│                                                                          │
│  HTTP Request from Browser                                              │
│  GET /api/transactions                                                   │
│  Headers: {Content-Type: 'application/json', ...}                       │
│  Body: {...}                                                             │
│                                                                          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────── SECURITY LAYER 1: HEADERS ──────────────────┐
│  securityHeaders middleware                                              │
│  ✓ X-Frame-Options: DENY                                                │
│  ✓ X-Content-Type-Options: nosniff                                      │
│  ✓ X-XSS-Protection: 1; mode=block                                      │
│  ✓ Strict-Transport-Security: max-age=31536000                          │
│  ✓ Content-Security-Policy: default-src 'self'...                       │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 ▼
┌──────────────────────────── SECURITY LAYER 2: RATE LIMIT ───────────────┐
│  rateLimiter middleware                                                  │
│  ✓ Track requests per IP address                                        │
│  ✓ Allow 100 requests per minute                                        │
│  ✓ Return 429 if exceeded                                               │
│  ✓ Add rate limit headers to response                                   │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 ▼
┌──────────────────────────── SECURITY LAYER 3: VALIDATION ───────────────┐
│  validateRequest middleware                                              │
│  ✓ Check Content-Length (max 1MB)                                       │
│  ✓ Validate Content-Type for POST/PUT                                   │
│  ✓ Return 413 if payload too large                                      │
│  ✓ Return 415 if wrong content type                                     │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 ▼
┌──────────────────────────── SECURITY LAYER 4: CORS ─────────────────────┐
│  CORS middleware                                                         │
│  ✓ Allow origin: http://localhost:3000                                  │
│  ✓ Allow credentials                                                    │
│  ✓ Block unauthorized origins                                           │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 ▼
┌──────────────────────────── SECURITY LAYER 5: SANITIZATION ─────────────┐
│  sanitizeInput middleware                                                │
│  ✓ Remove HTML tags (<script>, <iframe>, etc.)                         │
│  ✓ Strip javascript: protocol                                           │
│  ✓ Remove event handlers (onclick, onerror, etc.)                      │
│  ✓ Clean body, query params, URL params                                │
│  ✓ Prevent XSS attacks                                                  │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 ▼
┌──────────────────────────── SECURITY LAYER 6: SQL INJECTION ────────────┐
│  preventSqlInjection middleware                                          │
│  ✓ Detect SQL keywords (SELECT, DROP, UNION, etc.)                     │
│  ✓ Block SQL operators (;, --, /*, */)                                 │
│  ✓ Identify OR/AND patterns                                             │
│  ✓ Return 400 if SQL injection detected                                │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 ▼
┌──────────────────────────── SECURITY LAYER 7: AUDIT ────────────────────┐
│  auditLogger middleware                                                  │
│  ✓ Log all POST/PUT/DELETE operations                                   │
│  ✓ Record timestamp, method, path, IP, user-agent                      │
│  ✓ Sanitize sensitive data (passwords, tokens)                         │
│  ✓ Write to console: [AUDIT] {...}                                     │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 ▼
┌──────────────────────────── CONTROLLER & MODEL ─────────────────────────┐
│  Controller receives sanitized, validated request                        │
│  ↓                                                                       │
│  Model validates business rules                                          │
│  ↓                                                                       │
│  Database query with PARAMETERIZED statements                            │
│  ↓                                                                       │
│  Example: INSERT INTO transactions (...) VALUES (?, ?, ?, ?)           │
│           Parameters: [type, amount, category_id, date]                 │
│           ✓ No string concatenation = No SQL injection                  │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 ▼
                         SECURE DATA OPERATION
```

### Security Features Summary

| Feature | Implementation | Purpose | Status |
|---------|---------------|---------|--------|
| Rate Limiting | 100 req/min per IP | Prevent DoS attacks |    Active |
| Input Sanitization | Remove HTML/scripts | Prevent XSS |    Active |
| SQL Injection Prevention | Pattern detection | Block malicious SQL |    Active |
| Security Headers | 5 HTTP headers | Multiple protections |    Active |
| Request Validation | Size & type checks | Prevent abuse |    Active |
| CORS | Origin whitelist | Control access |    Active |
| Audit Logging | Log modifications | Track changes |    Active |
| Parameterized Queries | No string concat | SQL injection proof |    Active |
| Error Sanitization | Hide stack traces | Info disclosure prevention |    Active |

---

## Design Principles Applied

### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Each model has one job (TransactionModel handles transactions only)
   - Controllers handle HTTP, Models handle data, Middleware handles security
   - Each component has a clear, single purpose

2. **Open/Closed Principle (OCP)**
   - BaseModel is open for extension (child classes), closed for modification
   - New models can be added without changing BaseModel
   - Middleware can be added without changing existing middleware

3. **Liskov Substitution Principle (LSP)**
   - TransactionModel and CategoryModel can be used anywhere BaseModel is expected
   - Child classes don't break parent's contract

4. **Interface Segregation Principle (ISP)**
   - Controllers only use model methods they need
   - Not forced to implement unnecessary methods

5. **Dependency Inversion Principle (DIP)**
   - Controllers depend on Model interface, not concrete implementations
   - Database abstraction allows switching databases

### Design Patterns Used

1. **Template Method Pattern** - BaseModel defines algorithm structure, children fill in details
2. **Strategy Pattern** - Different validation strategies for different models
3. **Chain of Responsibility** - Middleware pipeline
4. **Repository Pattern** - Models abstract database operations
5. **MVC (Model-View-Controller)** - Overall architecture

---

## Scalability Features

1. **Modular Architecture** - Each component can be scaled independently
2. **Stateless API** - No sessions, easy to load balance
3. **Database Abstraction** - Easy to migrate to PostgreSQL/MySQL
4. **OOP Design** - Easy to extend with new models/features
5. **RESTful API** - Standard interface for any client
6. **Component-Based Frontend** - Easy to add/modify UI components
7. **Middleware Pipeline** - Easy to add new security/features
8. **Environment Configuration** - Different configs for dev/prod

---

**END OF DESIGN DOCUMENT**