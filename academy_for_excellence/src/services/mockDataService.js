

// Mock data for courses
const mockCourses = [
  {
    id: 1,
    name: "Digital Leadership in Construction",
    description: "Develop digital leadership skills for modern construction projects",
    category: "Leadership",
    level: "Intermediate",
    duration: 40,
    instructor: "Dr. Sarah Ahmed",
    instructorId: "inst-001",
    maxParticipants: 25,
    currentEnrollments: 18,
    startDate: "2025-02-15T09:00:00Z",
    endDate: "2025-02-19T17:00:00Z",
    location: "Dubai Training Center",
    format: "hybrid",
    price: 2500,
    currency: "AED",
    status: "active",
    prerequisites: "Basic project management knowledge",
    learningObjectives: "Digital tools mastery, Team leadership, Change management",
    materials: "Course handbook, Digital toolkit, Case studies",
    certificationOffered: true,
    tags: ["digital", "leadership", "construction"],
    rating: 4.8,
    totalRatings: 127,
    createdDate: "2024-12-01T10:00:00Z",
    lastModified: "2025-01-08T15:30:00Z"
  },
  {
    id: 2,
    name: "Safety Management in High-Rise Projects",
    description: "Advanced safety protocols for high-rise construction",
    category: "Safety",
    level: "Advanced",
    duration: 32,
    instructor: "Eng. Mohammed Al-Rashid",
    instructorId: "inst-002",
    maxParticipants: 20,
    currentEnrollments: 15,
    startDate: "2025-02-10T08:00:00Z",
    endDate: "2025-02-14T16:00:00Z",
    location: "Abu Dhabi Campus",
    format: "in-person",
    price: 3200,
    currency: "AED",
    status: "active",
    prerequisites: "Basic safety certification, 3+ years experience",
    learningObjectives: "Risk assessment, Emergency protocols, Safety auditing",
    materials: "Safety manual, Inspection checklists, VR training modules",
    certificationOffered: true,
    tags: ["safety", "high-rise", "protocols"],
    rating: 4.9,
    totalRatings: 89,
    createdDate: "2024-11-15T09:00:00Z",
    lastModified: "2025-01-05T11:20:00Z"
  },
  {
    id: 3,
    name: "Sustainable Construction Practices",
    description: "Green building techniques and environmental compliance",
    category: "Environment",
    level: "Beginner",
    duration: 24,
    instructor: "Dr. Fatima Al-Zahra",
    instructorId: "inst-003",
    maxParticipants: 30,
    currentEnrollments: 22,
    startDate: "2025-02-20T10:00:00Z",
    endDate: "2025-02-23T17:00:00Z",
    location: "Sharjah Institute",
    format: "online",
    price: 1800,
    currency: "AED",
    status: "active",
    prerequisites: "None",
    learningObjectives: "Green materials, Energy efficiency, LEED standards",
    materials: "Digital resources, Case studies, Assessment tools",
    certificationOffered: true,
    tags: ["sustainable", "green", "environment"],
    rating: 4.6,
    totalRatings: 203,
    createdDate: "2024-12-10T14:00:00Z",
    lastModified: "2025-01-07T16:45:00Z"
  }
];

