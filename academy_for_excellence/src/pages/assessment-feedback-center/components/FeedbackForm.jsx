import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const FeedbackForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    overallRating: '',
    instructorRating: '',
    contentQuality: '',
    practicalApplicability: '',
    safetyImprovement: '',
    projectImpact: '',
    culturalSensitivity: '',
    communicationStyle: '',
    recommendations: '',
    additionalComments: '',
    anonymous: false
  });

  const ratingOptions = [
    { value: '5 - Excellent (5/5)', label: 'Excellent (5/5)' },
    { value: '4 - Very Good (4/5)', label: 'Very Good (4/5)' },
    { value: '3 - Good (3/5)', label: 'Good (3/5)' },
    { value: '2 - Fair (2/5)', label: 'Fair (2/5)' },
    { value: '1 - Poor (1/5)', label: 'Poor (1/5)' }
  ];
 
  const impactOptions = [
    { value: 'High Impact - Immediately applicable', label: 'High Impact - Immediately applicable' },
    { value: 'Medium Impact - Applicable with adaptation', label: 'Medium Impact - Applicable with adaptation' },
    { value: 'Low Impact - Limited applicability', label: 'Low Impact - Limited applicability' },
    { value: 'No Impact - Not relevant to current projects', label: 'No Impact - Not relevant to current projects' }
  ];
 
  const communicationOptions = [
    { value: 'Direct Western-style feedback', label: 'Direct Western-style feedback' },
    { value: 'Relationship-focused approach', label: 'Relationship-focused approach' },
    { value: 'Balanced approach', label: 'Balanced approach' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 construction-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-authority-charcoal mb-2">
            Course Feedback & Evaluation
          </h3>
          <p className="text-sm text-professional-gray">
            {course?.name} - Completed on {course?.completionDate}
          </p>
        </div>
        <Button variant="ghost" onClick={onCancel} iconName="X" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Overall Course Rating"
            description="Rate your overall experience with this course"
            options={ratingOptions}
            value={formData?.overallRating}
            onChange={(value) => handleInputChange('overallRating', value)}
            required
          />
          
          <Select
            label="Instructor Rating"
            description="Rate the instructor's effectiveness"
            options={ratingOptions}
            value={formData?.instructorRating}
            onChange={(value) => handleInputChange('instructorRating', value)}
            required
          />
        </div>

        {/* Content Quality Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Content Quality"
            description="How would you rate the course content?"
            options={ratingOptions}
            value={formData?.contentQuality}
            onChange={(value) => handleInputChange('contentQuality', value)}
            required
          />
          
          <Select
            label="Practical Applicability"
            description="How applicable is this training to your work?"
            options={impactOptions}
            value={formData?.practicalApplicability}
            onChange={(value) => handleInputChange('practicalApplicability', value)}
            required
          />
        </div>

        {/* Impact Assessment Section */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="text-lg font-medium text-authority-charcoal mb-4 flex items-center">
            <Icon name="Target" size={20} className="mr-2 text-accent" />
            Impact Assessment
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Safety Improvement"
              description="Will this training improve safety practices?"
              options={impactOptions}
              value={formData?.safetyImprovement}
              onChange={(value) => handleInputChange('safetyImprovement', value)}
              required
            />
            
            <Select
              label="Project Impact"
              description="Expected impact on project performance"
              options={impactOptions}
              value={formData?.projectImpact}
              onChange={(value) => handleInputChange('projectImpact', value)}
              required
            />
          </div>
        </div>

        {/* Cultural Considerations */}
        <div className="bg-card rounded-lg p-4">
          <h4 className="text-lg font-medium text-authority-charcoal mb-4 flex items-center">
            <Icon name="Globe" size={20} className="mr-2 text-confidence-teal" />
            Cultural Considerations
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Cultural Sensitivity"
              description="How well did the course address regional practices?"
              options={ratingOptions}
              value={formData?.culturalSensitivity}
              onChange={(value) => handleInputChange('culturalSensitivity', value)}
              required
            />
            
            <Select
              label="Communication Style Preference"
              description="Which feedback approach do you prefer?"
              options={communicationOptions}
              value={formData?.communicationStyle}
              onChange={(value) => handleInputChange('communicationStyle', value)}
              required
            />
          </div>
        </div>

        {/* Written Feedback */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-authority-charcoal mb-2">
              Recommendations for Improvement
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="3"
              placeholder="What improvements would you suggest for this course?"
              value={formData?.recommendations}
              onChange={(e) => handleInputChange('recommendations', e?.target?.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-authority-charcoal mb-2">
              Additional Comments
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="4"
              placeholder="Any additional feedback or comments about your learning experience..."
              value={formData?.additionalComments}
              onChange={(e) => handleInputChange('additionalComments', e?.target?.value)}
            />
          </div>
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData?.anonymous}
            onChange={(e) => handleInputChange('anonymous', e?.target?.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <label htmlFor="anonymous" className="text-sm text-authority-charcoal">
            Submit this feedback anonymously (respects cultural hierarchies while encouraging honest input)
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="default" iconName="Send" iconPosition="left">
            Submit Feedback
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;