import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FeedbackSubmissionForm = ({ course, userProfile, onSubmit, onCancel, isOnline = true }) => {
  const [formData, setFormData] = useState({
    // Core Ratings
    overallRating: '',
    instructorRating: '',
    contentQuality: '',
    practicalApplicability: '',
    
    // Impact Assessment
    safetyImprovement: '',
    projectImpact: '',
    skillDevelopment: '',
    careerProgression: '',
    
    // Cultural Considerations
    culturalSensitivity: '',
    communicationStyle: '',
    regionalRelevance: '',
    languageClarity: '',
    
    // Specific Feedback Areas
    trainingMethods: '',
    materialQuality: '',
    facilityRating: '',
    peerInteraction: '',
    
    // Written Feedback
    strengthsHighlights: '',
    improvementSuggestions: '',
    futureTrainingNeeds: '',
    additionalComments: '',
    
    // Submission Options
    anonymous: false,
    shareWithPeers: false,
    requestFollowUp: false,
    businessCentralSync: true
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const ratingOptions = [
    { value: '5', label: '⭐⭐⭐⭐⭐ Excellent (5/5)' },
    { value: '4', label: '⭐⭐⭐⭐ Very Good (4/5)' },
    { value: '3', label: '⭐⭐⭐ Good (3/5)' },
    { value: '2', label: '⭐⭐ Fair (2/5)' },
    { value: '1', label: '⭐ Poor (1/5)' }
  ];

  const impactOptions = [
    { value: 'high', label: '🔥 High Impact - Immediately applicable to my current role' },
    { value: 'medium', label: '📈 Medium Impact - Applicable with some adaptation' },
    { value: 'low', label: '📊 Low Impact - Limited applicability to current projects' },
    { value: 'none', label: '❌ No Impact - Not relevant to my current responsibilities' }
  ];

  const culturalOptions = [
    { value: 'excellent', label: '🌟 Excellent - Perfectly adapted to our cultural context' },
    { value: 'very_good', label: '👍 Very Good - Well-adapted with minor considerations' },
    { value: 'good', label: '✅ Good - Generally appropriate with room for improvement' },
    { value: 'fair', label: '⚠️ Fair - Some cultural sensitivity needed' },
    { value: 'poor', label: '❌ Poor - Significant cultural adaptation required' }
  ];

  const communicationStyles = [
    { value: 'direct', label: '💬 Direct Western-style communication preferred' },
    { value: 'relationship', label: '🤝 Relationship-focused Arab approach preferred' },
    { value: 'balanced', label: '⚖️ Balanced approach combining both styles' },
    { value: 'context_specific', label: '📍 Context-specific approach based on situation' }
  ];

  const trainingMethodOptions = [
    { value: 'hands_on', label: '🛠️ Hands-on practical sessions' },
    { value: 'case_studies', label: '📋 Case studies and real scenarios' },
    { value: 'group_discussion', label: '👥 Group discussions and collaboration' },
    { value: 'presentations', label: '📊 Presentations and lectures' },
    { value: 'field_visits', label: '🏗️ Site visits and field observations' }
  ];

  useEffect(() => {
    // Auto-save to local storage for offline capability
    const autoSave = () => {
      if (!isOnline) {
        localStorage.setItem(`feedback_draft_${course?.id}`, JSON.stringify(formData));
      }
    };

    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [formData, course?.id, isOnline]);

  useEffect(() => {
    // Load draft if exists
    const savedDraft = localStorage.getItem(`feedback_draft_${course?.id}`);
    if (savedDraft && !isOnline) {
      setFormData(JSON.parse(savedDraft));
    }
  }, [course?.id, isOnline]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1: // Core Ratings
        if (!formData?.overallRating) errors.overallRating = 'Overall rating is required';
        if (!formData?.instructorRating && course?.type === 'instructor') errors.instructorRating = 'Instructor rating is required';
        if (!formData?.contentQuality) errors.contentQuality = 'Content quality rating is required';
        break;
      case 2: // Impact Assessment
        if (!formData?.practicalApplicability) errors.practicalApplicability = 'Practical applicability is required';
        if (!formData?.safetyImprovement) errors.safetyImprovement = 'Safety improvement assessment is required';
        break;
      case 3: // Cultural Considerations
        if (!formData?.culturalSensitivity) errors.culturalSensitivity = 'Cultural sensitivity rating is required';
        if (!formData?.communicationStyle) errors.communicationStyle = 'Communication style preference is required';
        break;
      case 4: // Final Review - no required fields, just recommendations
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        courseId: course?.id,
        businessCentralId: course?.businessCentralId,
        userId: userProfile?.id,
        submissionDate: new Date()?.toISOString(),
        userLocation: userProfile?.location,
        isOfflineSubmission: !isOnline
      };
      
      await onSubmit(submissionData);
      
      // Clear draft after successful submission
      localStorage.removeItem(`feedback_draft_${course?.id}`);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-medium text-authority-charcoal mb-2 flex items-center">
                <Icon name="Star" size={20} className="mr-2 text-primary" />
                Core Performance Ratings
              </h4>
              <p className="text-sm text-professional-gray">
                Provide your overall assessment of the training experience and effectiveness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Overall Course Rating *"
                description="Your overall experience with this course"
                options={ratingOptions}
                value={formData?.overallRating}
                onChange={(value) => handleInputChange('overallRating', value)}
                error={validationErrors?.overallRating}
                required
              />
              
              {course?.type === 'instructor' && (
                <Select
                  label="Instructor Effectiveness *"
                  description="Rate the instructor's teaching effectiveness"
                  options={ratingOptions}
                  value={formData?.instructorRating}
                  onChange={(value) => handleInputChange('instructorRating', value)}
                  error={validationErrors?.instructorRating}
                  required
                />
              )}
              
              <Select
                label="Content Quality *"
                description="Quality and relevance of course materials"
                options={ratingOptions}
                value={formData?.contentQuality}
                onChange={(value) => handleInputChange('contentQuality', value)}
                error={validationErrors?.contentQuality}
                required
              />
              
              <Select
                label="Training Methods"
                description="Effectiveness of training delivery methods"
                options={ratingOptions}
                value={formData?.trainingMethods}
                onChange={(value) => handleInputChange('trainingMethods', value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-accent/5 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-medium text-authority-charcoal mb-2 flex items-center">
                <Icon name="Target" size={20} className="mr-2 text-accent" />
                Professional Impact Assessment
              </h4>
              <p className="text-sm text-professional-gray">
                Evaluate the practical impact on your work performance and career development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Practical Applicability *"
                description="How applicable is this training to your current role?"
                options={impactOptions}
                value={formData?.practicalApplicability}
                onChange={(value) => handleInputChange('practicalApplicability', value)}
                error={validationErrors?.practicalApplicability}
                required
              />
              
              <Select
                label="Safety Improvement Impact *"
                description="Will this training enhance safety practices?"
                options={impactOptions}
                value={formData?.safetyImprovement}
                onChange={(value) => handleInputChange('safetyImprovement', value)}
                error={validationErrors?.safetyImprovement}
                required
              />
              
              <Select
                label="Project Performance Impact"
                description="Expected impact on project delivery and quality"
                options={impactOptions}
                value={formData?.projectImpact}
                onChange={(value) => handleInputChange('projectImpact', value)}
              />
              
              <Select
                label="Career Progression Value"
                description="How will this contribute to your career growth?"
                options={impactOptions}
                value={formData?.careerProgression}
                onChange={(value) => handleInputChange('careerProgression', value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-confidence-teal/5 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-medium text-authority-charcoal mb-2 flex items-center">
                <Icon name="Globe" size={20} className="mr-2 text-confidence-teal" />
                Cultural Intelligence & Communication
              </h4>
              <p className="text-sm text-professional-gray">
                Assess cultural appropriateness and communication effectiveness for our regional context
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Cultural Sensitivity *"
                description="How well did the course address regional business practices?"
                options={culturalOptions}
                value={formData?.culturalSensitivity}
                onChange={(value) => handleInputChange('culturalSensitivity', value)}
                error={validationErrors?.culturalSensitivity}
                required
              />
              
              <Select
                label="Communication Style Preference *"
                description="Which approach works best for you?"
                options={communicationStyles}
                value={formData?.communicationStyle}
                onChange={(value) => handleInputChange('communicationStyle', value)}
                error={validationErrors?.communicationStyle}
                required
              />
              
              <Select
                label="Regional Relevance"
                description="Relevance to Middle Eastern construction industry"
                options={culturalOptions}
                value={formData?.regionalRelevance}
                onChange={(value) => handleInputChange('regionalRelevance', value)}
              />
              
              <Select
                label="Language Clarity"
                description="Was the content clearly communicated?"
                options={ratingOptions}
                value={formData?.languageClarity}
                onChange={(value) => handleInputChange('languageClarity', value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-medium text-authority-charcoal mb-2 flex items-center">
                <Icon name="MessageSquare" size={20} className="mr-2 text-green-600" />
                Written Feedback & Recommendations
              </h4>
              <p className="text-sm text-professional-gray">
                Share detailed insights to help improve future training programs
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-authority-charcoal mb-2">
                  Course Strengths & Highlights
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="3"
                  placeholder="What aspects of this course were most valuable? What should definitely be retained?"
                  value={formData?.strengthsHighlights}
                  onChange={(e) => handleInputChange('strengthsHighlights', e?.target?.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-authority-charcoal mb-2">
                  Improvement Suggestions
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="3"
                  placeholder="What specific improvements would enhance this training? Consider content, delivery, cultural aspects..."
                  value={formData?.improvementSuggestions}
                  onChange={(e) => handleInputChange('improvementSuggestions', e?.target?.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-authority-charcoal mb-2">
                  Future Training Needs
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="3"
                  placeholder="What additional training topics would benefit your role and the company?"
                  value={formData?.futureTrainingNeeds}
                  onChange={(e) => handleInputChange('futureTrainingNeeds', e?.target?.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-authority-charcoal mb-2">
                  Additional Comments
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Any other feedback, suggestions, or observations about your learning experience..."
                  value={formData?.additionalComments}
                  onChange={(e) => handleInputChange('additionalComments', e?.target?.value)}
                />
              </div>
            </div>

            {/* Submission Options */}
            <div className="bg-muted rounded-lg p-4">
              <h5 className="text-md font-medium text-authority-charcoal mb-3">Submission Preferences</h5>
              <div className="space-y-3">
                <Checkbox
                  checked={formData?.anonymous}
                  onChange={(checked) => handleInputChange('anonymous', checked)}
                  label="Submit anonymously (respects cultural hierarchies while encouraging honest feedback)"
                />
                <Checkbox
                  checked={formData?.shareWithPeers}
                  onChange={(checked) => handleInputChange('shareWithPeers', checked)}
                  label="Allow sharing insights with course peers (promotes collaborative learning)"
                />
                <Checkbox
                  checked={formData?.requestFollowUp}
                  onChange={(checked) => handleInputChange('requestFollowUp', checked)}
                  label="Request follow-up discussion about implementation challenges"
                />
                {isOnline && (
                  <Checkbox
                    checked={formData?.businessCentralSync}
                    onChange={(checked) => handleInputChange('businessCentralSync', checked)}
                    label="Sync to Business Central for HR and development tracking"
                  />
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border construction-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-authority-charcoal mb-2 flex items-center">
            <Icon name="MessageSquare" size={24} className="mr-3 text-primary" />
            Course Feedback Submission
          </h3>
          <div className="text-sm text-professional-gray space-y-1">
            <p><strong>{course?.name}</strong> • {course?.instructor}</p>
            <p>Completed: {course?.completedDate} • {course?.location}</p>
            {!isOnline && (
              <p className="text-orange-600 flex items-center">
                <Icon name="WifiOff" size={16} className="mr-1" />
                Offline Mode - Data will sync when connected
              </p>
            )}
          </div>
        </div>
        <Button variant="ghost" onClick={onCancel} iconName="X" />
      </div>

      {/* Progress Indicator */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-authority-charcoal">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-professional-gray">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full construction-transition" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-border mt-8">
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevStep}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            
            {currentStep < totalSteps ? (
              <Button 
                type="button" 
                variant="default" 
                onClick={handleNextStep}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                type="submit" 
                variant="default" 
                disabled={isSubmitting}
                iconName="Send"
                iconPosition="left"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FeedbackSubmissionForm;