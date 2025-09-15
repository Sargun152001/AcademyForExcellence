import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../../components/ui/Header';
import Sidebar from '../../../components/ui/Sidebar';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const EnrollmentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const { course, studentName } = location?.state || {};

  const handleGoToCourse = () => {
    // In a real app, this would navigate to the course content/learning page
    navigate(`/course-catalog-discovery/course/${course?.id}/learn`);
  };

  const handleBackToCatalog = () => {
    navigate('/course-catalog-discovery');
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log('Download receipt for course:', course?.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Enrollment Successful | Academy for Excellence</title>
        <meta name="description" content="Congratulations! Your course enrollment was successful. Start learning today." />
      </Helmet>
      <Header />
      <div className="flex pt-16">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className={`flex-1 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} construction-transition`}>
          <div className="max-w-4xl mx-auto p-6">
            {/* Success Message */}
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="CheckCircle" size={40} className="text-green-600" />
              </div>
              
              <h1 className="text-3xl font-heading font-bold text-authority-charcoal mb-4">
                Enrollment Successful!
              </h1>
              
              <p className="text-lg text-professional-gray mb-8 max-w-2xl mx-auto">
                Congratulations {studentName}! You have successfully enrolled in the course. 
                You can start learning immediately or save it for later.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg"
                  onClick={handleGoToCourse}
                  iconName="Play"
                  iconPosition="left"
                >
                  Start Learning Now
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleBackToCatalog}
                >
                  Browse More Courses
                </Button>
              </div>
            </div>

            {/* Course Details */}
            {course && (
              <div className="bg-white rounded-lg construction-shadow p-8 mb-8">
                <h2 className="text-2xl font-heading font-bold text-authority-charcoal mb-6">
                  Your Course
                </h2>
                
                <div className="flex items-start space-x-6">
                  {course?.image && (
                    <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={course?.image}
                        alt={course?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-authority-charcoal mb-2">
                      {course?.title || 'Course Title'}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-professional-gray mb-4">
                      {course?.instructor?.name && (
                        <div className="flex items-center">
                          <Icon name="User" size={16} className="mr-1" />
                          {course?.instructor?.name}
                        </div>
                      )}
                      {course?.duration && (
                        <div className="flex items-center">
                          <Icon name="Clock" size={16} className="mr-1" />
                          {course?.duration}
                        </div>
                      )}
                      {course?.level && (
                        <div className="flex items-center">
                          <Icon name="BarChart3" size={16} className="mr-1" />
                          {course?.level}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {course?.price === 0 ? 'Free' : `$${course?.price}`}
                      </span>
                      
                      {course?.price > 0 && (
                        <Button
                          variant="ghost"
                          onClick={handleDownloadReceipt}
                          iconName="Download"
                          iconPosition="left"
                        >
                          Download Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-white rounded-lg construction-shadow p-8 mb-8">
              <h2 className="text-2xl font-heading font-bold text-authority-charcoal mb-6">
                What's Next?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Play" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-authority-charcoal mb-2">
                    Start Learning
                  </h3>
                  <p className="text-sm text-professional-gray">
                    Access your course content immediately and begin your learning journey.
                  </p>
                </div>

                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Users" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-authority-charcoal mb-2">
                    Join Community
                  </h3>
                  <p className="text-sm text-professional-gray">
                    Connect with fellow students and instructors in the course community.
                  </p>
                </div>

                <div className="text-center p-6 border border-border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Award" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-authority-charcoal mb-2">
                    Earn Certificate
                  </h3>
                  <p className="text-sm text-professional-gray">
                    Complete the course to earn your professional certificate.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <Icon name="HelpCircle" size={24} className="text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Need Help Getting Started?
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Our support team is here to help you make the most of your learning experience.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="mailto:support@academy.com" 
                      className="text-blue-600 hover:underline font-medium"
                    >
                      support@academy.com
                    </a>
                    <a 
                      href="tel:+1-800-123-4567" 
                      className="text-blue-600 hover:underline font-medium"
                    >
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnrollmentSuccess;