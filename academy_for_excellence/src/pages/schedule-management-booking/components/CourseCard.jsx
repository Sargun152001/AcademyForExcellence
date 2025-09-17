import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CourseCard = ({ course, onScheduleCourse ,isSelected}) => {
  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'text-success bg-success/10';
      case 'intermediate':
        return 'text-warning bg-warning/10';
      case 'advanced':
        return 'text-error bg-error/10';
      default:
        return 'text-professional-gray bg-muted';
    }
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${hours * 60}min`;
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
  };

  return (
    <div className={`bg-card rounded-xl construction-shadow-premium construction-transition border-2 ${
      isSelected ? 'border-primary' : 'border-transparent hover:border-border'
    }`}>
      {/* Course Image */}
      <div className="relative overflow-hidden rounded-t-xl h-48">
        <Image
          src={course?.imageUrl}
          alt={course?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course?.level)}`}>
            {course?.level}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
            {formatDuration(course?.duration)}
          </div>
        </div>
        {course?.isNew && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-action-orange text-white px-2 py-1 rounded-full text-xs font-bold">
              NEW
            </span>
          </div>
        )}
      </div>
      {/* Course Content */}
      <div className="p-6">
        {/* Course Title & Category */}
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="BookOpen" size={16} className="text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              {course?.category}
            </span>
          </div>
          <h3 className="text-lg font-heading font-semibold text-authority-charcoal line-clamp-2">
            {course?.title}
          </h3>
        </div>

        {/* Course Description */}
        <p className="text-sm text-professional-gray mb-4 line-clamp-3">
          {course?.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} className="text-professional-gray" />
              <span className="text-xs text-professional-gray">{course?.enrolled} enrolled</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-warning fill-current" />
              <span className="text-xs text-professional-gray">{course?.rating}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} className="text-professional-gray" />
            <span className="text-xs text-professional-gray">{course?.availableSlots} slots</span>
          </div>
        </div>

        {/* Instructor Info */}
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
        {/* Prerequisites */}
        {course?.prerequisites && course?.prerequisites?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle" size={14} className="text-professional-gray" />
              <span className="text-xs font-medium text-professional-gray">Prerequisites</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {course?.prerequisites?.slice(0, 2)?.map((prereq, index) => (
                <span key={index} className="px-2 py-1 bg-background text-xs text-professional-gray rounded border">
                  {prereq}
                </span>
              ))}
              {course?.prerequisites?.length > 2 && (
                <span className="px-2 py-1 bg-background text-xs text-professional-gray rounded border">
                  +{course?.prerequisites?.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

      {/* Action Button */}
<Button
  fullWidth
  onClick={onScheduleCourse}  
  iconName="Calendar"
  iconPosition="left"
>
  Schedule Course
</Button>

      </div>
    </div>
  );
};

export default CourseCard;