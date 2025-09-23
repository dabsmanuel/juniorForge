'use client'
import { useEffect } from 'react';
import LoadingSpinner from './controledAccess/layout/LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  admin, 
  token, 
  loading, 
  requiredRole = null, 
  requiredPermission = null,
  onUnauthorized 
}) => {
  useEffect(() => {
    // Check if we need to redirect unauthorized users
    if (!loading && (!admin || !token)) {
      if (onUnauthorized) {
        onUnauthorized();
      }
    }
  }, [loading, admin, token, onUnauthorized]);

  // Still loading
  if (loading) {
    return <LoadingSpinner message="Verifying access..." />;
  }

  // Not authenticated
  if (!admin || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access this page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if admin is approved
  if (admin.status !== 'approved') {
    let message = 'Your account is not active.';
    let icon = '⏳';
    
    switch (admin.status) {
      case 'pending':
        message = 'Your account is pending approval. Please wait for admin approval.';
        icon = '⏳';
        break;
      case 'rejected':
        message = 'Your account has been rejected. Please contact support.';
        icon = '❌';
        break;
      case 'suspended':
        message = 'Your account has been suspended. Please contact support.';
        icon = '🚫';
        break;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Account Status: {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.reload();
              }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check role requirement
  if (requiredRole && admin.role !== requiredRole && admin.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Insufficient Permissions
            </h2>
            <p className="text-gray-600 mb-6">
              You don&apos;t have the required role to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && !admin.permissions?.[requiredPermission] && admin.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Restricted
            </h2>
            <p className="text-gray-600 mb-6">
              You don&apos;t have permission to access this feature.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // All checks passed, render children
  return children;
};

export default ProtectedRoute;