const express = require('express');
const Mood = require('../models/Mood');
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

// Log a new mood
router.post('/log', async (req, res) => {
  try {
    console.log('=== MOOD LOG REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('=======================');
    
    const { mood } = req.body;

    if (!mood) {
      console.log('❌ Mood is missing from request body');
      return res.status(400).json({ 
        error: 'Mood is required' 
      });
    }

    const validMoods = ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'tired', 'stressed'];
    if (!validMoods.includes(mood.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid mood. Valid moods: ' + validMoods.join(', ') 
      });
    }

    // Get user from token
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    // Create new mood entry
    const moodEntry = new Mood({
      user: user._id,
      mood: mood.toLowerCase(),
      intensity: 5 // Default intensity
    });

    await moodEntry.save();

    console.log('✅ Mood logged successfully:', mood, 'for user:', user.email);

    res.status(201).json({
      message: 'Mood logged successfully',
      mood: mood.toLowerCase(),
      timestamp: moodEntry.createdAt
    });

  } catch (error) {
    console.error('❌ Mood logging error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get mood history
router.get('/history', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get user from token
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    // Get moods from MongoDB
    const moods = await Mood.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const moodHistory = moods.map(mood => ({
      mood: mood.mood,
      timestamp: mood.createdAt
    }));

    res.json({
      moods: moodHistory,
      total: moodHistory.length,
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('❌ Mood history error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get mood statistics
router.get('/stats', async (req, res) => {
  try {
    const moods = await readMoodHistory();
    
    // Count mood frequencies
    const moodCounts = {};
    moods.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    // Calculate most common mood
    let mostCommonMood = null;
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonMood = mood;
      }
    });

    res.json({
      totalEntries: moods.length,
      moodCounts: moodCounts,
      mostCommonMood: mostCommonMood,
      averageMoodsPerDay: moods.length > 0 ? 
        Math.round((moodCounts[mostCommonMood] / moods.length) * 100) : 0
    });

  } catch (error) {
    console.error('Mood stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get current mood (most recent)
router.get('/current', async (req, res) => {
  try {
    const moods = await readMoodHistory();
    
    if (moods.length === 0) {
      return res.status(404).json({ 
        error: 'No mood data available' 
      });
    }

    const currentMood = moods[moods.length - 1];
    res.json({
      mood: currentMood.mood,
      timestamp: currentMood.timestamp
    });

  } catch (error) {
    console.error('Current mood error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router; 