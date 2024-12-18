const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Import auth routes
const dashboardRoute = require('./routes/dashboard'); // Import dashboard route
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON body parsing

// Register routes
app.use('/api', authRoutes); // All routes in auth.js will be prefixed with /api
app.use('/api', dashboardRoute); // Dashboard routes

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