// Mock data for assessments
const mockAssessments = [
  {
    id: "assess-001",
    courseName: "Digital Leadership in Construction",
    description: "Comprehensive assessment covering digital tools, leadership strategies, and change management in construction projects.",
    dueDate: "2025-02-20T23:59:59Z",
    duration: 90,
    status: "pending",
    type: "Final Assessment",
    score: null,
    completedDate: null,
    certificationExpiry: null,
    scores: {
      technical: null,
      safety: null,
      management: null,
      cultural: null,
      communication: null
    }
  },
  {
    id: "assess-002",
    courseName: "Safety Management in High-Rise Projects",
    description: "Advanced safety assessment including risk evaluation, emergency response, and safety audit procedures.",
    dueDate: "2025-02-15T23:59:59Z",
    duration: 120,
    status: "completed",
    type: "Certification Exam",
    score: 87,
    completedDate: "2025-01-05T14:30:00Z",
    certificationExpiry: "2027-01-05T14:30:00Z",
    scores: {
      technical: 85,
      safety: 92,
      management: 88,
      cultural: 82,
      communication: 87
    }
  },
  {
    id: "assess-003",
    courseName: "Sustainable Construction Practices",
    description: "Assessment on green building techniques, environmental compliance, and sustainable materials usage.",
    dueDate: "2025-01-15T23:59:59Z",
    duration: 60,
    status: "overdue",
    type: "Skills Assessment",
    score: null,
    completedDate: null,
    certificationExpiry: null,
    scores: {
      technical: null,
      safety: null,
      management: null,
      cultural: null,
      communication: null
    }
  },
  {
    id: "assess-004",
    courseName: "BIM Integration for Project Managers",
    description: "Practical assessment on BIM software usage, 3D modeling, and collaborative project management.",
    dueDate: "2025-03-01T23:59:59Z",
    duration: 105,
    status: "completed",
    type: "Practical Assessment",
    score: 91,
    completedDate: "2024-12-28T16:15:00Z",
    certificationExpiry: "2026-12-28T16:15:00Z",
    scores: {
      technical: 94,
      safety: 85,
      management: 93,
      cultural: 89,
      communication: 91
    }
  }
];

// Mock data for feedback courses
const mockFeedbackCourses = [
  {
    id: "fb-course-001",
    name: "Advanced Project Management",
    completionDate: "2025-01-03T17:00:00Z",
    instructor: "Dr. Ahmed Hassan",
    status: "feedback_pending"
  },
  {
    id: "fb-course-002",
    name: "Quality Control Systems",
    completionDate: "2024-12-20T16:30:00Z",
    instructor: "Eng. Layla Mohammed",
    status: "feedback_pending"
  },
  {
    id: "fb-course-003",
    name: "Cultural Intelligence in Construction",
    completionDate: "2024-12-15T15:45:00Z",
    instructor: "Dr. Omar Al-Rashid",
    status: "feedback_pending"
  }
];

// Mock data for peer evaluations
const mockPeerEvaluations = [
  {
    id: "peer-001",
    colleague: {
      name: "Ahmed Al-Mansouri",
      role: "Senior Project Manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
    },
    courseName: "Digital Leadership in Construction",
    dueDate: "2025-02-25T23:59:59Z",
    status: "pending"
  },
  {
    id: "peer-002",
    colleague: {
      name: "Fatima Al-Zahra",
      role: "Site Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima"
    },
    courseName: "Safety Management in High-Rise Projects",
    dueDate: "2025-02-20T23:59:59Z",
    status: "pending"
  },
  {
    id: "peer-003",
    colleague: {
      name: "Mohammed bin Rashid",
      role: "Quality Control Specialist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed"
    },
    courseName: "Sustainable Construction Practices",
    dueDate: "2025-02-18T23:59:59Z",
    status: "pending"
  }
];

// Mock statistics
const mockStats = {
  completedAssessments: 2,
  pendingEvaluations: 3,
  averageScore: 89,
  peerReviewsGiven: 0
};

