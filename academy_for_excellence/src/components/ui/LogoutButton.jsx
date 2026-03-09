// LogoutButton.jsx
import React, { useState } from 'react';
import { useAzureAuthContext } from '../AzureAuthProvider';
import Button from './Button';
import Icon from '../AppIcon';

const LogoutButton = ({ variant = "outline", className = "", children, ...props }) => {
  const { instance } = useAzureAuthContext(); // MSAL instance
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // ✅ Step 1: Clear all app-specific storage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      localStorage.removeItem('authType');
      localStorage.removeItem('userResource');

      // ✅ Step 2: Get active MSAL account
      const accounts = instance?.getAllAccounts?.() || [];
      const account = accounts.length > 0 ? accounts[0] : null;

      console.debug('[Logout] Accounts found:', accounts);

      if (account) {
        // ✅ Step 3: Trigger MSAL logoutRedirect (ends session + redirects)
        await instance.logoutRedirect({
          account,
          postLogoutRedirectUri: import.meta.env.VITE_AZURE_POST_LOGOUT_REDIRECT_URI || `${window.location.origin}/login`
        });
        return; // MSAL will handle redirection
      }

      // ❗ If no MSAL account found (demo user?), fallback to hard redirect
      window.location.href = '/login';

    } catch (error) {
      console.error('[Logout] Error during logout:', error);
      window.location.href = '/login'; // Fallback redirect
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
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
