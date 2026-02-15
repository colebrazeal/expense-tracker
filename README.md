# Personal Expense & Budget Tracker

## Author
Cole Brazeal
Student ID: 12381587

A full-stack web application for managing personal finances, tracking income and expenses, and visualizing spending patterns.

## Features

-   **OOP Architecture** - Inheritance, polymorphism, and encapsulation
-   Add, edit, and delete transactions (income/expenses)
-   **Advanced Search** - Multi-criteria search with filters
-   Categorize transactions with custom categories
-   View transaction history
-   **Report Generation** - Professional reports with multiple columns, rows, timestamps
-   Monthly financial summaries with visual charts
-   Dashboard with pie charts and bar graphs
-   Category management (create, edit, delete)
-   **Industry Security** - Rate limiting, input sanitization, SQL injection prevention
-   **Comprehensive Validation** - Backend and frontend input validation
-   **Scalable Design** - Modular architecture, RESTful API
-   Responsive design for mobile and desktop
-   Audit logging for all modifications

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight relational database
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Recharts** - Charting library
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
expense-tracker/
├── server/                 # Backend (Express API)
│   ├── controllers/        # Request handlers
│   ├── database/          # Database initialization
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── client/                # Frontend (React)
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       ├── services/      # API service
│       ├── App.js         # Main app component
│       └── App.css        # Main styles
├── .env                   # Environment variables
└── package.json           # Dependencies and scripts
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

From the root directory:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

Or use the convenient script:

```bash
npm run install-all
```

### Step 2: Environment Configuration

The `.env` file is already created with default values:
```
PORT=5001
NODE_ENV=development
```

You can modify these if needed.

### Step 3: Start the Application

#### Option 1: Run both servers simultaneously (recommended)
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5001
- Frontend React app on http://localhost:3000

#### Option 2: Run servers separately

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

## Usage Guide

### 1. Dashboard
- View monthly income, expenses, and balance
- See visual breakdowns with charts
- Select different months/years to view historical data

### 2. Add Transaction
- Choose transaction type (Income or Expense)
- Enter amount
- Select category
- Add description (optional)
- Set transaction date

### 3. Transaction History
- View all transactions in chronological order
- Edit existing transactions
- Delete transactions
- Color-coded by type (green for income, red for expenses)

### 4. Category Management
- View all income and expense categories
- Add new custom categories
- Edit existing category names
- Delete unused categories

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/transactions/search` - **Search transactions with filters**
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary?year=2026&month=2` - Get monthly summary

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories?type=income` - Get categories by type
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Reports
- `GET /api/reports/financial` - **Generate detailed financial report**
- `GET /api/reports/category` - **Generate category summary report**
- `GET /api/reports/yearly` - **Generate annual comparison report**

## Database Schema

### Categories Table
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT UNIQUE)
- type (TEXT: 'income' or 'expense')
- created_at (DATETIME)
```

### Transactions Table
```sql
- id (INTEGER PRIMARY KEY)
- type (TEXT: 'income' or 'expense')
- amount (REAL)
- category_id (INTEGER FOREIGN KEY)
- description (TEXT)
- date (DATE)
- created_at (DATETIME)
```

## Default Categories

### Income Categories
- Salary
- Freelance
- Investment
- Other Income

### Expense Categories
- Food & Dining
- Transportation
- Housing
- Utilities
- Healthcare
- Entertainment
- Shopping
- Other Expense

## Development Timeline

Based on the project requirements (Task 2 - SE Capstone):

| Phase | Duration | Dates |
|-------|----------|-------|
| Planning & Requirements | 4 days | 01/22/2026 - 01/26/2026 |
| System Design | 1 day | 01/26/2026 - 01/27/2026 |
| Backend Development | 3 days | 01/27/2026 - 01/30/2026 |
| Frontend Development | 3 days | 01/30/2026 - 02/02/2026 |
| Testing & Refinement | 1 day | 02/02/2026 - 02/03/2026 |
| Deployment & Documentation | 1 day | 02/03/2026 - 02/04/2026 |

## Testing Strategy

### Verification Methods
- **Unit Testing**: Test individual backend functions and API endpoints
- **Functional Testing**: Confirm CRUD operations behave as expected

### Validation Methods
- **User Interface Testing**: Evaluate usability and responsiveness
- **Data Validation Testing**: Confirm accurate storage and display

## Troubleshooting

### Port already in use
If port 5001 or 3000 is already in use:
1. Change the PORT in `.env` file
2. Or kill the process using the port

### Database issues
The SQLite database is created automatically in `server/database/expense_tracker.db`. To reset:
```bash
rm server/database/expense_tracker.db
npm run server  # Will recreate the database
```

### Connection issues
Make sure the backend API URL in `client/src/services/api.js` matches your backend port.

## Future Enhancements
- User authentication and authorization
- Budget goals and alerts
- Recurring transactions
- Export data to CSV/PDF
- Multi-currency support
- Mobile app version