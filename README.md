# Carbon and Diesel Savings Dashboard

A Node.js application that visualizes carbon and diesel savings data from CSV files using SQLite and Express.

## Features

- Data visualization of carbon and diesel savings
- Key metrics:
  - Total Carbon Saved (tonnes)
  - Monthly Average Carbon Saved (tonnes/month)
  - Total Diesel Saved (litres)
  - Monthly Average Diesel Saved (litres/month)
- Interactive date range filtering
- Monthly breakdown chart
- SQLite database for efficient data storage
- REST APIs for data retrieval

<img width="1107" height="862" alt="image" src="https://github.com/user-attachments/assets/4abe9945-7aba-41d1-ac05-938356c882d1" />

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Project Structure

```
├── data/
│   ├── devices.csv         # Device information
│   └── device-saving.csv   # Savings data
├── public/
│   └── index.html         # Frontend dashboard
├── src/
│   ├── db/
│   │   ├── database.js    # Database connection handler
│   │   └── dataLoader.js  # CSV to SQLite data loader
│   └── routes/
│       └── savings.js     # API routes
├── index.js              # Main application file
├── loadDb.js             # File to create tables and trigger data load into SQL lite from CSV files
└── package.json         # Project dependencies
```

## Installation

1. Clone or download this repository

2. Navigate to the project directory:
   ```bash
   cd "0fcfdf47-6a1b-4767-8bc3-719d430d73ed"
   ```

3. Install dependencies:
   ```bash
   npm install express sqlite3 csv-parser cors
   ```

## Running the Application

1. Start the server:
   ```bash
   node index.js
   ```

2. Open your web browser and visit:
   ```
   http://localhost:3000
   ```

The application will:
- Start the web server on port 3000
- Display the dashboard in your browser

## API Endpoints

### Get Summary Statistics
```
GET /api/savings/summary
```
Returns total and monthly average savings for both carbon and diesel.

### Get Filtered Data
```
GET /api/savings/filter?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```
Returns savings data between the specified dates.

## Data Sources

This Application uses two CSV files, which are loaded into the SQLite database file (savings.db)."

1. `data/devices.csv`:
   - Device information including ID, name, and timezone

2. `data/device-saving.csv`:
   - Savings records with timestamps and measurements

To Load data from csv to sqlite run command `node loadDb.js` 

## Troubleshooting

1. If the database gets corrupted or you want to reset the data:
   - Stop the server
   - Delete the `savings.db` file
   - Execute `node loadDb.js` 

3. If data isn't loading:
   - Check that CSV files exist in the `data/` directory
   - Verify CSV file permissions
   - Check console for error messages
