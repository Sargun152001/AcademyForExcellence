import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CourseListItem = ({ course, onEnroll, onWishlist, isWishlisted = false }) => {
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Foundation': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white border border-border rounded-lg construction-shadow hover:construction-shadow-lg construction-transition p-6">
      <div className="flex gap-6">
        {/* Course Image */}
        <div className="relative flex-shrink-0 w-48 h-32 overflow-hidden rounded-lg">
          <Image
            src={course?.image}
            alt={course?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course?.level)}`}>
              {course?.level}
            </span>
          </div>
          {course?.isNew && (
            <div className="absolute top-2 right-2">
              <span className="bg-action-orange text-white px-2 py-1 rounded-full text-xs font-medium">
                New
              </span>
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              {/* Category & Duration */}
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {course?.category}
                </span>
                <div className="flex items-center text-sm text-professional-gray">
                  <Icon name="Clock" size={16} className="mr-1" />
                  {course?.duration}
                </div>
                <div className="flex items-center text-sm text-professional-gray">
                  <Icon name="Users" size={16} className="mr-1" />
                  {course?.enrolledCount} enrolled
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-heading font-semibold text-authority-charcoal mb-2 hover:text-primary construction-transition">
                <Link to={`/course-catalog-discovery/course/${course?.id}`}>
                  {course?.title}
                </Link>
              </h3>

              {/* Description */}
              <p className="text-sm text-professional-gray mb-3 line-clamp-2">
                {course?.description}
              </p>

              {/* Instructor & Rating */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                    <Image
                      src={course?.instructor?.avatar}
                      alt={course?.instructor?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-authority-charcoal">
                      {course?.instructor?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(course?.rating)}
                  </div>
                  <span className="text-sm font-medium text-authority-charcoal">
                    {course?.rating}
                  </span>
                  <span className="text-sm text-professional-gray">
                    ({course?.reviewCount})
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mb-3">
                {course?.skills?.slice(0, 4)?.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs bg-accent/20 text-accent px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {course?.skills?.length > 4 && (
                  <span className="text-xs text-professional-gray">
                    +{course?.skills?.length - 4} more
                  </span>
                )}
              </div>

              {/* Prerequisites */}
              {course?.prerequisites?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-professional-gray">
                    Prerequisites: {course?.prerequisites?.slice(0, 2)?.join(', ')}
                    {course?.prerequisites?.length > 2 && ` +${course?.prerequisites?.length - 2} more`}
                  </p>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onWishlist(course?.id)}
            >
              <Icon
                name="Heart"
                size={18}
                className={isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}
              />
            </Button>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            {/* Price */}
            <div className="flex items-center space-x-2">
              {course?.originalPrice && (
                <span className="text-sm text-professional-gray line-through">
                  ${course?.originalPrice}
                </span>
              )}
              <span className="text-lg font-bold text-authority-charcoal">
                {course?.price === 0 ? 'Free' : `$${course?.price}`}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Link to={`/course-catalog-discovery/course/${course?.id}`}>
                <Button variant="outline">
                  View Details
                </Button>
              </Link>
              <Button
                variant="default"
                onClick={() => onEnroll(course?.id)}
              >
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListItem;