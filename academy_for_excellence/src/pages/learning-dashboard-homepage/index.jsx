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
  const [userRole, setUserRole] = useState('employee');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [chatVisible, setChatVisible] = useState(false);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) setCurrentLanguage(savedLanguage);

    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) setSidebarCollapsed(JSON.parse(savedSidebarState));
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
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar}
        />
        
        <main className={`pt-16 construction-transition ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <WelcomeHero 
                userRole={userRole}
                userName={userData?.name}
                userTitle={userData.role}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2 space-y-6">
                <QuickActions userRole={userRole} />
                <ProgressVisualization />
                <RecommendedCourses />
              </div>
              <div className="xl:col-span-1">
                <LiveStatistics />
              </div>
            </div>
          </div>
        </main>

      {/* 💬 Floating Chatbot */}
<div className="fixed bottom-5 right-5 z-50">
  {/* Toggle Button */}
  {!chatVisible && (
    <button
      onClick={() => setChatVisible(true)}
      className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
      title="Open Chatbot"
    >
      <span className="text-lg">💬</span>
      <span className="font-medium">Chat</span>
    </button>
  )}

  {/* Chat Window */}
  {chatVisible && (
    <div className="relative w-[380px] h-[520px] bg-white border border-gray-300 rounded-2xl shadow-2xl overflow-hidden">
      <iframe
        src="https://copilotstudio.microsoft.com/environments/Default-50b7a7db-965b-4a2e-8f58-39e635bf39b5/bots/creef_excellia/webchat?__version__=2"
        title="Copilot Chatbot"
        frameBorder="0"
        style={{ width: '100%', height: '100%' }}
      ></iframe>

      {/* Close Button */}
      <button
        onClick={() => setChatVisible(false)}
        className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-2 py-1 text-xs font-semibold"
      >
        ✕
      </button>
    </div>
  )}
</div>
      </div>
    </>
  );
};

export default LearningDashboardHomepage;