// Mock schedules
const mockSchedules = [
  {
    id: "sched-001",
    courseId: 1,
    courseName: "Digital Leadership in Construction",
    instructorId: "inst-001",
    instructorName: "Dr. Sarah Ahmed",
    sessionTitle: "Introduction to Digital Tools",
    description: "Overview of digital transformation in construction",
    startDateTime: "2025-02-15T09:00:00Z",
    endDateTime: "2025-02-15T12:00:00Z",
    timeZone: "Asia/Dubai",
    location: "Dubai Training Center - Room 101",
    format: "in-person",
    meetingLink: null,
    meetingId: null,
    meetingPassword: null,
    maxParticipants: 25,
    currentBookings: 18,
    availableSpots: 7,
    status: "scheduled",
    notes: "Bring laptop for hands-on exercises",
    materials: ["Digital toolkit access", "Course handbook"],
    recordingEnabled: true,
    recordingUrl: null,
    createdDate: "2025-01-01T10:00:00Z",
    lastModified: "2025-01-08T15:30:00Z"
  },
  {
    id: "sched-002",
    courseId: 2,
    courseName: "Safety Management in High-Rise Projects",
    instructorId: "inst-002",
    instructorName: "Eng. Mohammed Al-Rashid",
    sessionTitle: "Risk Assessment Fundamentals",
    description: "Identifying and evaluating risks in high-rise construction",
    startDateTime: "2025-02-10T08:00:00Z",
    endDateTime: "2025-02-10T11:00:00Z",
    timeZone: "Asia/Dubai",
    location: "Abu Dhabi Campus - Safety Lab",
    format: "in-person",
    meetingLink: null,
    meetingId: null,
    meetingPassword: null,
    maxParticipants: 20,
    currentBookings: 15,
    availableSpots: 5,
    status: "scheduled",
    notes: "Safety equipment will be provided",
    materials: ["Safety manual", "Risk assessment templates"],
    recordingEnabled: false,
    recordingUrl: null,
    createdDate: "2024-12-15T09:00:00Z",
    lastModified: "2025-01-05T11:20:00Z"
  }
];

// Mock enrollments
const mockEnrollments = [
  {
    id: "enroll-001",
    courseId: 1,
    courseName: "Digital Leadership in Construction",
    courseDescription: "Develop digital leadership skills for modern construction projects",
    category: "Leadership",
    level: "Intermediate",
    instructorName: "Dr. Sarah Ahmed",
    startDate: "2025-02-15T09:00:00Z",
    endDate: "2025-02-19T17:00:00Z",
    enrollmentDate: "2024-12-20T10:00:00Z",
    status: "active",
    progress: 65,
    completionDate: null,
    certificateIssued: false,
    certificateUrl: null,
    grade: null,
    attendanceRate: 85,
    lastAccessDate: "2025-01-08T14:30:00Z",
    paymentStatus: "paid",
    paymentAmount: 2500,
    refundEligible: true,
    waitlistPosition: null
  },
  {
    id: "enroll-002",
    courseId: 2,
    courseName: "Safety Management in High-Rise Projects",
    courseDescription: "Advanced safety protocols for high-rise construction",
    category: "Safety",
    level: "Advanced",
    instructorName: "Eng. Mohammed Al-Rashid",
    startDate: "2025-02-10T08:00:00Z",
    endDate: "2025-02-14T16:00:00Z",
    enrollmentDate: "2024-11-30T09:00:00Z",
    status: "completed",
    progress: 100,
    completionDate: "2025-01-05T16:00:00Z",
    certificateIssued: true,
    certificateUrl: "https://certificates.academy.ae/cert-002",
    grade: "A",
    attendanceRate: 95,
    lastAccessDate: "2025-01-05T16:00:00Z",
    paymentStatus: "paid",
    paymentAmount: 3200,
    refundEligible: false,
    waitlistPosition: null
  }
];

// Mock categories
const mockCategories = [
  {
    id: "cat-001",
    name: "Project Management",
    description: "Comprehensive project management skills for construction projects",
    courseCount: 12
  },
  {
    id: "cat-002",
    name: "Safety",
    description: "Safety protocols and risk management in construction",
    courseCount: 8
  },
  {
    id: "cat-003",
    name: "Leadership",
    description: "Leadership and team management skills",
    courseCount: 6
  },
  {
    id: "cat-004",
    name: "Environment",
    description: "Sustainable construction and environmental practices",
    courseCount: 5
  }
];

// Mock instructors
const mockInstructors = [
  {
    id: "inst-001",
    name: "Dr. Sarah Ahmed",
    email: "sarah.ahmed@academy.ae",
    bio: "Expert in digital construction technologies with 15 years experience",
    specialization: "Digital Construction, BIM, Project Management",
    rating: 4.8,
    totalCourses: 12,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "active"
  },
  {
    id: "inst-002",
    name: "Eng. Mohammed Al-Rashid",
    email: "mohammed.rashid@academy.ae",
    bio: "Safety expert specializing in high-rise construction projects",
    specialization: "Safety Management, Risk Assessment, Emergency Response",
    rating: 4.9,
    totalCourses: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
    status: "active"
  },
  {
    id: "inst-003",
    name: "Dr. Fatima Al-Zahra",
    email: "fatima.zahra@academy.ae",
    bio: "Environmental and sustainability expert in construction",
    specialization: "Green Building, LEED, Environmental Compliance",
    rating: 4.7,
    totalCourses: 6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    status: "active"
  }
];

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Services

