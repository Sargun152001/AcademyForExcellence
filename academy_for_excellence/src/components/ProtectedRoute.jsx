import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAzureAuthContext } from './AzureAuthProvider';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAzureAuthContext();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-professional-gray">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check Azure AD authentication first
  if (isAuthenticated && user) {
    return children;
  }

  // Fallback to localStorage for demo users
  const localAuth = localStorage.getItem('isAuthenticated') === 'true';
  const localUser = localStorage.getItem('userData');
  
  if (localAuth && localUser) {
    try {
      JSON.parse(localUser); // Validate JSON
      return children;
    } catch {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
    }
  }

  // Redirect to login if not authenticated
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;