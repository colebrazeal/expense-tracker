# End-User Guide
## Personal Expense & Budget Tracker
### How to Use Your Expense Tracker

**Version:** 1.0  
**Date:** February 2026  
**For:** End Users  

---

## Welcome to Your Personal Expense & Budget Tracker

This guide will help you understand how to use your new expense tracking application to manage your personal finances, track spending, and achieve your financial goals.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Understanding the Dashboard](#2-understanding-the-dashboard)
3. [Adding Your First Transaction](#3-adding-your-first-transaction)
4. [Managing Your Transactions](#4-managing-your-transactions)
5. [Searching for Transactions](#5-searching-for-transactions)
6. [Generating Reports](#6-generating-reports)
7. [Managing Categories](#7-managing-categories)
8. [Tips for Success](#8-tips-for-success)
9. [Frequently Asked Questions](#9-frequently-asked-questions)

---

## 1. Getting Started

### 1.1 What You'll Need

- **A web browser** (Chrome, Firefox, Safari, or Edge)
- **Internet connection** (for initial setup)
- **Your financial records** (receipts, bank statements, pay stubs)

### 1.2 Opening the Application

1. **Open your web browser**
2. **Type in the address bar:**
   ```
   http://localhost:3000
   ```
3. **Press Enter**

You should see the main dashboard with a purple gradient header saying "Personal Expense & Budget Tracker"

### 1.3 First Look - What You'll See

At the top of the screen, you'll see **six navigation tabs**:

- **Dashboard** - Your financial overview
- **Add Transaction** - Record income or expenses
- **Transactions** - View all your records
- **Search** - Find specific transactions
- **Reports** - Generate financial reports
- **Categories** - Manage your categories

---

## 2. Understanding the Dashboard

The Dashboard is your financial command center. Here's what everything means:

### 2.1 Summary Cards (Top Section)

You'll see three colored boxes showing:

#### Total Income (Green Box)
- Shows all money you've earned
- Example: Salary, freelance work, investments
- **Higher is better**

#### Total Expenses (Red Box)
- Shows all money you've spent
- Example: Rent, groceries, entertainment
- **Lower is better**

#### Balance (Blue/Red Box)
- Your income minus your expenses
- **Blue** = Positive (you saved money)
- **Red** = Negative (you spent more than earned)

### 2.2 Month and Year Selector

At the top right of the dashboard:

1. **Click the first dropdown** to select a month (January through December)
2. **Click the second dropdown** to select a year (2021-2031)
3. The summary automatically updates to show data for that period

**Example:** Select "February" and "2026" to see your finances for February 2026

### 2.3 Visual Charts (Bottom Section)

#### Income vs Expenses Bar Chart
- **Green bar** = Your income
- **Red bar** = Your expenses
- Quickly compare how much you earned versus spent
- The taller bar shows which was higher

#### Expense Breakdown Pie Chart
- Shows WHERE your money went
- Each slice = a different spending category
- Bigger slices = more money spent in that category
- Hover over slices to see exact amounts

#### Income Breakdown Pie Chart
- Shows WHERE your money came from
- Each slice = a different income source
- Bigger slices = larger income sources
- Hover over slices to see exact amounts

### 2.4 What If I Don't See Any Data?

If you just started using the app, you'll see:
- $0.00 for all values
- Empty charts
- Message: "No transactions for the selected period"

**This is normal!** Once you add transactions (see Section 3), your dashboard will come to life with real data.

---

## 3. Adding Your First Transaction

Let's record your first financial transaction.

### 3.1 Navigate to Add Transaction

1. Click the **"Add Transaction"** tab at the top of the screen
2. You'll see a form with several fields

### 3.2 Recording an Expense (Money You Spent)

Let's say you spent $45.00 on groceries yesterday.

**Step-by-step:**

1. **Type:** Select "Expense" from the dropdown
   - Use this for money you spent

2. **Amount:** Type `45.00`
   - Always use numbers only
   - Include cents (e.g., 45.00 not 45)
   - Don't type the dollar sign

3. **Category:** Select "Food & Dining" from the dropdown
   - Categories are pre-organized by type
   - When you select "Expense," only expense categories show

4. **Date:** Click the calendar and choose yesterday's date
   - Or type the date in YYYY-MM-DD format (e.g., 2026-02-08)

5. **Description (Optional):** Type "Weekly grocery shopping"
   - This helps you remember what the purchase was for
   - You can leave this blank if you want

6. **Click "Add Transaction"**
   - You'll see a success message
   - The form clears, ready for another entry

### 3.3 Recording Income (Money You Earned)

Let's say you received your $3,000 monthly salary today.

**Step-by-step:**

1. **Type:** Select "Income" from the dropdown
   - Use this for money you earned

2. **Amount:** Type `3000.00`

3. **Category:** Select "Salary" from the dropdown
   - Notice the categories changed to income categories
   - Options: Salary, Freelance, Investment, Other Income

4. **Date:** Select today's date

5. **Description (Optional):** Type "February salary"

6. **Click "Add Transaction"**

### 3.4 What Happens After You Add Transactions?

- The transaction is saved to your database
- You can view it in the "Transactions" tab
- It will appear in your Dashboard statistics
- It will be included in reports

---

## 4. Managing Your Transactions

### 4.1 Viewing All Transactions

1. Click the **"Transactions"** tab
2. You'll see a list of all your recorded transactions

**What you'll see for each transaction:**
- **Category name** (e.g., "Food & Dining")
- **Amount** with +/- sign
  - Green with "+" = Income
  - Red with "-" = Expense
- **Date** when it occurred
- **Description** (if you added one)
- **Edit button** (pencil icon)
- **Delete button** (trash can icon)

### 4.2 Sorting and Organization

Transactions are automatically sorted:
- **Newest first** (most recent at the top)
- **Oldest last** (scroll down to see older transactions)

### 4.3 Editing a Transaction

Made a mistake? Need to update details? Here's how:

1. **Find the transaction** in your Transactions list
2. **Click the pencil icon** (edit button) on the right
3. You'll be taken to the "Add Transaction" form
4. The form will be **pre-filled** with the current details
5. **Change any field** you need to update
6. **Click "Update Transaction"**
   - Or click "Cancel" to abort the edit

**Common edits:**
- Fixing the wrong amount
- Changing the category
- Correcting the date
- Adding or updating the description

### 4.4 Deleting a Transaction

Need to remove a transaction completely?

1. **Find the transaction** in your Transactions list
2. **Click the trash can icon** (delete button)
3. **Confirm deletion** when asked "Are you sure?"
4. The transaction is permanently removed

**Warning:** Deleted transactions cannot be recovered. Be certain before deleting.

### 4.5 Transaction List Features

**Transaction count:**
- At the top of the list: "Total Transactions: 15"
- Shows how many transactions you have

**Color coding:**
- Light green background = Income
- Light red background = Expense
- Easy to scan and identify transaction types

**Empty state:**
- If no transactions exist: "No transactions yet. Start by adding your first transaction!"

---

## 5. Searching for Transactions

Need to find specific transactions? Use the Search feature.

### 5.1 Basic Search

1. Click the **"Search"** tab
2. Type a word in the search box
3. Click **"Search"**

**What you can search for:**
- Words in descriptions (e.g., "grocery")
- Category names (e.g., "dining")
- Partial words work too (e.g., "food" will find "Food & Dining")

**Example:**
- Type "grocery" and click Search
- See all transactions with "grocery" in the description

### 5.2 Advanced Filters

Want to narrow down your search? Use the filters below the search box.

#### Filter by Type
- Select "Income" to see only income
- Select "Expense" to see only expenses
- Leave as "All Types" to see both

#### Filter by Category
- Select a specific category from the dropdown
- Example: "Food & Dining" to see only food expenses

#### Filter by Date Range
- **Start Date:** The earliest date to include
- **End Date:** The latest date to include
- Example: Start Date = 2026-02-01, End Date = 2026-02-28 (all of February)

#### Filter by Amount Range
- **Min Amount:** Smallest amount to show
- **Max Amount:** Largest amount to show
- Example: Min = 100, Max = 500 (transactions between $100 and $500)

### 5.3 Using Multiple Filters Together

You can combine filters for powerful searches.

**Example Search:**
"Find all grocery expenses over $50 in February"

1. **Search term:** Leave blank or type "grocery"
2. **Type:** Select "Expense"
3. **Category:** Select "Food & Dining"
4. **Start Date:** 2026-02-01
5. **End Date:** 2026-02-28
6. **Min Amount:** 50
7. Click **"Search"**

### 5.4 Understanding Search Results

After searching, you'll see:

- **Result count:** "Search Results (5 found)"
- **List of matching transactions** with all details
- **Color-coded** by type (green=income, red=expense)
- **No results message** if nothing matches

### 5.5 Clearing Filters

To start a new search:

1. Click **"Clear All Filters"** button
2. All fields reset to empty
3. Search box clears
4. Results disappear

---

## 6. Generating Reports

Reports help you analyze your finances over time.

### 6.1 Types of Reports Available

The application offers three types of reports:

1. **Detailed Financial Report** - Comprehensive transaction report for a date range
2. **Category Summary Report** - Breakdown by category for a specific month
3. **Annual Comparison Report** - Year-over-year monthly comparison

### 6.2 Creating a Detailed Financial Report

This report shows all transactions within a date range with complete statistics.

**Step-by-step:**

1. Click the **"Reports"** tab
2. Report type should show "Detailed Financial Report" (default)
3. **Start Date:** Click calendar and select the first day
   - Example: 2026-01-01 (January 1st)
4. **End Date:** Click calendar and select the last day
   - Example: 2026-01-31 (January 31st)
5. **Transaction Type (optional):** 
   - Leave as blank to include both income and expenses
   - Or select "Income Only" or "Expenses Only"
6. Click **"Generate Report"** button

**What the report shows:**

**Summary Section:**
- Total Income for the period
- Total Expenses for the period
- Net Balance (income minus expenses)
- Total number of transactions
- Average transaction amount

**Category Breakdown Table:**
- Each category you used
- Total spent/earned per category
- Number of transactions in each category
- Average transaction per category
- Sorted by highest amount first

**Transaction Details:**
- Lists up to 50 transactions
- Date, Category, Type, Amount, Description
- Full details for your records

**Report Header:**
- Report title and date range
- Unique Report ID number
- Timestamp showing when it was generated

### 6.3 Creating a Category Summary Report

This report shows spending by category for a specific month.

**Step-by-step:**

1. Select **"Category Summary Report"** from the dropdown
2. **Year:** Select the year (e.g., 2026)
3. **Month:** Select the month (e.g., February)
4. Click **"Generate Report"**

**What the report shows:**

- Total income for that month
- Total expenses for that month
- Net balance for that month
- Table listing each category with:
  - Category name
  - Type (income or expense)
  - Total amount
  - Number of transactions
  - Average transaction

**Use this to:**
- See where most money went in a month
- Compare income sources
- Identify your biggest expense categories

### 6.4 Creating an Annual Comparison Report

This report compares all 12 months of a year side-by-side.

**Step-by-step:**

1. Select **"Annual Comparison Report"** from the dropdown
2. **Year:** Enter the year you want to analyze (e.g., 2026)
3. Click **"Generate Report"**

**What the report shows:**

**Annual Summary:**
- Total income for entire year
- Total expenses for entire year
- Net balance for entire year
- Total transactions for entire year
- Average monthly income
- Average monthly expenses

**Monthly Breakdown Table:**
- One row for each month (January through December)
- Columns: Month, Income, Expenses, Balance, Transactions
- Shows trends over the year
- Easy to spot high-spending or high-earning months

**Use this to:**
- Review your entire year financially
- Spot seasonal patterns
- Compare month-to-month performance
- Plan for next year

### 6.5 Report Actions

Once a report is generated, you can:

#### Download Report (JSON format)
1. Click the **"Download JSON"** button
2. Report saves to your Downloads folder
3. Open with any text editor to view data
4. Import into spreadsheet software if needed

#### Print Report
1. Click the **"Print Report"** button
2. Your browser's print dialog appears
3. Choose printer or "Save as PDF"
4. Print or save for your records

**Tip:** Reports are formatted for printing without the navigation and buttons (print-optimized).

### 6.6 Understanding Report IDs

Each report has a unique ID like: `RPT-1707329400000`

- Helps you identify specific reports
- Useful for filing and organization
- Timestamp-based (won't duplicate)

---

## 7. Managing Categories

Categories help you organize your transactions. The application comes with default categories, but you can customize them.

### 7.1 Viewing Categories

1. Click the **"Categories"** tab
2. You'll see two sections:
   - **Income Categories** (green section at top)
   - **Expense Categories** (red section at bottom)

### 7.2 Default Categories

**Income Categories** (4 default):
- Salary
- Freelance
- Investment
- Other Income

**Expense Categories** (8 default):
- Food & Dining
- Transportation
- Housing
- Utilities
- Healthcare
- Entertainment
- Shopping
- Other Expense

### 7.3 Adding a New Category

Need a category that doesn't exist? Create your own.

**Step-by-step:**

1. Click the **"+ Add New Category"** button
2. **Category Name:** Type the name
   - Example: "Pet Expenses"
   - Keep it short and descriptive
   - Maximum 100 characters
3. **Type:** Select "Income" or "Expense"
   - Choose based on whether money comes in or goes out
4. Click **"Create Category"**

**Your new category will:**
- Appear in the appropriate section (income or expense)
- Be available immediately in the Add Transaction form
- Show up in all dropdown lists

**Rules:**
- Category names must be unique
- You can't have two categories with the same name

### 7.4 Editing a Category

Want to rename an existing category?

1. Find the category in the list
2. Click the **pencil icon** (edit button) next to it
3. The name becomes editable (inline editing)
4. Type the new name
5. Click **"Save"**
   - Or click **"Cancel"** to keep the old name

**Note:** Editing a category name updates it everywhere (past and future transactions).

### 7.5 Deleting a Category

No longer need a category?

1. Find the category in the list
2. Click the **trash can icon** (delete button)
3. Confirm deletion when prompted

**Important:**
- You **cannot delete** a category if it has been used in any transaction
- First delete or reassign all transactions using that category
- Then you can delete the category

**Why this restriction?**
- Prevents orphaned transactions (transactions without a category)
- Maintains data integrity

---

## 8. Tips for Success

### 8.1 Best Practices

#### Record Transactions Regularly
- **Daily is best** - Record expenses as they happen
- Set a reminder to update before bed
- Keep receipts until recorded
- Less likely to forget small purchases

#### Be Consistent with Categories
- Use the same category for similar expenses
- Don't create too many categories (harder to analyze)
- Stick to the defaults unless you have a specific need

#### Add Meaningful Descriptions
- Future you will thank you
- "Grocery shopping" is better than just "Store"
- Include store name or purpose
- Helps when searching later

#### Check Your Dashboard Weekly
- Review spending patterns
- Spot unusual expenses
- Adjust budget if needed
- Celebrate when you're under budget

#### Generate Monthly Reports
- End of each month, create a Category Summary Report
- Review where money went
- Plan for next month
- Save reports for annual review

### 8.2 Common Workflows

#### Weekly Routine
1. Sunday evening: Open the app
2. Add any transactions from the week you forgot
3. Check Dashboard for weekly spending
4. Adjust spending for upcoming week

#### Monthly Routine
1. First day of month: Generate last month's Category Summary Report
2. Review spending by category
3. Identify areas to reduce spending
4. Set goals for new month
5. Print/save report for records

#### Annual Routine
1. End of year: Generate Annual Comparison Report
2. Review entire year's finances
3. Identify patterns and trends
4. Set financial goals for new year
5. Archive old transactions (optional)

### 8.3 Making the Most of Features

#### Use Search for Tax Time
- Search for "medical" to find healthcare expenses
- Filter by date range for the tax year
- Filter by specific categories (donations, business expenses)
- Generate report for your tax preparer

#### Track Specific Goals
- Create a category for "Savings Goals"
- Record transfers to savings as "Income" in that category
- Watch it grow on your dashboard
- Generate reports to see progress

#### Budget Tracking
- At month start, estimate expected expenses per category
- Compare actual spending (from reports) to estimates
- Adjust spending mid-month if over budget
- Use Annual Report to plan next year's budget

### 8.4 Data Entry Tips

**Speed up entry:**
- Today's date is often the default
- Use Tab key to move between fields
- Amount field accepts decimal (45.99 works)
- Description is optional for small purchases

**Accuracy tips:**
- Round cents if you don't know exact amount (better than nothing)
- Use "Other Income" or "Other Expense" when unsure of category
- Can edit later if you get exact details
- Better to record approximately than not at all

---

## 9. Frequently Asked Questions

### 9.1 General Questions

**Q: How do I access the application?**

A: Open your web browser and go to `http://localhost:3000`

**Q: Do I need an internet connection?**

A: Only for initial setup. Once installed, it works offline (as long as the server is running).

**Q: Where is my data stored?**

A: In a local database file on your computer at `expense-tracker/server/database/expense_tracker.db`

**Q: Is my financial data secure?**

A: Yes, data stays on your local computer. It's not sent to any external servers or cloud services.

**Q: Can I access this from my phone?**

A: If your phone is on the same network, you can access it by using your computer's IP address instead of localhost.

### 9.2 Transaction Questions

**Q: Can I add transactions for past dates?**

A: Yes! Use the date picker to select any date, past or future.

**Q: What if I forget the exact amount?**

A: Enter your best estimate. You can edit it later when you find the receipt.

**Q: Can I have negative amounts?**

A: No, amounts must be positive. Use the Type field (Income vs Expense) to indicate direction.

**Q: How do I record a refund?**

A: If you got money back for an expense, record it as Income in the same category.

**Q: What's the maximum amount I can enter?**

A: No practical limit. The system handles very large numbers.

### 9.3 Category Questions

**Q: Can I rename the default categories?**

A: Yes! Click edit next to any category and change the name.

**Q: What happens to old transactions if I rename a category?**

A: They automatically update to show the new category name.

**Q: Can I delete a default category?**

A: Yes, but only if no transactions use it. Delete or reassign those transactions first.

**Q: How many categories can I create?**

A: No limit. However, too many categories makes analysis harder. 10-15 total is usually ideal.

**Q: Can I move a transaction to a different category?**

A: Yes! Edit the transaction and select a different category from the dropdown.

### 9.4 Dashboard & Reports Questions

**Q: Why does my dashboard show $0.00 for everything?**

A: You haven't added any transactions yet, or the selected month/year has no transactions.

**Q: The charts aren't showing. Why?**

A: Charts only appear when you have transaction data. Add some transactions and they'll appear.

**Q: How do I change the month on the dashboard?**

A: Use the two dropdown menus at the top-right of the dashboard.

**Q: Can I generate a report for multiple months?**

A: Yes! Use the Detailed Financial Report and select a start and end date spanning multiple months.

**Q: Where do downloaded reports go?**

A: Your browser's default Downloads folder (usually Downloads in your user folder).

**Q: Can I export data to Excel?**

A: Reports download as JSON format. You can import JSON into Excel or most spreadsheet programs.

### 9.5 Search Questions

**Q: Why isn't my search finding anything?**

A: Check your spelling and filters. Try broadening your search (fewer filters, shorter search terms).

**Q: Can I search for amounts?**

A: Use the Min Amount and Max Amount filters rather than the search box for amount-based searches.

**Q: How do I find all transactions from a specific store?**

A: Search for the store name (it searches descriptions).

**Q: Can I save searches?**

A: Not currently, but you can note your filter combinations and re-enter them when needed.

### 9.6 Technical Questions

**Q: The application won't load. What do I do?**

A: Make sure the server is running. Open a terminal and run `npm run dev` from the expense-tracker folder.

**Q: I see "Failed to fetch" errors. Help?**

A: The backend server isn't running. Start it with `npm run dev` from the project folder.

**Q: Can I make a backup of my data?**

A: Yes! Copy the file `server/database/expense_tracker.db` to a safe location.

**Q: How do I restore from a backup?**

A: Stop the server, replace the expense_tracker.db file with your backup, and restart.

**Q: The application is slow. How can I speed it up?**

A: Usually not an issue unless you have thousands of transactions. Consider archiving very old data.

### 9.7 Troubleshooting

**Q: I deleted a transaction by accident. Can I get it back?**

A: Unfortunately no. Deleted transactions are permanent. Be careful with the delete button.

**Q: My browser says "This site can't be reached"**

A: The server isn't running. Start it with `npm run dev` from the project directory.

**Q: Numbers look weird (like 45.0000001)**

A: This is rare. Edit the transaction and re-enter the correct amount.

**Q: Categories dropdown is empty when adding transactions**

A: Make sure you've selected Income or Expense first. The categories filter based on type.

**Q: Edit button doesn't work**

A: Make sure you're clicking the pencil icon, not the delete icon. Try refreshing your browser.

---

## Quick Reference Card

### Adding a Transaction
1. Click "Add Transaction"
2. Select Type (Income/Expense)
3. Enter Amount
4. Select Category
5. Choose Date
6. Add Description (optional)
7. Click "Add Transaction"

### Viewing Dashboard
1. Click "Dashboard"
2. Select Month and Year
3. View Summary Cards
4. Review Charts

### Searching
1. Click "Search"
2. Enter search term (or leave blank)
3. Apply filters as needed
4. Click "Search"

### Generating Reports
1. Click "Reports"
2. Select Report Type
3. Enter required dates/parameters
4. Click "Generate Report"
5. Download or Print if needed

### Managing Categories
1. Click "Categories"
2. View Income and Expense sections
3. Click "+ Add New Category" to create
4. Click edit icon to rename
5. Click delete icon to remove

---

## Getting Help

If you encounter issues not covered in this guide:

1. **Check the FAQ section** (Section 9) for common problems
2. **Review the error message** carefully for clues
3. **Try refreshing your browser** (many issues resolve this way)
4. **Restart the application** (stop and run `npm run dev` again)
5. **Consult the technical USER_GUIDE.md** for advanced troubleshooting

---

**Congratulations!** You now know how to use all features of the Personal Expense & Budget Tracker. Start tracking your finances today and take control of your financial future.

---

**END OF END-USER GUIDE**

*For technical setup and maintenance instructions, see USER_GUIDE.md*