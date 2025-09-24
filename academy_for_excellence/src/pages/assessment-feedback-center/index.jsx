import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import AssessmentCard from './components/AssessmentCard';
import FeedbackForm from './components/FeedbackForm';
import PeerEvaluationCard from './components/PeerEvaluationCard';
import ResultsModal from './components/ResultsModal';
import StatsOverview from './components/StatsOverview';
// import ConnectionStatus from '../../components/ConnectionStatus';
import { useBusinessCentral, useAssessments, useFeedback, usePeerEvaluations } from '../../hooks/useBusinessCentral';
import AssessmentForm from './components/AssessmentForm';
import { getAssessmentsAndFeedbacks, submitAssessmentAnswers } from 'services/businessCentralApi';

const AssessmentFeedbackCenter = () => {
  const [activeTab, setActiveTab] = useState('assessments');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(null);

  const [isOnlineMode, setIsOnlineMode] = useState(navigator?.onLine || false);
  const [offlineData, setOfflineData] = useState([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);


  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [selectedAssessmentForForm, setSelectedAssessmentForForm] = useState(null);


  // NEW: Add state for API data
  const [assessmentFeedbackData, setAssessmentFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Business Central integration hooks
  // const { isConnected, connectionStatus } = useBusinessCentral();
  const {
    assessments,
    stats,
    loading: assessmentsLoading,
    error: assessmentsError,
    submitAssessmentRequest,
    startAssessment
  } = useAssessments();
  const {
    feedbackCourses,
    loading: feedbackLoading,
    error: feedbackError,
    submitFeedback
  } = useFeedback();
  const {
    peerEvaluations,
    loading: peerLoading,
    error: peerError,
    submitEvaluation
  } = usePeerEvaluations();


  // NEW: Function to get resource email from localStorage
  const getResourceEmail = () => {
    try {
      // Try userResource first
      const userResource = localStorage.getItem('userResource');
      if (userResource) {
        const resource = JSON.parse(userResource);
        if (resource.email) {
          return resource.email;
        }
      }

      // Try userData as fallback
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.email) {
          return user.email;
        }
      }

      console.warn('[DEBUG] No email found in localStorage');
      return null;
    } catch (err) {
      console.error('[DEBUG] Error getting email from localStorage:', err);
      return null;
    }
  };


  // Add this function alongside getResourceEmail
  const getResourceId = () => {
    try {
      // Try userResource first
      const userResource = localStorage.getItem('userResource');
      if (userResource) {
        const resource = JSON.parse(userResource);
        if (resource.id) {
          return resource.id;
        }
      }

      // Try userData as fallback
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


  // NEW: Fetch assessment and feedback data on component mount
  useEffect(() => {
    const fetchAssessmentFeedbackData = async () => {
      try {
        setLoading(true);
        setError(null);

        const resourceEmail = getResourceEmail();
        if (!resourceEmail) {
          setAssessmentFeedbackData([]);
          return;
        }

        const data = await getAssessmentsAndFeedbacks(resourceEmail);

        setAssessmentFeedbackData(data || []);
      } catch (err) {
        setError('Failed to load assessment and feedback data');
        setAssessmentFeedbackData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentFeedbackData();
  }, []); // Empty dependency array - fetch once on mount

  const tabs = [
    { id: 'assessments', label: 'My Assessments', icon: 'ClipboardCheck' },
    { id: 'feedback', label: 'Course Feedback', icon: 'MessageSquare' },
    // { id: 'peer-evaluation', label: 'Peer Evaluations', icon: 'Users' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Final Assessment', label: 'Final Assessment' },
    { value: 'Certification Exam', label: 'Certification Exam' },
    { value: 'Skills Assessment', label: 'Skills Assessment' },
    { value: 'Practical Assessment', label: 'Practical Assessment' }
  ];

  // Enhanced Export Reports functionality
  const handleExportReports = async () => {
    setIsExporting(true);
    try {
      const completedAssessments = assessments?.filter(assessment => assessment?.status === 'completed') || [];

      const reportData = {
        generatedAt: new Date()?.toISOString(),
        // connectionStatus: isConnected ? 'connected' : 'disconnected',
        dataSource: 'Microsoft Dynamics 365 Business Central',
        summary: {
          totalAssessments: assessments?.length || 0,
          completedAssessments: completedAssessments?.length || 0,
          averageScore: stats?.averageScore || 0,
          pendingAssessments: assessments?.filter(a => a?.status === 'pending')?.length || 0,
          overdueAssessments: assessments?.filter(a => a?.status === 'overdue')?.length || 0
        },
        assessmentDetails: completedAssessments?.map(assessment => ({
          id: assessment?.id,
          courseName: assessment?.courseName,
          type: assessment?.type,
          score: assessment?.score,
          completedDate: assessment?.completedDate,
          certificationExpiry: assessment?.certificationExpiry,
          detailedScores: assessment?.scores
        })),
        feedbackStats: {
          totalCourses: feedbackCourses?.length || 0,
          pendingFeedback: feedbackCourses?.filter(c => c?.status === 'feedback_pending')?.length || 0
        },
        peerEvaluationStats: {
          totalEvaluations: peerEvaluations?.length || 0,
          pendingEvaluations: peerEvaluations?.filter(e => e?.status === 'pending')?.length || 0
        }
      };

      // Create downloadable report
      const reportContent = JSON.stringify(reportData, null, 2);
      const blob = new Blob([reportContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `assessment-report-bc-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Assessment report exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Enhanced Request Assessment functionality
  const handleRequestAssessment = () => {
    setShowRequestForm(true);
  };


  const handleSubmitAssessment = async (submissionData) => {
    try {
      console.log('[DEBUG] Assessment submission:', submissionData);
      // return;

      await submitAssessmentAnswers(submissionData);

      alert('Assessment submitted successfully!');
      setShowAssessmentForm(false);
      setSelectedAssessmentForForm(null);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error; // Let AssessmentForm handle the error display
    }
  };

  const handleSubmitAssessmentRequest = async (requestData) => {
    try {
      await submitAssessmentRequest(requestData);
      alert('Assessment request submitted successfully to Business Central! You will be notified once it\'s ready.');
      setShowRequestForm(false);
    } catch (error) {
      console.error('Error submitting assessment request:', error);
      alert(`Failed to submit assessment request: ${error?.message}`);
    }
  };

  // Enhanced Start Assessment functionality
  const handleStartAssessment = async (assessment, courseId) => {
    if (!assessment) return;

    // if (!isConnected) {
    //   alert('Cannot start assessment: Not connected to Business Central. Please check your connection and try again.');
    //   return;
    // }

    setAssessmentStarted(assessment?.id);

    // const confirmed = window.confirm(`Are you sure you want to start the "${assessment?.courseName}" assessment?\n\nDuration: ${assessment?.duration} \nType: ${assessment?.type}\n\nThis will be recorded in Business Central.`);

    const confirmed = window.confirm(`Are you sure you want to start the "${assessment?.courseName}" assessment?`);

    if (confirmed) {
      try {
        // await startAssessment(courseId);
        // alert(`Assessment "${assessment?.courseName}" started successfully!\n\nThe assessment session has been logged in Business Central.\nReminder: You have ${assessment?.duration} minutes to complete this assessment.`);

        const resourceId = getResourceId();

        setSelectedAssessmentForForm({
          ...assessment,
          courseId: courseId || assessment?.courseId,
          resourceId: resourceId
        });
        setShowAssessmentForm(true);

      } catch (error) {
        console.error('Error starting assessment:', error);
        alert(`Failed to start assessment: ${error?.message}`);
      }
    } else {
      setAssessmentStarted(null);
    }
  };

  // Enhanced View Results functionality
  const handleViewResults = (assessment) => {
    if (!assessment || assessment?.assessmentStatus !== 'completed') {
      alert('Results are only available for completed assessments.');
      return;
    }

    setSelectedAssessment(assessment);
    setShowResultsModal(true);
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      // if (!isConnected) {
      //   throw new Error('Not connected to Business Central');
      // }

      // console.log("Data to be send: ", selectedCourse?.bookingId, selectedCourse?.courseId, feedbackData);

      // console.log("Feedback data: ", feedbackData)

      // Validate required fields
      // if (!selectedCourse?.bookingId) {
      //   alert('Error: Booking ID is missing. Cannot submit feedback.');
      //   return;
      // }

      const resourceEmail = getResourceEmail();

      const result = await submitFeedback(selectedCourse?.bookingId, selectedCourse?.courseId, feedbackData, resourceEmail);

      console.log("result after submitFeedback: ", result)

      setAssessmentFeedbackData(prevData =>
        prevData.map(course =>
          course.bookingId === selectedCourse?.bookingId
            ? { ...course, feedbackSubmitted: true }
            : course
        )
      );

      // await submitFeedback(selectedCourse?.id, feedbackData);
      alert('Feedback submitted successfully to Business Central!');
      setShowFeedbackForm(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Failed to submit feedback: ${error?.message}`);
    }
  };

  const handleCourseSelection = (course) => {
    setSelectedCourse(course);
    setShowFeedbackForm(true);
  };

  const handleSubmitPeerEvaluation = async (evaluationData) => {
    try {
      // if (!isConnected) {
      //   throw new Error('Not connected to Business Central');
      // }

      await submitEvaluation(evaluationData?.evaluationId, evaluationData);
      alert('Peer evaluation submitted successfully to Business Central!');
    } catch (error) {
      console.error('Error submitting peer evaluation:', error);
      alert(`Failed to submit peer evaluation: ${error?.message}`);
    }
  };

  // const filteredAssessments = assessments?.filter(assessment => {
  //   const statusMatch = filterStatus === 'all' || assessment?.status === filterStatus;
  //   const typeMatch = filterType === 'all' || assessment?.type === filterType;
  //   return statusMatch && typeMatch;
  // }) || [];

  // console.log('Scheduled Bookings: ', feedbackCourses)

  const pendingFeedbackCourses = assessmentFeedbackData?.filter(course => {
    if (!course.feedbackSubmitted) {
      const courseDate = new Date(course?.date);
      const today = new Date();
      courseDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return courseDate.getTime() < today.getTime();
    }
    return false;
  }) || [];
  console.log('Pending Feedback afterFilter: ', pendingFeedbackCourses)

  const myAssessmentCourses = assessmentFeedbackData?.filter(course => {
    const courseDate = new Date(course.date);
    const today = new Date();
    courseDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return courseDate.getTime() < today.getTime();
  }) || [];
  console.log('myAssessmentCourses afterFilter: ', myAssessmentCourses);

  const completedAssessmentCount = assessmentFeedbackData?.filter(course => {
    if (course.assessmentStatus === 'completed') {
      const courseDate = new Date(course.date);
      const today = new Date();
      courseDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return courseDate.getTime() < today.getTime();
    }
    return false;
  }).length || 0;



  // Loading states
  const isLoading = loading || assessmentsLoading || feedbackLoading || peerLoading;
  const hasErrors = error || assessmentsError || feedbackError || peerError;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <h1 className="text-3xl font-bold text-authority-charcoal">
                    Assessment & Feedback Center
                  </h1>
                  {/* <ConnectionStatus
                    isConnected={isConnected}
                    connectionStatus={connectionStatus}
                  /> */}
                </div>
                <p className="text-professional-gray">
                  Multi-dimensional evaluation system integrated with Microsoft Dynamics 365 Business Central for comprehensive learning assessment and cultural feedback integration
                </p>
                {/* {!isConnected && (
                  <div className="mt-2 text-amber-600 text-sm flex items-center space-x-1">
                    <Icon name="AlertTriangle" size={16} />
                    <span>Operating in offline mode - data may not be current</span>
                  </div>
                )} */}
              </div>

              {/* <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleExportReports}
                  loading={isExporting}
                  disabled={isExporting}
                >
                  {isExporting ? 'Exporting...' : 'Export Reports'}
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleRequestAssessment}
                  // disabled={!isConnected}
                >
                  Request Assessment
                </Button>
              </div> */}
            </div>
          </div>

          {/* Error Display */}
          {/* {hasErrors && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800">
                <Icon name="AlertCircle" size={20} />
                <h3 className="font-medium">Data Loading Issues</h3>
              </div>
              <div className="mt-2 text-sm text-red-700 space-y-1">
                {error && <div>• Assessment/Feedback Data: {error}</div>}
                {assessmentsError && <div>• Assessments: {assessmentsError}</div>}
                {feedbackError && <div>• Feedback: {feedbackError}</div>}
                {peerError && <div>• Peer Evaluations: {peerError}</div>}
              </div>
              <div className="mt-3 text-sm text-red-600">
                Some data may be incomplete. Please check your connection to Business Central.
              </div>
            </div>
          )} */}




          {/* Loading State */}
          {isLoading && (
            <div className="mb-6 text-center py-8">
              <div className="inline-flex items-center space-x-2 text-professional-gray">
                <Icon name="Loader2" size={20} className="animate-spin" />
                <span>Loading data from Business Central...</span>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <StatsOverview stats={stats} loading={assessmentsLoading} pendingFeedbackCount={pendingFeedbackCourses?.length || 0} completedAssessmentCount={completedAssessmentCount} />

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg border border-border construction-shadow mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm construction-transition ${activeTab === tab?.id
                      ? 'border-primary text-primary' : 'border-transparent text-professional-gray hover:text-authority-charcoal hover:border-border'
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
              {/* Assessments Tab */}
              {activeTab === 'assessments' && (
                <div>
                  {/* Filters */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <Select
                        options={statusOptions}
                        value={filterStatus}
                        onChange={setFilterStatus}
                        placeholder="Filter by status"
                        className="w-48"
                      />
                      {/* <Select
                        options={typeOptions}
                        value={filterType}
                        onChange={setFilterType}
                        placeholder="Filter by type"
                        className="w-48"
                      /> */}
                    </div>

                    <div className="text-sm text-professional-gray">
                      Showing {myAssessmentCourses?.length} of {myAssessmentCourses?.length || 0} assessments
                      {/* {isConnected && <span className="text-green-600"> (Live data)</span>} */}
                    </div>
                  </div>

                  {/* Assessment Cards */}
                  {myAssessmentCourses?.length > 0 ? (
                    <div className="space-y-4">
                      {myAssessmentCourses?.map((assessment) => (
                        <AssessmentCard
                          key={assessment?.id}
                          courseId={assessment?.courseId}
                          assessment={assessment}
                          onStartAssessment={handleStartAssessment}
                          onViewResults={handleViewResults}
                        // disabled={!isConnected}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-professional-gray">
                      <Icon name="ClipboardList" size={48} className="mx-auto mb-4 text-border" />
                      <h3 className="text-lg font-medium mb-2">No Assessments Found</h3>
                      <p className="text-sm">
                        {assessmentsLoading
                          ? 'Loading assessments from Business Central...' : 'No assessments match your current filters or none are available.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div>
                  {!showFeedbackForm ? (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-authority-charcoal mb-2">
                          Pending Course Feedback
                        </h3>
                        <p className="text-professional-gray">
                          Provide feedback for completed courses to help improve training quality and cultural relevance.
                          {/* {isConnected && <span className="text-green-600"> Data synced with Business Central.</span>} */}
                        </p>
                      </div>

                      {pendingFeedbackCourses?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {pendingFeedbackCourses?.map((course) => (
                            <div key={course?.id} className="bg-white rounded-lg border border-border p-6 construction-shadow hover:construction-shadow-lg construction-transition">
                              <div className="mb-4">
                                <h4 className="font-semibold text-authority-charcoal mb-2">
                                  {course?.courseName}
                                </h4>
                                <div className="text-sm text-professional-gray space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <Icon name="Calendar" size={16} />
                                    <span>Completed: {course?.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Icon name="User" size={16} />
                                    <span>Instructor: {course?.instructorName?.name}</span>
                                  </div>
                                </div>
                              </div>

                              <Button
                                variant="default"
                                fullWidth
                                onClick={() => handleCourseSelection(course)}
                                iconName="MessageSquare"
                                iconPosition="left"
                                disabled={!isOnlineMode}
                              >
                                {!isOnlineMode && course?.type !== 'self_assessment' ? 'Offline Mode' : 'Provide Feedback'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-professional-gray">
                          <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-border" />
                          <h3 className="text-lg font-medium mb-2">No Pending Feedback</h3>
                          <p className="text-sm">
                            {feedbackLoading
                              ? 'Loading feedback courses from Business Central...' : 'All course feedback has been completed or none are available.'}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <FeedbackForm
                      course={selectedCourse}
                      onSubmit={handleSubmitFeedback}
                      onCancel={() => {
                        setShowFeedbackForm(false);
                        setSelectedCourse(null);
                      }}
                    // isConnected={isConnected}
                    />
                  )}
                </div>
              )}

              {/* Peer Evaluation Tab */}
              {/* {activeTab === 'peer-evaluation' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-authority-charcoal mb-2">
                      Peer Evaluations
                    </h3>
                    <p className="text-professional-gray">
                      Evaluate colleagues who participated in courses with you. Your feedback helps build a collaborative learning community.
                      {isConnected && <span className="text-green-600"> Data synced with Business Central.</span>}
                    </p>
                  </div>

                  {peerEvaluations?.length > 0 ? (
                    <div className="space-y-6">
                      {peerEvaluations?.map((evaluation) => (
                        <PeerEvaluationCard
                          key={evaluation?.id}
                          evaluation={evaluation}
                          onSubmitEvaluation={handleSubmitPeerEvaluation}
                          disabled={!isConnected}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-professional-gray">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-border" />
                      <h3 className="text-lg font-medium mb-2">No Peer Evaluations</h3>
                      <p className="text-sm">
                        {peerLoading
                          ? 'Loading peer evaluations from Business Central...' : 'No peer evaluations are currently pending or available.'}
                      </p>
                    </div>
                  )}
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Request Assessment Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-authority-charcoal">
                Request New Assessment
              </h3>
              <button
                onClick={() => setShowRequestForm(false)}
                className="text-professional-gray hover:text-authority-charcoal"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* {!isConnected && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-center space-x-2 text-amber-700">
                  <Icon name="AlertTriangle" size={16} />
                  <span className="text-sm">Connection to Business Central required</span>
                </div>
              </div>
            )} */}

            <form
              onSubmit={(e) => {
                e?.preventDefault();
                const formData = new FormData(e.target);
                const requestData = {
                  courseName: formData?.get('courseName'),
                  assessmentType: formData?.get('assessmentType'),
                  preferredDate: formData?.get('preferredDate'),
                  additionalNotes: formData?.get('additionalNotes')
                };
                handleSubmitAssessmentRequest(requestData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-authority-charcoal mb-2">
                  Course/Topic Name *
                </label>
                <input
                  type="text"
                  name="courseName"
                  required
                  // disabled={!isConnected}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter course or topic name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-authority-charcoal mb-2">
                  Assessment Type *
                </label>
                <select
                  name="assessmentType"
                  required
                  // disabled={!isConnected}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select assessment type</option>
                  <option value="Final Assessment">Final Assessment</option>
                  <option value="Certification Exam">Certification Exam</option>
                  <option value="Skills Assessment">Skills Assessment</option>
                  <option value="Practical Assessment">Practical Assessment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-authority-charcoal mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  // disabled={!isConnected}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-authority-charcoal mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  rows="3"
                  // disabled={!isConnected}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Any specific requirements or notes"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <Button
                  type="submit"
                  variant="default"
                  fullWidth
                // disabled={!isConnected}
                >
                  Submit to Business Central
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResultsModal && (
        <ResultsModal
          assessment={selectedAssessment}
          onClose={() => {
            setShowResultsModal(false);
            setSelectedAssessment(null);
          }}
        />
      )}

      {/* Assessment Form Modal - ADD THIS HERE */}
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
    </div>
  );
};

export default AssessmentFeedbackCenter;