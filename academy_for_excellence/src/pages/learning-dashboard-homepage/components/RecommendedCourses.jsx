import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { getRecommendedCoursesForUsers } from 'services/businessCentralApi';
import BookingForm from '../../schedule-management-booking/components/BookingForm'; // ✅ added import

const RecommendedCourses = () => {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ NEW STATES FOR BOOKING
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedCourseForBooking, setSelectedCourseForBooking] = useState(null);

  const getUserId = () => {
    try {
      const userData = localStorage.getItem('userData');
      const userResource = localStorage.getItem('userResource');

      if (userResource) {
        const resource = JSON.parse(userResource);
        return resource.id;
      } else if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }

      console.warn('[DEBUG] No user ID found in localStorage');
      return null;
    } catch (err) {
      console.error('[DEBUG] Error getting user ID:', err);
      return null;
    }
  };

  const recommendedCourses = [];

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getUserId();

        if (!userId) {
          console.warn('[DEBUG] No user ID available, using fallback data');
          setCourses(recommendedCourses);
          setLoading(false);
          return;
        }

        console.log('[DEBUG] Fetching courses for user ID:', userId);
        const coursesData = await getRecommendedCoursesForUsers(userId);

        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
        } else {
          setCourses(recommendedCourses);
        }
      } catch (err) {
        setError('Failed to load recommended courses');
        setCourses(recommendedCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, []);

  // ✅ HANDLE SCHEDULE CLICK
  const handleScheduleCourse = (course) => {
    console.log("Opening booking form for:", course);

    setSelectedCourseForBooking({
      id: course.id,
      title: course.title,
      name: course.title,
      duration: course.duration,
      instructor: { name: course.instructor }
    });

    setShowBookingForm(true);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-success text-white';
      case 'Intermediate': return 'bg-warning text-white';
      case 'Advanced': return 'bg-error text-white';
      default: return 'bg-professional-gray text-white';
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
              Recommended for You
            </h3>
            <p className="text-sm text-professional-gray mt-1">
              Loading personalized recommendations...
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background rounded-lg border border-border p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="bg-gray-300 rounded w-48 h-32"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('[DEBUG] Showing fallback data due to error:', error);
  }

  return (
    <div className="bg-card rounded-xl p-6 construction-shadow">

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
            <p className="text-sm text-yellow-700">
              {error}. Showing default recommendations.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
            Recommended for You
          </h3>
          <p className="text-sm text-professional-gray mt-1">
            Based on your current projects and skill gaps
          </p>
        </div>
        <Link to="/course-catalog-discovery">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {courses?.map((course) => (
          <div key={course?.id} className="bg-background rounded-lg border border-border hover:border-primary construction-transition hover:construction-shadow-lg group">

            <div className="flex flex-col lg:flex-row">

              <div className="relative lg:w-48 h-48 lg:h-auto">
                <Image
                  src={course?.image}
                  alt={course?.title}
                  className="w-full h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
                />

                {course?.isNew && (
                  <div className="absolute top-3 left-3 bg-action-orange text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </div>
                )}
              </div>

              <div className="flex-1 p-4">
                <div className="flex flex-col h-full">

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">

                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(course?.level)}`}>
                          {course?.level}
                        </span>
                        <span className="text-xs text-professional-gray">
                          {course?.category}
                        </span>
                      </div>

                      <h4 className="font-semibold text-authority-charcoal group-hover:text-primary construction-transition line-clamp-2">
                        {course?.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm text-professional-gray mb-3 line-clamp-2">
                    {course?.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {course?.tags?.map((tag, index) => (
                      <span key={index} className="text-xs bg-muted text-professional-gray px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">

                    <div className="flex items-center space-x-4 text-sm text-professional-gray">
                      <div className="flex items-center space-x-1">
                        <Icon name="User" size={14} />
                        <span>{course?.instructor}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{course?.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">

                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={14} className="text-accent fill-current" />
                        <span className="text-sm font-medium text-authority-charcoal">
                          {course?.rating}
                        </span>
                      </div>

                      {/* ✅ SCHEDULE BUTTON */}
                      <Button
                        size="sm"
                        onClick={() => handleScheduleCourse(course)}
                      >
                        Schedule Course
                      </Button>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommendation Note */}
      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Sparkles" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-authority-charcoal mb-1">
              AI-Powered Recommendations
            </h4>
            <p className="text-sm text-professional-gray">
              These courses are selected based on your current role as Project Manager,
              recent activity in structural engineering topics, and upcoming project requirements
              in the Dubai Metro expansion.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ BOOKING FORM MODAL */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            <BookingForm
              selectedCourse={selectedCourseForBooking}
              selectedSlot={null}
              isDirectBooking={true}
              onCancel={() => setShowBookingForm(false)}
              onSubmit={(data) => {
                console.log("Booking Submitted:", data);
                setShowBookingForm(false);
              }}
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default RecommendedCourses;