// =============================================================================
// ASSESSMENT RELATED APIs
// =============================================================================

export const getAssessments = async () => {
  await delay(500); // Simulate network delay
  console.log('Mock API: Fetching assessments...');
  return mockAssessments?.map(assessment => ({
    id: assessment?.id,
    courseName: assessment?.courseName,
    description: assessment?.description,
    dueDate: assessment?.dueDate,
    duration: assessment?.duration,
    status: assessment?.status?.toLowerCase(),
    type: assessment?.type,
    score: assessment?.score,
    completedDate: assessment?.completedDate,
    certificationExpiry: assessment?.certificationExpiry,
    scores: assessment?.scores
  }));
};

export const getAssessmentStats = async () => {
  await delay(300);
  console.log('Mock API: Fetching assessment stats...');
  return {
    completedAssessments: mockStats?.completedAssessments,
    pendingEvaluations: mockStats?.pendingEvaluations,
    averageScore: mockStats?.averageScore,
    peerReviewsGiven: mockStats?.peerReviewsGiven
  };
};

export const submitAssessmentRequest = async (requestData) => {
  await delay(800);
  console.log('Mock API: Submitting assessment request...', requestData);
  
  // Simulate successful submission
  const newAssessment = {
    id: `assess-${Date.now()}`,
    courseName: requestData?.courseName,
    description: `Assessment for ${requestData?.courseName}`,
    dueDate: requestData?.preferredDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)?.toISOString(),
    duration: 90,
    status: "scheduled",
    type: requestData?.assessmentType,
    score: null,
    completedDate: null,
    certificationExpiry: null,
    scores: {
      technical: null,
      safety: null,
      management: null,
      cultural: null,
      communication: null
    }
  };
  
  // Add to mock data
  mockAssessments?.push(newAssessment);
  
  return {
    success: true,
    message: "Assessment request submitted successfully",
    assessmentId: newAssessment?.id
  };
};

export const startAssessment = async (assessmentId) => {
  await delay(600);
  console.log('Mock API: Starting assessment...', assessmentId);
  
  // Find and update assessment status
  const assessment = mockAssessments?.find(a => a?.id === assessmentId);
  if (assessment) {
    assessment.status = "in_progress";
    assessment.startTime = new Date()?.toISOString();
  }
  
  return {
    success: true,
    message: "Assessment started successfully",
    startTime: new Date()?.toISOString()
  };
};

// =============================================================================
// FEEDBACK RELATED APIs
// =============================================================================

export const getFeedbackCourses = async () => {
  await delay(400);
  console.log('Mock API: Fetching feedback courses...');
  return mockFeedbackCourses?.map(course => ({
    id: course?.id,
    name: course?.name,
    completionDate: course?.completionDate,
    instructor: course?.instructor,
    status: course?.status?.toLowerCase()
  }));
};

export const submitCourseFeedback = async (courseId, feedbackData) => {
  await delay(700);
  console.log('Mock API: Submitting course feedback...', courseId, feedbackData);
  
  // Find and update course status
  const course = mockFeedbackCourses?.find(c => c?.id === courseId);
  if (course) {
    course.status = "feedback_submitted";
    course.feedbackDate = new Date()?.toISOString();
  }
  
  return {
    success: true,
    message: "Feedback submitted successfully",
    feedbackId: `feedback-${Date.now()}`
  };
};

// =============================================================================
// PEER EVALUATION APIs
// =============================================================================

