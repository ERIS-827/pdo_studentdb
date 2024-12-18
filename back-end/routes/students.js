// students.js
const express = require('express');
const router = express.Router();
const db = require('./config/db');

// Route to fetch student data
router.get('/students', (req, res) => {
  const query = 'SELECT id, name, email FROM students'; // Adjust to your schema
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching students.', error: err });
    }
    res.status(200).json({ students: results });
  });
});

module.exports = router;
