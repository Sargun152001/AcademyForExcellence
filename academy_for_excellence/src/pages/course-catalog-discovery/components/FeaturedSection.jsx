import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedSection = ({ featuredCourses, onEnroll }) => {
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
    
      <div className="">
        {/* Section Header */}
        {/* <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold mb-3">
            Featured Learning Paths
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Curated by industry experts.
          </p>
        </div> */}

        {/* Featured Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {featuredCourses?.map((course, index) => (
            <div
              key={course?.id}
              className={`relative overflow-hidden rounded-xl construction-shadow-lg ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                {/* <Image
                  src={course?.image}
                  alt={course?.title}
                  className="w-full h-full object-cover"
                /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]"></div>
              </div>

              {/* Content */}
              <div className={`relative p-6 flex flex-col justify-end ${
                index === 0 ? 'min-h-[400px]' : 'min-h-[280px]'
              }`}>
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-authority-charcoal px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    {course?.badge}
                  </span>
                </div>

                {/* Course Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm opacity-95">
                    <div className="flex items-center">
                      <Icon name="Clock" size={16} className="mr-1" />
                      {course?.duration}
                    </div>
                    <div className="flex items-center">
                      <Icon name="Users" size={16} className="mr-1" />
                      {course?.enrolledCount}
                    </div>
                    <div className="flex items-center">
                      {renderStars(course?.rating)}
                      <span className="ml-1">{course?.rating}</span>
                    </div>
                  </div>

                  <h3 className={`font-heading font-bold text-white drop-shadow-lg ${
                    index === 0 ? 'text-2xl' : 'text-lg'
                  }`}>
                    {course?.title}
                  </h3>

                  <p className={`text-white/95 drop-shadow-md ${
                    index === 0 ? 'text-base' : 'text-sm'
                  } line-clamp-2`}>
                    {course?.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20">
                      <Image
                        src={course?.instructor?.avatar}
                        alt={course?.instructor?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white drop-shadow-sm">
                        {course?.instructor?.name}
                      </p>
                      <p className="text-xs text-white/90 drop-shadow-sm">
                        {course?.instructor?.title}
                      </p>
                    </div>
                  </div>

                  {/* Skills Preview */}
                  <div className="flex flex-wrap gap-1">
                    {course?.skills?.slice(0, 3)?.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="text-xs bg-white/30 text-white px-2 py-1 rounded backdrop-blur-sm shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-2">
                    <Link to={`/course-catalog-discovery/course/${course?.id}`}>
                      <Button variant="outline" className="bg-white/20 border-white/40 text-white hover:bg-white/30 shadow-lg backdrop-blur-sm">
                        Learn More
                      </Button>
                    </Link>
                    <Button
                      variant="default"
                      onClick={() => onEnroll(course?.id)}
                      className="bg-accent text-authority-charcoal hover:bg-accent/90 shadow-lg"
                    >
                      Start Learning
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {/* <div className="text-center">
          <Link to="/personal-learning-path-progress">
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              iconName="ArrowRight"
              iconPosition="right"
            >
              Explore All Learning Paths
            </Button>
          </Link>
        </div> */}
      </div>
  );
};

export default FeaturedSection;