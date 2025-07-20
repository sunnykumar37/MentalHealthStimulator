'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Quote {
  _id: string;
  text: string;
  author: string;
  category: string;
  isCustom?: boolean;
}

interface QuoteContextType {
  dailyQuote: Quote | null;
  loading: boolean;
  error: string;
  fetchDailyQuote: () => Promise<void>;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const useQuoteContext = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuoteContext must be used within a QuoteProvider');
  }
  return context;
};

interface QuoteProviderProps {
  children: ReactNode;
}

export const QuoteProvider: React.FC<QuoteProviderProps> = ({ children }) => {
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDailyQuote = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(process.env.NODE_ENV === 'production' ? '/api/quotes/random' : 'http://localhost:5000/api/quotes/random');
      if (!response.ok) {
        throw new Error('Failed to fetch daily quote');
      }
      const data = await response.json();
      setDailyQuote(data);
    } catch (err) {
      setError('Failed to fetch daily quote');
      console.error('Daily quote fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyQuote();
  }, []);

  return (
    <QuoteContext.Provider value={{ dailyQuote, loading, error, fetchDailyQuote }}>
      {children}
    </QuoteContext.Provider>
  );
}; 