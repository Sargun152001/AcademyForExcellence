import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import WelcomeHero from './components/WelcomeHero';
import QuickActions from './components/QuickActions';
import ProgressVisualization from './components/ProgressVisualization';
import RecommendedCourses from './components/RecommendedCourses';
import LiveStatistics from './components/LiveStatistics';

const LearningDashboardHomepage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('employee'); // employee, manager, instructor
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Mock user data
  const userData =JSON.parse(localStorage.getItem('userData') || '{}');
  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Check for saved sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) {
      setSidebarCollapsed(JSON.parse(savedSidebarState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const currentUser = userData?.role;

  return (
    <>
      <Helmet>
        <title>Learning Dashboard - Academy for Excellence</title>
        <meta name="description" content="Your personalized learning command center for construction project management excellence in the Middle East." />
        <meta name="keywords" content="construction learning, project management, Middle East, training dashboard, professional development" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar}
        />
        
        <main className={`pt-16 construction-transition ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {/* Welcome Hero Section */}
            <div className="mb-8">
              <WelcomeHero 
                userRole={userRole}
                userName={userData?.name}
                userTitle={userData.role}
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              {/* Left Column - Primary Actions and Progress */}
              <div className="xl:col-span-2 space-y-6">
                <QuickActions userRole={userRole} />
                <ProgressVisualization />
                <RecommendedCourses />
              </div>

              {/* Right Column - Live Statistics and Updates */}
              <div className="xl:col-span-1">
                <LiveStatistics />
              </div>
            </div>

            {/* Role Switcher for Demo (Remove in production) */}
            {/* <div className="fixed bottom-4 right-4 bg-card p-4 rounded-lg construction-shadow border border-border">
              <div className="text-xs text-professional-gray mb-2">Demo: Switch Role</div>
              <div className="flex space-x-2">
                {Object.keys(userData)?.map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRole(role)}
                    className={`px-3 py-1 text-xs rounded construction-transition ${
                      userRole === role
                        ? 'bg-primary text-white' :'bg-muted text-professional-gray hover:bg-primary/10'
                    }`}
                  >
                    {role?.charAt(0)?.toUpperCase() + role?.slice(1)}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </>
  );
};

export default LearningDashboardHomepage;