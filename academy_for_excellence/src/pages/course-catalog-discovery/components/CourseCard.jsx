import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CourseCard = ({ course, onEnroll, onWishlist, isWishlisted = false }) => {
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
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg border border-border construction-shadow hover:construction-shadow-lg construction-transition group">
      {/* Course Image */}
      <div className="relative overflow-hidden rounded-t-lg h-48">
       <Image src=
       {course?.imageUrl} 
          alt={course?.name}
          className="w-full h-full object-cover group-hover:scale-105 construction-transition"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course?.level)}`}>
            {course?.level}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onWishlist(course?.id)}
            className="bg-white/90 hover:bg-white"
          >
            <Icon
              name="Heart"
              size={18}
              className={isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}
            />
          </Button>
        </div>
        {course?.isNew && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-action-orange text-white px-2 py-1 rounded-full text-xs font-medium">
              New
            </span>
          </div>
        )}
      </div>
      {/* Course Content */}
      <div className="p-6">
        {/* Category & Duration */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
            {course?.category}
          </span>
          <div className="flex items-center text-sm text-professional-gray">
            <Icon name="Clock" size={16} className="mr-1" />
            {course?.duration}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-heading font-semibold text-authority-charcoal mb-2 line-clamp-2 group-hover:text-primary construction-transition">
          {course?.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-professional-gray mb-4 line-clamp-3">
          {course?.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
            <Image
              src={course?.instructor?.avatar}
              alt={course?.instructor?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-authority-charcoal">
              {course?.instructor.name}
            </p>
            <p className="text-xs text-professional-gray">
              {course?.instructor?.title}
            </p>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(course?.rating)}
            </div>
            <span className="text-sm font-medium text-authority-charcoal">
              {course?.rating}
            </span>
            <span className="text-sm text-professional-gray">
              ({course?.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center text-sm text-professional-gray">
            <Icon name="Users" size={16} className="mr-1" />
            {course?.enrolledCount}
          </div>
        </div>

        {/* Prerequisites */}
        {course?.prerequisites?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-professional-gray mb-2">Prerequisites:</p>
            <div className="flex flex-wrap gap-1">
              {course?.prerequisites?.slice(0, 2)?.map((prereq, index) => (
                <span
                  key={index}
                  className="text-xs bg-muted text-text-secondary px-2 py-1 rounded"
                >
                  {prereq}
                </span>
              ))}
              {course?.prerequisites?.length > 2 && (
                <span className="text-xs text-professional-gray">
                  +{course?.prerequisites?.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Skills & Certifications */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {course?.skills?.slice(0, 3)?.map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-accent/20 text-accent px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
          {course?.certifications?.length > 0 && (
            <div className="flex items-center text-xs text-professional-gray">
              <Icon name="Award" size={14} className="mr-1" />
              Leads to: {course?.certifications?.join(', ')}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
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
          <div className="flex items-center space-x-2">
            <Link to={`/course-catalog-discovery/course/${course?.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <Button
              variant="default"
              size="sm"
              onClick={() => onEnroll(course?.id)}
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;