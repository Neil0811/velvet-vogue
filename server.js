const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable Content Security Policy (CSP) headers with updated sources
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"], // Default source is self
    scriptSrc: [
      "'self'", // Allow scripts from the same origin
      "'unsafe-inline'", // Allow inline scripts (if absolutely necessary)
      "'unsafe-eval'", // Allow eval() if absolutely necessary
      "https://code.jquery.com", // Allow jQuery CDN
      "https://cdn.jsdelivr.net", // Allow jsDelivr CDN for Popper.js
      "https://stackpath.bootstrapcdn.com" // Allow Bootstrap CDN
    ],
    styleSrc: [
      "'self'", 
      "https://stackpath.bootstrapcdn.com", 
      "https://maxcdn.bootstrapcdn.com"
    ],
    imgSrc: ["'self'", "data:", "https://velvet-vogue-1.onrender.com"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  }
}));

// Set up PostgreSQL connection pool.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Sample API endpoint: Get all products from the database
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Fallback route to serve index.html for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
