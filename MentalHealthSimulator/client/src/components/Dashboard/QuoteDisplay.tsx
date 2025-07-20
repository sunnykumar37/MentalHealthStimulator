import React from "react";
import { useQuoteContext } from "../../contexts/QuoteContext";

const QuoteDisplay: React.FC = () => {
  const { dailyQuote, loading, error, fetchDailyQuote } = useQuoteContext();

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Inspiration</h3>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading quote...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={fetchRandomQuote}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="text-center">
          <blockquote className="text-lg text-gray-700 italic mb-4">
            "{dailyQuote?.text}"
          </blockquote>
          <p className="text-sm text-gray-500 mb-4">
            — {dailyQuote?.author}
          </p>
          <button 
            onClick={fetchDailyQuote}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            New Quote
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteDisplay; 