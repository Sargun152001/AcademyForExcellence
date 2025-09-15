import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressVisualization = () => {
  const [selectedPath, setSelectedPath] = useState('foundation');

  const learningPaths = {
    foundation: {
      title: "Foundation Skills",
      description: "Essential construction project management fundamentals",
      progress: 75,
      color: "bg-construction-blue",
      icon: "Building",
      courses: [
        { name: "Construction Basics", completed: true, duration: "8h" },
        { name: "Safety Protocols", completed: true, duration: "6h" },
        { name: "Quality Control", completed: false, duration: "10h", current: true },
        { name: "Documentation Standards", completed: false, duration: "4h" }
      ]
    },
    structure: {
      title: "Structural Excellence",
      description: "Advanced structural engineering and design principles",
      progress: 45,
      color: "bg-confidence-teal",
      icon: "Layers",
      courses: [
        { name: "Structural Analysis", completed: true, duration: "12h" },
        { name: "Material Science", completed: false, duration: "8h", current: true },
        { name: "Load Calculations", completed: false, duration: "10h" },
        { name: "Seismic Design", completed: false, duration: "14h" }
      ]
    },
    leadership: {
      title: "Leadership Mastery",
      description: "Team management and project leadership skills",
      progress: 60,
      color: "bg-decision-blue",
      icon: "Crown",
      courses: [
        { name: "Team Dynamics", completed: true, duration: "6h" },
        { name: "Conflict Resolution", completed: true, duration: "4h" },
        { name: "Strategic Planning", completed: false, duration: "8h", current: true },
        { name: "Cultural Intelligence", completed: false, duration: "6h" }
      ]
    },
    specialization: {
      title: "Regional Specialization",
      description: "Middle Eastern construction standards and practices",
      progress: 30,
      color: "bg-desert-gold",
      icon: "Award",
      courses: [
        { name: "UAE Building Codes", completed: true, duration: "10h" },
        { name: "Cultural Practices", completed: false, duration: "6h", current: true },
        { name: "Climate Considerations", completed: false, duration: "8h" },
        { name: "Local Regulations", completed: false, duration: "12h" }
      ]
    }
  };

  const currentPath = learningPaths?.[selectedPath];

  return (
    <div className="bg-card rounded-xl p-6 construction-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
          Learning Progress
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={20} className="text-accent" />
          <span className="text-sm font-medium text-professional-gray">
            Overall: 52%
          </span>
        </div>
      </div>
      {/* Path Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {Object.entries(learningPaths)?.map(([key, path]) => (
          <button
            key={key}
            onClick={() => setSelectedPath(key)}
            className={`p-3 rounded-lg border construction-transition ${
              selectedPath === key
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
          >
            <div className={`w-8 h-8 ${path?.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
              <Icon name={path?.icon} size={16} className="text-white" />
            </div>
            <div className="text-xs font-medium text-authority-charcoal text-center">
              {path?.title}
            </div>
            <div className="text-xs text-professional-gray text-center mt-1">
              {path?.progress}%
            </div>
          </button>
        ))}
      </div>
      {/* Selected Path Details */}
      <div className="bg-background rounded-lg p-4 border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 ${currentPath?.color} rounded-lg flex items-center justify-center`}>
            <Icon name={currentPath?.icon} size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-authority-charcoal">
              {currentPath?.title}
            </h4>
            <p className="text-sm text-professional-gray">
              {currentPath?.description}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-professional-gray">Progress</span>
            <span className="font-medium text-authority-charcoal">
              {currentPath?.progress}%
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className={`h-2 rounded-full construction-transition ${currentPath?.color}`}
              style={{ width: `${currentPath?.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-3">
          {currentPath?.courses?.map((course, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                course?.completed 
                  ? 'bg-success' 
                  : course?.current 
                    ? 'bg-warning' :'bg-border'
              }`}>
                {course?.completed ? (
                  <Icon name="Check" size={12} className="text-white" />
                ) : course?.current ? (
                  <Icon name="Play" size={12} className="text-white" />
                ) : (
                  <Icon name="Lock" size={12} className="text-professional-gray" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    course?.completed 
                      ? 'text-professional-gray line-through' :'text-authority-charcoal'
                  }`}>
                    {course?.name}
                  </span>
                  <span className="text-xs text-professional-gray">
                    {course?.duration}
                  </span>
                </div>
                {course?.current && (
                  <div className="text-xs text-warning font-medium mt-1">
                    Currently in progress
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continue {currentPath?.title}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressVisualization;