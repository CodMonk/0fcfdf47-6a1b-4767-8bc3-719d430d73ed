
const dataLoader = require('./src/db/dataLoader');
const database = require('./src/db/database');

// Initialize data
async function initializeData() {
    try {
        console.log('Data initialization started');
        await dataLoader.loadData();
        console.log('Data initialization completed');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

initializeData();