# Set Up Guide
## Personal Expense & Budget Tracker
### Setup, Running, and Maintenance Guide

**Version:** 1.0  
**Date:** February 2026  
**Author:** Cole Brazeal  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements](#2-system-requirements)
3. [Installation Guide](#3-installation-guide)
4. [Running the Application](#4-running-the-application)
5. [User Manual](#5-user-manual)
6. [Maintenance Procedures](#6-maintenance-procedures)
7. [Troubleshooting](#7-troubleshooting)
8. [Backup and Recovery](#8-backup-and-recovery)
9. [Configuration Guide](#9-configuration-guide)
10. [Security Maintenance](#10-security-maintenance)

---

## 1. Introduction

### 1.1 Purpose
This guide provides comprehensive instructions for setting up, running, and maintaining the Personal Expense & Budget Tracker application. It is intended for system administrators, developers, and technical users responsible for deploying and maintaining the application.

### 1.2 Application Overview
The Personal Expense & Budget Tracker is a full-stack web application that helps users:
- Track income and expenses
- Categorize financial transactions
- Generate financial reports
- Visualize spending patterns
- Search and filter transaction history

### 1.3 Architecture Summary
- **Frontend:** React.js (Port 3000)
- **Backend:** Node.js/Express (Port 5001)
- **Database:** SQLite (File-based)
- **Security:** 7-layer middleware pipeline

---

## 2. System Requirements

### 2.1 Hardware Requirements

**Minimum Requirements:**
- **CPU:** Dual-core processor (2.0 GHz or higher)
- **RAM:** 2 GB
- **Storage:** 500 MB free space
- **Network:** Internet connection for npm packages

**Recommended Requirements:**
- **CPU:** Quad-core processor (2.5 GHz or higher)
- **RAM:** 4 GB or more
- **Storage:** 1 GB free space
- **Network:** Broadband internet connection

### 2.2 Software Requirements

**Required Software:**
- **Node.js:** Version 14.x or higher (18.x recommended)
- **npm:** Version 6.x or higher (comes with Node.js)
- **Operating System:** 
  - macOS 10.15 or higher
  - Windows 10 or higher
  - Linux (Ubuntu 20.04 or similar)

**Optional Software:**
- **Git:** For version control
- **VS Code:** For code editing
- **SQLite Browser:** For database inspection

### 2.3 Browser Requirements

**Supported Browsers:**
- Google Chrome (version 90+)
- Mozilla Firefox (version 88+)
- Safari (version 14+)
- Microsoft Edge (version 90+)

---

## 3. Installation Guide

### 3.1 Initial Setup

#### Step 1: Verify Node.js Installation

```bash
# Check Node.js version
node --version
# Expected output: v18.x.x or higher

# Check npm version
npm --version
# Expected output: 8.x.x or higher
```

**If Node.js is not installed:**
- Download from: https://nodejs.org/
- Install the LTS (Long Term Support) version
- Restart your terminal after installation

#### Step 2: Download/Extract Project

```bash
# Navigate to your projects directory
cd /path/to/your/projects

# If using Git:
git clone <repository-url>

# If using downloaded ZIP:
# Extract the expense-tracker folder to your projects directory
```

#### Step 3: Navigate to Project Directory

```bash
cd expense-tracker

# Verify you're in the correct directory
ls -la

# You should see:
# - server/
# - client/
# - package.json
# - .env
# - README.md
```

### 3.2 Backend Installation

#### Step 1: Install Backend Dependencies

```bash
# From the root expense-tracker directory
npm install
```

**This installs:**
- express (Web framework)
- cors (Cross-origin resource sharing)
- sqlite3 (Database driver)
- dotenv (Environment configuration)
- nodemon (Development auto-restart)
- concurrently (Run multiple processes)

**Verify installation:**
```bash
# Check that node_modules folder was created
ls -la node_modules

# You should see folders for all dependencies
```

#### Step 2: Configure Environment

```bash
# Check if .env file exists
cat .env

# Expected content:
# PORT=5001
# NODE_ENV=development
```

**If .env doesn't exist, create it:**
```bash
echo "PORT=5001" > .env
echo "NODE_ENV=development" >> .env
```

### 3.3 Frontend Installation

#### Step 1: Install Frontend Dependencies

```bash
# Navigate to client directory
cd client

# Install React dependencies
npm install

# This may take 2-5 minutes
```

**This installs:**
- react (UI library)
- react-dom (React rendering)
- axios (HTTP client)
- recharts (Charting library)
- All other React dependencies

#### Step 2: Verify Frontend Setup

```bash
# Check package.json exists
cat package.json

# Return to root directory
cd ..
```

### 3.4 Database Initialization

The database is **automatically created** when you first run the backend server.

**Database location:**
```
expense-tracker/server/database/expense_tracker.db
```

**What gets created:**
- `categories` table with 12 default categories
- `transactions` table (initially empty)
- Indexes and constraints

**Manual database reset (if needed):**
```bash
# Delete existing database
rm server/database/expense_tracker.db

# Database will be recreated on next server start
npm run server
```

### 3.5 Verify Complete Installation

```bash
# From root directory, check all key files exist:

# Backend files
ls server/server.js
ls server/models/BaseModel.js
ls server/middleware/security.js
ls server/controllers/transactionController.js

# Frontend files
ls client/src/App.js
ls client/src/services/api.js
ls client/src/components/Dashboard.js

# Configuration
ls .env
ls package.json
ls client/package.json

# If all files exist, installation is complete!
```

---

## 4. Running the Application

### 4.1 Starting the Application

#### Option 1: Run Both Servers Together (Recommended)

```bash
# From root directory
npm run dev
```

**What happens:**
- Backend starts on port 5001
- Frontend starts on port 3000
- Both run concurrently in the same terminal
- Browser automatically opens to http://localhost:3000

**Console output should show:**
```
[0] Server is running on port 5001
[0] Environment: development
[0] Security features enabled:
[0]   - Rate limiting (100 req/min)
[0]   - Input sanitization
[0]   - SQL injection prevention
[0]   - XSS protection
[0]   - Security headers
[0]   - Audit logging
[0] Connected to SQLite database
[0] Categories table ready
[0] Transactions table ready
[1] 
[1] Compiled successfully!
[1] 
[1] You can now view expense-tracker in the browser.
[1] 
[1]   Local:            http://localhost:3000
```

#### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd expense-tracker
npm run server
```

Wait for message: "Server is running on port 5001"

**Terminal 2 - Frontend:**
```bash
cd expense-tracker
npm run client
```

Wait for message: "Compiled successfully!"

### 4.2 Accessing the Application

**Frontend URL:**
```
http://localhost:3000
```

**Backend API URL:**
```
http://localhost:5001
```

**API Health Check:**
```bash
# Test if backend is running
curl http://localhost:5001/health

# Expected response:
# {"status":"OK","timestamp":"2026-02-08T..."}
```

### 4.3 Stopping the Application

**If running with `npm run dev`:**
```bash
# Press Ctrl+C in the terminal
# Both servers will stop
```

**If running separately:**
```bash
# In each terminal, press Ctrl+C
```

**Force stop all Node processes:**
```bash
# macOS/Linux:
pkill -9 node

# Windows:
taskkill /F /IM node.exe
```

### 4.4 Restarting the Application

```bash
# Stop the application (Ctrl+C)

# Clear any port conflicts
lsof -ti:5001 | xargs kill -9  # macOS/Linux
lsof -ti:3000 | xargs kill -9  # macOS/Linux

# Restart
npm run dev
```

---

## 5. User Manual

### 5.1 Dashboard

**Purpose:** View financial overview with charts and summaries

**How to use:**
1. Click "Dashboard" tab in navigation
2. Select month and year from dropdowns
3. View summary cards:
   - Total Income (green)
   - Total Expenses (red)
   - Balance (blue/red based on positive/negative)
4. Review charts:
   - Income vs Expenses bar chart
   - Expense breakdown pie chart
   - Income breakdown pie chart

**What you'll see:**
- $0.00 for all values if no transactions exist
- "No transactions for the selected period" message
- Charts appear only when data exists

### 5.2 Add Transaction

**Purpose:** Create or edit financial transactions

**How to add:**
1. Click "Add Transaction" tab
2. Select transaction type (Income or Expense)
3. Enter amount (must be positive number)
4. Select category (filtered by transaction type)
5. Choose date
6. Add description (optional)
7. Click "Add Transaction" button

**How to edit:**
1. Go to "Transactions" tab
2. Click edit button (✏️) on any transaction
3. You'll be taken to "Add Transaction" tab with pre-filled form
4. Make changes
5. Click "Update Transaction"
6. Or click "Cancel" to abort edit

**Validation rules:**
- Amount must be greater than 0
- Category must be selected
- Date must be valid
- Description maximum 500 characters

### 5.3 Transaction List

**Purpose:** View all recorded transactions

**Features:**
- Chronological list (newest first)
- Color-coded by type:
  - Green background = Income
  - Red background = Expense
- Shows: Date, Category, Amount, Description
- Transaction count at top

**Actions:**
- **Edit (✏️):** Modify transaction details
- **Delete (🗑️):** Remove transaction (requires confirmation)

### 5.4 Search

**Purpose:** Find specific transactions with advanced filters

**How to search:**
1. Click "Search" tab
2. Enter search term (searches description and category)
3. Apply filters (optional):
   - Transaction type
   - Category
   - Date range (start and end)
   - Amount range (min and max)
4. Click "Search" button

**Results:**
- Shows count of results found
- Lists all matching transactions
- Color-coded by type
- "No results" message if nothing matches

**Clear filters:**
- Click "Clear All Filters" to reset

### 5.5 Reports

**Purpose:** Generate detailed financial reports

**Report Types:**

#### 5.5.1 Detailed Financial Report
1. Select "Detailed Financial Report"
2. Choose start date and end date
3. Optional: Filter by transaction type
4. Click "📄 Generate Report"

**Report includes:**
- Report ID and generation timestamp
- Summary (income, expenses, balance)
- Category breakdown table
- Transaction details (up to 50 shown)

#### 5.5.2 Category Summary Report
1. Select "Category Summary Report"
2. Choose year and month
3. Click "📄 Generate Report"

**Report includes:**
- Income/expense totals
- Category-by-category breakdown
- Transaction counts per category
- Average amounts

#### 5.5.3 Annual Comparison Report
1. Select "Annual Comparison Report"
2. Enter year
3. Click "📄 Generate Report"

**Report includes:**
- Monthly breakdown for entire year
- Annual summary statistics
- Income/expenses per month
- Total transactions per month

**Report Actions:**
- **📥 Download JSON:** Save report data
- **🖨️ Print Report:** Print-friendly format

### 5.6 Categories

**Purpose:** Manage income and expense categories

**View categories:**
- Income categories (green section)
- Expense categories (red section)
- Count shown for each type

**Add category:**
1. Click "+ Add New Category"
2. Enter category name
3. Select type (Income or Expense)
4. Click "Create Category"

**Edit category:**
1. Click edit button (✏️) next to category
2. Modify name in inline editor
3. Click "Save"
4. Or click "Cancel"

**Delete category:**
1. Click delete button (🗑️)
2. Confirm deletion
3. **Note:** Cannot delete categories that have transactions

---

## 6. Maintenance Procedures

### 6.1 Regular Maintenance Tasks

#### Daily Tasks (if running in production)

**1. Check application status:**
```bash
# Verify backend is running
curl http://localhost:5001/health

# Check frontend is accessible
curl http://localhost:3000
```

**2. Review logs:**
```bash
# Check for errors in backend logs
# Look for [AUDIT] entries for modifications
# Review any error messages
```

**3. Monitor disk space:**
```bash
# Check database size
ls -lh server/database/expense_tracker.db

# If file is growing too large, consider archiving old data
```

#### Weekly Tasks

**1. Backup database:**
```bash
# Create backup with timestamp
cp server/database/expense_tracker.db \
   server/database/backups/expense_tracker_$(date +%Y%m%d).db

# Keep last 4 weeks of backups
```

**2. Update dependencies (check for security updates):**
```bash
# Check for outdated packages
npm outdated

# Update to latest compatible versions
npm update
cd client && npm update && cd ..
```

**3. Clear old logs (if logging to files):**
```bash
# Remove logs older than 30 days
find logs/ -name "*.log" -mtime +30 -delete
```

#### Monthly Tasks

**1. Full system backup:**
```bash
# Backup entire application directory
tar -czf expense-tracker-backup-$(date +%Y%m%d).tar.gz expense-tracker/

# Store backup in secure location
mv expense-tracker-backup-*.tar.gz /path/to/backups/
```

**2. Review and optimize database:**
```bash
# Use SQLite Browser or command line
sqlite3 server/database/expense_tracker.db

# Run in SQLite prompt:
VACUUM;  # Reclaim unused space
ANALYZE; # Update query optimizer statistics
.exit
```

**3. Security audit:**
```bash
# Check for vulnerable dependencies
npm audit

# Fix issues
npm audit fix

# In client directory
cd client
npm audit
npm audit fix
cd ..
```

### 6.2 Database Maintenance

#### View Database Contents

```bash
# Open database in SQLite
sqlite3 server/database/expense_tracker.db

# Common queries:
.tables                          # List all tables
.schema transactions             # Show table structure
SELECT COUNT(*) FROM transactions; # Count records
SELECT * FROM categories;        # View all categories
.exit                           # Exit SQLite
```

#### Clean Old Data (Archive)

```bash
# Archive transactions older than 2 years
sqlite3 server/database/expense_tracker.db

# In SQLite prompt:
-- Create archive table
CREATE TABLE IF NOT EXISTS transactions_archive AS 
SELECT * FROM transactions WHERE 1=0;

-- Move old records
INSERT INTO transactions_archive 
SELECT * FROM transactions 
WHERE date < date('now', '-2 years');

-- Delete from main table
DELETE FROM transactions 
WHERE date < date('now', '-2 years');

-- Optimize
VACUUM;
.exit
```

#### Database Integrity Check

```bash
sqlite3 server/database/expense_tracker.db

# In SQLite prompt:
PRAGMA integrity_check;
# Should return: ok

.exit
```

### 6.3 Log Management

#### Enable File Logging (Optional)

**Edit server/server.js** to add file logging:

```javascript
const fs = require('fs');
const util = require('util');

// Create logs directory
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

// Create log file stream
const logFile = fs.createWriteStream('./logs/app.log', { flags: 'a' });

// Override console.log to also write to file
const originalConsoleLog = console.log;
console.log = function(...args) {
  originalConsoleLog(...args);
  logFile.write(util.format(...args) + '\n');
};
```

#### View Logs

```bash
# View recent logs
tail -n 100 logs/app.log

# Follow logs in real-time
tail -f logs/app.log

# Search logs for errors
grep "Error" logs/app.log

# Search for specific date
grep "2026-02-08" logs/app.log
```

#### Rotate Logs

```bash
# Create log rotation script
cat > rotate_logs.sh << 'EOF'
#!/bin/bash
cd /path/to/expense-tracker
mv logs/app.log logs/app-$(date +%Y%m%d).log
touch logs/app.log
find logs/ -name "app-*.log" -mtime +30 -delete
EOF

chmod +x rotate_logs.sh

# Run weekly via cron:
# 0 0 * * 0 /path/to/rotate_logs.sh
```

### 6.4 Performance Monitoring

#### Check Application Performance

```bash
# Monitor backend response times
time curl http://localhost:5001/api/transactions

# Monitor memory usage
ps aux | grep node

# Monitor database size
ls -lh server/database/expense_tracker.db
```

#### Optimize Performance

**1. Database Optimization:**
```bash
sqlite3 server/database/expense_tracker.db "VACUUM; ANALYZE;"
```

**2. Clear npm cache:**
```bash
npm cache clean --force
cd client && npm cache clean --force && cd ..
```

**3. Rebuild node_modules:**
```bash
rm -rf node_modules
rm -rf client/node_modules
npm install
cd client && npm install && cd ..
```

### 6.5 Security Maintenance

#### Review Security Settings

**1. Check security middleware is active:**
```bash
# Start server and look for this in output:
npm run server

# Should see:
# Security features enabled:
#   - Rate limiting (100 req/min)
#   - Input sanitization
#   - SQL injection prevention
#   - XSS protection
#   - Security headers
#   - Audit logging
```

**2. Test security headers:**
```bash
curl -I http://localhost:5001/health

# Should include:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

**3. Review audit logs:**
```bash
# Look for [AUDIT] entries in logs
npm run server | grep AUDIT
```

#### Update Security Dependencies

```bash
# Check for security vulnerabilities
npm audit

# Fix issues automatically
npm audit fix

# Force fix (may break compatibility)
npm audit fix --force

# Do same for client
cd client
npm audit
npm audit fix
cd ..
```

---

## 7. Troubleshooting

### 7.1 Common Issues and Solutions

#### Issue: "Cannot find module"

**Symptoms:**
```
Error: Cannot find module './middleware/security'
```

**Solution:**
```bash
# Verify all files exist
ls server/middleware/security.js
ls server/models/BaseModel.js

# If files are missing, ensure you have the complete project
# Reinstall dependencies
npm install
cd client && npm install && cd ..
```

#### Issue: "Port already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5001
```

**Solution:**
```bash
# Find what's using the port
lsof -i :5001

# Kill the process
lsof -ti:5001 | xargs kill -9

# Or change port in .env
echo "PORT=5002" > .env

# Update frontend API URL in client/src/services/api.js
# Change: const API_BASE_URL = 'http://localhost:5002/api';
```

#### Issue: "Failed to fetch" errors in frontend

**Symptoms:**
- Frontend shows "Failed to fetch transactions"
- Network errors in browser console

**Solution:**
```bash
# 1. Verify backend is running
curl http://localhost:5001/health

# 2. Check API URL in client/src/services/api.js
# Should match your backend port (5001)

# 3. Verify CORS settings in server/server.js
# Should allow http://localhost:3000

# 4. Restart both servers
# Press Ctrl+C
npm run dev
```

#### Issue: Database errors

**Symptoms:**
```
SQLITE_ERROR: no such table: transactions
```

**Solution:**
```bash
# Delete and recreate database
rm server/database/expense_tracker.db

# Restart server (will recreate database)
npm run server

# Verify tables were created (should see success messages)
```

#### Issue: "Module build failed" in React

**Symptoms:**
```
Failed to compile.
Module not found: Can't resolve './components/Dashboard'
```

**Solution:**
```bash
cd client

# Clear React cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart
npm start
```

### 7.2 Diagnostic Commands

#### Check System Status

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if backend is running
curl http://localhost:5001/health

# Check if frontend is accessible
curl http://localhost:3000

# Check running Node processes
ps aux | grep node

# Check ports in use
lsof -i :5001
lsof -i :3000
```

#### Verify File Permissions

```bash
# Check if files are readable
ls -la server/
ls -la client/

# Fix permissions if needed
chmod -R 755 server/
chmod -R 755 client/
```

#### Test Database Connection

```bash
# Try to open database
sqlite3 server/database/expense_tracker.db ".tables"

# Should show: categories  transactions

# If error, database file may be corrupted
# Backup and recreate
mv server/database/expense_tracker.db server/database/expense_tracker.db.backup
npm run server  # Will create new database
```

### 7.3 Getting Help

#### Enable Debug Mode

```bash
# Set environment to development
echo "NODE_ENV=development" >> .env

# Restart server (will show detailed errors)
npm run server
```

#### Collect Diagnostic Information

When reporting issues, collect:

```bash
# 1. System information
node --version
npm --version
uname -a  # or: systeminfo (Windows)

# 2. Package versions
cat package.json | grep version
cd client && cat package.json | grep version && cd ..

# 3. Recent errors
# Copy last 50 lines from console output

# 4. Database status
sqlite3 server/database/expense_tracker.db ".tables"
sqlite3 server/database/expense_tracker.db "SELECT COUNT(*) FROM transactions;"

# 5. Network status
netstat -an | grep 5001
netstat -an | grep 3000
```

---

## 8. Backup and Recovery

### 8.1 Backup Procedures

#### Manual Backup

```bash
# Create backups directory
mkdir -p backups

# Backup database only
cp server/database/expense_tracker.db \
   backups/expense_tracker_$(date +%Y%m%d_%H%M%S).db

# Backup entire application
tar -czf backups/expense-tracker-full-$(date +%Y%m%d).tar.gz \
   --exclude='node_modules' \
   --exclude='client/node_modules' \
   --exclude='backups' \
   expense-tracker/

# Verify backup was created
ls -lh backups/
```

#### Automated Backup Script

**Create backup script:**

```bash
cat > backup.sh << 'EOF'
#!/bin/bash

# Configuration
APP_DIR="/path/to/expense-tracker"
BACKUP_DIR="/path/to/backups"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup database
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp "$APP_DIR/server/database/expense_tracker.db" \
   "$BACKUP_DIR/expense_tracker_$TIMESTAMP.db"

# Remove old backups
find "$BACKUP_DIR" -name "expense_tracker_*.db" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: expense_tracker_$TIMESTAMP.db"
EOF

chmod +x backup.sh
```

**Schedule with cron (daily at 2 AM):**

```bash
crontab -e

# Add this line:
0 2 * * * /path/to/backup.sh >> /path/to/backup.log 2>&1
```

### 8.2 Recovery Procedures

#### Restore Database from Backup

```bash
# 1. Stop the application
# Press Ctrl+C or:
pkill -9 node

# 2. Backup current (corrupted) database
mv server/database/expense_tracker.db \
   server/database/expense_tracker.db.corrupted

# 3. Restore from backup
cp backups/expense_tracker_YYYYMMDD.db \
   server/database/expense_tracker.db

# 4. Verify database integrity
sqlite3 server/database/expense_tracker.db "PRAGMA integrity_check;"

# 5. Restart application
npm run dev
```

#### Restore Full Application

```bash
# 1. Extract backup
tar -xzf backups/expense-tracker-full-YYYYMMDD.tar.gz

# 2. Navigate to restored directory
cd expense-tracker

# 3. Reinstall dependencies
npm install
cd client && npm install && cd ..

# 4. Start application
npm run dev
```

#### Emergency Recovery (Database Corrupted)

```bash
# 1. Try to export data from corrupted database
sqlite3 server/database/expense_tracker.db ".dump" > recovery.sql

# 2. Create new database
rm server/database/expense_tracker.db
npm run server  # Creates fresh database structure
# Stop server with Ctrl+C

# 3. Import data (skip schema creation lines)
grep -v "CREATE TABLE" recovery.sql | \
sqlite3 server/database/expense_tracker.db

# 4. Verify data
sqlite3 server/database/expense_tracker.db \
  "SELECT COUNT(*) FROM transactions;"

# 5. Restart
npm run dev
```

---

## 9. Configuration Guide

### 9.1 Environment Variables

**File location:** `expense-tracker/.env`

**Available variables:**

```bash
# Server port (default: 5001)
PORT=5001

# Environment mode (development or production)
NODE_ENV=development
```

**To change port:**

```bash
# Edit .env file
echo "PORT=8080" > .env

# Update frontend API URL
# Edit: client/src/services/api.js
# Change: const API_BASE_URL = 'http://localhost:8080/api';

# Restart both servers
npm run dev
```

### 9.2 Security Configuration

**Rate Limiting:**

Edit `server/middleware/security.js`:

```javascript
// Line 3-4: Change these values
const RATE_LIMIT_WINDOW = 60000; // 1 minute (in milliseconds)
const MAX_REQUESTS = 100;        // Max requests per window
```

**Request Size Limit:**

Edit `server/server.js`:

```javascript
// Line 20: Change payload size limit
app.use(express.json({ limit: '1mb' })); // Change to '2mb', etc.
```

**CORS Settings:**

Edit `server/server.js`:

```javascript
// Lines 18-21: Change allowed origins
app.use(cors({
  origin: 'http://localhost:3000', // Change for production
  credentials: true
}));
```

### 9.3 Database Configuration

**Current database location:**
```
expense-tracker/server/database/expense_tracker.db
```

**To change database location:**

Edit `server/database/init.js`:

```javascript
// Line 4: Change database path
const dbPath = path.join(__dirname, 'expense_tracker.db');

// Change to:
const dbPath = '/custom/path/expense_tracker.db';
```

**Switch to PostgreSQL/MySQL:**

1. Install database driver:
```bash
npm install pg  # PostgreSQL
# or
npm install mysql2  # MySQL
```

2. Replace database connection in `server/database/init.js`

### 9.4 Frontend Configuration

**API endpoint:**

Edit `client/src/services/api.js`:

```javascript
// Line 3: Change API URL
const API_BASE_URL = 'http://localhost:5001/api';

// For production:
const API_BASE_URL = 'https://api.yourdomain.com/api';
```

**Chart colors:**

Edit `client/src/components/Dashboard.js`:

```javascript
// Lines 29-33: Change colors
const COLORS = [
  '#0088FE', // Blue
  '#00C49F', // Green
  '#FFBB28', // Yellow
  // Add more colors as needed
];
```

---

## 10. Security Maintenance

### 10.1 Security Checklist

#### Monthly Security Review

- [ ] Run `npm audit` on backend
- [ ] Run `npm audit` on frontend (client/)
- [ ] Review audit logs for suspicious activity
- [ ] Check for Node.js security updates
- [ ] Verify all security middleware is active
- [ ] Test security headers with curl
- [ ] Review rate limiting effectiveness
- [ ] Check for unauthorized access attempts

#### Security Commands

```bash
# Check for vulnerabilities
npm audit
cd client && npm audit && cd ..

# Fix vulnerabilities
npm audit fix
npm audit fix --force  # If needed

# Update Node.js (use nvm if installed)
nvm install node --latest-npm
nvm use node

# Verify security middleware
npm run server | grep "Security features enabled"
```

### 10.2 Security Best Practices

**1. Keep Dependencies Updated:**
```bash
# Check outdated packages
npm outdated

# Update packages
npm update
cd client && npm update && cd ..
```

**2. Use HTTPS in Production:**
- Obtain SSL certificate (Let's Encrypt)
- Configure reverse proxy (nginx, Apache)
- Update CORS settings
- Force HTTPS redirects

**3. Implement Authentication (Future Enhancement):**
- Add user login system
- Use JWT tokens
- Implement session management
- Add role-based access control

**4. Regular Backups:**
- Automate daily database backups
- Store backups securely off-site
- Test restore procedures monthly

**5. Monitor Logs:**
- Review [AUDIT] logs daily
- Set up alerts for errors
- Log failed login attempts (if auth added)
- Monitor unusual activity

### 10.3 Incident Response

**If security breach suspected:**

1. **Immediate Actions:**
   ```bash
   # Stop the application
   pkill -9 node
   
   # Backup current database for forensics
   cp server/database/expense_tracker.db \
      server/database/incident_$(date +%Y%m%d_%H%M%S).db
   
   # Review audit logs
   grep AUDIT logs/app.log > incident_logs.txt
   ```

2. **Investigation:**
   - Review all logs for unauthorized access
   - Check database for unexpected changes
   - Review recent transactions
   - Identify attack vector

3. **Remediation:**
   - Update all dependencies
   - Change any credentials
   - Restore from clean backup if needed
   - Apply security patches

4. **Prevention:**
   - Implement additional security measures
   - Update security policies
   - Train users on security practices

---

## Appendix A: Quick Reference Commands

### Starting/Stopping

```bash
# Start both servers
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Stop (Ctrl+C in terminal)
# Or force stop all:
pkill -9 node
```

### Database

```bash
# Open database
sqlite3 server/database/expense_tracker.db

# View tables
.tables

# Count transactions
SELECT COUNT(*) FROM transactions;

# Backup database
cp server/database/expense_tracker.db backups/backup_$(date +%Y%m%d).db

# Reset database
rm server/database/expense_tracker.db
npm run server
```

### Maintenance

```bash
# Update dependencies
npm update
cd client && npm update && cd ..

# Security audit
npm audit
npm audit fix

# Clear cache
npm cache clean --force
rm -rf node_modules
npm install
```

### Troubleshooting

```bash
# Check if running
curl http://localhost:5001/health
curl http://localhost:3000

# Kill port conflicts
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# View logs
tail -f logs/app.log

# Check Node version
node --version
npm --version
```

---

## Appendix B: File Structure Reference

```
expense-tracker/
├── server/                      # Backend application
│   ├── controllers/             # Request handlers
│   │   ├── categoryController.js
│   │   ├── reportController.js
│   │   └── transactionController.js
│   ├── database/                # Database files
│   │   ├── expense_tracker.db   # SQLite database
│   │   └── init.js              # Database initialization
│   ├── middleware/              # Security & utilities
│   │   └── security.js          # Security middleware
│   ├── models/                  # Data models (OOP)
│   │   └── BaseModel.js         # Model classes
│   ├── routes/                  # API route definitions
│   │   ├── categories.js
│   │   ├── reports.js
│   │   └── transactions.js
│   └── server.js                # Main server file
├── client/                      # Frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── CategoryManager.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Reports.js
│   │   │   ├── Search.js
│   │   │   ├── TransactionForm.js
│   │   │   ├── TransactionList.js
│   │   │   └── *.css            # Component styles
│   │   ├── services/            # API communication
│   │   │   └── api.js
│   │   ├── App.js               # Main app component
│   │   ├── App.css              # Main styles
│   │   └── index.js             # Entry point
│   └── package.json             # Frontend dependencies
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Backend dependencies
└── README.md                    # Project documentation
```

---

## Appendix C: Port Configuration

| Service | Default Port | Change Location |
|---------|--------------|-----------------|
| Backend | 5001 | `.env` file (PORT variable) |
| Frontend | 3000 | Automatic (React default) |
| Database | N/A | File-based (no port) |

**Note:** If you change the backend port, you must also update the frontend API URL in `client/src/services/api.js`.

---

## Appendix D: Contact and Support

### Getting Help

**Documentation:**
- README.md - Project overview
- DESIGN_DOCUMENT.md - Architecture details
- REQUIREMENTS_COMPLIANCE.md - Feature documentation
- TROUBLESHOOTING.md - Common issues

**Self-Help:**
1. Check this user guide
2. Review troubleshooting section
3. Check console for error messages
4. Verify all files exist
5. Ensure dependencies are installed

**Reporting Issues:**

When reporting problems, include:
1. Node.js version (`node --version`)
2. Operating system
3. Exact error message
4. Steps to reproduce
5. Recent log output
6. Database size and record count

---

**END OF USER GUIDE**

*For additional technical details, refer to DESIGN_DOCUMENT.md and README.md*