export const getPeerEvaluations = async () => {
  await delay(450);
  console.log('Mock API: Fetching peer evaluations...');
  return mockPeerEvaluations?.map(evaluation => ({
    id: evaluation?.id,
    colleague: evaluation?.colleague,
    courseName: evaluation?.courseName,
    dueDate: evaluation?.dueDate,
    status: evaluation?.status?.toLowerCase()
  }));
};

export const submitPeerEvaluation = async (evaluationId, evaluationData) => {
  await delay(650);
  console.log('Mock API: Submitting peer evaluation...', evaluationId, evaluationData);
  
  // Find and update evaluation
  const evaluation = mockPeerEvaluations?.find(e => e?.id === evaluationId);
  if (evaluation) {
    evaluation.status = "completed";
    evaluation.completionDate = new Date()?.toISOString();
  }
  
  // Update stats
  mockStats.peerReviewsGiven += 1;
  
  return {
    success: true,
    message: "Peer evaluation submitted successfully",
    evaluationId: evaluationId
  };
};

// =============================================================================
// COURSES RELATED APIs
// =============================================================================

export const getCourses = async (filters = {}) => {
  await delay(600);
  console.log('Mock API: Fetching courses...', filters);
  
  let filtered = [...mockCourses];
  
  // Apply filters
  if (filters?.category) {
    filtered = filtered?.filter(course => course?.category?.toLowerCase() === filters?.category?.toLowerCase());
  }
  if (filters?.level) {
    filtered = filtered?.filter(course => course?.level?.toLowerCase() === filters?.level?.toLowerCase());
  }
  if (filters?.search) {
    const searchTerm = filters?.search?.toLowerCase();
    filtered = filtered?.filter(course => 
      course?.name?.toLowerCase()?.includes(searchTerm) ||
      course?.description?.toLowerCase()?.includes(searchTerm)
    );
  }
  
  return filtered?.map(course => ({
    id: course?.id,
    name: course?.name,
    description: course?.description,
    category: course?.category,
    level: course?.level,
    duration: course?.duration,
    instructor: course?.instructor,
    instructorId: course?.instructorId,
    maxParticipants: course?.maxParticipants,
    currentEnrollments: course?.currentEnrollments,
    startDate: course?.startDate,
    endDate: course?.endDate,
    location: course?.location,
    format: course?.format,
    price: course?.price,
    currency: course?.currency,
    status: course?.status?.toLowerCase(),
    prerequisites: course?.prerequisites,
    learningObjectives: course?.learningObjectives,
    materials: course?.materials,
    certificationOffered: course?.certificationOffered,
    tags: course?.tags,
    rating: course?.rating,
    totalRatings: course?.totalRatings,
    createdDate: course?.createdDate,
    lastModified: course?.lastModified
  }));
};

