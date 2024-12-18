const jwt = require('jsonwebtoken');

// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the "Authorization" header

  if (!token) {
    return res.status(401).json({ message: 'Access Token Required' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });
    }

    req.user = user; // Attach the decoded user info to the request
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
