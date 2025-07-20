'use client';

import React, { useState, useEffect } from 'react';
import { useQuoteContext } from '../../contexts/QuoteContext';

interface Quote {
  _id: string;
  text: string;
  author: string;
  category: 'motivation' | 'peace' | 'strength' | 'growth';
  isCustom: boolean;
  userId?: string;
}

const QuoteBrowser: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { dailyQuote, fetchDailyQuote } = useQuoteContext();

  const categories = [
    { id: 'all', name: 'All', color: 'from-blue-500 to-purple-600' },
    { id: 'motivation', name: 'Motivation', color: 'from-blue-400 to-blue-600' },
    { id: 'mindfulness', name: 'Mindfulness', color: 'from-green-400 to-green-600' },
    { id: 'happiness', name: 'Happiness', color: 'from-yellow-400 to-yellow-600' },
    { id: 'gratitude', name: 'Gratitude', color: 'from-purple-400 to-purple-600' },
    { id: 'general', name: 'General', color: 'from-gray-400 to-gray-600' }
  ];

  const fetchQuotes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(process.env.NODE_ENV === 'production' ? '/api/quotes' : 'http://localhost:5000/api/quotes');
      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }
      const data = await response.json();
      // Filter out any invalid quotes and ensure all required fields exist
      const validQuotes = (data.quotes || []).filter(quote => 
        quote && 
        quote._id && 
        quote.text && 
        quote.author && 
        typeof quote.text === 'string' && 
        typeof quote.author === 'string'
      );
      setQuotes(validQuotes);
    } catch (err) {
      setError('Failed to load quotes');
      console.error('Quote fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (quoteId: string) => {
    setFavorites(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };



  useEffect(() => {
    fetchQuotes();
  }, []);

  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading inspirational quotes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchQuotes}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                : 'bg-white text-gray-600 hover:text-gray-800 shadow-md hover:shadow-lg'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Daily Inspiration Quote */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Inspiration</h3>
          {dailyQuote ? (
            <div className="space-y-4">
              <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                "{dailyQuote.text}"
              </blockquote>
              <p className="text-sm text-gray-500 font-medium">
                — {dailyQuote.author}
              </p>
                             <button
                 onClick={fetchDailyQuote}
                 className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
               >
                 New Quote
               </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
                             <button
                 onClick={fetchDailyQuote}
                 className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
               >
                 Load Quote
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Quotes Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No quotes found for this category</p>
          <button
            onClick={getRandomQuote}
            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Get a Random Quote
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.filter(quote => quote && quote._id && quote.text && quote.author).map((quote) => (
            <div
              key={quote._id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  quote.category === 'motivation' ? 'bg-blue-100 text-blue-700' :
                  quote.category === 'mindfulness' ? 'bg-green-100 text-green-700' :
                  quote.category === 'happiness' ? 'bg-yellow-100 text-yellow-700' :
                  quote.category === 'gratitude' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {(quote.category || 'general').charAt(0).toUpperCase() + (quote.category || 'general').slice(1)}
                </div>
                <button
                  onClick={() => toggleFavorite(quote._id)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    favorites.includes(quote._id)
                      ? 'text-red-500 bg-red-50 hover:bg-red-100'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill={favorites.includes(quote._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <blockquote className="text-gray-700 italic mb-4 text-lg leading-relaxed">
                "{quote.text || 'Quote text not available'}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">
                  — {quote.author || 'Unknown Author'}
                </p>
                {quote.isCustom && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Custom
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Favorites Summary */}
      {favorites.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Your Favorites</h3>
                <p className="text-gray-600">{favorites.length} quote{favorites.length !== 1 ? 's' : ''} saved</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteBrowser; 