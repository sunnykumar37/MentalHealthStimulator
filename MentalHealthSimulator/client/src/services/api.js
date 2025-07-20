const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Create a clean config object
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Handle body for POST/PUT requests
  if (options.body && (config.method === 'POST' || config.method === 'PUT')) {
    config.body = JSON.stringify(options.body);
  }

  console.log('API Request Details:', { 
    url, 
    method: config.method,
    headers: config.headers,
    body: config.body 
  });

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log('API Response:', { status: response.status, data });
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: { email, password },
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  getProfile: async (token) => {
    return apiRequest('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Mood API
export const moodAPI = {
  logMood: async (mood, token) => {
    console.log('Sending mood request:', { mood, token });
    return apiRequest('/mood/log', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { mood },
    });
  },

  getHistory: async (token, limit = 10) => {
    return apiRequest(`/mood/history?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getStats: async (token) => {
    return apiRequest('/mood/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getCurrent: async (token) => {
    return apiRequest('/mood/current', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Quotes API
export const quotesAPI = {
  getRandom: async () => {
    return apiRequest('/quotes/random');
  },

  getAll: async () => {
    return apiRequest('/quotes');
  },

  getDaily: async () => {
    return apiRequest('/quotes/daily');
  },

  getByIndex: async (index) => {
    return apiRequest(`/quotes/${index}`);
  },
};

// Exercises API
export const exercisesAPI = {
  getBreathingPatterns: async () => {
    return apiRequest('/exercises/breathing');
  },

  getBreathingPattern: async (pattern) => {
    return apiRequest(`/exercises/breathing/${pattern}`);
  },

  startBreathingExercise: async (pattern, cycles) => {
    return apiRequest(`/exercises/breathing/${pattern}/start`, {
      method: 'POST',
      body: { cycles },
    });
  },

  getCalmingExercises: async () => {
    return apiRequest('/exercises/calming');
  },

  getCalmingExercise: async (id) => {
    return apiRequest(`/exercises/calming/${id}`);
  },

  startCalmingExercise: async (id) => {
    return apiRequest(`/exercises/calming/${id}/start`, {
      method: 'POST',
      body: {},
    });
  },

  getRecommendations: async (mood) => {
    return apiRequest(`/exercises/recommendations?mood=${mood}`);
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
}; 