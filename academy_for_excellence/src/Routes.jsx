import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import AzureAuthProvider from "components/AzureAuthProvider";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import CommunityLearningHub from './pages/community-learning-hub';
import AssessmentFeedbackCenter from './pages/assessment-feedback-center';
import ScheduleManagementBooking from './pages/schedule-management-booking';
import CourseCatalogDiscovery from './pages/course-catalog-discovery';
import LearningDashboardHomepage from './pages/learning-dashboard-homepage';
import PersonalLearningPathProgress from './pages/personal-learning-path-progress';
import FeedbackAssessmentManagement from './pages/feedback-assessment-management';
import CourseDetails from './pages/course-catalog-discovery/components/CourseDetails';
import CourseEnrollment from './pages/course-catalog-discovery/components/CourseEnrollment';
import EnrollmentSuccess from './pages/course-catalog-discovery/components/EnrollmentSuccess';

const Routes = () => {
  return (
    <BrowserRouter>
      <AzureAuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <LearningDashboardHomepage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <LearningDashboardHomepage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community-learning-hub" 
              element={
                <ProtectedRoute>
                  <CommunityLearningHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessment-feedback-center" 
              element={
                <ProtectedRoute>
                  <AssessmentFeedbackCenter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule-management-booking" 
              element={
                <ProtectedRoute>
                  <ScheduleManagementBooking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course-catalog-discovery" 
              element={
                <ProtectedRoute>
                  <CourseCatalogDiscovery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course-catalog-discovery/course/:courseId" 
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course-catalog-discovery/enrollment/:courseId" 
              element={
                <ProtectedRoute>
                  <CourseEnrollment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course-catalog-discovery/enrollment-success" 
              element={
                <ProtectedRoute>
                  <EnrollmentSuccess />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learning-dashboard-homepage" 
              element={
                <ProtectedRoute>
                  <LearningDashboardHomepage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/personal-learning-path-progress" 
              element={
                <ProtectedRoute>
                  <PersonalLearningPathProgress />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/feedback-assessment-management" 
              element={
                <ProtectedRoute>
                  <FeedbackAssessmentManagement />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AzureAuthProvider>
    </BrowserRouter>
  );
};

export default Routes;