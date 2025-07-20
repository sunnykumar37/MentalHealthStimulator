'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: '😊', title: 'Mood Tracking', desc: 'Log your daily moods and track patterns over time' },
    { icon: '🫁', title: 'Breathing Exercises', desc: 'Practice guided breathing techniques to reduce stress' },
    { icon: '💭', title: 'Daily Inspiration', desc: 'Get motivational quotes and mindfulness tips' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className={`relative bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-100 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                🧠 Mental Health Simulator
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link 
                href="/login" 
                className="relative text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 group"
              >
                <span className="relative z-10">Login</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/register" 
                className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 transform group overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`text-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Take Control of Your
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse"> Mental Health</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in animation-delay-500">
            Track your mood, practice breathing exercises, and discover daily inspiration 
            with our comprehensive mental health simulator.
          </p>
          
          <div className="flex justify-center space-x-6 mb-16 animate-fade-in animation-delay-700">
            <Link 
              href="/register" 
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 transform relative overflow-hidden"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="/login" 
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 hover:scale-105 transform"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Animated Features */}
        <div className={`grid md:grid-cols-3 gap-8 mt-20 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 transform cursor-pointer ${
                currentFeature === index ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
              onClick={() => setCurrentFeature(index)}
            >
              <div className="text-4xl mb-4 animate-bounce">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Improve Your Mental Health?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of users who are taking control of their mental well-being.
          </p>
          <Link 
            href="/register" 
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full text-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-110 transform animate-pulse"
          >
            Create Your Account
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative bg-white/80 backdrop-blur-sm mt-20 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Mental Health Simulator. Built with care for your well-being.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
}
