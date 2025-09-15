import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import { useAzureAuthContext } from '../../components/AzureAuthProvider';
import { validateAzureConfig } from '../../config/azureAdConfig';

const LoginPage = () => {
  const navigate = useNavigate();
  const authContext = useAzureAuthContext();
  console.log('[DEBUG] Auth Context:', authContext);

  const {
    isAuthenticated,
    user,
    isLoading: authLoading,
    error: authError,
    loginPopup,
    loginRedirect,
    clearError,
    isBrowserSupported,
    getAccount,
  } = authContext || {};

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [configValidation, setConfigValidation] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  // Debug function to test button clicks
  const debugButtonClick = (buttonName) => {
    console.log(`[DEBUG] Button clicked: ${buttonName}`);
    setDebugInfo(`Button clicked: ${buttonName} at ${new Date().toLocaleTimeString()}`);
  };

  // Validate Azure configuration on mount
  useEffect(() => {
    try {
      const validation = validateAzureConfig();
      console.log('[DEBUG] Config validation:', validation);
      setConfigValidation(validation);

      if (!validation?.isValid) {
        console.warn('Azure AD Configuration Issues:', validation?.errors);
        setError('Azure AD configuration is invalid. Please contact your administrator.');
      }
    } catch (err) {
      console.error('[DEBUG] Config validation error:', err);
      setConfigValidation({ isValid: false, errors: ['Configuration validation failed'] });
      setError('Configuration validation failed. Please contact your administrator.');
    }
  }, []);

  // Check if user is on mobile device
  const checkMobile = useCallback(() => {
    const userAgent = navigator?.userAgent || '';
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobileCheck);
    console.log('[DEBUG] Mobile check:', mobileCheck, userAgent);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('[DEBUG] Auth state:', { isAuthenticated, user, authLoading });
    if (isAuthenticated && user && !authLoading) {
      console.log('[DEBUG] User already authenticated, redirecting to dashboard...');      
      navigate('/learning-dashboard-homepage', { replace: true });
    } else if (getAccount) {
      // Check for an active MSAL account
      const account = getAccount();
      console.log('[DEBUG] MSAL account check:', account);
      if (account) {
        console.log('[DEBUG] Found active account, redirecting to dashboard...');            
        navigate('/learning-dashboard-homepage', { replace: true });
      }
    }
  }, [isAuthenticated, user, authLoading, navigate, getAccount]);

  // Handle Azure AD login
  const handleAzureLogin = async (useRedirect = false,role) => {
    debugButtonClick(`Azure Login ${useRedirect ? 'Redirect' : 'Popup'}`);
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('[DEBUG] Starting Azure login...', { useRedirect, isMobile });          
      if (!loginPopup && !loginRedirect) {
        throw new Error('No login functions available from auth context. Please check AzureAuthProvider setup.');
      }

      console.log('[DEBUG] Auth functions available:', {
        loginPopup: !!loginPopup,
        loginRedirect: !!loginRedirect,
      });

      let loginResult;
      if (useRedirect && loginRedirect) {
        console.log('[DEBUG] Calling loginRedirect...');
        await loginRedirect();
        // Note: For redirect, the page will reload, and useEffect will handle navigation
        return;
      } else if (loginPopup) {
        console.log('[DEBUG] Calling loginPopup...');
        loginResult = await loginPopup();
        console.log('[DEBUG] Login popup result:', loginResult);
      } else {
        throw new Error('Required login function not available');
      }
      //DDY>>
      const demoUsers = {
        manager: {
          id: 'demo-mgr-1',
          name: 'Dheeraj Dubey',
          email: 'admin@trojanpi.onmicrosoft.com',
          title: 'Construction Director',
          role: 'manager',
        }
      };

      const userData = demoUsers[role];
      if (!userData) {
        throw new Error(`Invalid role: ${role}`);
      }

      console.log('[DEBUG] Setting demo user data:', userData);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('authType', 'demo');
      
      await new Promise(resolve => setTimeout(resolve, 1000));      
      //DDY<<
      // Check authentication state after login
      console.log('[DEBUG] Post-login auth state:', { isAuthenticated, user });
      if (isAuthenticated && user) {
        console.log('[DEBUG] Azure login successful, navigating to dashboard...');
        navigate('/learning-dashboard-homepage', { replace: true });
      } else if (loginResult && loginResult.account) {
        console.log('[DEBUG] Login result received, verifying account...');
        const account = getAccount ? getAccount() : null;
        console.log('[DEBUG] MSAL account after login:', account);
        if (account) {
          console.log('[DEBUG] Account verified, navigating to dashboard...');
          navigate('/learning-dashboard-homepage', { replace: true });
        } else {
          throw new Error('No active account found after login. Please try again.');
        }
      } else {
        console.warn('[DEBUG] No user data or account in login result:', loginResult);
        throw new Error('Authentication failed: Unable to retrieve user data. Please try again.');
      }

    } catch (err) {
      console.error('[DEBUG] Azure login error:', err);
      setError(err.message || 'Login failed. Please try again or contact your administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  //Handle demo login
  const handleDemoLogin = async (role) => {
    debugButtonClick(`Demo Login: ${role}`);
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('[DEBUG] Demo login for role:', role);

      const demoUsers = {
        employee: {
          id: 'demo-emp-1',
          name: 'Ahmed Al-Rashid',
          email: 'ahmed@construction-academy.com',
          title: 'Senior Project Manager',
          role: 'employee',
        },
        manager: {
          id: 'demo-mgr-1',
          name: 'Sarah Al-Zahra',
          email: 'sarah@construction-academy.com',
          title: 'Construction Director',
          role: 'manager',
        },
        instructor: {
          id: 'demo-inst-1',
          name: 'Dr. Hassan Al-Mahmoud',
          email: 'hassan@construction-academy.com',
          title: 'Lead Instructor',
          role: 'instructor',
        },
      };

      const userData = demoUsers[role];
      if (!userData) {
        throw new Error(`Invalid role: ${role}`);
      }

      console.log('[DEBUG] Setting demo user data:', userData);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('authType', 'demo');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('[DEBUG] Navigating to dashboard...');
      navigate('/learning-dashboard-homepage', { replace: true });
      
    } catch (err) {
      console.error('[DEBUG] Demo login error:', err);
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = error || authError;
  const displayLoading = isLoading || authLoading;
  const isAzureConfigured = configValidation?.isValid;

  return (
    <>
      <Helmet>
        <title>Sign In - Academy for Excellence</title>
        <meta name="description" content="Sign in to access your personalized learning dashboard for construction project management excellence." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
            {/* Debug Info */}
            {debugInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-700 text-sm">Debug: {debugInfo}</p>
              </div>
            )}

            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 mx-auto">
                <Icon name="GraduationCap" size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Academy for Excellence
              </h1>
              <p className="text-gray-600">
                Sign in with your Microsoft account to continue
              </p>
            </div>

            {/* Error Display */}
            {displayError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-700 text-sm">{displayError}</p>
                    <button
                      onClick={() => {
                        setError(null);
                        if (clearError) clearError();
                      }}
                      className="text-red-600 hover:text-red-800 text-xs underline mt-1 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Azure AD Login */}
            <div className="space-y-4 mb-6">
              {['manager'].map((role) => (
              <button
                key={role}
                onClick={() => handleAzureLogin(false,role)}
                disabled={displayLoading || !isAzureConfigured}
                className={`
                  w-full h-12 px-4 py-2 rounded-lg font-medium transition-all duration-200 
                  flex items-center justify-center space-x-2 relative
                  ${displayLoading || !isAzureConfigured
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg cursor-pointer'
                  }
                `}
                style={{ zIndex: 999 }}
              >
                {displayLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Shield" size={16} />
                    <span>Sign in with Microsoft</span>
                  </>
                )}
                {/* Continue as {role.charAt(0).toUpperCase() + role.slice(1)} */}
              </button>
              ))}
              {/* Mobile redirect option */}
              {isMobile && (
                <button
                  onClick={() => handleAzureLogin(true)}
                  disabled={displayLoading || !isAzureConfigured}
                  className="w-full h-12 px-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Icon name="ExternalLink" size={16} />
                  <span>Sign in (Mobile)</span>
                </button>
              )}
            </div>

            {/* Demo Login Options */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500 mb-4">
                Demo Access (Development Only)
              </p>
              <div className="space-y-3">
                {['employee', 'manager', 'instructor'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleDemoLogin(role)}
                    disabled={displayLoading}
                    className="w-full h-10 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ zIndex: 998 }}
                  >
                    <Icon 
                      name={role === 'employee' ? 'User' : role === 'manager' ? 'Users' : 'GraduationCap'} 
                      size={16} 
                      className="mr-2" 
                    />
                    Continue as {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Configuration Instructions */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                {isAzureConfigured ? (
                  'Azure AD properly configured for Microsoft authentication.'
                ) : (
                  'To enable Microsoft authentication, configure VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID in your .env file.'
                )}
                <br />
                Contact your system administrator for access credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;