const mongoose = require('mongoose');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Import models
const User = require('../models/User');
const Quote = require('../models/Quote');
const Mood = require('../models/Mood');

// Load environment variables from config.env
const configPath = path.join(__dirname, '../config.env');
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf8');
  config.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Seed quotes from the existing quotes.txt file
const seedQuotes = async () => {
  try {
    const quotesPath = path.join(__dirname, '../cpp_engine/quotes.txt');
    const quotesData = await fsPromises.readFile(quotesPath, 'utf8');
    const quotes = quotesData.split('\n').filter(line => line.trim());

    const quoteDocuments = quotes.map(text => ({
      text: text.trim(),
      author: 'Unknown',
      category: 'motivation',
      tags: ['mental-health', 'motivation'],
      language: 'en',
      isActive: true
    }));

    // Clear existing quotes and insert new ones
    await Quote.deleteMany({});
    await Quote.insertMany(quoteDocuments);

    console.log(`✅ Seeded ${quoteDocuments.length} quotes`);
  } catch (error) {
    console.error('❌ Error seeding quotes:', error);
  }
};

// Migrate existing users from users.txt
const migrateUsers = async () => {
  try {
    const usersPath = path.join(__dirname, '../cpp_engine/users.txt');
    const usersData = await fsPromises.readFile(usersPath, 'utf8');
    const userLines = usersData.split('\n').filter(line => line.trim());

    for (const line of userLines) {
      const [email, password] = line.split(',');
      if (email && password) {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.trim() });
        if (!existingUser) {
          await User.create({
            email: email.trim(),
            password: password.trim() // Will be hashed by the pre-save hook
          });
          console.log(`✅ Migrated user: ${email.trim()}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error migrating users:', error);
  }
};

// Migrate existing moods from moods.txt
const migrateMoods = async () => {
  try {
    const moodsPath = path.join(__dirname, '../cpp_engine/moods.txt');
    const moodsData = await fsPromises.readFile(moodsPath, 'utf8');
    const lines = moodsData.split('\n').filter(line => line.trim());

    // Get the first user (or create a default one)
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        email: 'default@mentalhealth.com',
        password: 'default123'
      });
    }

    const moodDocuments = [];
    for (let i = 0; i < lines.length; i += 2) {
      if (lines[i] && lines[i + 1]) {
        const timestamp = new Date(lines[i]);
        const moodText = lines[i + 1].trim().replace(' - ', '');
        
        // Clean up the mood text by removing the "- " prefix
        const cleanMood = moodText.replace(/^-\s*/, '').trim();
        
        moodDocuments.push({
          user: user._id,
          mood: cleanMood,
          intensity: 5,
          createdAt: timestamp
        });
      }
    }

    if (moodDocuments.length > 0) {
      await Mood.insertMany(moodDocuments);
      console.log(`✅ Migrated ${moodDocuments.length} mood entries`);
    }
  } catch (error) {
    console.error('❌ Error migrating moods:', error);
  }
};

// Add more motivational quotes
const addMoreQuotes = async () => {
  const additionalQuotes = [
    {
      text: "Every day is a new beginning. Take a deep breath and start again.",
      author: "Anonymous",
      category: "mindfulness",
      tags: ["mindfulness", "new-beginning", "breathing"]
    },
    {
      text: "You are not a drop in the ocean. You are the entire ocean in a drop.",
      author: "Rumi",
      category: "mindfulness",
      tags: ["mindfulness", "self-worth", "perspective"]
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "motivation",
      tags: ["motivation", "passion", "work"]
    },
    {
      text: "Happiness is not something ready-made. It comes from your own actions.",
      author: "Dalai Lama",
      category: "happiness",
      tags: ["happiness", "actions", "mindfulness"]
    },
    {
      text: "What you think, you become. What you feel, you attract. What you imagine, you create.",
      author: "Buddha",
      category: "mindfulness",
      tags: ["mindfulness", "thoughts", "creation"]
    },
    {
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela",
      category: "motivation",
      tags: ["motivation", "resilience", "perseverance"]
    },
    {
      text: "Peace comes from within. Do not seek it without.",
      author: "Buddha",
      category: "mindfulness",
      tags: ["mindfulness", "peace", "inner-peace"]
    },
    {
      text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius",
      category: "stress",
      tags: ["stress", "mind-control", "strength"]
    },
    {
      text: "Gratitude turns what we have into enough.",
      author: "Anonymous",
      category: "gratitude",
      tags: ["gratitude", "contentment", "mindfulness"]
    },
    {
      text: "The mind is everything. What you think you become.",
      author: "Buddha",
      category: "mindfulness",
      tags: ["mindfulness", "thoughts", "transformation"]
    }
  ];

  try {
    for (const quoteData of additionalQuotes) {
      const existingQuote = await Quote.findOne({ text: quoteData.text });
      if (!existingQuote) {
        await Quote.create(quoteData);
        console.log(`✅ Added quote: "${quoteData.text.substring(0, 50)}..."`);
      }
    }
  } catch (error) {
    console.error('❌ Error adding additional quotes:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await seedQuotes();
    await addMoreQuotes();
    await migrateUsers();
    await migrateMoods();
    
    console.log('✅ Database seeding completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔄 Database connection closed');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 