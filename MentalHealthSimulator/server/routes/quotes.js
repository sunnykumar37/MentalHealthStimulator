const express = require('express');
const Quote = require('../models/Quote');
const User = require('../models/User');

const router = express.Router();

// Middleware to extract user from JWT token
const getUserFromToken = async (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'mental-health-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Get random quote
router.get('/random', async (req, res) => {
  try {
    const quote = await Quote.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (quote.length === 0) {
      return res.json({
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu",
        category: "motivation"
      });
    }

    res.json(quote[0]);
  } catch (error) {
    console.error('Error fetching random quote:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get quotes by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const quotes = await Quote.find({ category: category }).limit(10);
    res.json({ quotes });
  } catch (error) {
    console.error('Error fetching quotes by category:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Add custom quote
router.post('/add', async (req, res) => {
  try {
    console.log('=== ADD QUOTE REQUEST ===');
    console.log('Request body:', req.body);
    console.log('=======================');
    
    const { text, author, category } = req.body;

    if (!text || !author) {
      return res.status(400).json({ 
        error: 'Quote text and author are required' 
      });
    }

    // Get user from token
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    // Create new quote
    const quote = new Quote({
      text: text.trim(),
      author: author.trim(),
      category: category || 'motivation',
      user: user._id,
      isCustom: true
    });

    await quote.save();

    console.log('✅ Quote saved successfully:', text.substring(0, 50) + '...');

    res.status(201).json({
      message: 'Quote saved successfully',
      quote: {
        id: quote._id,
        text: quote.text,
        author: quote.author,
        category: quote.category
      }
    });

  } catch (error) {
    console.error('❌ Add quote error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get user's custom quotes
router.get('/my-quotes', async (req, res) => {
  try {
    // Get user from token
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    const quotes = await Quote.find({ 
      user: user._id,
      isCustom: true 
    }).sort({ createdAt: -1 });

    res.json({ quotes });
  } catch (error) {
    console.error('Error fetching user quotes:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get all quotes (mixed custom and default)
router.get('/all', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 }).limit(20);
    res.json({ quotes });
  } catch (error) {
    console.error('Error fetching all quotes:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get all quotes (for browsing)
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 }).limit(50);
    res.json({ quotes });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router; 