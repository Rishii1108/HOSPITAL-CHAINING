const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {     
  const authHeader = req.headers['authorization'];    //extracting the auth headers
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });     // extract the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);   // verify the token using JWT secret
    const user = await User.findById(decoded.userId);            // find the user in the database
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user; // If everything is valid, attaches the user object to req.user.
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });    // handle any errors during verification
  }
}

module.exports = { auth };