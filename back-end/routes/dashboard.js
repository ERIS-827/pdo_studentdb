const express = require('express');
const router = express.Router(); // Use router here

// Example route for dashboard
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Dashboard' });
});

module.exports = router; // Export the router object
