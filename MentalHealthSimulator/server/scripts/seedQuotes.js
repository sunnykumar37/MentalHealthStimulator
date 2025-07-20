const mongoose = require('mongoose');
const Quote = require('../models/Quote');
const path = require('path');
const fs = require('fs');

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
const connectDB = require('../config/database');
connectDB();

const defaultQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation"
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "mindfulness"
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "happiness"
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "mindfulness"
  },
  {
    text: "Life is 10% what happens to you and 90% how you react to it.",
    author: "Charles R. Swindoll",
    category: "general"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "motivation"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation"
  },
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "motivation"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "motivation"
  },
  {
    text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    author: "Zig Ziglar",
    category: "motivation"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    category: "motivation"
  },
  {
    text: "Love yourself first and everything else falls into line.",
    author: "Lucille Ball",
    category: "happiness"
  },
  {
    text: "The greatest gift of life is friendship, and I have received it.",
    author: "Hubert H. Humphrey",
    category: "gratitude"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "general"
  },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
    category: "motivation"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "motivation"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "motivation"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "motivation"
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "motivation"
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    category: "motivation"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "motivation"
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "motivation"
  },
  {
    text: "The best revenge is massive success.",
    author: "Frank Sinatra",
    category: "motivation"
  },
  {
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    category: "motivation"
  },
  {
    text: "The only way to achieve the impossible is to believe it is possible.",
    author: "Charles Kingsleigh",
    category: "motivation"
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "general"
  },
  {
    text: "The greatest wealth is to live content with little.",
    author: "Plato",
    category: "mindfulness"
  },
  {
    text: "Happiness is when what you think, what you say, and what you do are in harmony.",
    author: "Mahatma Gandhi",
    category: "happiness"
  }
];

const seedQuotes = async () => {
  try {
    console.log('🌱 Starting to seed quotes...');

    // Clear existing quotes
    await Quote.deleteMany({});
    console.log('🗑️  Cleared existing quotes');

    // Insert default quotes
    const quotes = defaultQuotes.map(quote => ({
      ...quote,
      isCustom: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await Quote.insertMany(quotes);
    console.log(`✅ Successfully seeded ${quotes.length} quotes`);

    // Display some statistics
    const totalQuotes = await Quote.countDocuments();
    const customQuotes = await Quote.countDocuments({ isCustom: true });
    const defaultQuotesCount = await Quote.countDocuments({ isCustom: false });

    console.log('\n📊 Quote Statistics:');
    console.log(`Total quotes: ${totalQuotes}`);
    console.log(`Default quotes: ${defaultQuotesCount}`);
    console.log(`Custom quotes: ${customQuotes}`);

    // Show quotes by category
    const categories = await Quote.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📂 Quotes by Category:');
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} quotes`);
    });

    console.log('\n🎉 Quote seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding quotes:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedQuotes(); 