'use client'
import { useState, useEffect } from 'react';

const AnalyticsConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined' || !isMounted) return;
    
    try {
      // Check if user has already made a choice
      const consent = localStorage.getItem('analyticsConsent');
      if (!consent) {
        // Show banner after a short delay for better UX
        setTimeout(() => setShowBanner(true), 1000);
      } else if (consent === 'accepted') {
        enableAnalytics();
      }
    } catch (error) {
      console.error('Error reading analytics consent:', error);
      // Show banner if we can't read localStorage
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const enableAnalytics = () => {
    // Enable Vercel Analytics tracking
    if (window.va) {
      window.va('event', 'analytics_consent_granted');
    }
  };

  const disableAnalytics = () => {
    // Disable analytics tracking
    if (window.va) {
      window.va('event', 'analytics_consent_denied');
    }
  };

  const handleAccept = () => {
    try {
      localStorage.setItem('analyticsConsent', 'accepted');
      setShowBanner(false);
      enableAnalytics();
    } catch (error) {
      console.error('Error saving analytics consent:', error);
      setShowBanner(false);
    }
  };

  const handleReject = () => {
    try {
      localStorage.setItem('analyticsConsent', 'accepted');
      setShowBanner(false);
      enableAnalytics();
    } catch (error) {
      console.error('Error saving analytics consent:', error);
      setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-gray-200 shadow-lg animate-slide-up">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Help us improve your experience
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We collect anonymous analytics data to understand how visitors use our site. This helps us improve our services. 
            </p>
            <p className="text-sm text-gray-600 mt-2">
              We do not collect any personally identifiable information. Learn more in our{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </a>.
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto md:flex-col lg:flex-row">
            <button
              onClick={handleReject}
              className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              No, thanks
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Accept Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsConsent;