'use client';

import React, { useState } from 'react';

interface QuoteWriterProps {
  onQuoteSaved?: () => void;
}

const QuoteWriter: React.FC<QuoteWriterProps> = ({ onQuoteSaved }) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('motivation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'motivation', label: 'Motivation', color: 'bg-blue-500' },
    { value: 'happiness', label: 'Happiness', color: 'bg-green-500' },
    { value: 'mindfulness', label: 'Mindfulness', color: 'bg-purple-500' },
    { value: 'gratitude', label: 'Gratitude', color: 'bg-orange-500' },
    { value: 'general', label: 'General', color: 'bg-gray-500' },
    { value: 'anxiety', label: 'Anxiety', color: 'bg-yellow-500' },
    { value: 'depression', label: 'Depression', color: 'bg-red-500' },
    { value: 'stress', label: 'Stress', color: 'bg-pink-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quote.trim()) {
      setMessage('Please write a quote');
      return;
    }

    if (!author.trim()) {
      setMessage('Please add an author name');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(process.env.NODE_ENV === 'production' ? '/api/quotes/add' : 'http://localhost:5000/api/quotes/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: quote.trim(),
          author: author.trim(),
          category: category
        })
      });

      if (response.ok) {
        setMessage('Quote saved successfully! ✨');
        setQuote('');
        setAuthor('');
        setCategory('motivation');
        onQuoteSaved?.();
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to save quote');
      }
    } catch (error) {
      console.error('Error saving quote:', error);
      setMessage('Failed to save quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (catValue: string) => {
    const category = categories.find(cat => cat.value === catValue);
    return category?.color || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Write Your Own Quote</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quote Text */}
        <div>
          <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-2">
            Your Quote *
          </label>
          <textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Write your inspirational quote here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
            rows={4}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {quote.length}/500 characters
            </span>
            {quote.length > 400 && (
              <span className="text-xs text-orange-500">
                Getting close to limit!
              </span>
            )}
          </div>
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name or pen name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            maxLength={100}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <label
                key={cat.value}
                className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  category === cat.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={category === cat.value}
                  onChange={(e) => setCategory(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 ${cat.color} rounded-full flex items-center justify-center`}>
                  {category === cat.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !quote.trim() || !author.trim()}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            isSubmitting || !quote.trim() || !author.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </div>
          ) : (
            'Save Quote ✨'
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">💡 Writing Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Keep it concise and impactful</li>
          <li>• Write from personal experience</li>
          <li>• Focus on positive, uplifting messages</li>
          <li>• Be authentic and genuine</li>
        </ul>
      </div>
    </div>
  );
};

export default QuoteWriter; 