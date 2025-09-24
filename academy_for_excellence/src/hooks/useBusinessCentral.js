import { useState, useEffect, useCallback } from 'react';
import businessCentralApi from '../services/businessCentralApi';

/**
 * Custom hook for Business Central API integration with enhanced error handling
 */
export const useBusinessCentral = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Test connection with retry logic
  const testConnection = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setConnectionStatus('checking');
      }
      
      const result = await businessCentralApi?.testConnection();
      
      if (result?.success) {
        setIsConnected(true);
        setConnectionStatus('connected');
        setConnectionDetails(result);
        setRetryAttempt(0);
      } else {
        setIsConnected(false);
        setConnectionStatus('error');
        setConnectionDetails(result);
        
        // Auto-retry for network issues (max 3 attempts)
        if (retryAttempt < 3 && result?.message?.includes('Network')) {
          setTimeout(() => {
            setRetryAttempt(prev => prev + 1);
            testConnection(true);
          }, Math.pow(2, retryAttempt) * 2000); // Exponential backoff
        }
      }
    } catch (error) {
      console.error('Business Central connection test failed:', error);
      setIsConnected(false);
      setConnectionStatus('error');
      setConnectionDetails({
        success: false,
        message: error?.message || 'Connection failed',
        details: 'Please check your configuration and try again'
      });
    }
  }, [retryAttempt]);

  // Manual retry function
  const retryConnection = useCallback(() => {
    setRetryAttempt(0);
    testConnection(false);
  }, [testConnection]);

  // Test connection on mount and when network status changes
  useEffect(() => {
    testConnection();

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('Network connection restored, retesting Business Central...');
      testConnection();
    };

    const handleOffline = () => {
      console.log('Network connection lost');
      setIsConnected(false);
      setConnectionStatus('offline');
      setConnectionDetails({
        success: false,
        message: 'Network connection unavailable',
        details: 'Please check your internet connection'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [testConnection]);

  return {
    isConnected,
    connectionStatus,
    connectionDetails,
    retryAttempt,
    retryConnection,
    api: businessCentralApi
  };
};

/**
 * Custom hook for fetching assessments with enhanced error handling
 */
export const useAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({
    completedAssessments: 0,
    pendingEvaluations: 0,
    averageScore: 0,
    peerReviewsGiven: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const fetchAssessments = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      console.log('Fetching assessments and stats...');
      const [assessmentsData, statsData] = await Promise.all([
        businessCentralApi?.getAssessments(),
        businessCentralApi?.getAssessmentStats()
      ]);
      
      setAssessments(assessmentsData || []);
      setStats(statsData || {
        completedAssessments: 0,
        pendingEvaluations: 0,
        averageScore: 0,
        peerReviewsGiven: 0
      });
      setLastFetchTime(new Date());
      console.log('Successfully fetched assessments and stats');
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setError(err?.message || 'Failed to fetch assessments');
      
      // Don't clear existing data on error - keep showing cached data
      // Only clear if it's the first load
      if (assessments?.length === 0) {
        setAssessments([]);
        setStats({
          completedAssessments: 0,
          pendingEvaluations: 0,
          averageScore: 0,
          peerReviewsGiven: 0
        });
      }
    } finally {
      setLoading(false);
    }
  }, [assessments?.length]);

  const submitAssessmentRequest = useCallback(async (requestData) => {
    try {
      const result = await businessCentralApi?.submitAssessmentRequest(requestData);
      // Refresh assessments after successful submission
      await fetchAssessments(false);
      return result;
    } catch (err) {
      console.error('Error submitting assessment request:', err);
      throw new Error(err?.message || 'Failed to submit assessment request');
    }
  }, [fetchAssessments]);

  const startAssessment = useCallback(async (assessmentId) => {
    try {
      const result = await businessCentralApi?.startAssessment(assessmentId);
      // Refresh assessments after starting
      await fetchAssessments(false);
      return result;
    } catch (err) {
      console.error('Error starting assessment:', err);
      throw new Error(err?.message || 'Failed to start assessment');
    }
  }, [fetchAssessments]);

  // Auto-refresh assessments periodically (every 5 minutes)
  useEffect(() => {
    fetchAssessments();
    
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAssessments(false); // Silent refresh
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [fetchAssessments]);

  return {
    assessments,
    stats,
    loading,
    error,
    lastFetchTime,
    refetch: fetchAssessments,
    submitAssessmentRequest,
    startAssessment
  };
};

/**
 * Custom hook for feedback management with enhanced error handling
 */
export const useFeedback = () => {
  const [feedbackCourses, setFeedbackCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const fetchFeedbackCourses = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      console.log('Fetching feedback courses...');
      
      const coursesData = await businessCentralApi?.getUserBookings();
console.log('CourseData from fetchFeedbackCourses: ', coursesData);
      setFeedbackCourses(coursesData || []);
      setLastFetchTime(new Date());
      console.log('Successfully fetched feedback courses');
    } catch (err) {
      console.error('Error fetching feedback courses:', err);
      setError(err?.message || 'Failed to fetch feedback courses');
      
      // Keep existing data on error
      if (feedbackCourses?.length === 0) {
        setFeedbackCourses([]);
      }
    } finally {
      setLoading(false);
    }
  }, [feedbackCourses?.length]);

const submitFeedback = useCallback(async (bookingId, courseId, feedbackData, resourceEmail) => {
    try {
      console.log('Submit Feedback function: ', bookingId, courseId, feedbackData)
      // return;
      const result = await businessCentralApi?.submitCourseFeedback(bookingId, courseId, feedbackData, resourceEmail);
      // Refresh courses after successful submission
      // await fetchFeedbackCourses(false);
     
      return result;
    } catch (err) {
      console.error('Error submitting feedback:', err);
      throw new Error(err?.message || 'Failed to submit feedback');
    }
  }, [fetchFeedbackCourses]);
 

  useEffect(() => {
    fetchFeedbackCourses();
  }, [fetchFeedbackCourses]);

  return {
    feedbackCourses,
    loading,
    error,
    lastFetchTime,
    refetch: fetchFeedbackCourses,
    submitFeedback
  };
};

/**
 * Custom hook for peer evaluations with enhanced error handling
 */
export const usePeerEvaluations = () => {
  const [peerEvaluations, setPeerEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const fetchPeerEvaluations = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      console.log('Fetching peer evaluations...');
      const evaluationsData = await businessCentralApi?.getPeerEvaluations();
      setPeerEvaluations(evaluationsData || []);
      setLastFetchTime(new Date());
      console.log('Successfully fetched peer evaluations');
    } catch (err) {
      console.error('Error fetching peer evaluations:', err);
      setError(err?.message || 'Failed to fetch peer evaluations');
      
      // Keep existing data on error
      if (peerEvaluations?.length === 0) {
        setPeerEvaluations([]);
      }
    } finally {
      setLoading(false);
    }
  }, [peerEvaluations?.length]);

  const submitEvaluation = useCallback(async (evaluationId, evaluationData) => {
    try {
      const result = await businessCentralApi?.submitPeerEvaluation(evaluationId, evaluationData);
      // Refresh evaluations after successful submission
      await fetchPeerEvaluations(false);
      return result;
    } catch (err) {
      console.error('Error submitting peer evaluation:', err);
      throw new Error(err?.message || 'Failed to submit peer evaluation');
    }
  }, [fetchPeerEvaluations]);

  useEffect(() => {
    fetchPeerEvaluations();
  }, [fetchPeerEvaluations]);

  return {
    peerEvaluations,
    loading,
    error,
    lastFetchTime,
    refetch: fetchPeerEvaluations,
    submitEvaluation
  };
};