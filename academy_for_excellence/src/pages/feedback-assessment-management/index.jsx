import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

import Input from '../../components/ui/Input';
import FeedbackSubmissionForm from './components/FeedbackSubmissionForm';
import AssessmentHistoryCard from './components/AssessmentHistoryCard';
import FeedbackAnalyticsChart from './components/FeedbackAnalyticsChart';
import CertificationTracker from './components/CertificationTracker';
import SkillDevelopmentChart from './components/SkillDevelopmentChart';
import FeedbackReminderModal from './components/FeedbackReminderModal';

const FeedbackAssessmentManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submit-feedback');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnlineMode, setIsOnlineMode] = useState(navigator?.onLine || false);
  const [offlineData, setOfflineData] = useState([]);

  // Mock data representing Business Central integration
  const userProfile = {
    id: 'BC-EMP-2024-001',
    name: 'Ahmed Al-Mansouri',
    role: 'Senior Project Manager',
    department: 'Construction Operations',
    location: 'Dubai, UAE',
    employeeId: 'EMP001234',
    completedCourses: 28,
    certificationsHeld: 12,
    skillsProgression: 85
  };

  const availableCourses = [
    {
      id: 'BC-COURSE-001',
      name: 'Advanced Project Management for Construction',
      instructor: 'Dr. Khalid Al-Rashid',
      completedDate: '2024-11-28',
      type: 'instructor',
      status: 'feedback_pending',
      location: 'Dubai Training Center',
      duration: '3 days',
      participants: 24,
      businessCentralId: 'BC-TRN-2024-11-001'
    },
    {
      id: 'BC-COURSE-002', 
      name: 'Safety Management & Cultural Awareness',
      instructor: 'Sarah Johnson',
      completedDate: '2024-11-15',
      type: 'instructor',
      status: 'feedback_submitted',
      location: 'Abu Dhabi Site Office',
      duration: '2 days',
      participants: 18,
      businessCentralId: 'BC-TRN-2024-11-002'
    },
    {
      id: 'BC-COURSE-003',
      name: 'Digital Construction Technologies Workshop',
      instructor: 'Omar Hassan',
      completedDate: '2024-11-10',
      type: 'peer',
      status: 'feedback_pending',
      location: 'Remote Training',
      duration: '1 day',
      participants: 32,
      businessCentralId: 'BC-TRN-2024-11-003'
    },
    {
      id: 'BC-COURSE-004',
      name: 'Leadership Development Program',
      instructor: 'Fatima Al-Zahra',
      completedDate: '2024-10-25',
      type: 'self_assessment',
      status: 'feedback_submitted',
      location: 'Sharjah Training Center',
      duration: '5 days',
      participants: 15,
      businessCentralId: 'BC-TRN-2024-10-004'
    }
  ];

  const feedbackHistory = [
    {
      id: 'FB-001',
      courseId: 'BC-COURSE-002',
      courseName: 'Safety Management & Cultural Awareness',
      submissionDate: '2024-11-20',
      type: 'instructor',
      overallRating: 4.5,
      status: 'processed',
      businessCentralStatus: 'synced',
      impact: 'High - Enhanced safety protocols on current project'
    },
    {
      id: 'FB-002',
      courseId: 'BC-COURSE-004',
      courseName: 'Leadership Development Program',
      submissionDate: '2024-11-01',
      type: 'self_assessment',
      overallRating: 4.8,
      status: 'processed',
      businessCentralStatus: 'synced',
      impact: 'High - Improved team coordination and cultural sensitivity'
    }
  ];

  const skillProgressData = [
    { skill: 'Technical Expertise', current: 92, target: 95, improvement: '+8%' },
    { skill: 'Safety Management', current: 88, target: 90, improvement: '+12%' },
    { skill: 'Cultural Intelligence', current: 85, target: 88, improvement: '+15%' },
    { skill: 'Leadership', current: 90, target: 92, improvement: '+10%' },
    { skill: 'Communication', current: 87, target: 90, improvement: '+9%' }
  ];

  const certificationData = [
    {
      id: 'CERT-001',
      name: 'Project Management Professional (PMP)',
      issueDate: '2024-06-15',
      expiryDate: '2027-06-15',
      status: 'active',
      provider: 'PMI',
      businessCentralId: 'BC-CERT-001'
    },
    {
      id: 'CERT-002',
      name: 'Construction Safety Management',
      issueDate: '2024-11-20',
      expiryDate: '2026-11-20',
      status: 'active',
      provider: 'Dubai Municipality',
      businessCentralId: 'BC-CERT-002'
    }
  ];

  const analyticsData = {
    totalFeedbackSubmissions: 28,
    averageRating: 4.6,
    improvementTrends: {
      technical: '+12%',
      safety: '+15%',
      cultural: '+18%',
      leadership: '+10%'
    },
    completionRate: 94,
    timeToSubmit: '2.3 days average'
  };

  const tabs = [
    { id: 'submit-feedback', label: 'Submit Feedback', icon: 'MessageSquare' },
    { id: 'view-history', label: 'Feedback History', icon: 'History' },
    { id: 'analytics', label: 'Progress Analytics', icon: 'TrendingUp' },
    { id: 'certifications', label: 'Certifications', icon: 'Award' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'instructor', label: 'Instructor Evaluations' },
    { value: 'peer', label: 'Peer Feedback' },
    { value: 'self_assessment', label: 'Self-Assessments' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' }
  ];

  // Check online status and handle offline mode
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnlineMode(navigator?.onLine);
      if (navigator?.onLine && offlineData?.length > 0) {
        // Sync offline data when back online
        syncOfflineData();
      }
    };

    window?.addEventListener('online', handleOnlineStatus);
    window?.addEventListener('offline', handleOnlineStatus);

    return () => {
      window?.removeEventListener('online', handleOnlineStatus);
      window?.removeEventListener('offline', handleOnlineStatus);
    };
  }, [offlineData]);

  // Show reminder for pending feedback after 3 days
  useEffect(() => {
    const pendingCourses = availableCourses?.filter(course => 
      course?.status === 'feedback_pending' &&
      new Date() - new Date(course?.completedDate) > 3 * 24 * 60 * 60 * 1000
    );
    
    if (pendingCourses?.length > 0) {
      setShowReminderModal(true);
    }
  }, []);

  const syncOfflineData = async () => {
    try {
      // Simulate Business Central API sync
      console.log('Syncing offline feedback data to Business Central...', offlineData);
      setOfflineData([]);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      if (!isOnlineMode) {
        // Store offline for later sync
        const offlineFeedback = {
          ...feedbackData,
          timestamp: new Date()?.toISOString(),
          userId: userProfile?.id,
          courseId: selectedCourse?.businessCentralId
        };
        setOfflineData(prev => [...prev, offlineFeedback]);
        alert('Feedback saved offline. Will sync when connection is restored.');
      } else {
        // Simulate Business Central API call
        const response = await fetch('/api/business-central/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env?.VITE_BC_ACCESS_TOKEN}`
          },
          body: JSON.stringify({
            companyId: import.meta.env?.VITE_BC_COMPANY_ID,
            resourceId: userProfile?.employeeId,
            courseId: selectedCourse?.businessCentralId,
            feedback: feedbackData
          })
        });
        
        if (response?.ok) {
          alert('Feedback submitted successfully to Business Central!');
        }
      }
      
      setShowSubmissionForm(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  const handleCourseSelection = (course) => {
    setSelectedCourse(course);
    setShowSubmissionForm(true);
  };

  const filteredCourses = availableCourses?.filter(course => {
    const categoryMatch = filterCategory === 'all' || course?.type === filterCategory;
    const searchMatch = !searchQuery || course?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const statusMatch = course?.status === 'feedback_pending';
    
    return categoryMatch && searchMatch && statusMatch;
  });

  const filteredHistory = feedbackHistory?.filter(feedback => {
    const categoryMatch = filterCategory === 'all' || feedback?.type === filterCategory;
    const searchMatch = !searchQuery || feedback?.courseName?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-authority-charcoal mb-2">
                  Feedback & Assessment Management
                </h1>
                <p className="text-professional-gray mb-4">
                  Advanced evaluation ecosystem with Business Central integration for comprehensive learning assessment and cultural feedback processing
                </p>
                
                {/* Connection Status */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className={`flex items-center space-x-2 ${isOnlineMode ? 'text-green-600' : 'text-orange-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${isOnlineMode ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span>{isOnlineMode ? 'Online - Business Central Connected' : 'Offline Mode - Data will sync when connected'}</span>
                  </div>
                  {offlineData?.length > 0 && (
                    <div className="text-orange-600">
                      {offlineData?.length} feedback(s) pending sync
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" iconName="Download" iconPosition="left">
                  Export Reports
                </Button>
                <Button 
                  variant="default" 
                  iconName="Plus" 
                  iconPosition="left"
                  onClick={() => setActiveTab('submit-feedback')}
                >
                  Quick Feedback
                </Button>
              </div>
            </div>
          </div>

          {/* User Profile Overview */}
          <div className="bg-white rounded-lg border border-border construction-shadow mb-8 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {userProfile?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-authority-charcoal">{userProfile?.name}</h3>
                  <p className="text-professional-gray">{userProfile?.role} • {userProfile?.department}</p>
                  <p className="text-sm text-professional-gray">Employee ID: {userProfile?.employeeId} • {userProfile?.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{userProfile?.completedCourses}</div>
                  <div className="text-sm text-professional-gray">Courses Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{userProfile?.certificationsHeld}</div>
                  <div className="text-sm text-professional-gray">Certifications</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-confidence-teal">{userProfile?.skillsProgression}%</div>
                  <div className="text-sm text-professional-gray">Skills Progression</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg border border-border construction-shadow mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm construction-transition ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-professional-gray hover:text-authority-charcoal hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={20} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Submit Feedback Tab */}
              {activeTab === 'submit-feedback' && (
                <div>
                  {!showSubmissionForm ? (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-authority-charcoal mb-2">
                            Pending Course Feedback
                          </h3>
                          <p className="text-professional-gray">
                            Complete feedback for recent courses to support continuous improvement and professional development tracking
                          </p>
                        </div>
                        
                        {/* Filters */}
                        <div className="flex items-center space-x-4">
                          <Select
                            options={filterOptions}
                            value={filterCategory}
                            onChange={setFilterCategory}
                            placeholder="Category"
                            className="w-48"
                          />
                          <Input
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e?.target?.value)}
                            iconName="Search"
                            className="w-64"
                          />
                        </div>
                      </div>

                      {/* Courses Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses?.map((course) => (
                          <div key={course?.id} className="bg-white rounded-lg border border-border p-6 construction-shadow hover:construction-shadow-lg construction-transition">
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  course?.type === 'instructor' ? 'bg-blue-100 text-blue-800' :
                                  course?.type === 'peer'? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {course?.type?.replace('_', ' ')?.toUpperCase()}
                                </span>
                                <span className="text-xs text-orange-600 font-medium">PENDING</span>
                              </div>
                              
                              <h4 className="font-semibold text-authority-charcoal mb-2">
                                {course?.name}
                              </h4>
                              
                              <div className="text-sm text-professional-gray space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Icon name="Calendar" size={16} />
                                  <span>Completed: {course?.completedDate}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Icon name="User" size={16} />
                                  <span>Instructor: {course?.instructor}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Icon name="MapPin" size={16} />
                                  <span>{course?.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Icon name="Clock" size={16} />
                                  <span>{course?.duration} • {course?.participants} participants</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              variant="default"
                              fullWidth
                              onClick={() => handleCourseSelection(course)}
                              iconName="MessageSquare"
                              iconPosition="left"
                              disabled={!isOnlineMode && course?.type !== 'self_assessment'}
                            >
                              {!isOnlineMode && course?.type !== 'self_assessment' ? 'Offline Mode' : 'Provide Feedback'}
                            </Button>
                          </div>
                        ))}
                      </div>

                      {filteredCourses?.length === 0 && (
                        <div className="text-center py-12">
                          <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
                          <h3 className="text-lg font-medium text-authority-charcoal mb-2">All Caught Up!</h3>
                          <p className="text-professional-gray">No pending feedback submissions at this time.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <FeedbackSubmissionForm
                      course={selectedCourse}
                      userProfile={userProfile}
                      onSubmit={handleSubmitFeedback}
                      onCancel={() => {
                        setShowSubmissionForm(false);
                        setSelectedCourse(null);
                      }}
                      isOnline={isOnlineMode}
                    />
                  )}
                </div>
              )}

              {/* View History Tab */}
              {activeTab === 'view-history' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-authority-charcoal mb-2">
                        Feedback History & Status
                      </h3>
                      <p className="text-professional-gray">
                        Track your submitted feedback and view Business Central synchronization status
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Select
                        options={filterOptions}
                        value={filterCategory}
                        onChange={setFilterCategory}
                        placeholder="Filter by type"
                        className="w-48"
                      />
                      <Select
                        options={dateRangeOptions}
                        value={filterDateRange}
                        onChange={setFilterDateRange}
                        placeholder="Date range"
                        className="w-48"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredHistory?.map((feedback) => (
                      <AssessmentHistoryCard
                        key={feedback?.id}
                        feedback={feedback}
                        onViewDetails={(id) => console.log('View details:', id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg border border-border p-6 construction-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-professional-gray">Total Submissions</p>
                          <p className="text-2xl font-bold text-authority-charcoal">{analyticsData?.totalFeedbackSubmissions}</p>
                        </div>
                        <Icon name="MessageSquare" size={24} className="text-primary" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-border p-6 construction-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-professional-gray">Average Rating</p>
                          <p className="text-2xl font-bold text-authority-charcoal">{analyticsData?.averageRating}/5.0</p>
                        </div>
                        <Icon name="Star" size={24} className="text-accent" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-border p-6 construction-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-professional-gray">Completion Rate</p>
                          <p className="text-2xl font-bold text-authority-charcoal">{analyticsData?.completionRate}%</p>
                        </div>
                        <Icon name="TrendingUp" size={24} className="text-green-600" />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-border p-6 construction-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-professional-gray">Avg. Response Time</p>
                          <p className="text-2xl font-bold text-authority-charcoal">{analyticsData?.timeToSubmit}</p>
                        </div>
                        <Icon name="Clock" size={24} className="text-confidence-teal" />
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FeedbackAnalyticsChart data={analyticsData} />
                    <SkillDevelopmentChart data={skillProgressData} />
                  </div>
                </div>
              )}

              {/* Certifications Tab */}
              {activeTab === 'certifications' && (
                <div>
                  <CertificationTracker 
                    certifications={certificationData}
                    skillProgress={skillProgressData}
                    userProfile={userProfile}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <FeedbackReminderModal
          pendingCourses={availableCourses?.filter(c => c?.status === 'feedback_pending')}
          onClose={() => setShowReminderModal(false)}
          onSubmitFeedback={(courseId) => {
            const course = availableCourses?.find(c => c?.id === courseId);
            if (course) {
              handleCourseSelection(course);
            }
            setShowReminderModal(false);
          }}
        />
      )}
    </div>
  );
};

export default FeedbackAssessmentManagement;