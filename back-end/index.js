const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());  // For parsing JSON requests

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test DB connection
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Register route
app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;

  // Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send('Error hashing password');

    // Save user to DB
    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
      if (err) return res.status(500).send('Error saving user');
      res.status(201).send('User created successfully');
    });
  });
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Find user in DB
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).send('Invalid email or password');

    // Compare password
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err || !isMatch) return res.status(400).send('Invalid email or password');

      // Generate JWT token
      const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// Dashboard route (protected)
app.get('/api/dashboard', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send('Token is required');

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');

    // Retrieve user data from DB
    db.query('SELECT email FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err || results.length === 0) return res.status(500).send('Error retrieving user data');
      res.json({ email: results[0].email });
    });
  });
});

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
