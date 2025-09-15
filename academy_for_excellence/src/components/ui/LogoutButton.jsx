import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';
import { useAzureAuthContext } from '../AzureAuthProvider';

const LogoutButton = ({ variant = "outline", className = "", children, ...props }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logoutPopup, logoutRedirect } = useAzureAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      // If authenticated with Azure AD, use Azure logout
      if (isAuthenticated) {
        // Try popup first, fallback to redirect
        try {
          await logoutPopup?.();
        } catch (popupError) {
          console.warn('Popup logout failed, trying redirect:', popupError);
          await logoutRedirect?.();
          return; // Redirect will handle navigation
        }
      }

      // Clear local storage for demo users
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');

      // Navigate to login
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: clear local storage and navigate anyway
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      navigate('/login', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Signing out...</span>
        </div>
      ) : (
        children || (
          <div className="flex items-center space-x-2">
            <Icon name="LogOut" size={16} />
            <span>Sign Out</span>
          </div>
        )
      )}
    </Button>
  );
};

export default LogoutButton;