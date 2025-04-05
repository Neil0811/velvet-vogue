// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
console.log('🔍 Render PORT environment:', process.env.PORT);


// PostgreSQL connection using the DATABASE_URL from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('pong');
  });
  

// Sample API endpoint to get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Route for the home page (important for Render)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Fallback route for other frontend routes (e.g., SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
