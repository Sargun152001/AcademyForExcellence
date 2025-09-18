import axios from "axios";

// Proxy base URL → goes to your Node backend
const BASE_API_URL = "/api";
const BACKEND_URL = "https://academyforexcellence-backend-ywc2.onrender.com";

// Sleep utility for retry logic
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple network check
const isNetworkAvailable = () => navigator.onLine !== false;

/**
 * Create Axios instance (no MSAL, token handled by backend proxy)
 */
const createApiInstance = () => {
  return axios.create({
    baseURL: BASE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 30000,
  });
};

/**
 * Generic API call
 */
const apiCall = async (method, endpoint, data = null, retryCount = 0) => {
  const maxRetries = 2;
  const retryDelay = Math.pow(2, retryCount) * 1000;

  try {
    if (!isNetworkAvailable()) throw new Error('Network connection unavailable');

    const api = await createApiInstance();
    const config = { method, url: endpoint };
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) config.data = data;

    const response = await api(config);
    if (response?.status >= 400) {
      throw new Error(`Business Central API Error: ${response.status} - ${response.data?.message || response.data?.error || 'Unknown error'}`);
    }
    return response.data;

  } catch (error) {
    console.error(`API call failed (${method} ${endpoint}) - Attempt ${retryCount + 1}:`, error);

    if (error?.response?.status === 401) {
      accessToken = null;
      tokenExpiry = null;
    }

    const shouldRetry = retryCount < maxRetries &&
      (error?.response?.status === 401 || error?.response?.status >= 500 || error?.message?.includes('Network Error'));
    if (shouldRetry) {
      await sleep(retryDelay);
      return apiCall(method, endpoint, data, retryCount + 1);
    }

    throw error;
  }
};
// =============================================================================
// ASSESSMENT RELATED APIs
// =============================================================================

/**
 * Get all assessments for current user
 */
export const getAssessments = async () => {
  try {
    const response = await apiCall('GET', '/Assessments');
    return response?.value?.map(assessment => ({
      id: assessment?.AssessmentId,
      courseName: assessment?.CourseName,
      description: assessment?.Description,
      dueDate: assessment?.DueDate,
      duration: assessment?.DurationMinutes,
      status: assessment?.Status?.toLowerCase(),
      type: assessment?.Type,
      score: assessment?.Score,
      completedDate: assessment?.CompletedDate,
      certificationExpiry: assessment?.CertificationExpiry,
      scores: {
        technical: assessment?.TechnicalScore,
        safety: assessment?.SafetyScore,
        management: assessment?.ManagementScore,
        cultural: assessment?.CulturalScore,
        communication: assessment?.CommunicationScore
      }
    })) || [];
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }
};

/**
 * Get assessment statistics
 */
export const getAssessmentStats = async () => {
  try {
    const response = await apiCall('GET', '/AssessmentStats');
    return {
      completedAssessments: response?.CompletedAssessments || 0,
      pendingEvaluations: response?.PendingEvaluations || 0,
      averageScore: response?.AverageScore || 0,
      peerReviewsGiven: response?.PeerReviewsGiven || 0
    };
  } catch (error) {
    console.error('Error fetching assessment stats:', error);
    // Return default values if API fails
    return {
      completedAssessments: 0,
      pendingEvaluations: 0,
      averageScore: 0,
      peerReviewsGiven: 0
    };
  }
};

/**
 * Submit assessment request
 */
export const submitAssessmentRequest = async (requestData) => {
  try {
    const payload = {
      CourseName: requestData?.courseName,
      AssessmentType: requestData?.assessmentType,
      PreferredDate: requestData?.preferredDate,
      AdditionalNotes: requestData?.additionalNotes,
      RequestedBy: 'current-user', // This should be the actual user ID
      RequestDate: new Date()?.toISOString()
    };
    
    const response = await apiCall('POST', '/AssessmentRequests', payload);
    return response;
  } catch (error) {
    console.error('Error submitting assessment request:', error);
    throw error;
  }
};

/**
 * Start an assessment
 */
export const startAssessment = async (assessmentId) => {
  try {
    const payload = {
      AssessmentId: assessmentId,
      StartTime: new Date()?.toISOString()
    };
    
    const response = await apiCall('POST', `/Assessments(${assessmentId})/Start`, payload);
    return response;
  } catch (error) {
    console.error('Error starting assessment:', error);
    throw error;
  }
};

// =============================================================================
// FEEDBACK RELATED APIs
// =============================================================================

/**
 * Get courses available for feedback
 */
export const getFeedbackCourses = async () => {
  try {
    const response = await apiCall('GET', '/CourseFeedback');
    return response?.value?.map(course => ({
      id: course?.CourseId,
      name: course?.CourseName,
      completionDate: course?.CompletionDate,
      instructor: course?.InstructorName,
      status: course?.FeedbackStatus?.toLowerCase()
    })) || [];
  } catch (error) {
    console.error('Error fetching feedback courses:', error);
    throw error;
  }
};

/**
 * Submit course feedback
 */
