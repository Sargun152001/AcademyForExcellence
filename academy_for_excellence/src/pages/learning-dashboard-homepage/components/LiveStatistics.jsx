import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { getCertificatesForAll, getAssessmentsAndFeedbacks } from 'services/businessCentralApi';
import Button from 'components/ui/Button';

import AssessmentForm from 'pages/assessment-feedback-center/components/AssessmentForm';
import FeedbackForm from 'pages/assessment-feedback-center/components/FeedbackForm';
import { useFeedback } from 'hooks/useBusinessCentral';
import { submitAssessmentAnswers } from 'services/businessCentralApi';

const LiveStatistics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [certificatesData, setCertificatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ADD THIS NEW LINE:
  const [assessmentFeedbackData, setAssessmentFeedbackData] = useState([]);

  // ADD THESE NEW STATE VARIABLES:
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [selectedAssessmentForForm, setSelectedAssessmentForForm] = useState(null);
  const [showFeedbackFormModal, setShowFeedbackFormModal] = useState(false);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState(null);


  // ADD THIS HOOK:
  const { submitFeedback } = useFeedback();


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const getResourceEmail = () => {
    try {
      const userResource = localStorage.getItem('userResource');
      if (userResource) {
        const resource = JSON.parse(userResource);
        if (resource.email) {
          return resource.email;
        }
      }
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.email) {
          return user.email;
        }
      }
      return null;
    } catch (err) {
      console.error('[DEBUG] Error getting email from localStorage:', err);
      return null;
    }
  };

  // ADD THESE HELPER FUNCTIONS:
  const getResourceId = () => {
    try {
      const userResource = localStorage.getItem('userResource');
      if (userResource) {
        const resource = JSON.parse(userResource);
        if (resource.id) {
          return resource.id;
        }
      }
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.id) {
          return user.id;
        }
      }
      console.warn('[DEBUG] No resource ID found in localStorage');
      return null;
    } catch (err) {
      console.error('[DEBUG] Error getting resource ID from localStorage:', err);
      return null;
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const certificates = await getCertificatesForAll();

        setCertificatesData(certificates || []);
        // console.log('[DEBUG] Successfully loaded certificates:', certificates);

        // ADD THIS SECTION:
        // Fetch assessment and feedback data
        const resourceEmail = getResourceEmail();
        if (resourceEmail) {
          const assessmentFeedback = await getAssessmentsAndFeedbacks(resourceEmail);
          console.log('assessmenttFeedbackdataa in Live Statistics: ', assessmentFeedback);
          
          setAssessmentFeedbackData(assessmentFeedback || []);
        }
      } catch (err) {
        // console.error('[DEBUG] Error fetching certificates:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array - fetch once on mount

  const formatCompletionDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  // ADD THESE TWO NEW FUNCTIONS:
  const formatUpcomingDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  const generateUpcomingDeadlines = (assessmentFeedbackData) => {
    const pendingAssessments = assessmentFeedbackData
      .filter(course => {
        const courseDate = new Date(course.date);
        const today = new Date();
        courseDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return courseDate.getTime() < today.getTime() && course.assessmentStatus === 'pending';
      })
      .map(course => ({
        title: course.courseName,
        type: 'Assessment',
        dueDate: formatUpcomingDate(course.date),
        priority: 'high',
        course: course.courseName,
        itemType: 'assessment',
        courseId: course.courseId,  // ADD THIS LINE
        bookingId: course.bookingId  // ADD THIS LINE (useful for feedback)
      }));

    const pendingFeedback = assessmentFeedbackData
      .filter(course => {
        if (!course.feedbackSubmitted) {
          const courseDate = new Date(course?.date);
          const today = new Date();
          courseDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          return courseDate.getTime() < today.getTime();
        }
        return false;
      })
      .map(course => ({
        title: course.courseName,
        type: 'Feedback',
        dueDate: formatUpcomingDate(course.date),
        priority: 'medium',
        course: course.courseName,
        itemType: 'feedback',
        courseId: course.courseId,  // ADD THIS LINE
        bookingId: course.bookingId  // ADD THIS LINE
      }));

    // Combine and return all pending items
    return [...pendingAssessments, ...pendingFeedback]; // Show top 5 items
  };


  // Generate recent achievements from certificates data
  const generateRecentAchievements = (certificates) => {
    return certificates
      .filter(cert => cert.status === 'Completed')
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 3) // Show top 3 recent certificates
      .map((cert) => ({
        user: cert.resourceName || `Resource ${cert.resourceNo}`,
        achievement: `Completed ${cert.title}`,
        // time: getRelativeTime(cert.completedAt),
        completedDate: formatCompletionDate(cert.completedAt), // Changed from 'time' to 'completedDate'
        avatar: cert.resourceName ? cert.resourceName.split(' ').map(n => n[0]).join('').toUpperCase() : `R${cert.resourceNo}`,
        type: "certification",
        description: cert.description,
        duration: cert.duration
      }));
  };

  // const organizationStats = [
  //   {
  //     title: "Active Learners",
  //     value: "1,247",
  //     change: "+12%",
  //     trend: "up",
  //     icon: "Users",
  //     color: "text-success",
  //     bgColor: "bg-success/10"
  //   },
  //   {
  //     title: "Courses Completed",
  //     value: "3,456",
  //     change: "+8%",
  //     trend: "up",
  //     icon: "BookOpen",
  //     color: "text-primary",
  //     bgColor: "bg-primary/10"
  //   },
  //   {
  //     title: "Certifications Earned",
  //     value: "892",
  //     change: "+15%",
  //     trend: "up",
  //     icon: "Award",
  //     color: "text-accent",
  //     bgColor: "bg-accent/10"
  //   },
  //   {
  //     title: "Average Score",
  //     value: "87.5%",
  //     change: "+2.3%",
  //     trend: "up",
  //     icon: "TrendingUp",
  //     color: "text-confidence-teal",
  //     bgColor: "bg-confidence-teal/10"
  //   }
  // ];

  // REPLACE THIS ENTIRE SECTION:
  const upcomingDeadlines = (assessmentFeedbackData.length > 0 && !loading)
    ? generateUpcomingDeadlines(assessmentFeedbackData)
    : loading
      ? [] // Empty array while loading - we'll handle loading state in JSX
      : [
        {
          title: "Project Risk Assessment",
          type: "Assessment",
          dueDate: "Today",
          priority: "high",
          course: "Advanced Risk Management",
          itemType: 'assessment'
        },
        {
          title: "Safety Protocol Quiz",
          type: "Feedback",
          dueDate: "Tomorrow",
          priority: "medium",
          course: "Construction Safety Standards",
          itemType: 'feedback'
        }
      ];


  // const recentAchievements = [
  //   {
  //     user: "Ahmed Al-Rashid",
  //     achievement: "Completed PMI-PMP Certification",
  //     time: "2 hours ago",
  //     avatar: "AR",
  //     type: "certification"
  //   },
  //   {
  //     user: "Fatima Hassan",
  //     achievement: "Scored 95% in Structural Analysis",
  //     time: "4 hours ago",
  //     avatar: "FH",
  //     type: "score"
  //   },
  //   {
  //     user: "Mohammed Khalil",
  //     achievement: "Earned Safety Excellence Badge",
  //     time: "6 hours ago",
  //     avatar: "MK",
  //     type: "badge"
  //   }
  // ];
  const recentAchievements = certificatesData.length > 0
    ? generateRecentAchievements(certificatesData)
    : [
      {
        user: "Loading...",
        achievement: "Fetching recent achievements",
        time: "Loading...",
        avatar: "...",
        type: "certification"
      }
    ];


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error bg-error/5';
      case 'medium': return 'border-l-primary bg-primary/5';
      case 'low': return 'border-l-success bg-success/5';
      default: return 'border-l-professional-gray bg-muted';
    }
  };

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'certification': return 'Award';
      case 'score': return 'Target';
      case 'badge': return 'Shield';
      default: return 'Star';
    }
  };

  // REPLACE the existing handleAssessmentClick and handleFeedbackClick functions:
  const handleAssessmentClick = (deadline) => {
    // console.log('Start Assessment clicked for:', deadline.title);

    // Find the full assessment data using courseId (more reliable than title)
    const assessmentData = assessmentFeedbackData.find(course =>
      course.courseId === deadline.courseId && course.assessmentStatus === 'pending'
    );

    if (!assessmentData) {
      alert('Assessment data not found. Please try again.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to start the "${deadline.title}" assessment?`);

    if (confirmed) {
      const resourceId = getResourceId();

      setSelectedAssessmentForForm({
        ...assessmentData,
        // courseId: deadline.courseId || assessmentData.courseId,
        resourceId: resourceId
      });
      setShowAssessmentForm(true);
    }
  };

  const handleFeedbackClick = (deadline) => {
    // console.log('Complete Feedback clicked for:', deadline.title);

    // Find the full course data using courseId or bookingId (more reliable than title)
    const courseData = assessmentFeedbackData.find(course =>
      course.courseId === deadline.courseId && !course.feedbackSubmitted
    );

    if (!courseData) {
      alert('Course data not found. Please try again.');
      return;
    }

    setSelectedCourseForModal(courseData);
    setShowFeedbackFormModal(true);
  };


  // ADD THESE NEW HANDLER FUNCTIONS:
  const handleSubmitAssessment = async (submissionData) => {
    try {
      console.log('Handle Submit Assessmetn function data', submissionData);
      await submitAssessmentAnswers(submissionData);

      // Update local state to reflect completion
      setAssessmentFeedbackData(prevData =>
        prevData.map(course =>
          // console.log('CHECk:   ','courseID: ', course.id, ' selectedAssessmentForForm: ', selectedAssessmentForForm?.id),
          course.id === selectedAssessmentForForm?.id
            ? { ...course, assessmentStatus: 'completed' }
            : course
        )
      );

      alert('Assessment submitted successfully!');
      setShowAssessmentForm(false);
      setSelectedAssessmentForForm(null);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      // console.log("Feedback data: ", feedbackData);
      // console.log("Selected Course: ", selectedCourseForModal);

      const resourceEmail = getResourceEmail();
      if (!resourceEmail) {
        alert('Error: User email not found. Cannot submit feedback.');
        return;
      }

      const result = await submitFeedback(
        selectedCourseForModal?.bookingId,
        selectedCourseForModal?.courseId,
        feedbackData,
        resourceEmail
      );

      // Update local state to reflect feedback submission
      setAssessmentFeedbackData(prevData =>
        prevData.map(course =>
          course.bookingId === selectedCourseForModal?.bookingId
            ? { ...course, feedbackSubmitted: true }
            : course
        )
      );

      alert('Feedback submitted successfully to Business Central!');
      setShowFeedbackFormModal(false);
      setSelectedCourseForModal(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Failed to submit feedback: ${error?.message}`);
    }
  };


  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-card rounded-xl p-4 construction-shadow">
          <div className="flex items-center space-x-2 text-yellow-700">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm">{error}. Showing available data.</span>
          </div>
        </div>
      )}
      {/* Live Clock */}
      <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="text-center">
          <div className="text-3xl font-bold text-authority-charcoal mb-2">
            {currentTime?.toLocaleTimeString('en-US', {
              hour12: false,
              timeZone: 'Asia/Dubai'
            })}
          </div>
          <div className="text-sm text-professional-gray">
            {currentTime?.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'Asia/Dubai'
            })} • UAE Time
          </div>
        </div>
      </div>
      {/* Organization Statistics */}
      {/* <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
            Live Statistics
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-professional-gray">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {organizationStats?.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg ${stat?.bgColor}`}>
              <div className="flex items-center justify-between mb-2">
                <Icon name={stat?.icon} size={20} className={stat?.color} />
                <div className={`flex items-center text-xs ${stat?.color}`}>
                  <Icon name="TrendingUp" size={12} className="mr-1" />
                  {stat?.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-authority-charcoal">
                {stat?.value}
              </div>
              <div className="text-sm text-professional-gray">
                {stat?.title}
              </div>
            </div>
          ))}
        </div>
      </div> */}


      {/* Communication Channels */}
      <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
            Communication Channels
          </h3>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              window.open("https://teams.microsoft.com", "_blank");
            }}
            className="flex items-center px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition w-full"
          >
            <Icon name="MessageSquare" size={20} className="mr-2" />
            <span className="font-medium text-base">Open Microsoft Teams</span>
          </button>

          <button
            onClick={() => {
              window.open("https://outlook.office.com/mail/", "_blank");
            }}
            className="flex items-center px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition w-full"
          >
            <Icon name="Mail" size={20} className="mr-2" />
            <span className="font-medium text-base">Open Microsoft Outlook</span>
          </button>
        </div>
      </div>



      {/* Upcoming Deadlines */}
      <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
            Upcoming Deadlines
          </h3>
          <Icon name="Clock" size={20} className="text-warning" />
        </div>

        {/* ADD LOADING STATE */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border-l-4 border-l-gray-300 bg-gray-50 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                    <div className="h-2 bg-gray-300 rounded w-1/4"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="space-y-3 max-h-96 overflow-y-auto pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e0 #f7fafc'
            }}
          >
            {upcomingDeadlines?.map((deadline, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(deadline?.priority)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-authority-charcoal">
                      {deadline?.title}
                    </h4>
                    <p className="text-sm text-professional-gray">
                      <span className="text-xs text-professional-gray">Due Date:</span> {deadline?.dueDate}
                    </p>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${deadline?.type === 'Assessment'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}>
                        {deadline?.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* UPDATED: Dynamic button based on type */}
                    {deadline?.type === 'Assessment' ? (
                      <Button
                        onClick={() => handleAssessmentClick(deadline)}
                        className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors max-w-[80px] min-w-0"
                        style={{
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          lineHeight: '1.2',
                          textAlign: 'center'
                        }}
                        iconName="Play"
                        iconPosition="left"
                      >
                        <span className="break-words">Start</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleFeedbackClick(deadline)}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors max-w-[80px] min-w-0"
                        style={{
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          lineHeight: '1.2',
                          textAlign: 'center'
                        }}
                        iconName="MessageSquare"
                        iconPosition="left"
                      >
                        <span className="break-words">Provide</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {upcomingDeadlines.length === 0 && !loading && (
              <div className="text-center py-8 text-professional-gray">
                <Icon name="CheckCircle" size={32} className="mx-auto mb-2 opacity-50" />
                <p>No pending deadlines</p>
                <p className="text-xs mt-1">All assessments and feedback are up to date</p>
              </div>
            )}
          </div>
        )}
      </div>



      {/* Recent Achievements */}
      <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
            Recent Certifications
          </h3>
          <Icon name="Trophy" size={20} className="text-accent" />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-background rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentAchievements?.length > 0 ? (
              recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {achievement?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-authority-charcoal">
                        {achievement?.user}
                      </span>
                      <Icon name={getAchievementIcon(achievement?.type)} size={14} className="text-accent" />
                    </div>
                    <p className="text-sm text-professional-gray">
                      {achievement?.achievement}
                    </p>
                    {/* {achievement?.description && (
                      <p className="text-xs text-professional-gray mt-1">
                        {achievement.description} • {achievement.duration}
                      </p>
                    )} */}
                    <p className="text-xs text-professional-gray">
                      <span className="font-medium text-green-600">Completed:</span> {achievement?.completedDate}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-professional-gray">
                <Icon name="Award" size={32} className="mx-auto mb-2 opacity-50" />
                <p>No recent achievements found</p>
                <p className="text-xs mt-1">Achievements from the last 7 days will appear here</p>
              </div>
            )}
          </div>
        )}


        {/* <div className="space-y-4">
          {recentAchievements?.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {achievement?.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-authority-charcoal">
                    {achievement?.user}
                  </span>
                  <Icon name={getAchievementIcon(achievement?.type)} size={14} className="text-accent" />
                </div>
                <p className="text-sm text-professional-gray">
                  {achievement?.achievement}
                </p>
                <p className="text-xs text-professional-gray">
                  {achievement?.time}
                </p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
      {/* Assessment Form Modal */}
      {showAssessmentForm && selectedAssessmentForForm && (
        <AssessmentForm
          assessment={selectedAssessmentForForm}
          onSubmit={handleSubmitAssessment}
          onCancel={() => {
            setShowAssessmentForm(false);
            setSelectedAssessmentForForm(null);
          }}
        />
      )}

      {/* Feedback Form Modal */}
      {showFeedbackFormModal && selectedCourseForModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-authority-charcoal">
                  Course Feedback & Evaluation
                </h3>
                <p className="text-sm text-professional-gray mt-1">
                  {selectedCourseForModal?.courseName}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFeedbackFormModal(false);
                  setSelectedCourseForModal(null);
                }}
                className="text-professional-gray hover:text-authority-charcoal"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <FeedbackForm
                course={selectedCourseForModal}
                onSubmit={handleSubmitFeedback}
                onCancel={() => {
                  setShowFeedbackFormModal(false);
                  setSelectedCourseForModal(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStatistics;