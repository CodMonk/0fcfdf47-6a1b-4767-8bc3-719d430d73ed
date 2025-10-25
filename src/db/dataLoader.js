const csv = require('csv-parser');
const fs = require('fs');
const Database = require('./database');

class DataLoader {
    constructor() {
        this.db = Database.getInstance().getDB();
    }

    async loadData() {
        const dbInstance = Database.getInstance();
        dbInstance.createTables();

        await this.loadDevices();
        await this.loadDeviceSavings();
    }

    async loadDevices() {
        const row = await this.getRow("SELECT COUNT(*) as count FROM devices");
        if (row.count > 0) {
            console.log('Devices already loaded');
            return;
        }

        console.log('Loading devices...');
        const insertPromises = [];

        const stream = fs.createReadStream('data/devices.csv').pipe(csv());
        for await (const r of stream) {
            insertPromises.push(this.run(
                'INSERT INTO devices (id, name, timezone) VALUES (?, ?, ?)',
                [r.id, r.name, r.timezone]
            ));
        }

        await Promise.all(insertPromises);
        console.log(`Loaded ${insertPromises.length} devices`);
    }

    async loadDeviceSavings() {
        const row = await this.getRow("SELECT COUNT(*) as count FROM device_savings");
        if (row.count > 0) {
            console.log('Device savings already loaded');
            return;
        }

        console.log('Loading device savings...');
        const batchSize = 1000;
        let batch = [];
        let completed = 0;

        await this.run('BEGIN TRANSACTION');

        const processBatch = async (b) => {
            for (const r of b) {
                await this.run(
                    'INSERT INTO device_savings (device_id, timestamp, device_timestamp, carbon_saved, fuel_saved) VALUES (?, ?, ?, ?, ?)',
                    [r.device_id, r.timestamp, r.device_timestamp, r.carbon_saved, r.fueld_saved]
                );
            }
            completed += b.length;
            console.log(`Processed ${completed} records`);
        };

        const stream = fs.createReadStream('data/device-saving.csv').pipe(csv());
        for await (const r of stream) {
            batch.push(r);
            if (batch.length >= batchSize) {
                await processBatch(batch);
                batch = [];
            }
        }

        if (batch.length > 0) await processBatch(batch);

        await this.run('COMMIT');
        console.log(`loaded ${completed} device savings records`);
    }

    getRow(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => err ? reject(err) : resolve(row));
        });
    }

    run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, (err) => err ? reject(err) : resolve());
        });
    }
}

module.exports = new DataLoader();
