import React, { useState, useEffect } from 'react';
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
    startTime: '',
    finishTime: '',
    // attendeeType: 'self',
    specialRequirements: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreedToTerms: false,
    notificationPreferences: {
      email: true,
      sms: false,
      whatsapp: true,
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [resources, setResources] = useState([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [resourceError, setResourceError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const BACKEND_URL = 'https://academyforexcellence-backend-ywc2.onrender.com';

  // Fetch resources if attendeeType is nominee
useEffect(() => {
  const fetchResources = async () => {
    setLoadingResources(true);
    setResourceError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/Resources`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Resources API error: ${res.status} - ${text}`);
      }
      const data = await res.json();
      setResources(data?.value || []);
    } catch (err) {
      setResourceError(err.message);
    } finally {
      setLoadingResources(false);
    }
  };

  // Always fetch resources now
  fetchResources();
}, []);


  // Helper to create a unique key for each resource
const getResourceKey = (res, index) => {
  if (res.employeeCode) return `emp-${res.employeeCode}`;
  if (res.eMail) return `email-${res.eMail}`;
  return `idx-${index}`; // fallback
};

const toggleResourceSelection = (resourceId) => {
  setSelectedResourceIds((prev) =>
    prev.includes(resourceId)
      ? prev.filter((id) => id !== resourceId)
      : [...prev, resourceId]
  );
};

  // Pre-fill course if selected
  useEffect(() => {
    if (selectedCourse) {
      setFormData((prev) => ({
        ...prev,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title || selectedCourse.name,
      }));
    }
  }, [selectedCourse]);

  // Fetch courses dynamically
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const courses = await getCourses();
        const options = courses.map((course) => ({
          value: course.id,
          label: course.name,
        }));
        setCourseOptions(options);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
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
    { value: 'group', label: 'Group Booking (3+ people)' },
  ];

  const dietaryOptions = [
    { value: 'none', label: 'No dietary restrictions' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'halal', label: 'Halal only' },
    { value: 'gluten-free', label: 'Gluten-free' },
    { value: 'other', label: 'Other (specify in notes)' },
  ];

  const timeOptions = [
    { value: '09:00', label: '09:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '01:00 PM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '15:00', label: '03:00 PM' },
    { value: '16:00', label: '04:00 PM' },
    { value: '17:00', label: '05:00 PM' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleNotificationChange = (type, checked) => {
    setFormData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: checked,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (isDirectBooking) {
      if (!formData?.courseTitle) newErrors.courseTitle = 'Please select a course';
      if (!formData?.preferredDate) newErrors.preferredDate = 'Please select a preferred date';
      if (!formData?.startTime) newErrors.startTime = 'Please select a start time';
      if (!formData?.finishTime) newErrors.finishTime = 'Please select a finish time';
      if (formData.startTime && formData.finishTime && formData.finishTime <= formData.startTime) {
        newErrors.finishTime = 'Finish time must be after start time';
      }
    }

    if (formData?.attendeeType === 'nominee' && selectedResourceIds.length === 0) {
      newErrors.selectedResourceIds = 'Please select at least one resource';
    }

    if (!formData?.emergencyContact?.trim())
      newErrors.emergencyContact = 'Emergency contact name is required';
    if (!formData?.emergencyPhone?.trim())
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    if (!formData?.agreedToTerms)
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const sanitizeForJSON = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForJSON);
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const value = obj[key];
      if (typeof value === 'function') continue;          // skip functions
      if (value instanceof Element) continue;            // skip DOM nodes
      if (value?._reactInternals || value?.__reactFiber$) continue; // skip React fiber/circular
      sanitized[key] = sanitizeForJSON(value);
    }
    return sanitized;
  }
  return undefined;
};

