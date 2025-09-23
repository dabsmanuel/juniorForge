'use client'
import { useAuth } from '../../../hooks/useAuth';
import SuperAdminLayout from '../../../components/controledAccess/layout/SuperAdminLayout';
import AdminLayout from '../../../components/controledAccess/layout/AdminLayout';
import LoadingSpinner from '../../../components/controledAccess/layout/LoadingSpinner';
import ErrorBoundary from '../../../components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectRoute';
import LoginPage from '@/components/auth/LoginPage';
import RegisterPage from '@/components/auth/RegisterPage';

const App = () => {
  const {
    currentView,
    admin,
    token,
    loading,
    handleLogin,
    handleLogout,
    switchToRegister,
    switchToLogin
  } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  // If user is authenticated and approved, show appropriate dashboard
  if (currentView === 'dashboard' && admin && token) {
    return (
      <ErrorBoundary>
        <ProtectedRoute
          admin={admin}
          token={token}
          loading={loading}
          onUnauthorized={handleLogout}
        >
          {/* Conditional dashboard rendering based on role */}
          {(() => {
            switch (admin.role) {
              case 'super_admin':
                return (
                  <SuperAdminLayout
                    admin={admin}
                    token={token}
                    onLogout={handleLogout}
                  />
                );
              case 'admin':
              case 'moderator':
              default:
                return (
                  <AdminLayout
                    admin={admin}
                    token={token}
                    onLogout={handleLogout}
                  />
                );
            }
          })()}
        </ProtectedRoute>
      </ErrorBoundary>
    );
  }

  // Show register page
  if (currentView === 'register') {
    return (
      <ErrorBoundary>
        <RegisterPage onSwitchToLogin={switchToLogin} />
      </ErrorBoundary>
    );
  }

  // Show login page (default)
  return (
    <ErrorBoundary>
      <LoginPage
        onLogin={handleLogin}
        onSwitchToRegister={switchToRegister}
      />
    </ErrorBoundary>
  );
};

export default App;