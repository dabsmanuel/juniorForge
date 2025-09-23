'use client'

import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-300 border-top-4 border-t-[#685EFC] rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-[#685EFC] rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{message}</h2>
          <p className="text-sm text-gray-500">Please wait while we load your dashboard...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;