const handleSubmit = async (e) => {
  e?.preventDefault();

  if (!validateForm()) {
    const firstErrorElement = document.querySelector('[data-error="true"]');
    if (firstErrorElement)
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  setIsSubmitting(true);

  try {
    console.log("🔹 Selected Resource IDs:", selectedResourceIds);

    // Map selected resources into nominees
    const nomineeList = selectedResourceIds.map((id) => {
      const res = resources.find((r, idx) => getResourceKey(r, idx) === id);
      console.log(`Mapped ID ${id} →`, res);

      return {
        name: res?.employeeName || res?.name || 'Unnamed',
        email: res?.eMail || '',
        phone: res?.phone || '',
        organization: res?.organization || '',
      };
    });

    const bookingPayload = {
      courseId: formData.courseId || selectedCourse?.id,
      userId: '1',
      bookingDate: new Date().toISOString(),
      status: 'Pending',
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      preferredDate: formData.preferredDate,
      startTime: formData.startTime || '',   // ✅ send as separate field
  finishTime: formData.finishTime || '',
      attendeeType: 'Individual',
      dietaryRestrictions: formData.dietaryRestrictions || '',
      accessibilityNeeds: formData.accessibilityNeeds || '',
      notes: formData.specialRequirements || '',
      notificationPreferences: { ...formData.notificationPreferences },
      ...(nomineeList.length && { nominees: nomineeList }),
    };

    console.log('📤 Payload sent to BC:', bookingPayload);

    await onSubmit({
      courseId: formData.courseId || selectedCourse?.id,
      bookingDetails: bookingPayload,
      isDirectBooking,
    });
  } catch (error) {
    console.error('Booking submission error:', error);
    alert('There was an error processing your booking. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


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

      {/* Booking Summary for regular booking */}
      {!isDirectBooking && selectedCourse && selectedSlot && (
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
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
                    <span className="text-authority-charcoal font-semibold">
                      {selectedSlot?.startTime} - {selectedSlot?.finishTime}
                    </span>
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
        {/* Direct Booking Section */}
        {isDirectBooking && (
          <div className="space-y-6">
            <Select
              label="Select Course"
              description="Choose the course you want to schedule"
              options={courseOptions}
              value={formData?.courseId}
              onChange={(value) => {
                const selected = courseOptions.find((c) => c.value === value);
                setFormData((prev) => ({
                  ...prev,
                  courseId: value,
                  courseTitle: selected?.label,
                }));
              }}
              error={errors?.courseId}
              required
              data-error={!!errors?.courseId}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Preferred Date"
                type="date"
                value={formData.preferredDate || ''}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                error={errors?.preferredDate}
                min={new Date().toISOString().split('T')[0]}
                required
                data-error={!!errors?.preferredDate}
                description="Select your preferred training date"
              />
              <Select
                label="Start Time"
                description="Select when your training session starts"
                options={timeOptions}
                value={formData?.startTime}
                onChange={(value) => handleInputChange('startTime', value)}
                error={errors?.startTime}
                required
                data-error={!!errors?.startTime}
              />
              <Select
                label="Finish Time"
                description="Select when your training session ends"
                options={timeOptions}
                value={formData?.finishTime}
                onChange={(value) => handleInputChange('finishTime', value)}
                error={errors?.finishTime}
                required
                data-error={!!errors?.finishTime}
              />
            </div>
          </div>
        )}

        {/* Booking Type
        <Select
          label="Booking Type"
          description="Choose who will attend this training session"
          options={attendeeTypeOptions}
          value={formData?.attendeeType}
          onChange={(value) => handleInputChange('attendeeType', value)}
          required
        /> */}

        {/* Nominee Section */}
       <div className="bg-muted/50 rounded-lg p-4 border border-border">
  <div className="flex items-center space-x-2 mb-3">
    <Icon name="User" size={20} className="text-primary" />
    <h5 className="font-medium text-authority-charcoal">Nominate Resources</h5>
  </div>

  <Input
    label="Search Resource"
    placeholder="Type employee name or email..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  {loadingResources ? (
    <p className="text-sm text-gray-500">Loading resources...</p>
  ) : resourceError ? (
    <p className="text-sm text-red-500">Error: {resourceError}</p>
  ) : resources.length === 0 ? (
    <p className="text-sm text-gray-500">No resources available</p>
  ) : (
    <ul className="space-y-2 max-h-60 overflow-y-auto">
     {resources
  .filter((res) => {
    if (!searchTerm) return true;
    const name = res.employeeName || res.name || '';
    const email = res.eMail || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  })
  .slice(0, 4)
  .map((res, index) => {
    const key = getResourceKey(res, index);

    return (
      <li key={key}>
        <label className="flex items-center justify-between p-2 border rounded-lg bg-white cursor-pointer">
          <div>
            <p className="font-medium text-sm text-authority-charcoal">
              {res.employeeName || res.name || 'Unnamed'} (
              {res.eMail || 'No email'})
            </p>
            <p className="text-xs text-gray-500">
              {res.designation || ''}{' '}
              {res.resourceGroupNo ? `| Group: ${res.resourceGroupNo}` : ''}
            </p>
          </div>
          <input
            type="checkbox"
            checked={selectedResourceIds.includes(key)}
            onChange={() => toggleResourceSelection(key)}
            className="h-4 w-4 accent-primary"
          />
        </label>
      </li>
    );
  })}

    </ul>
  )}
  {errors?.selectedResourceIds && (
    <p className="text-sm text-red-500 mt-2">{errors.selectedResourceIds}</p>
  )}
</div>

        {/* Emergency Contact Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-authority-charcoal">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Emergency Contact Name"
              placeholder="Full name"
              value={formData?.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              error={errors?.emergencyContact}
              required
              data-error={!!errors?.emergencyContact}
              description="Name of person to contact in case of emergency"
            />
            <Input
              label="Emergency Contact Phone"
              placeholder="+971 50 123 4567"
              value={formData?.emergencyPhone}
              onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
              error={errors?.emergencyPhone}
              required
              data-error={!!errors?.emergencyPhone}
              description="Phone number with country code"
            />
          </div>
        </div>

        {/* Special Requirements Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-authority-charcoal">Special Requirements</h4>
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
              placeholder="Any accessibility accommodations needed"
              value={formData?.accessibilityNeeds}
              onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
            />
            <Input
              label="Other Special Requirements / Notes"
              placeholder="Add any other requirements or notes"
              value={formData?.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-2">
          <h4 className="font-semibold text-authority-charcoal">Notification Preferences</h4>
          {['email', 'sms', 'whatsapp'].map((type) => (
            <Checkbox
              key={type}
              label={`Receive ${type.toUpperCase()} notifications`}
              checked={formData.notificationPreferences[type]}
              onChange={(checked) => handleNotificationChange(type, checked)}
            />
          ))}
        </div>

        {/* Terms & Conditions */}
        <Checkbox
          label="I agree to the terms and conditions"
          checked={formData.agreedToTerms}
          onChange={(checked) => handleInputChange('agreedToTerms', checked)}
          error={errors?.agreedToTerms}
          required
          data-error={!!errors?.agreedToTerms}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : isDirectBooking ? 'Schedule Course' : 'Confirm Booking'}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
