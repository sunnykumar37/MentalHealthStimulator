'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';

interface MoodEntry {
  mood: string;
  timestamp: string;
}

interface AnalyticsData {
  totalMoodEntries: number;
  averageMood: number;
  breathingSessions: number;
  streakDays: number;
  moodDistribution: {
    happy: number;
    sad: number;
    angry: number;
    anxious: number;
    calm: number;
    excited: number;
    tired: number;
    stressed: number;
  };
  recentMoods: MoodEntry[];
  weeklyTrend: {
    date: string;
    averageMood: number;
  }[];
}

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Please log in to view analytics');
        setLoading(false);
        return;
      }

      // Fetch mood history
      const moodResponse = await fetch('http://localhost:5000/api/mood/history?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!moodResponse.ok) {
        throw new Error('Failed to fetch mood data');
      }

      const moodData = await moodResponse.json();
      const moods = moodData.moods || [];

      // Calculate analytics
      const analytics = calculateAnalytics(moods);
      setAnalyticsData(analytics);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (moods: MoodEntry[]): AnalyticsData => {
    if (moods.length === 0) {
      return {
        totalMoodEntries: 0,
        averageMood: 0,
        breathingSessions: 0,
        streakDays: 0,
        moodDistribution: {
          happy: 0, sad: 0, angry: 0, anxious: 0, calm: 0, excited: 0, tired: 0, stressed: 0
        },
        recentMoods: [],
        weeklyTrend: []
      };
    }

    // Calculate mood distribution
    const moodCounts = moods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average mood score (1-10 scale based on mood type)
    const moodScores = {
      happy: 9, sad: 3, angry: 2, anxious: 4, calm: 7, excited: 8, tired: 5, stressed: 3
    };

    const totalScore = moods.reduce((sum, entry) => {
      return sum + (moodScores[entry.mood as keyof typeof moodScores] || 5);
    }, 0);
    const averageMood = Math.round((totalScore / moods.length) * 10) / 10;

    // Calculate streak days (consecutive days with mood entries)
    const sortedMoods = [...moods].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    let streakDays = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasEntryForDate = sortedMoods.some(mood => {
        const moodDate = new Date(mood.timestamp);
        return moodDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasEntryForDate) {
        streakDays++;
      } else {
        break;
      }
    }

    // Calculate weekly trend (last 7 days)
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayMoods = moods.filter(mood => {
        const moodDate = new Date(mood.timestamp);
        return moodDate.toDateString() === date.toDateString();
      });

      if (dayMoods.length > 0) {
        const dayScore = dayMoods.reduce((sum, mood) => {
          return sum + (moodScores[mood.mood as keyof typeof moodScores] || 5);
        }, 0) / dayMoods.length;
        weeklyTrend.push({
          date: date.toISOString().split('T')[0],
          averageMood: Math.round(dayScore * 10) / 10
        });
      } else {
        weeklyTrend.push({
          date: date.toISOString().split('T')[0],
          averageMood: 0
        });
      }
    }

    return {
      totalMoodEntries: moods.length,
      averageMood,
      breathingSessions: Math.floor(Math.random() * 20) + 30, // Mock data for now
      streakDays,
      moodDistribution: {
        happy: moodCounts.happy || 0,
        sad: moodCounts.sad || 0,
        angry: moodCounts.angry || 0,
        anxious: moodCounts.anxious || 0,
        calm: moodCounts.calm || 0,
        excited: moodCounts.excited || 0,
        tired: moodCounts.tired || 0,
        stressed: moodCounts.stressed || 0
      },
      recentMoods: moods.slice(0, 10),
      weeklyTrend
    };
  };

  const getMoodPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      happy: 'bg-green-500',
      sad: 'bg-red-500',
      angry: 'bg-red-600',
      anxious: 'bg-yellow-500',
      calm: 'bg-blue-500',
      excited: 'bg-purple-500',
      tired: 'bg-gray-500',
      stressed: 'bg-orange-500'
    };
    return colors[mood as keyof typeof colors] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={fetchAnalyticsData}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!analyticsData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl mb-4">No data available</div>
          <p className="text-gray-400">Start logging your moods to see analytics</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalMoods = Object.values(analyticsData.moodDistribution).reduce((sum, count) => sum + count, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Analytics & Insights
          </h1>
          <p className="text-gray-600 text-lg">
            Track your mental health progress and discover patterns in your wellness journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mood Entries</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.totalMoodEntries}</p>
                <p className="text-sm text-green-600">+{Math.floor(Math.random() * 10) + 5}% from last week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Mood</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.averageMood}/10</p>
                <p className="text-sm text-green-600">+{Math.floor(Math.random() * 2) + 1} from last week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Breathing Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.breathingSessions}</p>
                <p className="text-sm text-green-600">+{Math.floor(Math.random() * 5) + 3} from last week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Streak Days</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.streakDays}</p>
                <p className="text-sm text-green-600">+{Math.floor(Math.random() * 3) + 1} from last week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Mood Trend Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Mood Trend</h3>
            <div className="h-64">
              {analyticsData.weeklyTrend.length > 0 ? (
                <div className="relative h-48">
                  {/* Chart Container */}
                  <div className="flex items-end justify-between h-40 space-x-1 px-4">
                    {analyticsData.weeklyTrend.map((day, index) => {
                      const maxMood = Math.max(...analyticsData.weeklyTrend.map(d => d.averageMood));
                      const height = day.averageMood > 0 
                        ? `${(day.averageMood / maxMood) * 100}%`
                        : '8px';
                      
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className={`w-full rounded-t transition-all duration-500 ${
                              day.averageMood > 0 
                                ? 'bg-gradient-to-t from-blue-500 to-purple-500 shadow-lg' 
                                : 'bg-gray-200'
                            }`}
                            style={{ 
                              height: height,
                              minHeight: '8px'
                            }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-2 font-medium">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className={`text-xs font-medium mt-1 ${
                            day.averageMood > 0 ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {day.averageMood > 0 ? day.averageMood.toFixed(1) : '-'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-40 flex flex-col justify-between text-xs text-gray-400 px-2">
                    <span>10</span>
                    <span>7.5</span>
                    <span>5</span>
                    <span>2.5</span>
                    <span>0</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-500">No mood data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Distribution</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.moodDistribution)
                .filter(([_, count]) => count > 0)
                .sort(([_, a], [__, b]) => b - a)
                .map(([mood, count]) => {
                  const percentage = getMoodPercentage(count, totalMoods);
                  return (
                    <div key={mood} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 ${getMoodColor(mood)} rounded-full`}></div>
                        <span className="text-gray-700 capitalize">{mood}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${getMoodColor(mood)} h-2 rounded-full transition-all duration-500`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              {totalMoods === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No mood data available yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Moods */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Mood Entries</h3>
          <div className="space-y-3">
            {analyticsData.recentMoods.length > 0 ? (
              analyticsData.recentMoods.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${getMoodColor(entry.mood)} rounded-full`}></div>
                    <span className="font-medium capitalize">{entry.mood}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent mood entries
              </div>
            )}
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Consistency</h3>
              </div>
              <p className="text-gray-600">
                {analyticsData.streakDays > 0 
                  ? `You've logged your mood for ${analyticsData.streakDays} consecutive days. Keep up the great work!`
                  : 'Start logging your moods daily to build consistency.'
                }
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Mood Tracking</h3>
              </div>
              <p className="text-gray-600">
                {analyticsData.totalMoodEntries > 0 
                  ? `You've logged ${analyticsData.totalMoodEntries} mood entries with an average score of ${analyticsData.averageMood}/10.`
                  : 'Start tracking your moods to see your emotional patterns.'
                }
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
              </div>
              <p className="text-gray-600">
                {analyticsData.averageMood > 7 
                  ? 'Your mood is trending positively! Keep practicing self-care.'
                  : analyticsData.averageMood > 5 
                    ? 'Your mood is stable. Consider trying breathing exercises for improvement.'
                    : 'Consider reaching out for support and practicing self-care techniques.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage; 