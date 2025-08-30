'use client'
import { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function Custom404() {
  const [mounted, setMounted] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Trigger glitch effect periodically
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home page
      window.location.href = '/';
    }
  };

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className={`absolute w-2 h-2 rounded-full opacity-20 animate-pulse`}
      style={{
        backgroundColor: i % 3 === 0 ? '#685EFC' : i % 3 === 1 ? '#12895E' : '#685EFC',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${i * 0.5}s`,
        animationDuration: `${2 + Math.random() * 2}s`
      }}
    />
  ));

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
         style={{ backgroundColor: '#fffff' }}>
      
      {/* Floating background elements */}
      {floatingElements}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
      
      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        
        {/* 404 Number with glitch effect */}
        <div className="relative mb-8">
          <h1 
            className={`text-8xl md:text-9xl font-bold transition-all duration-200 ${
              glitchActive ? 'transform translate-x-1 text-red-500' : ''
            }`}
            style={{ 
              color: glitchActive ? '#ff0000' : '#685EFC',
              textShadow: glitchActive 
                ? '2px 0 #12895E, -2px 0 #685EFC' 
                : '0 0 30px rgba(104, 94, 252, 0.5)'
            }}
          >
            404
          </h1>
          
          {/* Glitch overlay */}
          {glitchActive && (
            <h1 
              className="absolute top-0 left-0 text-8xl md:text-9xl font-bold transform -translate-x-1"
              style={{ color: '#12895E' }}
            >
              404
            </h1>
          )}
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-400">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={handleGoBack}
            className="group flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{ 
              backgroundColor: '#685EFC',
              boxShadow: '0 4px 20px rgba(104, 94, 252, 0.3)'
            }}
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-white">Go Back</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 text-black hover:text-white"
            style={{ 
              borderColor: '#12895E',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#12895E';
              e.target.style.boxShadow = '0 4px 20px rgba(18, 137, 94, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>Home Page</span>
          </button>
        </div>

        {/* Search suggestion */}
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Search className="w-4 h-4" />
          <span className="text-sm">
            Try searching for what you need, or contact support if the problem persists
          </span>
        </div>
      </div>

      {/* Animated background shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-10 animate-bounce"
           style={{ 
             backgroundColor: '#685EFC',
             animationDelay: '0s',
             animationDuration: '3s'
           }} 
      />
      
      <div className="absolute bottom-20 right-16 w-16 h-16 rounded-full opacity-10 animate-bounce"
           style={{ 
             backgroundColor: '#12895E',
             animationDelay: '1s',
             animationDuration: '4s'
           }} 
      />
      
      <div className="absolute top-1/2 left-16 w-12 h-12 rotate-45 opacity-10 animate-spin"
           style={{ 
             backgroundColor: '#685EFC',
             animationDuration: '8s'
           }} 
      />
    </div>
  );
}