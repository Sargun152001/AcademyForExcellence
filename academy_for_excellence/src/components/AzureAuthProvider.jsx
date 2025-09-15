import React, { createContext, useContext, useEffect, useState } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../config/azureAdConfig';
import { useAzureAuth } from '../hooks/useAzureAuth';

// Create Azure Auth Context
const AzureAuthContext = createContext(null);

// Azure Auth Provider component
const AzureAuthProvider = ({ children }) => {
  const [msalInstance, setMsalInstance] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        setIsInitializing(true);
        setInitError(null);
        
        // Create MSAL instance with proper error handling
        const instance = new PublicClientApplication(msalConfig);
        
        // Initialize MSAL instance
        await instance?.initialize();
        
        setMsalInstance(instance);
        console.log('[Azure AD] MSAL instance initialized successfully');
      } catch (error) {
        console.error('Failed to initialize MSAL:', error);
        setInitError(error?.message || 'Failed to initialize Azure AD authentication');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeMsal();
  }, []);

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Initializing Authentication...
          </h2>
          <p className="text-gray-600">
            Setting up secure authentication
          </p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (initError || !msalInstance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Authentication Service Error
          </h2>
          <p className="text-gray-600 mb-4">
            {initError || 'Failed to initialize Azure AD authentication. Please check your configuration.'}
          </p>
          <button 
            onClick={() => window.location?.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AzureAuthContextProvider>
        {children}
      </AzureAuthContextProvider>
    </MsalProvider>
  );
};

// Internal context provider that uses the auth hook
const AzureAuthContextProvider = ({ children }) => {
  const authValue = useAzureAuth();

  return (
    <AzureAuthContext.Provider value={authValue}>
      {children}
    </AzureAuthContext.Provider>
  );
};

// Custom hook to use Azure Auth Context
export const useAzureAuthContext = () => {
  const context = useContext(AzureAuthContext);
  if (!context) {
    throw new Error('useAzureAuthContext must be used within AzureAuthProvider');
  }
  return context;
};

export default AzureAuthProvider;