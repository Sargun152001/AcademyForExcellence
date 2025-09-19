import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAzureAuthContext } from 'components/AzureAuthProvider';
import Image from 'components/AppImage';
 
 
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logoutPopup, logoutRedirect } = useAzureAuthContext();
  const location = useLocation();
 
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  // const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
 
const handleLogout = async () => {
    console.log('[DEBUG] Starting logout process...');
 
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
   localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('userResource');
    navigate('/login');
  };
  const primaryNavItems = [
    { name: 'Dashboard', path: '/learning-dashboard-homepage', icon: 'LayoutDashboard' },
    { name: 'Courses', path: '/course-catalog-discovery', icon: 'BookOpen' },
    { name: 'Schedule', path: '/schedule-management-booking', icon: 'Calendar' },
    { name: 'Progress', path: '/personal-learning-path-progress', icon: 'TrendingUp' },
  ];
 
  const secondaryNavItems = [
    { name: 'Assessment', path: '/assessment-feedback-center', icon: 'ClipboardCheck' },
    { name: 'Community', path: '/community-learning-hub', icon: 'Users' },
  ];
 
  const isActivePath = (path) => location?.pathname === path;
 
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMoreMenuOpen(false);
  };
 
  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };
 
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  };
 
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white construction-shadow border-b border-border h-16">
      <div className="flex items-center justify-between px-4 lg:px-6 h-full">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="GraduationCap" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-construction-blue">
              Academy for Excellence
            </h1>
          </div>
        </div>
 
        {/* Right Side - User Menu and Actions */}
        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted construction-transition"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  {/* <Icon name="User" size={16} className="text-white" /> */}
                  <Image
                    src={userData?.imageUrl}
                    alt={userData?.title}
                    className="w-full h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
                  />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-construction-blue">
                    {userData?.name || 'User'}
                  </div>
                  <div className="text-xs text-professional-gray">
                    {userData?.title || 'Member'}
                  </div>
                </div>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-professional-gray construction-transition ${
                    showUserMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>
 
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg construction-shadow-lg border border-border py-2 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="text-sm font-semibold text-construction-blue">
                      {userData?.name}
                    </div>
                    <div className="text-xs text-professional-gray">
                      {userData?.email}
                    </div>
                    <div className="text-xs text-professional-gray mt-1">
                      {userData?.title} • {userData?.role?.charAt(0)?.toUpperCase() + userData?.role?.slice(1)}
                    </div>
                  </div>
                 
                  <div className="py-2">
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted construction-transition flex items-center space-x-2"
                      onClick={() => {
                        setShowUserMenu(false);
                        // Add profile navigation logic here
                      }}
                    >
                      <Icon name="User" size={16} className="text-professional-gray" />
                      <span>View Profile</span>
                    </button>
                   
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted construction-transition flex items-center space-x-2"
                      onClick={() => {
                        setShowUserMenu(false);
                        // Add settings navigation logic here
                      }}
                    >
                      <Icon name="Settings" size={16} className="text-professional-gray" />
                      <span>Settings</span>
                    </button>
                   
                    <div className="border-t border-border my-2"></div>
                   
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-error/10 construction-transition flex items-center space-x-2 text-error"
                      onClick={handleLogout}
                    >
                      <Icon name="LogOut" size={16} className="text-error" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
 
export default Header;