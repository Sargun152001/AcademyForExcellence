import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../../components/ui/Header';
import Sidebar from '../../../components/ui/Sidebar';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CourseEnrollment = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const course = location?.state?.course || {
    id: courseId,
    title: 'Course Title Not Found',
    price: 0,
    duration: 'N/A',
    instructor: { name: 'Unknown', title: 'Instructor' }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    experience: '',
    learningGoals: '',
    paymentMethod: 'credit-card',
    agreeToTerms: false,
    subscribeToUpdates: true
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate enrollment process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would make an API call to process enrollment
      console.log('Enrollment data:', {
        courseId,
        studentData: formData
      });

      // Navigate to success page or course content
      navigate('/course-catalog-discovery/enrollment-success', {
        state: { 
          course,
          studentName: `${formData?.firstName} ${formData?.lastName}`
        }
      });
      
    } catch (error) {
      console.error('Enrollment failed:', error);
      setErrors({ submit: 'Enrollment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToCourse = () => {
    navigate(`/course-catalog-discovery/course/${courseId}`);
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Foundation': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const experienceOptions = [
    { value: '0-2', label: '0-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '6-10', label: '6-10 years' },
    { value: '11-15', label: '11-15 years' },
    { value: '15+', label: '15+ years' }
  ];

  const paymentMethods = [
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'company-billing', label: 'Company Billing' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Enroll in {course?.title} | Academy for Excellence</title>
        <meta name="description" content={`Complete your enrollment for ${course?.title}. Join thousands of professionals advancing their careers.`} />
      </Helmet>
      <Header />
      <div className="flex pt-16">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className={`flex-1 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} construction-transition`}>
          {/* Back Navigation */}
          <div className="bg-white border-b border-border p-4">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={handleBackToCourse}
                iconName="ArrowLeft"
                iconPosition="left"
                className="mb-2"
              >
                Back to Course Details
              </Button>
              <h1 className="text-2xl font-heading font-bold text-authority-charcoal">
                Course Enrollment
              </h1>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Enrollment Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg construction-shadow p-6">
                  <h2 className="text-xl font-heading font-bold text-authority-charcoal mb-6">
                    Student Information
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-authority-charcoal mb-2">
                          First Name *
                        </label>
                        <Input
                          placeholder="Enter your first name"
                          value={formData?.firstName}
                          onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                          error={errors?.firstName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-authority-charcoal mb-2">
                          Last Name *
                        </label>
                        <Input
                          placeholder="Enter your last name"
                          value={formData?.lastName}
                          onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                          error={errors?.lastName}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-authority-charcoal mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={formData?.email}
                          onChange={(e) => handleInputChange('email', e?.target?.value)}
                          error={errors?.email}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-authority-charcoal mb-2">
                          Phone Number *
                        </label>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData?.phone}
                          onChange={(e) => handleInputChange('phone', e?.target?.value)}
                          error={errors?.phone}
                        />
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-heading font-semibold text-authority-charcoal mb-4">
                        Professional Background
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-authority-charcoal mb-2">
                            Company (Optional)
                          </label>
                          <Input
                            placeholder="Enter your company name"
                            value={formData?.company}
                            onChange={(e) => handleInputChange('company', e?.target?.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-authority-charcoal mb-2">
                            Job Title (Optional)
                          </label>
                          <Input
                            placeholder="Enter your job title"
                            value={formData?.jobTitle}
                            onChange={(e) => handleInputChange('jobTitle', e?.target?.value)}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-authority-charcoal mb-2">
                          Years of Experience (Optional)
                        </label>
                        <Select
                          options={experienceOptions}
                          value={formData?.experience}
                          onChange={(value) => handleInputChange('experience', value)}
                          placeholder="Select your experience level"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-authority-charcoal mb-2">
                          Learning Goals (Optional)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          rows="3"
                          placeholder="What do you hope to achieve from this course?"
                          value={formData?.learningGoals}
                          onChange={(e) => handleInputChange('learningGoals', e?.target?.value)}
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    {course?.price > 0 && (
                      <div className="border-t border-border pt-6">
                        <h3 className="text-lg font-heading font-semibold text-authority-charcoal mb-4">
                          Payment Method
                        </h3>
                        <Select
                          options={paymentMethods}
                          value={formData?.paymentMethod}
                          onChange={(value) => handleInputChange('paymentMethod', value)}
                          placeholder="Select payment method"
                        />
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    <div className="border-t border-border pt-6 space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={formData?.agreeToTerms}
                          onChange={(checked) => handleInputChange('agreeToTerms', checked)}
                          error={errors?.agreeToTerms}
                        />
                        <label className="text-sm text-professional-gray">
                          I agree to the{' '}
                          <a href="#" className="text-primary hover:underline">
                            Terms and Conditions
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                          *
                        </label>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={formData?.subscribeToUpdates}
                          onChange={(checked) => handleInputChange('subscribeToUpdates', checked)}
                        />
                        <label className="text-sm text-professional-gray">
                          Subscribe to course updates and new course notifications
                        </label>
                      </div>
                    </div>

                    {/* Error Message */}
                    {errors?.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex items-center">
                          <Icon name="AlertCircle" size={20} className="text-red-500 mr-3" />
                          <p className="text-red-700">{errors?.submit}</p>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                          Processing Enrollment...
                        </>
                      ) : (
                        `Complete Enrollment${course?.price > 0 ? ` - $${course?.price}` : ' - Free'}`
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Course Summary Sidebar */}
              <div className="space-y-6">
                {/* Course Info */}
                <div className="bg-white rounded-lg construction-shadow p-6">
                  <h3 className="text-lg font-heading font-bold text-authority-charcoal mb-4">
                    Course Summary
                  </h3>
                  
                  {course?.image && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <Image
                        src={course?.image}
                        alt={course?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h4 className="font-semibold text-authority-charcoal mb-2">
                    {course?.title}
                  </h4>
                  
                  {course?.level && (
                    <div className="mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course?.level)}`}>
                        {course?.level}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-professional-gray mb-4">
                    {course?.duration && (
                      <div className="flex items-center">
                        <Icon name="Clock" size={16} className="mr-2" />
                        {course?.duration}
                      </div>
                    )}
                    {course?.instructor?.name && (
                      <div className="flex items-center">
                        <Icon name="User" size={16} className="mr-2" />
                        {course?.instructor?.name}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Icon name="Award" size={16} className="mr-2" />
                      Certificate included
                    </div>
                    <div className="flex items-center">
                      <Icon name="Infinity" size={16} className="mr-2" />
                      Lifetime access
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-authority-charcoal">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {course?.price === 0 ? 'Free' : `$${course?.price}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Icon name="Shield" size={20} className="text-green-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-green-800 mb-1">
                        Secure Enrollment
                      </h4>
                      <p className="text-xs text-green-700">
                        Your information is protected with industry-standard encryption.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Icon name="HelpCircle" size={20} className="text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">
                        Need Help?
                      </h4>
                      <p className="text-xs text-blue-700 mb-2">
                        Our support team is here to assist you.
                      </p>
                      <a href="mailto:support@academy.com" className="text-xs text-blue-600 hover:underline">
                        support@academy.com
                      </a>
                    </div>
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

export default CourseEnrollment;