export const submitCourseFeedback = async (bookingId, courseId, feedbackData) => {
  try {
    const payload = {
      bookingId: bookingId,
      courseId: courseId,
      additionalComments: feedbackData?.additionalComments,
      anonymous: feedbackData?.anonymous, //boolean
      communicationStyle: feedbackData?.communicationStyle,
      contentQuality: feedbackData?.contentQuality,
      culturalSensitivity: feedbackData?.culturalSensitivity,
      instructorRating: feedbackData?.instructorRating,
      overallRating: feedbackData?.overallRating,
      practicalApplicability: feedbackData?.practicalApplicability,
      projectImpact: feedbackData?.projectImpact,
      recommendations: feedbackData?.recommendations,
      safetyImprovement: feedbackData?.safetyImprovement,
      submittedBy: 'current-user', // This should be the actual user ID
      submittedDate: new Date()?.toISOString()
    };
    // return;
    console.log("📡 FeedbackPayload Sent (camelCase):", payload);
 
    // const response = await apiCall('POST', '/courseFeedbacks', payload);
    const response = await fetch(`${BACKEND_URL}/api/courseFeedbacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
 
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Backend response:", text);
      throw new Error(`Failed to create booking: ${response.status} ${text}`);
    }
 
    console.log('Response from submitCourseFeedback: ', response);
 
    return response;
  } catch (error) {
    console.error('Error submitting course feedback:', error);
    throw error;
  }
};
 
// =============================================================================
// PEER EVALUATION APIs
// =============================================================================

/**
 * Get peer evaluations to be completed
 */
// export const getPeerEvaluations = async () => {
//   try {
//     const response = await apiCall('GET', '/PeerEvaluations');
//     return response?.value?.map(evaluation => ({
//       id: evaluation?.EvaluationId,
//       colleague: {
//         name: evaluation?.ColleagueName,
//         role: evaluation?.ColleagueRole,
//         avatar: evaluation?.ColleagueAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${evaluation?.ColleagueName}`
//       },
//       courseName: evaluation?.CourseName,
//       dueDate: evaluation?.DueDate,
//       status: evaluation?.Status?.toLowerCase()
//     })) || [];
//   } catch (error) {
//     console.error('Error fetching peer evaluations:', error);
//     throw error;
//   }
// };

// /**
//  * Submit peer evaluation
//  */
// export const submitPeerEvaluation = async (evaluationId, evaluationData) => {
//   try {
//     const payload = {
//       EvaluationId: evaluationId,
//       Collaboration: evaluationData?.collaboration,
//       Communication: evaluationData?.communication,
//       Professionalism: evaluationData?.professionalism,
//       TechnicalSkills: evaluationData?.technicalSkills,
//       Leadership: evaluationData?.leadership,
//       CulturalAwareness: evaluationData?.culturalAwareness,
//       OverallRating: evaluationData?.overallRating,
//       Strengths: evaluationData?.strengths,
//       ImprovementAreas: evaluationData?.improvementAreas,
//       AdditionalComments: evaluationData?.additionalComments,
//       EvaluatedBy: 'current-user', // This should be the actual user ID
//       EvaluationDate: new Date()?.toISOString()
//     };
    
//     const response = await apiCall('PUT', `/PeerEvaluations(${evaluationId})`, payload);
//     return response;
//   } catch (error) {
//     console.error('Error submitting peer evaluation:', error);
//     throw error;
//   }
// };

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connectivity with enhanced diagnostics
 */
export const testConnection = async () => {
  try {
    // First check configuration
    validateConfig();
    
    // Check network
    if (!isNetworkAvailable()) {
      return { 
        success: false, 
        message: 'Network connection unavailable',
        details: 'Please check your internet connection and try again.'
      };
    }

    // Test authentication
    console.log('Testing Business Central connection...');
    await getAccessToken();
    
    // Test API endpoint
    await apiCall('GET', '/');
    
    return { 
      success: true, 
      message: 'Connected to Business Central API successfully',
      details: 'All systems operational'
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { 
      success: false, 
      message: error?.message || 'Connection test failed',
      details: error?.stack || 'Unknown error occurred'
    };
  }
};

/**
 * Get configuration status for debugging
 */
export const getConfigurationStatus = () => {
  try {
    validateConfig();
    return {
      valid: true,
      message: 'Configuration is valid',
      environment: BC_CONFIG?.environment,
      baseUrl: BC_CONFIG?.baseUrl
    };
  } catch (error) {
    return {
      valid: false,
      message: error?.message,
      environment: BC_CONFIG?.environment,
      baseUrl: BC_CONFIG?.baseUrl
    };
  }
};

/**
 * Get all available entity sets
 */
export const getEntitySets = async () => {
  try {
    const response = await apiCall('GET', '/');
    return response;
  } catch (error) {
    console.error('Error fetching entity sets:', error);
    throw error;
  }
};

// =============================================================================
// COURSES RELATED APIs
// =============================================================================

/**
 * Get all available courses with optional filtering
 */

const toQueryString = (obj) => {
  const params = new URLSearchParams();
  if (!obj) return "";
  if (obj.search) params.append("search", obj.search);
  if (obj.category) params.append("category", obj.category);
  if (obj.level) params.append("level", obj.level);
  if (obj.status) params.append("status", obj.status);
  const s = params.toString();
  return s ? `?${s}` : "";
};

export const getCourses = async (filters = {}) => {
  try {
    const qs = toQueryString(filters);
    const url = `${BACKEND_URL}/api/Courses?$expand=Curriculams${qs}`;
    console.log("📡 Full URL being called:", url);

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Backend error: ${res.status} ${text}`);
    }

    const data = await res.json();
    console.log("Raw backend response for courses:", data);

    const arr = data?.value || [];

    const courses = arr.map((course) => {
      const imageUrl = course?.ImageUrl
        ? `data:image/jpeg;base64,${course.ImageUrl.replace(/\s/g, '')}`
        : null;

      return {
        id: course?.CourseId,
        name: course?.CourseName,
        description: course?.Description,
        longDescription: course?.LongDescription,
        category: course?.Category,
        level: course?.Level,
        duration: course?.DurationHours,
       instructor: {
          name: course?.InstructorName,
          title: course?.InstructorTitle,
          avatar: course?.InstructorAvatar
            ? `data:image/jpeg;base64,${course.InstructorAvatar.replace(/\s/g, '')}`
            : null,
        },
        skills: course?.Skills
          ? course.Skills.split(',').map((s) => s.trim())
          : [],
        maxParticipants: course?.MaxParticipants,
        currentEnrollments: course?.CurrentEnrollments,
        startDate: course?.StartDate,
        endDate: course?.EndDate,
        location: course?.Location,
        format: course?.Format,
        price: course?.Price,
        currency: course?.Currency,
        status: course?.Status?.toLowerCase(),
        prerequisites: Array.isArray(course?.Prerequisites)
          ? course.Prerequisites
          : (course?.Prerequisites
              ? course.Prerequisites.split(",").map((p) => p.trim())
              : []),
        learningObjectives: course?.LearningObjectives,
        materials: course?.Materials,
        certificationOffered: course?.CertificationOffered,
        tags: Array.isArray(course?.Tags)
          ? course.Tags
          : (course?.Tags
              ? course.Tags.split(",").map((t) => t.trim())
              : []),
        rating: course?.AverageRating,
        totalRatings: course?.TotalRatings,
        createdDate: course?.CreatedDate,
        lastModified: course?.LastModified,
        imageUrl, 
        originalPrice: course?.OriginalPrice,
        reviewCount: course?.ReviewCount,
        enrolledCount: course?.EnrolledCount,
        isNew: course?.IsNew,
        instructorName: course?.InstructorName,
        instructorTitle: course?.InstructorTitle,
        instructorAvatar: course?.InstructorAvatar,
        bio:course?.bio,
        skills: Array.isArray(course?.Skills)
          ? course.Skills
          : (course?.Skills
              ? course.Skills.split(",").map((s) => s.trim())
              : []),
        certifications: Array.isArray(course?.Certifications)
          ? course.Certifications
          : (course?.Certifications
              ? course.Certifications.split(",").map((s) => s.trim())
              : []),
        projectType: course?.ProjectType,
        region: course?.Region,
      curriculums: Array.isArray(course?.curriculams)
  ? course.curriculams.map((module) => ({
      module: module?.Module,
      duration: module?.Duration,
      lessons: module?.Lessons
        ? module.Lessons.split(",").map((l) => l.trim())
        : [],
    }))
  : [],

      };
    });

    console.log("✅ Parsed courses:", courses);
    return courses;
  } catch (err) {
    console.error("❌ Error in getCourses (frontend):", err);
    throw err;
  }
};



/**
 * Get course details by ID
 */
export const getCourseById = async (courseId) => {
  try {
    const response = await apiCall('GET', `/Courses(${courseId})`);
    const course = response;
    
    return {
      id: course?.CourseId,
      name: course?.CourseName,
      description: course?.Description,
      detailedDescription: course?.DetailedDescription,
      category: course?.Category,
      level: course?.Level,
      duration: course?.DurationHours,
      instructor: {
        id: course?.InstructorId,
        name: course?.InstructorName,
        email: course?.InstructorEmail,
        bio: course?.InstructorBio,
        avatar: course?.InstructorAvatar
      },
      schedule: {
        startDate: course?.StartDate,
        endDate: course?.EndDate,
        sessions: course?.Sessions,
        timeZone: course?.TimeZone
      },
      enrollment: {
        maxParticipants: course?.MaxParticipants,
        currentEnrollments: course?.CurrentEnrollments,
        availableSpots: (course?.MaxParticipants || 0) - (course?.CurrentEnrollments || 0),
        enrollmentDeadline: course?.EnrollmentDeadline,
        waitlistEnabled: course?.WaitlistEnabled
      },
      location: course?.Location,
      format: course?.Format,
      price: course?.Price,
      currency: course?.Currency,
      status: course?.Status?.toLowerCase(),
      prerequisites: course?.Prerequisites?.split(',')?.map(p => p?.trim()) || [],
      learningObjectives: course?.LearningObjectives?.split(',')?.map(obj => obj?.trim()) || [],
      materials: course?.Materials?.split(',')?.map(mat => mat?.trim()) || [],
      certificationOffered: course?.CertificationOffered,
      tags: course?.Tags?.split(',')?.map(tag => tag?.trim()) || [],
      rating: course?.AverageRating,
      totalRatings: course?.TotalRatings,
      reviews: course?.RecentReviews || [],
      createdDate: course?.CreatedDate,
      lastModified: course?.LastModified
    };
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw error;
  }
};

/**
 * Create a new course
 */
export const createCourse = async (courseData) => {
  try {
    const payload = {
      CourseName: courseData?.name,
      Description: courseData?.description,
      DetailedDescription: courseData?.detailedDescription,
      Category: courseData?.category,
      Level: courseData?.level,
      DurationHours: courseData?.duration,
      InstructorId: courseData?.instructorId,
      MaxParticipants: courseData?.maxParticipants,
      StartDate: courseData?.startDate,
      EndDate: courseData?.endDate,
      Location: courseData?.location,
      Format: courseData?.format,
      Price: courseData?.price,
      Currency: courseData?.currency || 'USD',
      Prerequisites: courseData?.prerequisites?.join(', ') || '',
      LearningObjectives: courseData?.learningObjectives?.join(', ') || '',
      Materials: courseData?.materials?.join(', ') || '',
      CertificationOffered: courseData?.certificationOffered || false,
      Tags: courseData?.tags?.join(', ') || '',
      Status: 'Draft',
      CreatedBy: 'current-user', // This should be the actual user ID
      CreatedDate: new Date()?.toISOString()
    };
    
    const response = await apiCall('POST', '/Courses', payload);
    return response;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

/**
 * Update an existing course
 */
export const updateCourse = async (courseId, courseData) => {
  try {
    const payload = {
      CourseName: courseData?.name,
      Description: courseData?.description,
      DetailedDescription: courseData?.detailedDescription,
      Category: courseData?.category,
      Level: courseData?.level,
      DurationHours: courseData?.duration,
      InstructorId: courseData?.instructorId,
      MaxParticipants: courseData?.maxParticipants,
      StartDate: courseData?.startDate,
      EndDate: courseData?.endDate,
      Location: courseData?.location,
      Format: courseData?.format,
      Price: courseData?.price,
      Currency: courseData?.currency,
      Prerequisites: courseData?.prerequisites?.join(', ') || '',
      LearningObjectives: courseData?.learningObjectives?.join(', ') || '',
      Materials: courseData?.materials?.join(', ') || '',
      CertificationOffered: courseData?.certificationOffered,
      Tags: courseData?.tags?.join(', ') || '',
      Status: courseData?.status,
      LastModified: new Date()?.toISOString(),
      ModifiedBy: 'current-user' // This should be the actual user ID
    };
    
    const response = await apiCall('PUT', `/Courses(${courseId})`, payload);
    return response;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

/**
 * Delete a course
 */
export const deleteCourse = async (courseId) => {
  try {
    const response = await apiCall('DELETE', `/Courses(${courseId})`);
    return response;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

/**
 * Get course categories
 */
export const getCourseCategories = async () => {
  try {
    const response = await apiCall('GET', '/CourseCategories');
    return response?.value?.map(category => ({
      id: category?.CategoryId,
      name: category?.CategoryName,
      description: category?.Description,
      courseCount: category?.CourseCount || 0
    })) || [];
  } catch (error) {
    console.error('Error fetching course categories:', error);
    throw error;
  }
};

/**
 * Get course instructors
 */
export const getInstructors = async () => {
  try {
    const response = await apiCall('GET', '/Instructors');
    return response?.value?.map(instructor => ({
      id: instructor?.InstructorId,
      name: instructor?.Name,
      email: instructor?.Email,
      bio: instructor?.Bio,
      specialization: instructor?.Specialization,
      rating: instructor?.AverageRating,
      totalCourses: instructor?.TotalCourses,
      avatar: instructor?.Avatar,
      status: instructor?.Status?.toLowerCase()
    })) || [];
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};

// =============================================================================
// SCHEDULE RELATED APIs
// =============================================================================

/**
 * Get all schedules with optional filtering
 */
export const getSchedules = async (filters = {}) => {
  try {
    let endpoint = '/Schedules';
    const params = new URLSearchParams();
    
    // Add filters if provided
    if (filters?.courseId) {
      params.append('$filter', `CourseId eq ${filters.courseId}`);
    }
    if (filters?.instructorId) {
      params.append('$filter', `InstructorId eq ${filters.instructorId}`);
    }
    if (filters?.startDate) {
      params.append('$filter', `StartDateTime ge ${filters.startDate}`);
    }
    if (filters?.endDate) {
      params.append('$filter', `EndDateTime le ${filters.endDate}`);
    }
    if (filters?.status) {
      params.append('$filter', `Status eq '${filters.status}'`);
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await apiCall('GET', endpoint);
    return response?.value?.map(schedule => ({
      id: schedule?.ScheduleId,
      courseId: schedule?.CourseId,
      courseName: schedule?.CourseName,
      instructorId: schedule?.InstructorId,
      instructorName: schedule?.InstructorName,
      sessionTitle: schedule?.SessionTitle,
      description: schedule?.Description,
      startDateTime: schedule?.StartDateTime,
      endDateTime: schedule?.EndDateTime,
      timeZone: schedule?.TimeZone,
      location: schedule?.Location,
      format: schedule?.Format, // online, in-person, hybrid
      meetingLink: schedule?.MeetingLink,
      meetingId: schedule?.MeetingId,
      meetingPassword: schedule?.MeetingPassword,
      maxParticipants: schedule?.MaxParticipants,
      currentBookings: schedule?.CurrentBookings,
      availableSpots: (schedule?.MaxParticipants || 0) - (schedule?.CurrentBookings || 0),
      status: schedule?.Status?.toLowerCase(),
      notes: schedule?.Notes,
      materials: schedule?.Materials?.split(',')?.map(mat => mat?.trim()) || [],
      recordingEnabled: schedule?.RecordingEnabled,
      recordingUrl: schedule?.RecordingUrl,
      createdDate: schedule?.CreatedDate,
      lastModified: schedule?.LastModified
    })) || [];
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

/**
 * Get schedule details by ID
 */
export const getScheduleById = async (scheduleId) => {
  try {
    const response = await apiCall('GET', `/Schedules(${scheduleId})`);
    const schedule = response;
    
    return {
      id: schedule?.ScheduleId,
      course: {
        id: schedule?.CourseId,
        name: schedule?.CourseName,
        description: schedule?.CourseDescription
      },
      instructor: {
        id: schedule?.InstructorId,
        name: schedule?.InstructorName,
        email: schedule?.InstructorEmail
      },
      session: {
        title: schedule?.SessionTitle,
        description: schedule?.Description,
        startDateTime: schedule?.StartDateTime,
        endDateTime: schedule?.EndDateTime,
        timeZone: schedule?.TimeZone,
        duration: schedule?.DurationMinutes
      },
      location: {
        type: schedule?.Format,
        address: schedule?.Location,
        meetingLink: schedule?.MeetingLink,
        meetingId: schedule?.MeetingId,
        meetingPassword: schedule?.MeetingPassword
      },
      capacity: {
        maxParticipants: schedule?.MaxParticipants,
        currentBookings: schedule?.CurrentBookings,
        availableSpots: (schedule?.MaxParticipants || 0) - (schedule?.CurrentBookings || 0),
        waitlistCount: schedule?.WaitlistCount || 0
      },
      status: schedule?.Status?.toLowerCase(),
      notes: schedule?.Notes,
      materials: schedule?.Materials?.split(',')?.map(mat => mat?.trim()) || [],
      recording: {
        enabled: schedule?.RecordingEnabled,
        url: schedule?.RecordingUrl,
        available: schedule?.RecordingAvailable
      },
      participants: schedule?.Participants || [],
      createdDate: schedule?.CreatedDate,
      lastModified: schedule?.LastModified
    };
  } catch (error) {
    console.error('Error fetching schedule details:', error);
    throw error;
  }
};

/**
 * Create a new schedule/session
 */
export const createSchedule = async (scheduleData) => {
  try {
    const payload = {
      CourseId: scheduleData?.courseId,
      InstructorId: scheduleData?.instructorId,
      SessionTitle: scheduleData?.sessionTitle,
      Description: scheduleData?.description,
      StartDateTime: scheduleData?.startDateTime,
      EndDateTime: scheduleData?.endDateTime,
      TimeZone: scheduleData?.timeZone,
      Location: scheduleData?.location,
      Format: scheduleData?.format,
      MeetingLink: scheduleData?.meetingLink,
      MeetingId: scheduleData?.meetingId,
      MeetingPassword: scheduleData?.meetingPassword,
      MaxParticipants: scheduleData?.maxParticipants,
      Notes: scheduleData?.notes,
      Materials: scheduleData?.materials?.join(', ') || '',
      RecordingEnabled: scheduleData?.recordingEnabled || false,
      Status: 'Scheduled',
      CreatedBy: 'current-user', 
      CreatedDate: new Date()?.toISOString()
    };
    
    const response = await apiCall('POST', '/Schedules', payload);
    return response;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

/**
 * Update an existing schedule
 */
export const updateSchedule = async (scheduleId, scheduleData) => {
  try {
    const payload = {
      SessionTitle: scheduleData?.sessionTitle,
      Description: scheduleData?.description,
      StartDateTime: scheduleData?.startDateTime,
      EndDateTime: scheduleData?.endDateTime,
      TimeZone: scheduleData?.timeZone,
      Location: scheduleData?.location,
      Format: scheduleData?.format,
      MeetingLink: scheduleData?.meetingLink,
      MeetingId: scheduleData?.meetingId,
      MeetingPassword: scheduleData?.meetingPassword,
      MaxParticipants: scheduleData?.maxParticipants,
      Notes: scheduleData?.notes,
      Materials: scheduleData?.materials?.join(', ') || '',
      RecordingEnabled: scheduleData?.recordingEnabled,
      Status: scheduleData?.status,
      LastModified: new Date()?.toISOString(),
      ModifiedBy: 'current-user' // This should be the actual user ID
    };
    
    const response = await apiCall('PUT', `/Schedules(${scheduleId})`, payload);
    return response;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

/**
 * Cancel a scheduled session
 */
export const cancelSchedule = async (scheduleId, reason) => {
  try {
    const payload = {
      Status: 'Cancelled',
      CancellationReason: reason,
      CancelledBy: 'current-user', // This should be the actual user ID
      CancelledDate: new Date()?.toISOString()
    };
    
    const response = await apiCall('PUT', `/Schedules(${scheduleId})`, payload);
    return response;
  } catch (error) {
    console.error('Error cancelling schedule:', error);
    throw error;
  }
};

/**
 * Book a session (create booking)
 */

const generateScheduleId = () => Math.floor(Math.random() * 1e6).toString();
const generateBookingNo = () => {
  const maxInt = 2147483647;
  return (Date.now() % maxInt) + Math.floor(Math.random() * 1000);
};


export const createBooking = async (bookingData) => {
  try {
    const { courseId, bookingDetails = {}, isDirectBooking, userId } = bookingData;

    const scheduleID = generateScheduleId();
     const bookingNo = generateBookingNo();

    // Validate required IDs
    if (!scheduleID || !courseId) {
      throw new Error("scheduleID and courseId are required to create a booking");
    }

    // Build nominees array safely
    const nominees = Array.isArray(bookingDetails.nominees)
      ? bookingDetails.nominees.map((nominee) => ({
          name: nominee?.name || "",
          email: nominee?.email || "",
          phone: nominee?.phone || "",
          organization: nominee?.organization || "",
        }))
      : [];

    // Handle notificationPreferences: string or array
    const notificationPreferences = Array.isArray(bookingDetails.notificationPreferences)
      ? bookingDetails.notificationPreferences
      : typeof bookingDetails.notificationPreferences === "string"
      ? [bookingDetails.notificationPreferences]
      : [];

    // Build payload using camelCase for BC API
    const payload = {
      bookingNo,
      scheduleID,
      courseId,
      userId: userId || "1",
      bookingDate: new Date().toISOString(),
      status: "Pending",

      ...(bookingDetails.attendeeType && { attendeeType: bookingDetails.attendeeType }),
      ...(bookingDetails.nomineeEmail && { nomineeEmail: bookingDetails.nomineeEmail }),
      ...(nominees.length && { nominees }),

      ...(bookingDetails.emergencyContact && { emergencyContact: bookingDetails.emergencyContact }),
      ...(bookingDetails.emergencyPhone && { emergencyPhone: bookingDetails.emergencyPhone }),

      ...(bookingDetails.dietaryRestrictions && { dietaryRestrictions: bookingDetails.dietaryRestrictions }),
      ...(bookingDetails.accessibilityNeeds && { accessibilityNeeds: bookingDetails.accessibilityNeeds }),

      ...(bookingDetails.notes && { notes: bookingDetails.notes }),
      ...(bookingDetails.specialRequirements && { specialRequirements: bookingDetails.specialRequirements }),

      ...(notificationPreferences.length && { notificationPreferences }),
      ...(bookingDetails.preferredDate && { preferredDate: bookingDetails.preferredDate }),
      ...(bookingDetails.preferredTime && { preferredTime: bookingDetails.preferredTime }),
    };

    console.log("📡 Booking Payload Sent (camelCase):", payload);

const response = await fetch(`${BACKEND_URL}/api/Bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Backend response:", text);
      throw new Error(`Failed to create booking: ${response.status} ${text}`);
    }

    const result = await response.json();
    console.log("✅ Booking created:", result);
    return result;
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    throw error;
  }
};


/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId, reason) => {
  try {
    const payload = {
      Status: 'Cancelled',
      CancellationReason: reason,
      CancelledDate: new Date()?.toISOString()
    };
    
    const response = await apiCall('PUT', `/Bookings(${bookingId})`, payload);
    return response;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

/**
 * Get user's bookings
 */
// Fetch user bookings and merge with course data
export const getUserBookings = async (filters = {}) => {
  try {
    // 1️⃣ Build query string
    const qs = toQueryString(filters);
    const url = `${BACKEND_URL}/api/Bookings${qs}`;
    console.log("📡 Full URL being called (bookings):", url);

    // 2️⃣ Fetch bookings
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Backend error: ${res.status} ${text}`);
    }

    const data = await res.json();
    const bookings = data?.value || [];

    // 3️⃣ Fetch courses once
    const courses = await getCourses();

    // 4️⃣ Map bookings → normalized format
    return bookings.map((b) => {
      const course = courses.find((c) => c.id === b.courseId);
      const bookingDate = b.bookingDate ? new Date(b.bookingDate) : null;

      return {
        id: b.systemId,
        bookingId: b.bookingNo,
        scheduleId: b.scheduleID,
        courseId: b.courseId,
        courseName: b.courseTitle || course?.name,
        date: b.preferredDate,
        time: b.preferredTime,
        location: course?.location || "Online / TBD",
        format: b.attendeeType || course?.format,
        status: b.status?.toLowerCase(),
        specialRequirements: b.specialRequirements || "",
        notes: b.notes,
        duration: course?.duration || null,
        instructor: course?.instructor || null,
        category: course?.category || null,
        level: course?.level || null,
        rating: course?.rating || null,
        totalRatings: course?.totalRatings || null,
        createdDate: course?.createdDate || null,
        lastModified: course?.lastModified || null,
        imageUrl: course?.imageUrl || null,
        originalPrice: course?.originalPrice || null,
      };
    });
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    throw error;
  }
};




// =============================================================================
// ENROLLMENT RELATED APIs
// =============================================================================

/**
 * Get all enrollments with optional filtering
 */
export const getEnrollments = async (filters = {}) => {
  try {
    let endpoint = '/Enrollments';
    const params = new URLSearchParams();
    
    // Add filters if provided
    if (filters?.userId) {
      params.append('$filter', `UserId eq '${filters.userId}'`);
    } else {
      // Default to current user
      params.append('$filter', "UserId eq 'current-user'");
    }
    
    if (filters?.courseId) {
      params.append('$filter', `CourseId eq ${filters.courseId}`);
    }
    if (filters?.status) {
      params.append('$filter', `Status eq '${filters.status}'`);
    }
    if (filters?.enrollmentDate) {
      params.append('$filter', `EnrollmentDate ge ${filters.enrollmentDate}`);
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await apiCall('GET', endpoint);
    return response?.value?.map(enrollment => ({
      id: enrollment?.EnrollmentId,
      courseId: enrollment?.CourseId,
      courseName: enrollment?.CourseName,
      courseDescription: enrollment?.CourseDescription,
      category: enrollment?.Category,
      level: enrollment?.Level,
      instructorName: enrollment?.InstructorName,
      startDate: enrollment?.CourseStartDate,
      endDate: enrollment?.CourseEndDate,
      enrollmentDate: enrollment?.EnrollmentDate,
      status: enrollment?.Status?.toLowerCase(),
      progress: enrollment?.Progress || 0,
      completionDate: enrollment?.CompletionDate,
      certificateIssued: enrollment?.CertificateIssued,
      certificateUrl: enrollment?.CertificateUrl,
      grade: enrollment?.Grade,
      attendanceRate: enrollment?.AttendanceRate,
      lastAccessDate: enrollment?.LastAccessDate,
      paymentStatus: enrollment?.PaymentStatus?.toLowerCase(),
      paymentAmount: enrollment?.PaymentAmount,
      refundEligible: enrollment?.RefundEligible,
      waitlistPosition: enrollment?.WaitlistPosition
    })) || [];
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

/**
 * Get enrollment details by ID
 */
export const getEnrollmentById = async (enrollmentId) => {
  try {
    const response = await apiCall('GET', `/Enrollments(${enrollmentId})`);
    const enrollment = response;
    
    return {
      id: enrollment?.EnrollmentId,
      course: {
        id: enrollment?.CourseId,
        name: enrollment?.CourseName,
        description: enrollment?.CourseDescription,
        category: enrollment?.Category,
        level: enrollment?.Level,
        duration: enrollment?.DurationHours,
        format: enrollment?.Format,
        startDate: enrollment?.CourseStartDate,
        endDate: enrollment?.CourseEndDate
      },
      instructor: {
        name: enrollment?.InstructorName,
        email: enrollment?.InstructorEmail
      },
      enrollment: {
        date: enrollment?.EnrollmentDate,
        status: enrollment?.Status?.toLowerCase(),
        source: enrollment?.EnrollmentSource,
        notes: enrollment?.EnrollmentNotes
      },
      progress: {
        percentage: enrollment?.Progress || 0,
        completedSessions: enrollment?.CompletedSessions || 0,
        totalSessions: enrollment?.TotalSessions || 0,
        lastAttendedDate: enrollment?.LastAttendedDate,
        timeSpent: enrollment?.TimeSpentMinutes || 0
      },
      completion: {
        completionDate: enrollment?.CompletionDate,
        certificateIssued: enrollment?.CertificateIssued,
        certificateUrl: enrollment?.CertificateUrl,
        grade: enrollment?.Grade,
        passingScore: enrollment?.PassingScore
      },
      attendance: {
        rate: enrollment?.AttendanceRate || 0,
        sessionsAttended: enrollment?.SessionsAttended || 0,
        totalSessions: enrollment?.TotalSessions || 0,
        lastAttendedDate: enrollment?.LastAttendedDate
      },
      payment: {
        status: enrollment?.PaymentStatus?.toLowerCase(),
        amount: enrollment?.PaymentAmount,
        currency: enrollment?.Currency || 'USD',
        paymentDate: enrollment?.PaymentDate,
        refundEligible: enrollment?.RefundEligible,
        refundDeadline: enrollment?.RefundDeadline
      },
      waitlist: {
        position: enrollment?.WaitlistPosition,
        estimatedEnrollmentDate: enrollment?.EstimatedEnrollmentDate
      }
    };
  } catch (error) {
    console.error('Error fetching enrollment details:', error);
    throw error;
  }
};

/**
 * Enroll in a course
 */
export const enrollInCourse = async (courseId, enrollmentData = {}) => {
  try {
    const payload = {
      CourseId: courseId,
      UserId: 'current-user', // This should be the actual user ID
      EnrollmentDate: new Date()?.toISOString(),
      Status: 'Active',
      EnrollmentSource: enrollmentData?.source || 'web',
      EnrollmentNotes: enrollmentData?.notes,
      NotificationPreferences: enrollmentData?.notificationPreferences || 'email',
      SpecialRequirements: enrollmentData?.specialRequirements,
      EmergencyContact: enrollmentData?.emergencyContact,
      DietaryRestrictions: enrollmentData?.dietaryRestrictions
    };
    
    const response = await apiCall('POST', '/Enrollments', payload);
    return response;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

/**
 * Update enrollment (e.g., progress, notes)
 */
export const updateEnrollment = async (enrollmentId, updateData) => {
  try {
    const payload = {
      Progress: updateData?.progress,
      Status: updateData?.status,
      EnrollmentNotes: updateData?.notes,
      LastAccessDate: new Date()?.toISOString(),
      TimeSpentMinutes: updateData?.timeSpent,
      CompletedSessions: updateData?.completedSessions,
      SessionsAttended: updateData?.sessionsAttended,
      Grade: updateData?.grade,
      SpecialRequirements: updateData?.specialRequirements,
      LastModified: new Date()?.toISOString()
    };
    
    const response = await apiCall('PUT', `/Enrollments(${enrollmentId})`, payload);
    return response;
  } catch (error) {
    console.error('Error updating enrollment:', error);
    throw error;
  }
};

/**
 * Withdraw from a course
 */
export const withdrawFromCourse = async (enrollmentId, reason) => {
  try {
    const payload = {
      Status: 'Withdrawn',
      WithdrawalReason: reason,
      WithdrawalDate: new Date()?.toISOString(),
      LastModified: new Date()?.toISOString()
    };
    
    const response = await apiCall('PUT', `/Enrollments(${enrollmentId})`, payload);
    return response;
  } catch (error) {
    console.error('Error withdrawing from course:', error);
    throw error;
  }
};

/**
 * Get enrollment status for a specific course
 */
export const getEnrollmentStatus = async (courseId, userId = 'current-user') => {
  try {
    const endpoint = `/Enrollments?$filter=CourseId eq ${courseId} and UserId eq '${userId}'`;
    const response = await apiCall('GET', endpoint);
    
    if (response?.value?.length > 0) {
      const enrollment = response.value[0];
      return {
        enrolled: true,
        enrollmentId: enrollment?.EnrollmentId,
        status: enrollment?.Status?.toLowerCase(),
        enrollmentDate: enrollment?.EnrollmentDate,
        progress: enrollment?.Progress || 0,
        canWithdraw: enrollment?.Status === 'Active' && enrollment?.RefundEligible,
        withdrawalDeadline: enrollment?.RefundDeadline
      };
    } else {
      return {
        enrolled: false,
        canEnroll: true // This could be enhanced with capacity checks
      };
    }
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    throw error;
  }
};

/**
 * Get enrollment statistics
 */
export const getEnrollmentStats = async () => {
  try {
    const response = await apiCall('GET', '/EnrollmentStats');
    return {
      totalEnrollments: response?.TotalEnrollments || 0,
      activeEnrollments: response?.ActiveEnrollments || 0,
      completedCourses: response?.CompletedCourses || 0,
      inProgressCourses: response?.InProgressCourses || 0,
      certificatesEarned: response?.CertificatesEarned || 0,
      averageProgress: response?.AverageProgress || 0,
      totalTimeSpent: response?.TotalTimeSpentHours || 0,
      averageAttendanceRate: response?.AverageAttendanceRate || 0
    };
  } catch (error) {
    console.error('Error fetching enrollment stats:', error);
    // Return default values if API fails
    return {
      totalEnrollments: 0,
      activeEnrollments: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      certificatesEarned: 0,
      averageProgress: 0,
      totalTimeSpent: 0,
      averageAttendanceRate: 0
    };
  }
};

/**
 * Request course refund
 */
export const requestRefund = async (enrollmentId, refundData) => {
  try {
    const payload = {
      EnrollmentId: enrollmentId,
      RefundReason: refundData?.reason,
      RefundAmount: refundData?.amount,
      BankDetails: refundData?.bankDetails,
      AdditionalComments: refundData?.comments,
      RequestedBy: 'current-user', // This should be the actual user ID
      RequestDate: new Date()?.toISOString()
    };
    
    const response = await apiCall('POST', '/RefundRequests', payload);
    return response;
  } catch (error) {
    console.error('Error requesting refund:', error);
    throw error;
  }
};

export default {
  // Assessment APIs
  getAssessments,
  getAssessmentStats,
  submitAssessmentRequest,
  startAssessment,
  // Feedback APIs
  getFeedbackCourses,
  submitCourseFeedback,
  // Peer Evaluation APIs
  // getPeerEvaluations,
  // submitPeerEvaluation,
  // Course APIs
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCategories,
  getInstructors,
  // Schedule APIs
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  cancelSchedule,
  createBooking,
  cancelBooking,
  getUserBookings,
  // Enrollment APIs
  getEnrollments,
  getEnrollmentById,
  enrollInCourse,
  updateEnrollment,
  withdrawFromCourse,
  getEnrollmentStatus,
  getEnrollmentStats,
  requestRefund,
  // Utility APIs
  testConnection,
  getEntitySets,
  getConfigurationStatus
};