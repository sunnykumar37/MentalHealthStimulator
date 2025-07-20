const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'tired', 'stressed', 'neutral']
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  notes: {
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true
  }],
  activities: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  weather: {
    type: String,
    trim: true
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24
  },
  exerciseMinutes: {
    type: Number,
    min: 0
  },
  socialInteraction: {
    type: String,
    enum: ['none', 'minimal', 'moderate', 'high'],
    default: 'moderate'
  }
}, {
  timestamps: true
});

// Index for efficient queries
moodSchema.index({ user: 1, createdAt: -1 });
moodSchema.index({ mood: 1, createdAt: -1 });

// Virtual for date only (without time)
moodSchema.virtual('date').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

// Method to get mood statistics
moodSchema.statics.getStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 },
        avgIntensity: { $avg: '$intensity' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return stats;
};

// Method to get mood trends
moodSchema.statics.getTrends = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const trends = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          mood: "$mood"
        },
        count: { $sum: 1 },
        avgIntensity: { $avg: '$intensity' }
      }
    },
    { $sort: { "_id.date": 1 } }
  ]);

  return trends;
};

module.exports = mongoose.model('Mood', moodSchema); 