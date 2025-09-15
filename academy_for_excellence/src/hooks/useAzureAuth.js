import { useState, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/azureAdConfig';

export const useAzureAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Ensure MSAL instance is available and not in progress
        if (!instance || inProgress !== 'none') {
          return;
        }

        // Handle redirect response if coming from Azure AD
        const tokenResponse = await instance?.handleRedirectPromise();
        
        if (tokenResponse?.account) {
          instance?.setActiveAccount(tokenResponse?.account);
          setUser(tokenResponse?.account);
          setAccessToken(tokenResponse?.accessToken);
          setIsAuthenticated(true);
          console.log('[Azure AD] User authenticated via redirect');
          return;
        }

        // Check for existing authenticated accounts
        const currentAccounts = instance?.getAllAccounts() || [];
        if (currentAccounts?.length > 0) {
          const activeAccount = instance?.getActiveAccount() || currentAccounts?.[0];
          instance?.setActiveAccount(activeAccount);
          setUser(activeAccount);
          setIsAuthenticated(true);
          
          // Try to acquire token silently for authenticated user
          try {
            const silentRequest = {
              ...loginRequest,
              account: activeAccount
            };
            const silentResult = await instance?.acquireTokenSilent(silentRequest);
            if (silentResult?.accessToken) {
              setAccessToken(silentResult?.accessToken);
            }
          } catch (tokenError) {
            console.warn('Silent token acquisition failed:', tokenError);
          }
        } else {
          // No authenticated accounts found
          setUser(null);
          setIsAuthenticated(false);
          setAccessToken(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err?.message || 'Authentication initialization failed');
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Only initialize if MSAL instance is available
    if (instance) {
      initializeAuth();
    } else {
      // Set loading to false if instance is not available
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  }, [instance, inProgress]);

  // Update state when MSAL accounts change
  useEffect(() => {
    if (!instance || inProgress !== 'none') {
      return;
    }

    // Safe check for accounts array
    const safeAccounts = accounts || [];
    
    if (safeAccounts?.length > 0) {
      const activeAccount = instance?.getActiveAccount() || safeAccounts?.[0];
      if (activeAccount) {
        setUser(activeAccount);
        setIsAuthenticated(true);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setAccessToken(null);
    }
  }, [accounts, inProgress, instance]);

  // Login with popup
  const loginPopup = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!instance) {
        throw new Error('MSAL instance not available');
      }

      const loginResult = await instance?.loginPopup(loginRequest);
      
      if (loginResult?.account) {
        instance?.setActiveAccount(loginResult?.account);
        setUser(loginResult?.account);
        setAccessToken(loginResult?.accessToken);
        setIsAuthenticated(true);
        console.log('[Azure AD] Login successful via popup');
        return { success: true, user: loginResult?.account };
      } else {
        throw new Error('Login failed - no account returned');
      }
    } catch (err) {
      const errorMessage = err?.message || 'Login failed';
      console.error('Login popup error:', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [instance]);

  // Login with redirect
  const loginRedirect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!instance) {
        throw new Error('MSAL instance not available');
      }

      await instance?.loginRedirect(loginRequest);
      return { success: true };
    } catch (err) {
      const errorMessage = err?.message || 'Login redirect failed';
      console.error('Login redirect error:', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [instance]);

  // Logout with popup
  const logoutPopup = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!instance) {
        throw new Error('MSAL instance not available');
      }

      const logoutRequest = {
        account: instance?.getActiveAccount()
      };

      await instance?.logoutPopup(logoutRequest);
      
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      console.log('[Azure AD] Logout successful via popup');
      
      return { success: true };
    } catch (err) {
      const errorMessage = err?.message || 'Logout failed';
      console.error('Logout popup error:', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [instance]);

  // Logout with redirect
  const logoutRedirect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!instance) {
        throw new Error('MSAL instance not available');
      }

      const logoutRequest = {
        account: instance?.getActiveAccount()
      };

      await instance?.logoutRedirect(logoutRequest);
      return { success: true };
    } catch (err) {
      const errorMessage = err?.message || 'Logout redirect failed';
      console.error('Logout redirect error:', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [instance]);

  // Get access token
  const getAccessToken = useCallback(async () => {
    try {
      if (!instance) {
        throw new Error('MSAL instance not available');
      }

      const activeAccount = instance?.getActiveAccount();
      
      if (!activeAccount) {
        throw new Error('No active account found');
      }

      const silentRequest = {
        ...loginRequest,
        account: activeAccount
      };

      // Try silent token acquisition first
      try {
        const tokenResult = await instance?.acquireTokenSilent(silentRequest);
        setAccessToken(tokenResult?.accessToken);
        return tokenResult?.accessToken;
      } catch (silentError) {
        console.warn('Silent token acquisition failed, trying popup:', silentError);
        
        // If silent acquisition fails, try popup
        const popupResult = await instance?.acquireTokenPopup(loginRequest);
        setAccessToken(popupResult?.accessToken);
        return popupResult?.accessToken;
      }
    } catch (err) {
      console.error('Get access token error:', err);
      setError(err?.message);
      return null;
    }
  }, [instance]);

  // Get user info
  const getUserInfo = useCallback(() => {
    if (!user) return null;

    return {
      id: user?.homeAccountId || user?.localAccountId,
      name: user?.name || user?.username,
      email: user?.username || user?.name,
      tenantId: user?.tenantId,
      idTokenClaims: user?.idTokenClaims
    };
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check browser support
  const isBrowserSupported = useCallback(() => {
    try {
      return !!window.crypto && !!window.crypto?.subtle && !!window.indexedDB;
    } catch {
      return false;
    }
  }, []);

  return {
    isAuthenticated,
    user,
    accessToken,
    isLoading: isLoading || inProgress === 'login' || inProgress === 'logout',
    error,
    loginPopup,
    loginRedirect,
    logoutPopup,
    logoutRedirect,
    getAccessToken,
    getUserInfo,
    clearError,
    isBrowserSupported,
    // MSAL specific properties
    instance,
    accounts: accounts || [],
    inProgress
  };
};

export default useAzureAuth;