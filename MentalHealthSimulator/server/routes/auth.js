const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'mental-health-secret-key';

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    console.log('=== REGISTER REQUEST ===');
    console.log('Request body:', req.body);
    console.log('=======================');
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Email or password missing');
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists' 
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password: password
    });

    await user.save();

    console.log('✅ User registered successfully:', email);

    res.status(201).json({ 
      message: 'User registered successfully',
      email: email
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('=====================');
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Email or password missing');
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Compare password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', email);

    res.json({
      message: 'Login successful',
      token: token,
      email: user.email
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Profile accessed successfully',
    email: req.user.email
  });
});

module.exports = router; 