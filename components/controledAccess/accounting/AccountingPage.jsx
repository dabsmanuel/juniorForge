'use client'
import { useState, useEffect } from 'react';
import AccountingDashboard from '../Accounting';
import { authApi } from '@/lib/util';

const AccountingPage = () => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthAndPermissions();
  }, []);

  const checkAuthAndPermissions = async () => {
    try {
      // Get token from localStorage
      const storedToken = localStorage.getItem('adminToken');
      
      if (!storedToken) {
        setError('Please login to access accounting features.');
        setLoading(false);
        return;
      }

      // Verify token and get admin data
      const result = await authApi.getCurrentAdmin(storedToken);
      const adminData = result.data || result;

      // Check if admin is approved
      if (adminData.status !== 'approved') {
        setError('Your account is not approved. Please contact administrator.');
        setLoading(false);
        return;
      }

      // Check if admin has accounting access
      if (!adminData.accountingAccess) {
        setError('You do not have permission to access accounting features. Please contact your administrator to request access.');
        setLoading(false);
        return;
      }

      // All checks passed
      setAdmin(adminData);
      setToken(storedToken);
      setLoading(false);

    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err.message || 'Failed to verify authentication. Please login again.');
      // Clear invalid token
      localStorage.removeItem('adminToken');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render accounting dashboard if all checks pass
  return <AccountingDashboard token={token} admin={admin} />;
};

export default AccountingPage;