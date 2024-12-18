const express = require('express');
const router = express.Router(); // Use router here
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for JWT (from environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'giantmountain';

// Route to get profile data
router.get('/profile', (req, res) => {
    const userId = req.query.userId; // Assume userId is passed as a query param
    
    const query = 'SELECT name, email, role FROM users WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching profile data' });
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

// Route to update profile data
router.put('/profile', (req, res) => {
    const { userId, name, email, role } = req.body;
    
    const query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    db.query(query, [name, email, role, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating profile data' });
        }
        res.json({ message: 'Profile updated successfully' });
    });
});

// Signup Route
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)';
    db.query(query, [username, email, hashedPassword, 0], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Error inserting user', error: err.message });
        } else {
            console.log('User inserted successfully:', result);
            res.status(200).json({ message: 'User created successfully' });
        }
    });
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?'; // Fixed: Query the 'users' table
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare the hashed password with the entered password
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords.', error: err });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            // Check if the user is an admin
            const isAdmin = results[0].isAdmin;
            if (!isAdmin) {
                return res.status(403).json({ message: 'Only admins are allowed to access this area.' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: results[0].id, email: results[0].email, isAdmin }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({
                message: 'Login successful',
                token: token,
                user: { id: results[0].id, username: results[0].username, email: results[0].email, isAdmin }
            });
        });
    });
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
}

// Dashboard route (protected)
router.get('/dashboard', authenticateToken, (req, res) => {
    const user = req.user;

    if (!user.isAdmin) {
        return res.status(403).json({ message: 'Only admins are allowed.' });
    }

    const query = 'SELECT * FROM students'; // Example: Fetch all students
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'An error occurred while fetching data.', error: err.message });
        }

        res.status(200).json({ user, students: results });
    });
});

module.exports = router; // Export the router object
