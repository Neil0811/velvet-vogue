// server.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3000;

// Use JSON parser middleware
app.use(express.json());

// Content Security Policy (CSP)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "https://code.jquery.com",
      "https://cdn.jsdelivr.net",
      "https://stackpath.bootstrapcdn.com"
    ],
    styleSrc: [
      "'self'",
      "https://stackpath.bootstrapcdn.com",
      "https://maxcdn.bootstrapcdn.com"
    ],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
}));

// PostgreSQL connection
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your environment
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints

// Sign Up
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.json({ success: false, message: "Email already registered." });
    }
    await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, password]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
    if (result.rows.length === 1) {
      res.json({ success: true, name: result.rows[0].name });
    } else {
      res.json({ success: false, message: "Invalid credentials." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Inquiry
app.post("/send-inquiry", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await pool.query("INSERT INTO inquiries (name, email, message) VALUES ($1, $2, $3)", [name, email, message]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fallback: for SPA-style routing, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
