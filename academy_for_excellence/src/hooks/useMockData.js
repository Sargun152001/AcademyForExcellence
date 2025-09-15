import { useState, useEffect, useCallback } from 'react';
import mockDataService from '../services/mockDataService';

/**
 * Custom hook for Mock Data Service integration
 */
export const useMockData = () => {
  const [isConnected, setIsConnected] = useState(true); // Always connected for mock data
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [connectionDetails, setConnectionDetails] = useState({
    success: true,
    message: 'Connected to Mock Data Service',
    details: 'Using local mock data - no external API required'
  });
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Test connection (always successful for mock)
  const testConnection = useCallback(async () => {
    try {
      const result = await mockDataService?.testConnection();
      setIsConnected(true);
      setConnectionStatus('connected');
      setConnectionDetails(result);
      setRetryAttempt(0);
    } catch (error) {
      // This should never happen with mock data, but handle gracefully
      console.error('Mock data service error:', error);
      setIsConnected(false);
      setConnectionStatus('error');
      setConnectionDetails({
        success: false,
        message: 'Mock data service error',
        details: error?.message || 'Unknown error'
      });
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return {
    isConnected,
    connectionStatus,
    connectionDetails,
    retryAttempt,
    retryConnection: testConnection, // Same as testConnection for mock
    api: mockDataService
  };
};

/**
 * Custom hook for fetching assessments with mock data
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
      
      console.log('Fetching assessments and stats from mock data...');
      const [assessmentsData, statsData] = await Promise.all([
        mockDataService?.getAssessments(),
        mockDataService?.getAssessmentStats()
      ]);
      
      setAssessments(assessmentsData || []);
      setStats(statsData || {
        completedAssessments: 0,
        pendingEvaluations: 0,
        averageScore: 0,
        peerReviewsGiven: 0
      });
      setLastFetchTime(new Date());
      console.log('Successfully fetched assessments and stats from mock data');
    } catch (err) {
      console.error('Error fetching assessments from mock data:', err);
      setError(err?.message || 'Failed to fetch assessments');
      
      // Keep existing data on error
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
      const result = await mockDataService?.submitAssessmentRequest(requestData);
      // Refresh assessments after successful submission
      await fetchAssessments(false);
      return result;
    } catch (err) {
      console.error('Error submitting assessment request to mock data:', err);
      throw new Error(err?.message || 'Failed to submit assessment request');
    }
  }, [fetchAssessments]);

  const startAssessment = useCallback(async (assessmentId) => {
    try {
      const result = await mockDataService?.startAssessment(assessmentId);
      // Refresh assessments after starting
      await fetchAssessments(false);
      return result;
    } catch (err) {
      console.error('Error starting assessment in mock data:', err);
      throw new Error(err?.message || 'Failed to start assessment');
    }
  }, [fetchAssessments]);

  useEffect(() => {
    fetchAssessments();
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
 * Custom hook for feedback management with mock data
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
      
      console.log('Fetching feedback courses from mock data...');
      const coursesData = await mockDataService?.getFeedbackCourses();
      setFeedbackCourses(coursesData || []);
      setLastFetchTime(new Date());
      console.log('Successfully fetched feedback courses from mock data');
    } catch (err) {
      console.error('Error fetching feedback courses from mock data:', err);
      setError(err?.message || 'Failed to fetch feedback courses');
      
      if (feedbackCourses?.length === 0) {
        setFeedbackCourses([]);
      }
    } finally {
      setLoading(false);
    }
  }, [feedbackCourses?.length]);

  const submitFeedback = useCallback(async (courseId, feedbackData) => {
    try {
      const result = await mockDataService?.submitCourseFeedback(courseId, feedbackData);
      // Refresh courses after successful submission
      await fetchFeedbackCourses(false);
      return result;
    } catch (err) {
      console.error('Error submitting feedback to mock data:', err);
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
 * Custom hook for peer evaluations with mock data
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
      
      console.log('Fetching peer evaluations from mock data...');
      const evaluationsData = await mockDataService?.getPeerEvaluations();
      setPeerEvaluations(evaluationsData || []);
      setLastFetchTime(new Date());
      console.log('Successfully fetched peer evaluations from mock data');
    } catch (err) {
      console.error('Error fetching peer evaluations from mock data:', err);
      setError(err?.message || 'Failed to fetch peer evaluations');
      
      if (peerEvaluations?.length === 0) {
        setPeerEvaluations([]);
      }
    } finally {
      setLoading(false);
    }
  }, [peerEvaluations?.length]);

  const submitEvaluation = useCallback(async (evaluationId, evaluationData) => {
    try {
      const result = await mockDataService?.submitPeerEvaluation(evaluationId, evaluationData);
      // Refresh evaluations after successful submission
      await fetchPeerEvaluations(false);
      return result;
    } catch (err) {
      console.error('Error submitting peer evaluation to mock data:', err);
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

/**
 * Custom hook for courses with mock data
 */
export const useCourses = (filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching courses from mock data...', filters);
      const coursesData = await mockDataService?.getCourses(filters);
      setCourses(coursesData || []);
    } catch (err) {
      console.error('Error fetching courses from mock data:', err);
      setError(err?.message || 'Failed to fetch courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
};

/**
 * Custom hook for enrollments with mock data
 */
export const useEnrollments = (filters = {}) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching enrollments from mock data...', filters);
      const enrollmentsData = await mockDataService?.getEnrollments(filters);
      setEnrollments(enrollmentsData || []);
    } catch (err) {
      console.error('Error fetching enrollments from mock data:', err);
      setError(err?.message || 'Failed to fetch enrollments');
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  const enrollInCourse = useCallback(async (courseId, enrollmentData) => {
    try {
      const result = await mockDataService?.enrollInCourse(courseId, enrollmentData);
      await fetchEnrollments();
      return result;
    } catch (err) {
      console.error('Error enrolling in course:', err);
      throw new Error(err?.message || 'Failed to enroll in course');
    }
  }, [fetchEnrollments]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    enrollments,
    loading,
    error,
    refetch: fetchEnrollments,
    enrollInCourse
  };
};