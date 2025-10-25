const express = require('express');
const router = express.Router();
const Database = require('../db/database');
let db;
(async () => {
    try {
        db = Database.getInstance().getDB();
    } catch (err) {
    }
})();

// Get total and monthly savings
router.get('/savings/summary', (req, res) => {
    const query = `
        WITH monthly AS (
            SELECT 
                strftime('%Y-%m', timestamp) as month,
                SUM(carbon_saved) as monthly_carbon_saved,
                SUM(fuel_saved) as monthly_fuel_saved
            FROM device_savings
            GROUP BY month
        )
        SELECT 
            SUM(monthly_carbon_saved)/1000 as total_carbon_saved,
            SUM(monthly_fuel_saved) as total_fuel_saved,
            AVG(monthly_carbon_saved)/1000 as avg_monthly_carbon,
            AVG(monthly_fuel_saved) as avg_monthly_fuel
        FROM monthly`;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }    

        res.json({
            metrics:rows.length?rows[0]:{}
        });
    });
});

// Get savings between dates
router.get('/savings/filter', (req, res) => {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
        res.status(400).json({ error: 'Start date and end date are required' });
        return;
    }

    const query = `
        SELECT 
            SUM(carbon_saved) as carbon_saved,
            SUM(fuel_saved) as fuel_saved,
            strftime('%Y-%m', timestamp) as month,
            (CASE strftime('%m', date(substr(timestamp,1,10)))
            WHEN '01' THEN 'Jan' WHEN '02' THEN 'Feb' WHEN '03' THEN 'Mar'
            WHEN '04' THEN 'Apr' WHEN '05' THEN 'May' WHEN '06' THEN 'Jun'
            WHEN '07' THEN 'Jul' WHEN '08' THEN 'Aug' WHEN '09' THEN 'Sep'
            WHEN '10' THEN 'Oct' WHEN '11' THEN 'Nov' WHEN '12' THEN 'Dec'
        END) || ' ' || strftime('%Y', date(substr(timestamp,1,10))) AS month_label
        FROM device_savings
        WHERE timestamp BETWEEN ? AND ?
        GROUP BY month
        ORDER BY month`;

    db.all(query, [start_date, end_date], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


module.exports = router;