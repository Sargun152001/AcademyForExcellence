import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border construction-shadow">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/learning-dashboard-homepage" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-primary-foreground"
              fill="currentColor"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
              <path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-heading font-bold text-authority-charcoal">
              Academy for Excellence
            </h1>
            <p className="text-xs text-professional-gray font-medium">
              Construction Mastery
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium construction-transition ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-primary hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.name}</span>
            </Link>
          ))}
          
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={toggleMoreMenu}
              className={`flex items-center space-x-2 ${
                isMoreMenuOpen ? 'bg-muted' : ''
              }`}
            >
              <Icon name="MoreHorizontal" size={18} />
              <span>More</span>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`construction-transition ${
                  isMoreMenuOpen ? 'rotate-180' : ''
                }`} 
              />
            </Button>
            
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg construction-shadow-modal animate-fade-in">
                <div className="py-2">
                  {secondaryNavItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm construction-transition ${
                        isActivePath(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:text-primary hover:bg-muted'
                      }`}
                    >
                      <Icon name={item?.icon} size={18} />
                      <span>{item?.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button variant="ghost" className="relative hidden sm:flex">
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-action-orange rounded-full"></span>
          </Button>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-authority-charcoal">Ahmed Al-Rashid</p>
              <p className="text-xs text-professional-gray">Project Manager</p>
            </div>
            <div className="w-8 h-8 bg-desert-gold rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-authority-charcoal">AR</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            onClick={toggleMobileMenu}
            className="lg:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border construction-shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            {[...primaryNavItems, ...secondaryNavItems]?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium construction-transition ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-primary hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.name}</span>
              </Link>
            ))}
            
            {/* Mobile User Info */}
            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="w-10 h-10 bg-desert-gold rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-authority-charcoal">AR</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-authority-charcoal">Ahmed Al-Rashid</p>
                  <p className="text-xs text-professional-gray">Project Manager</p>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 lg:hidden"
          style={{ top: '64px' }}
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
};

export default Header;