export const getCourseById = async (courseId) => {
  await delay(400);
  console.log('Mock API: Fetching course by ID...', courseId);
  
  const course = mockCourses?.find(c => c?.id?.toString() === courseId?.toString());
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }
  
  return {
    id: course?.id,
    name: course?.name,
    description: course?.description,
    detailedDescription: course?.description + " This comprehensive course provides hands-on experience with industry best practices.",
    category: course?.category,
    level: course?.level,
    duration: course?.duration,
    instructor: {
      id: course?.instructorId,
      name: course?.instructor,
      email: `${course?.instructor?.toLowerCase()?.replace(/\s+/g, '.')}@academy.ae`,
      bio: "Expert instructor with extensive industry experience",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${course?.instructor}`
    },
    schedule: {
      startDate: course?.startDate,
      endDate: course?.endDate,
      sessions: Math.ceil(course?.duration / 8),
      timeZone: "Asia/Dubai"
    },
    enrollment: {
      maxParticipants: course?.maxParticipants,
      currentEnrollments: course?.currentEnrollments,
      availableSpots: course?.maxParticipants - course?.currentEnrollments,
      enrollmentDeadline: new Date(new Date(course?.startDate).getTime() - 7 * 24 * 60 * 60 * 1000)?.toISOString(),
      waitlistEnabled: true
    },
    location: course?.location,
    format: course?.format,
    price: course?.price,
    currency: course?.currency,
    status: course?.status?.toLowerCase(),
    prerequisites: course?.prerequisites?.split(',')?.map(p => p?.trim()) || [],
    learningObjectives: course?.learningObjectives?.split(',')?.map(obj => obj?.trim()) || [],
    materials: course?.materials?.split(',')?.map(mat => mat?.trim()) || [],
    certificationOffered: course?.certificationOffered,
    tags: course?.tags || [],
    rating: course?.rating,
    totalRatings: course?.totalRatings,
    reviews: [],
    createdDate: course?.createdDate,
    lastModified: course?.lastModified
  };
};

export const getCourseCategories = async () => {
  await delay(300);
  console.log('Mock API: Fetching course categories...');
  return mockCategories?.map(category => ({
    id: category?.id,
    name: category?.name,
    description: category?.description,
    courseCount: category?.courseCount
  }));
};

export const getInstructors = async () => {
  await delay(350);
  console.log('Mock API: Fetching instructors...');
  return mockInstructors?.map(instructor => ({
    id: instructor?.id,
    name: instructor?.name,
    email: instructor?.email,
    bio: instructor?.bio,
    specialization: instructor?.specialization,
    rating: instructor?.rating,
    totalCourses: instructor?.totalCourses,
    avatar: instructor?.avatar,
    status: instructor?.status?.toLowerCase()
  }));
};

// =============================================================================
// SCHEDULE RELATED APIs
// =============================================================================

export const getSchedules = async (filters = {}) => {
  await delay(500);
  console.log('Mock API: Fetching schedules...', filters);
  
  let filtered = [...mockSchedules];
  
  if (filters?.courseId) {
    filtered = filtered?.filter(schedule => schedule?.courseId?.toString() === filters?.courseId?.toString());
  }
  
  return filtered?.map(schedule => ({
    id: schedule?.id,
    courseId: schedule?.courseId,
    courseName: schedule?.courseName,
    instructorId: schedule?.instructorId,
    instructorName: schedule?.instructorName,
    sessionTitle: schedule?.sessionTitle,
    description: schedule?.description,
    startDateTime: schedule?.startDateTime,
    endDateTime: schedule?.endDateTime,
    timeZone: schedule?.timeZone,
    location: schedule?.location,
    format: schedule?.format,
    meetingLink: schedule?.meetingLink,
    meetingId: schedule?.meetingId,
    meetingPassword: schedule?.meetingPassword,
    maxParticipants: schedule?.maxParticipants,
    currentBookings: schedule?.currentBookings,
    availableSpots: schedule?.availableSpots,
    status: schedule?.status?.toLowerCase(),
    notes: schedule?.notes,
    materials: schedule?.materials,
    recordingEnabled: schedule?.recordingEnabled,
    recordingUrl: schedule?.recordingUrl,
    createdDate: schedule?.createdDate,
    lastModified: schedule?.lastModified
  }));
};

export const createBooking = async (bookingData) => {
  await delay(700);
  console.log('Mock API: Creating booking...', bookingData);
  
  const newBooking = {
    id: `booking-${Date.now()}`,
    scheduleId: bookingData?.scheduleId,
    courseId: bookingData?.courseId,
    userId: 'current-user',
    bookingDate: new Date()?.toISOString(),
    status: 'confirmed',
    notes: bookingData?.notes,
    specialRequirements: bookingData?.specialRequirements
  };
  
  // Update schedule booking count
  const schedule = mockSchedules?.find(s => s?.id === bookingData?.scheduleId);
  if (schedule) {
    schedule.currentBookings += 1;
    schedule.availableSpots -= 1;
  }
  
  return {
    success: true,
    message: "Booking created successfully",
    bookingId: newBooking?.id
  };
};

// =============================================================================
// ENROLLMENT RELATED APIs
// =============================================================================

export const getEnrollments = async (filters = {}) => {
  await delay(550);
  console.log('Mock API: Fetching enrollments...', filters);
  return mockEnrollments?.map(enrollment => ({
    id: enrollment?.id,
    courseId: enrollment?.courseId,
    courseName: enrollment?.courseName,
    courseDescription: enrollment?.courseDescription,
    category: enrollment?.category,
    level: enrollment?.level,
    instructorName: enrollment?.instructorName,
    startDate: enrollment?.startDate,
    endDate: enrollment?.endDate,
    enrollmentDate: enrollment?.enrollmentDate,
    status: enrollment?.status?.toLowerCase(),
    progress: enrollment?.progress,
    completionDate: enrollment?.completionDate,
    certificateIssued: enrollment?.certificateIssued,
    certificateUrl: enrollment?.certificateUrl,
    grade: enrollment?.grade,
    attendanceRate: enrollment?.attendanceRate,
    lastAccessDate: enrollment?.lastAccessDate,
    paymentStatus: enrollment?.paymentStatus?.toLowerCase(),
    paymentAmount: enrollment?.paymentAmount,
    refundEligible: enrollment?.refundEligible,
    waitlistPosition: enrollment?.waitlistPosition
  }));
};

export const enrollInCourse = async (courseId, enrollmentData = {}) => {
  await delay(800);
  console.log('Mock API: Enrolling in course...', courseId, enrollmentData);
  
  const course = mockCourses?.find(c => c?.id?.toString() === courseId?.toString());
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }
  
  const newEnrollment = {
    id: `enroll-${Date.now()}`,
    courseId: course?.id,
    courseName: course?.name,
    courseDescription: course?.description,
    category: course?.category,
    level: course?.level,
    instructorName: course?.instructor,
    startDate: course?.startDate,
    endDate: course?.endDate,
    enrollmentDate: new Date()?.toISOString(),
    status: "active",
    progress: 0,
    completionDate: null,
    certificateIssued: false,
    certificateUrl: null,
    grade: null,
    attendanceRate: 0,
    lastAccessDate: new Date()?.toISOString(),
    paymentStatus: "pending",
    paymentAmount: course?.price,
    refundEligible: true,
    waitlistPosition: null
  };
  
  // Add to enrollments
  mockEnrollments?.push(newEnrollment);
  
  // Update course enrollment count
  course.currentEnrollments += 1;
  
  return {
    success: true,
    message: "Enrollment successful",
    enrollmentId: newEnrollment?.id
  };
};

export const getEnrollmentStats = async () => {
  await delay(400);
  console.log('Mock API: Fetching enrollment stats...');
  
  const activeEnrollments = mockEnrollments?.filter(e => e?.status === "active")?.length;
  const completedCourses = mockEnrollments?.filter(e => e?.status === "completed")?.length;
  
  return {
    totalEnrollments: mockEnrollments?.length,
    activeEnrollments: activeEnrollments,
    completedCourses: completedCourses,
    inProgressCourses: activeEnrollments,
    certificatesEarned: mockEnrollments?.filter(e => e?.certificateIssued)?.length,
    averageProgress: mockEnrollments?.reduce((acc, e) => acc + (e?.progress || 0), 0) / mockEnrollments?.length,
    totalTimeSpent: 0,
    averageAttendanceRate: mockEnrollments?.reduce((acc, e) => acc + (e?.attendanceRate || 0), 0) / mockEnrollments?.length
  };
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const testConnection = async () => {
  await delay(200);
  console.log('Mock API: Testing connection...');
  return {
    success: true,
    message: 'Connected to Mock Data Service',
    details: 'Using local mock data - no external API required'
  };
};

export const getConfigurationStatus = () => {
  return {
    valid: true,
    message: 'Mock configuration is valid',
    environment: 'Mock',
    baseUrl: 'localhost'
  };
};

// Default export with all API functions
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
  getPeerEvaluations,
  submitPeerEvaluation,
  // Course APIs
  getCourses,
  getCourseById,
  getCourseCategories,
  getInstructors,
  // Schedule APIs
  getSchedules,
  createBooking,
  // Enrollment APIs
  getEnrollments,
  enrollInCourse,
  getEnrollmentStats,
  // Utility APIs
  testConnection,
  getConfigurationStatus
};