// server.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Content Security Policy
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

// Serve everything in /public
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html (if you want SPA‑style routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`));
