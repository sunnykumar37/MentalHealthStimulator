const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  author: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  category: {
    type: String,
    enum: ['motivation', 'anxiety', 'depression', 'stress', 'happiness', 'gratitude', 'mindfulness', 'general'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  language: {
    type: String,
    default: 'en'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
quoteSchema.index({ category: 1, isActive: 1 });
quoteSchema.index({ tags: 1 });
quoteSchema.index({ usageCount: -1 });

// Method to get random quote
quoteSchema.statics.getRandom = async function(category = null) {
  const query = { isActive: true };
  if (category) {
    query.category = category;
  }

  const count = await this.countDocuments(query);
  const random = Math.floor(Math.random() * count);
  
  const quote = await this.findOne(query).skip(random);
  
  if (quote) {
    quote.usageCount += 1;
    quote.lastUsed = new Date();
    await quote.save();
  }
  
  return quote;
};

// Method to get quote of the day
quoteSchema.statics.getDaily = async function() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const count = await this.countDocuments({ isActive: true });
  const index = dayOfYear % count;
  
  const quote = await this.findOne({ isActive: true }).skip(index);
  
  if (quote) {
    quote.usageCount += 1;
    quote.lastUsed = new Date();
    await quote.save();
  }
  
  return quote;
};

// Method to get popular quotes
quoteSchema.statics.getPopular = async function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ usageCount: -1 })
    .limit(limit);
};

// Method to get quotes by category
quoteSchema.statics.getByCategory = async function(category, limit = 20) {
  return this.find({ category, isActive: true })
    .sort({ usageCount: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Quote', quoteSchema); 