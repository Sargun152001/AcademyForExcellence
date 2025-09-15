import { LogLevel } from '@azure/msal-browser';

// MSAL configuration
export const msalConfig = {
  auth: {
    clientId: import.meta.env?.VITE_AZURE_CLIENT_ID || 'your-client-id-here',
    authority: `https://login.microsoftonline.com/${import.meta.env?.VITE_AZURE_TENANT_ID || 'your-tenant-id-here'}`,
    redirectUri: import.meta.env?.VITE_AZURE_REDIRECT_URI || window.location?.origin,
    postLogoutRedirectUri: import.meta.env?.VITE_AZURE_POST_LOGOUT_REDIRECT_URI || window.location?.origin,
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: 'localStorage', // Can be "localStorage" or "sessionStorage"
    storeAuthStateInCookie: false // Set to true for Internet Explorer 11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        
        switch (level) {
          case LogLevel?.Error:
            console.error('[MSAL Error]:', message);
            break;
          case LogLevel?.Info:
            console.info('[MSAL Info]:', message);
            break;
          case LogLevel?.Verbose:
            console.debug('[MSAL Verbose]:', message);
            break;
          case LogLevel?.Warning:
            console.warn('[MSAL Warning]:', message);
            break;
          default:
            console.log('[MSAL]:', message);
            break;
        }
      },
      logLevel: LogLevel?.Warning, // Increased logging to catch config issues
      piiLoggingEnabled: false
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    asyncPopups: false
  }
};

// Configuration validation
export const validateAzureConfig = () => {
  const clientId = import.meta.env?.VITE_AZURE_CLIENT_ID;
  const tenantId = import.meta.env?.VITE_AZURE_TENANT_ID;
  
  const errors = [];
  
  if (!clientId || clientId === 'your-azure-client-id-here') {
    errors?.push('VITE_AZURE_CLIENT_ID is not configured properly');
  }
  
  if (!tenantId || tenantId === 'your-azure-tenant-id-here') {
    errors?.push('VITE_AZURE_TENANT_ID is not configured properly');
  }
  
  if (clientId && !clientId?.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)) {
    errors?.push('VITE_AZURE_CLIENT_ID does not appear to be a valid GUID');
  }
  
  if (tenantId && !tenantId?.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i) && !tenantId?.includes('.onmicrosoft.com')) {
    errors?.push('VITE_AZURE_TENANT_ID does not appear to be a valid GUID or domain');
  }
  
  return {
    isValid: errors?.length === 0,
    errors,
    clientId,
    tenantId
  };
};

// Login request configuration
export const loginRequest = {
  scopes: [
    ...(import.meta.env?.VITE_AZURE_SCOPES?.split(',') || ['User.Read', 'profile', 'openid', 'email'])
  ],
  prompt: 'login', // Changed from 'select_account' to force credential prompt
  forceRefresh: true
};

// Graph API endpoint for user info
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphUserPhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value'
};

// Protected resource map for API calls
export const protectedResources = {
  graphApi: {
    endpoint: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['User.Read']
  }
};