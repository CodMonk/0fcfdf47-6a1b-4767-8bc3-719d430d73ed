const sqlite3 = require('sqlite3').verbose();

class Database {
    static instance = null; 
    static DB_PATH = 'savings.db';

    constructor() {
        if (Database.instance) {
            throw new Error('Use Database.getInstance() method to create DB insrtance');
        }

        this.db = new sqlite3.Database(Database.DB_PATH, (err) => {
            if (err) {
                console.error('error opening db file', err);
            } else {
                console.log('connected to sql lite');
                this.createTables();
            }
        });
    }

    createTables() {
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS devices (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    timezone TEXT
                )
            `);

            this.db.run(`
                CREATE TABLE IF NOT EXISTS device_savings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    device_id INTEGER,
                    timestamp DATETIME,
                    device_timestamp DATETIME,
                    carbon_saved REAL,
                    fuel_saved REAL,
                    FOREIGN KEY (device_id) REFERENCES devices(id)
                )
            `);
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    getDB() {
        return this.db;
    }
}

module.exports = Database;
