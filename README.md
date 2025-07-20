# Mental Health Simulator

A comprehensive mental health application built with Next.js, React, Node.js, and MongoDB. This application provides tools for mood tracking, breathing exercises, inspirational quotes, and mental wellness management.

## 🌟 Features

### 🧠 Mental Health Tools
- **Mood Tracking**: Log and track your daily moods with visual analytics
- **Breathing Exercises**: Interactive breathing patterns for stress relief
- **Inspirational Quotes**: Browse and create custom motivational quotes
- **Analytics Dashboard**: Visual insights into your mental health journey

### 🎨 User Experience
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Sidebar Navigation**: Easy navigation between different features
- **Real-time Updates**: Live data synchronization across components
- **Mobile Responsive**: Works perfectly on all devices

### 🔐 Security & Data
- **JWT Authentication**: Secure user authentication and authorization
- **MongoDB Atlas**: Cloud-based database for reliable data storage
- **Encrypted Passwords**: Bcrypt hashing for user security
- **Protected Routes**: Secure API endpoints with token validation

## 🚀 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Context**: State management for shared data
- **Framer Motion**: Smooth animations and transitions

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing

### Database
- **MongoDB Atlas**: Cloud-hosted database
- **Mongoose**: MongoDB object modeling

## 📁 Project Structure

```
MentalHealthSimulator/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React Context providers
│   │   ├── services/      # API services
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   ├── models/            # MongoDB schemas
│   ├── config/            # Configuration files
│   ├── scripts/           # Database seeding
│   └── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/sunnykumar37/MentalHealthStimulator.git
   cd MentalHealthStimulator
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # In server directory, create config.env
   PORT=5000
   JWT_SECRET=your-secret-key
   MONGODB_URI=your-mongodb-atlas-uri
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Seed the database with initial data
   cd server
   node scripts/seedQuotes.js
   ```

5. **Start the application**
   ```bash
   # Start the server (Terminal 1)
   cd server
   npm start
   
   # Start the client (Terminal 2)
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎯 Key Features

### Mood Tracking
- Log daily moods with emoji selection
- View mood history and trends
- Analytics dashboard with insights
- Weekly mood trend visualization

### Breathing Exercises
- 4-7-8 Breathing technique
- Box Breathing pattern
- Progressive Relaxation
- Interactive timer and instructions

### Quotes System
- Browse inspirational quotes by category
- Create and save custom quotes
- Heart/favorite functionality
- Daily inspiration feature

### User Authentication
- Secure registration and login
- JWT token-based authentication
- Protected routes and API endpoints
- User-specific data management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Mood Tracking
- `POST /api/mood/log` - Log mood entry
- `GET /api/mood/history` - Get mood history
- `GET /api/mood/stats` - Get mood statistics

### Quotes
- `GET /api/quotes` - Get all quotes
- `GET /api/quotes/random` - Get random quote
- `POST /api/quotes/add` - Add custom quote

### Exercises
- `GET /api/exercises/breathing` - Get breathing patterns
- `POST /api/exercises/breathing/:pattern/start` - Start breathing exercise

## 🎨 UI Components

### Layout Components
- `DashboardLayout`: Main layout with sidebar
- `Sidebar`: Navigation component
- `QuoteDisplay`: Daily inspiration component

### Feature Components
- `MoodTracker`: Mood logging interface
- `BreathingExercise`: Interactive breathing exercises
- `QuoteBrowser`: Quote browsing and management
- `QuoteWriter`: Custom quote creation
- `Analytics`: Mood analytics dashboard

## 🔒 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Tokens**: Secure authentication without sessions
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling and logging
- **CORS**: Cross-origin resource sharing configuration

## 📊 Database Schema

### User Model
```javascript
{
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Mood Model
```javascript
{
  user: ObjectId,
  mood: String,
  timestamp: Date
}
```

### Quote Model
```javascript
{
  text: String,
  author: String,
  category: String,
  isCustom: Boolean,
  user: ObjectId
}
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
npm start
```

### Backend Deployment
```bash
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the database solution
- React team for the component library

## 📞 Support

If you have any questions or need support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for mental health awareness and wellness** 