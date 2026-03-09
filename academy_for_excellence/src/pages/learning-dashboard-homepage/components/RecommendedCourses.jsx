import React, { useState, useEffect } from 'react'; // Add useState and useEffect
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { getRecommendedCoursesForUsers } from 'services/businessCentralApi';

const RecommendedCourses = () => {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserId = () => {
    try {
      const userData = localStorage.getItem('userData');
      const userResource = localStorage.getItem('userResource');

      if (userResource) {
        const resource = JSON.parse(userResource);
        return resource.id; // This should be the BC Resource 'No.' field
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

  const recommendedCourses = [
    // {
    //   id: 1,
    //   title: "Dubai Metro Phase 3: Project Management Case Study",
    //   instructor: "Dr. Hassan Al-Mahmoud",
    //   duration: "12 hours",
    //   level: "Advanced",
    //   rating: 4.8,
    //   students: 234,
    //   image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
    //   category: "Case Studies",
    //   tags: ["Metro", "Infrastructure", "Dubai"],
    //   description: "Deep dive into the complexities of managing large-scale transit infrastructure projects in the Middle East.",
    //   relevanceScore: 95,
    //   isNew: true
    // },
    // {
    //   id: 2,
    //   title: "NEOM Sustainable Construction Practices",
    //   instructor: "Eng. Sarah Al-Zahra",
    //   duration: "8 hours",
    //   level: "Intermediate",
    //   rating: 4.9,
    //   students: 156,
    //   image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=400&h=250&fit=crop",
    //   category: "Sustainability",
    //   tags: ["NEOM", "Green Building", "Innovation"],
    //   description: "Learn cutting-edge sustainable construction methods being implemented in Saudi Arabia\'s futuristic city project.",
    //   relevanceScore: 88,
    //   isNew: false
    // },
    // {
    //   id: 3,
    //   title: "Cultural Intelligence in Middle Eastern Projects",
    //   instructor: "Prof. Ahmed Rashid",
    //   duration: "6 hours",
    //   level: "Beginner",
    //   rating: 4.7,
    //   students: 312,
    //   image: "https://images.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_1280.jpg?w=400&h=250&fit=crop",
    //   category: "Leadership",
    //   tags: ["Culture", "Communication", "Leadership"],
    //   description: "Master the art of managing diverse teams and stakeholders across different Middle Eastern cultures.",
    //   relevanceScore: 82,
    //   isNew: false
    // }
  ];

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getUserId();
        // Add this check to prevent API call with null/undefined userId
        if (!userId) {
          console.warn('[DEBUG] No user ID available, using fallback data');
          setCourses(recommendedCourses);
          setLoading(false); // Important: set loading to false here
          return; // Exit early
        }

        console.log('[DEBUG] Fetching courses for user ID:', userId);
        const coursesData = await getRecommendedCoursesForUsers(userId);

        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
          // console.log('[DEBUG] Successfully loaded courses:', coursesData.length);
        } else {
          // console.warn('[DEBUG] No courses returned, using fallback data');
          setCourses(recommendedCourses); // Use dummy data as fallback
        }
      } catch (err) {
        // console.error('[DEBUG] Error fetching recommended courses:', err);
        setError('Failed to load recommended courses');
        setCourses(recommendedCourses); // Use dummy data on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, []); // Empty dependency array - fetch once on mount




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

  // Error state (still shows fallback data)
  if (error) {
    console.warn('[DEBUG] Showing fallback data due to error:', error);
  }


  return (
    <div className="bg-card rounded-xl p-6 construction-shadow">

      {/* Error message (if any) */}
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
              {/* Course Image */}
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
                {/* <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {course?.relevanceScore}% match
                </div> */}
              </div>

              {/* Course Content */}
              <div className="flex-1 p-4">
                <div className="flex flex-col h-full">
                  {/* Header */}
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

                  {/* Description */}
                  <p className="text-sm text-professional-gray mb-3 line-clamp-2">
                    {course?.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {course?.tags?.map((tag, index) => (
                      <span key={index} className="text-xs bg-muted text-professional-gray px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
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
                        {/* <span className="text-xs text-professional-gray">
                          ({course?.students})
                        </span> */}
                      </div>

                      {/* <Link to="/course-catalog-discovery">
                        <Button size="sm" variant="outline">
                          Enroll Now
                        </Button>
                      </Link> */}
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
    </div>
  );
};

export default RecommendedCourses;