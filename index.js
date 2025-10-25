const express = require('express');
const savingsRoutes = require('./src/routes/savings');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Load routes
app.use('/api', savingsRoutes);


// Start server
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
});