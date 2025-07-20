const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['breathing', 'meditation', 'mindfulness', 'body-scan', 'gratitude', 'visualization'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number, // in seconds
    required: true,
    min: 30,
    max: 3600 // 1 hour max
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  moodBefore: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'tired', 'stressed', 'neutral']
  },
  moodAfter: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'tired', 'stressed', 'neutral']
  },
  intensityBefore: {
    type: Number,
    min: 1,
    max: 10
  },
  intensityAfter: {
    type: Number,
    min: 1,
    max: 10
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  sessionData: {
    breathingPattern: String,
    cycles: Number,
    steps: [{
      action: String,
      duration: Number,
      instruction: String
    }]
  }
}, {
  timestamps: true
});

// Index for efficient queries
exerciseSchema.index({ user: 1, createdAt: -1 });
exerciseSchema.index({ type: 1, completed: 1 });
exerciseSchema.index({ completedAt: -1 });

// Method to complete exercise
exerciseSchema.methods.complete = function(moodAfter, intensityAfter, notes, rating) {
  this.completed = true;
  this.completedAt = new Date();
  this.moodAfter = moodAfter;
  this.intensityAfter = intensityAfter;
  if (notes) this.notes = notes;
  if (rating) this.rating = rating;
  return this.save();
};

// Method to get exercise statistics
exerciseSchema.statics.getStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$type',
        totalSessions: { $sum: 1 },
        completedSessions: { $sum: { $cond: ['$completed', 1, 0] } },
        totalDuration: { $sum: '$duration' },
        avgRating: { $avg: '$rating' },
        avgMoodImprovement: {
          $avg: {
            $subtract: ['$intensityAfter', '$intensityBefore']
          }
        }
      }
    },
    { $sort: { totalSessions: -1 } }
  ]);

  return stats;
};

// Method to get exercise history
exerciseSchema.statics.getHistory = async function(userId, limit = 20) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'email');
};

// Method to get favorite exercises
exerciseSchema.statics.getFavorites = async function(userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), completed: true } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        avgDuration: { $avg: '$duration' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
};

module.exports = mongoose.model('Exercise', exerciseSchema); 