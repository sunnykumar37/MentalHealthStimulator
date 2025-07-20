# Mental Health API Server

A REST API server for the Mental Health Simulator application, providing endpoints for authentication, mood tracking, quotes, and exercises.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Mood Tracking**: Log and retrieve mood data with statistics
- **Quotes**: Motivational quotes with random and daily selections
- **Exercises**: Breathing exercises and calming activities
- **File-based Storage**: Uses the existing C++ engine's data files

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **MongoDB Setup**
   - Using MongoDB Atlas cloud database
   - The API will connect to your Atlas cluster: `mental-health-simulator` database

3. **Environment Variables**
   The server uses `config.env` file for configuration:
   ```
   PORT=5000
   JWT_SECRET=mental-health-super-secret-key-change-in-production
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mental-health-simulator
   ```
   
   You can modify these values in the `config.env` file as needed.

4. **Seed Database**
   ```bash
   npm run seed
   ```
   This will migrate existing data from the C++ engine files and add additional quotes.

3. **Start the Server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Mood Tracking
- `POST /api/mood/log` - Log a new mood
- `GET /api/mood/history` - Get mood history
- `GET /api/mood/stats` - Get mood statistics
- `GET /api/mood/current` - Get current mood

### Quotes
- `GET /api/quotes/random` - Get a random quote
- `GET /api/quotes/all` - Get all quotes
- `GET /api/quotes/daily` - Get quote of the day
- `GET /api/quotes/:index` - Get specific quote by index
- `POST /api/quotes/add` - Add a new quote

### Exercises
- `GET /api/exercises/breathing` - Get all breathing patterns
- `GET /api/exercises/breathing/:pattern` - Get specific breathing pattern
- `POST /api/exercises/breathing/:pattern/start` - Start breathing exercise
- `GET /api/exercises/calming` - Get all calming exercises
- `GET /api/exercises/calming/:id` - Get specific calming exercise
- `POST /api/exercises/calming/:id/start` - Start calming exercise
- `GET /api/exercises/recommendations` - Get exercise recommendations based on mood

### Health Check
- `GET /api/health` - Server health status

## Data Storage

The API uses the existing C++ engine's data files:
- `cpp_engine/users.txt` - User credentials
- `cpp_engine/moods.txt` - Mood history
- `cpp_engine/quotes.txt` - Motivational quotes

## Example Usage

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Log a Mood
```bash
curl -X POST http://localhost:5000/api/mood/log \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"mood": "happy"}'
```

### Get a Random Quote
```bash
curl http://localhost:5000/api/quotes/random
```

### Start a Breathing Exercise
```bash
curl -X POST http://localhost:5000/api/exercises/breathing/4-7-8/start \
  -H "Content-Type: application/json" \
  -d '{"cycles": 5}'
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

Error responses include an `error` field with a descriptive message.

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS enabled for frontend integration
- Input validation on all endpoints

## Development

- Uses nodemon for auto-restart during development
- Comprehensive error handling
- Detailed logging for debugging
- Modular route structure 