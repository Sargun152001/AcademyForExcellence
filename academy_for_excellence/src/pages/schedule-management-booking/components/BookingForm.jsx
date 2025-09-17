import React, { useState,useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { getCourses } from '../../../services/businessCentralApi';
import { Checkbox } from '../../../components/ui/Checkbox';

const BookingForm = ({ selectedCourse, selectedSlot, onSubmit, onCancel, isDirectBooking = false }) => {
  const [formData, setFormData] = useState({
    courseTitle: '',
    preferredDate: '',
    courseId: '',
    preferredTime: '',
    attendeeType: 'self',
    nomineeEmail: '',
    specialRequirements: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreedToTerms: false,
    notificationPreferences: {
      email: true,
      sms: false,
      whatsapp: true
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
const generateScheduleId = () => {
  return Math.floor(Math.random() * 1000000); // random 6-digit number
};


useEffect(() => {
  if (selectedCourse) {
    setFormData(prev => ({
      ...prev,
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title || selectedCourse.name, // depending on your API field
    }));
  }
}, [selectedCourse]);



  // Fetch courses dynamically for direct booking
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const courses = await getCourses(); // You can pass filters if needed
        const options = courses.map(course => ({
          value: course.id,
          label: course.name
        }));
        setCourseOptions(options);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    if (isDirectBooking) {
      fetchCourses();
    }
  }, [isDirectBooking]);

  const attendeeTypeOptions = [
    { value: 'self', label: 'Self Enrollment' },
    { value: 'nominee', label: 'Nominate Team Member' },
    { value: 'group', label: 'Group Booking (3+ people)' }
  ];

  const dietaryOptions = [
    { value: 'none', label: 'No dietary restrictions' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'halal', label: 'Halal only' },
    { value: 'gluten-free', label: 'Gluten-free' },
    { value: 'other', label: 'Other (specify in notes)' }
  ];

  // Course options for direct booking
  // const courseOptions = [
  //   { value: 'project-management', label: 'Advanced Project Management for Large-Scale Construction' },
  //   { value: 'safety-compliance', label: 'Safety Compliance & Risk Management in Construction' },
  //   { value: 'digital-construction', label: 'Digital Construction Technologies & BIM Implementation' },
  //   { value: 'leadership', label: 'Leadership Excellence in Construction Teams' },
  //   { value: 'quality-control', label: 'Quality Control & Assurance in Construction' },
  //   { value: 'sustainable-construction', label: 'Sustainable Construction Practices' }
  // ];

  // Time slot options for direct booking
  const timeSlotOptions = [
    { value: '09:00', label: '9:00 AM - Full Day Session' },
    { value: '14:00', label: '2:00 PM - Afternoon Session' },
    { value: '10:00', label: '10:00 AM - Morning Session' },
    { value: '15:00', label: '3:00 PM - Late Afternoon Session' }
  ];

 const handleInputChange = (field, value) => {
  // Ensure date fields are always in YYYY-MM-DD string format
  if (field === 'preferredDate') {
    // If value is null/undefined, store empty string
    value = value ? value : '';
  }

  setFormData(prev => ({
    ...prev,
    [field]: value
  }));

  // Clear error when user types/selects
  if (errors?.[field]) {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }
};


  const handleNotificationChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev?.notificationPreferences,
        [type]: checked
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Direct booking validation
    if (isDirectBooking) {
      if (!formData?.courseTitle) {
        newErrors.courseTitle = 'Please select a course';
      }
      if (!formData?.preferredDate) {
        newErrors.preferredDate = 'Please select a preferred date';
      }
      if (!formData?.preferredTime) {
        newErrors.preferredTime = 'Please select a preferred time';
      }
    }

    if (formData?.attendeeType === 'nominee' && !formData?.nomineeEmail) {
      newErrors.nomineeEmail = 'Nominee email is required';
    }

    if (!formData?.emergencyContact?.trim()) {
      newErrors.emergencyContact = 'Emergency contact name is required';
    }

    if (!formData?.emergencyPhone?.trim()) {
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    }

    if (!formData?.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
     await onSubmit({
    courseId: formData.courseId || selectedCourse?.id,
    bookingDetails: formData,
    isDirectBooking,
  });
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show placeholder only for regular booking when course/slot not selected
  if (!isDirectBooking && (!selectedCourse || !selectedSlot)) {
    return (
      <div className="bg-card rounded-xl construction-shadow-premium p-8 text-center">
        <div className="max-w-md mx-auto">
          <Icon name="Calendar" size={64} className="text-professional-gray mx-auto mb-6 opacity-50" />
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal mb-3">
            Select Course & Time Slot
          </h3>
          <p className="text-professional-gray mb-6">
            Please select a course and available time slot to proceed with booking. Use the course cards above to choose your training session.
          </p>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-authority-charcoal mb-2">Quick Steps:</h4>
            <ol className="text-sm text-professional-gray text-left space-y-1">
              <li>1. Choose a course from the list above</li>
              <li>2. Select an available date from the calendar</li>
              <li>3. Pick a time slot that works for you</li>
              <li>4. Complete this booking form</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl construction-shadow-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-authority-charcoal">
          {isDirectBooking ? 'Schedule Course' : 'Complete Your Booking'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <Icon name="X" size={20} />
        </Button>
      </div>

      {/* Enhanced Booking Summary - Only show for regular booking */}
      {!isDirectBooking && selectedCourse && selectedSlot && (
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="BookOpen" size={24} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-authority-charcoal mb-3 text-lg">
                Booking Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-professional-gray font-medium">Course:</span>
                    <span className="text-authority-charcoal font-semibold text-right max-w-xs">
                      {selectedCourse?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-professional-gray font-medium">Date:</span>
                    <span className="text-authority-charcoal font-semibold">{selectedSlot?.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-professional-gray font-medium">Time:</span>
                    <span className="text-authority-charcoal font-semibold">{selectedSlot?.time}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-professional-gray font-medium">Duration:</span>
                    <span className="text-authority-charcoal font-semibold">{selectedCourse?.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-professional-gray font-medium">Instructor:</span>
                    <span className="text-authority-charcoal font-semibold">{selectedCourse?.instructor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-professional-gray font-medium">Available Spots:</span>
                    <span className="text-success font-semibold">{selectedSlot?.availableSpots} remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Selection - Enhanced for direct booking */}
        {isDirectBooking && (
          <div className="space-y-6">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="Info" size={20} className="text-accent" />
                <h4 className="font-semibold text-authority-charcoal">Course Selection</h4>
              </div>
              <p className="text-sm text-professional-gray">
                Choose your preferred course, date, and time. We'll confirm availability and send you a booking confirmation.
              </p>
            </div>
            
            <Select
  label="Select Course"
  description="Choose the course you want to schedule"
  options={courseOptions} // [{ value: course.id, label: course.name }]
  value={formData?.courseId} // ✅ will now show the pre-selected one
  onChange={(value) => {
    const selected = courseOptions.find(c => c.value === value);
    setFormData(prev => ({
      ...prev,
      courseId: value,
      courseTitle: selected?.label,
    }));
  }}
  error={errors?.courseId}
  required
  data-error={!!errors?.courseId}
/>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input
  label="Preferred Date"
  type="date"
  value={formData.preferredDate || ''} // ensure it's always a string
  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
  error={errors?.preferredDate}
  min={new Date().toISOString().split('T')[0]} // today
  required
  data-error={!!errors?.preferredDate}
  description="Select your preferred training date"
/>

              <Select
                label="Preferred Time"
                description="Select your preferred time slot"
                options={timeSlotOptions}
                value={formData?.preferredTime}
                onChange={(value) => handleInputChange('preferredTime', value)}
                error={errors?.preferredTime}
                required
                data-error={!!errors?.preferredTime}
              />
            </div>
          </div>
        )}

        {/* Enhanced Attendee Information Section */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h4 className="font-heading font-semibold text-authority-charcoal text-lg">
              Attendee Information
            </h4>
            <p className="text-sm text-professional-gray mt-1">
              Please provide details about who will be attending this training session.
            </p>
          </div>

          <Select
            label="Booking Type"
            description="Choose who will attend this training session"
            options={attendeeTypeOptions}
            value={formData?.attendeeType}
            onChange={(value) => handleInputChange('attendeeType', value)}
            required
          />

          {/* Enhanced Nominee Email Section */}
          {formData?.attendeeType === 'nominee' && (
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="User" size={20} className="text-primary" />
                <h5 className="font-medium text-authority-charcoal">Nominee Details</h5>
              </div>
              <Input
                label="Nominee Email Address"
                type="email"
                placeholder="colleague@company.com"
                description="Email of the person you're nominating for this course"
                value={formData?.nomineeEmail}
                onChange={(e) => handleInputChange('nomineeEmail', e?.target?.value)}
                error={errors?.nomineeEmail}
                required
                data-error={!!errors?.nomineeEmail}
              />
            </div>
          )}
        </div>

        {/* Enhanced Emergency Contact Section */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h4 className="font-heading font-semibold text-authority-charcoal text-lg">
              Emergency Contact
            </h4>
            <p className="text-sm text-professional-gray mt-1">
              Required for all training sessions for safety purposes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Emergency Contact Name"
              type="text"
              placeholder="Full name"
              value={formData?.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
              error={errors?.emergencyContact}
              required
              data-error={!!errors?.emergencyContact}
              description="Name of person to contact in case of emergency"
            />
            <Input
              label="Emergency Contact Phone"
              type="tel"
              placeholder="+971 50 123 4567"
              value={formData?.emergencyPhone}
              onChange={(e) => handleInputChange('emergencyPhone', e?.target?.value)}
              error={errors?.emergencyPhone}
              required
              data-error={!!errors?.emergencyPhone}
              description="Phone number with country code"
            />
          </div>
        </div>

        {/* Enhanced Special Requirements Section */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h4 className="font-heading font-semibold text-authority-charcoal text-lg">
              Special Requirements
            </h4>
            <p className="text-sm text-professional-gray mt-1">
              Help us provide the best training experience for you.
            </p>
          </div>

          <Select
            label="Dietary Requirements"
            description="Please specify any dietary restrictions for catered sessions"
            options={dietaryOptions}
            value={formData?.dietaryRestrictions}
            onChange={(value) => handleInputChange('dietaryRestrictions', value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Accessibility Needs"
              type="text"
              placeholder="Any accessibility accommodations needed"
              description="Wheelchair access, hearing assistance, etc."
              value={formData?.accessibilityNeeds}
              onChange={(e) => handleInputChange('accessibilityNeeds', e?.target?.value)}
            />
            
            <Input
              label="Additional Notes"
              type="text"
              placeholder="Any other special requirements or notes"
              description="Optional additional information"
              value={formData?.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
            />
          </div>
        </div>

        {/* Enhanced Notification Preferences Section */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h4 className="font-heading font-semibold text-authority-charcoal text-lg">
              Communication Preferences
            </h4>
            <p className="text-sm text-professional-gray mt-1">
              Choose how you'd like to receive updates about your booking.
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-4">
            <Checkbox
              label="Email notifications"
              description="Course reminders, updates, and confirmations via email"
              checked={formData?.notificationPreferences?.email}
              onChange={(e) => handleNotificationChange('email', e?.target?.checked)}
            />
            <Checkbox
              label="SMS notifications"
              description="Text message reminders and important updates (standard rates may apply)"
              checked={formData?.notificationPreferences?.sms}
              onChange={(e) => handleNotificationChange('sms', e?.target?.checked)}
            />
            <Checkbox
              label="WhatsApp notifications"
              description="Updates and reminders via WhatsApp Business"
              checked={formData?.notificationPreferences?.whatsapp}
              onChange={(e) => handleNotificationChange('whatsapp', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Enhanced Terms Agreement */}
        <div className="space-y-6">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <Checkbox
              label="I agree to the terms and conditions"
              description="By checking this box, you agree to our booking policy, cancellation terms, and privacy policy"
              checked={formData?.agreedToTerms}
              onChange={(e) => handleInputChange('agreedToTerms', e?.target?.checked)}
              error={errors?.agreedToTerms}
              required
              data-error={!!errors?.agreedToTerms}
            />
            <div className="mt-3 pt-3 border-t border-accent/20">
              <p className="text-xs text-professional-gray">
                <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before the session.
                <br />
                <strong>Privacy:</strong> We protect your data according to our privacy policy.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            iconName="Calendar"
            iconPosition="left"
            className="sm:flex-1 bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : (isDirectBooking ? 'Schedule Course' : 'Confirm Booking')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;