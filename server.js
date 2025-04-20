// server.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Supabase Admin SDK for auth
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase with service role key (admin)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- Security Middleware ---
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net", "https://stackpath.bootstrapcdn.com"],
      styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com", "https://maxcdn.bootstrapcdn.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", process.env.SUPABASE_URL],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  })
);

// Parse JSON bodies
app.use(express.json());
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- API Endpoints ---

// SIGN UP via Supabase Auth Admin
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: name },
      email_confirm: false
    });
    if (error) throw error;
    return res.json({ success: true, message: 'User created; please verify your email.' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
});

// LOGIN via Supabase Auth
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return res.json({ success: true, session: data.session, user: data.user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(401).json({ success: false, message: err.message });
  }
});

// CONTACT / INQUIRY
app.post('/send-inquiry', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    // Persist inquiry (e.g., to Supabase table or other DB)
    // Optional: await supabase.from('inquiries').insert([{ name, email, message }]);

    // Send notification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Inquiry',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });
    return res.json({ success: true, message: 'Inquiry submitted.' });
  } catch (err) {
    console.error('Inquiry error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Fallback for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
