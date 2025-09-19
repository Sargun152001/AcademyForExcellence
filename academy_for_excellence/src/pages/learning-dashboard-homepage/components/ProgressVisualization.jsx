import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getSkillProgress } from 'services/businessCentralApi';

const ProgressVisualization = () => {
  const [selectedPath, setSelectedPath] = useState('foundation');
  const [skillData, setSkillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from localStorage
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

      return null;
    } catch (err) {
      console.error('[DEBUG] Error getting user ID:', err);
      return null;
    }
  };

  // Fetch skill progress data
  useEffect(() => {
    const fetchSkillProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getUserId();
        if (!userId) {
          // console.warn('[DEBUG] No user ID available');
          setLoading(false);
          return;
        }

        // console.log('[DEBUG] Fetching skill progress for user ID:', userId);
        const skillProgressData = await getSkillProgress(userId);
        
        setSkillData(skillProgressData || []);
        // console.log('[DEBUG] Successfully loaded skill progress:', skillProgressData);
      } catch (err) {
        console.error('[DEBUG] Error fetching skill progress:', err);
        setError('Failed to load skill progress');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillProgress();
  }, []);

  // Generate learning paths from API data
  const generateLearningPaths = (apiData) => {
    // Helper function to filter and map skills
    const filterSkillsByLevel = (level, progressValue) => {
      return apiData
        .filter(skill => 
          skill.level === level && 
          skill.skillStatus === "Have" && 
          parseInt(skill.progress) === progressValue
        )
        .map((skill, index) => ({
          name: skill.skill,
          completed: false,
          // completed: index === apiData.filter(s => s.level === level && s.skillStatus === "Have" && parseInt(s.progress) === progressValue).length - 1, // Last one completed
          duration: "10h",
          current: true,
          // current: index === 0 && index !== apiData.filter(s => s.level === level && s.skillStatus === "Have" && parseInt(s.progress) === progressValue, // First one current (if not completed)
          skillId: skill.id,
          progress: skill.progress
        }));
    };

    // Calculate progress for each path based on completed courses
    const calculateProgress = (courses) => {
      if (courses.length === 0) return 0;
      const completedCount = courses.filter(course => course.completed).length;
      return Math.round((completedCount / courses.length) * 100);
    };

    const foundationCourses = filterSkillsByLevel('Foundation', 25);
    const intermediateCourses = filterSkillsByLevel('Intermediate', 50);
    const expertCourses = filterSkillsByLevel('Expert', 75);
    const advanceCourses = filterSkillsByLevel('Advance', 100);

    return {
      foundation: {
        title: "Foundation Skills",
        description: "Essential construction project management fundamentals",
        progress: 25,
        color: "bg-construction-blue",
        icon: "Building",
        courses: foundationCourses.length > 0 ? foundationCourses : [
          { name: "No foundation skills available", completed: false, duration: "0h" }
        ]
      },
      structure: {
        title: "Intermediate Skills",
        description: "Intermediate level construction management skills",
        progress: 50,
        color: "bg-confidence-teal",
        icon: "Layers",
        courses: intermediateCourses.length > 0 ? intermediateCourses : [
          { name: "No intermediate skills available", completed: false, duration: "0h" }
        ]
      },
      leadership: {
        title: "Expert Skills",
        description: "Expert level project leadership and management skills",
        progress: 75,
        color: "bg-decision-blue",
        icon: "Crown",
        courses: expertCourses.length > 0 ? expertCourses : [
          { name: "No expert skills available", completed: false, duration: "0h" }
        ]
      },
      specialization: {
        title: "Advanced Specialization",
        description: "Advanced construction standards and specialized practices",
        progress: 100,
        color: "bg-desert-gold",
        icon: "Award",
        courses: advanceCourses.length > 0 ? advanceCourses : [
          { name: "No advanced skills available", completed: false, duration: "0h" }
        ]
      }
    };
  };

  // Generate dynamic learning paths or use fallback
  const learningPaths = skillData.length > 0 ? generateLearningPaths(skillData) : {
    foundation: {
      title: "Foundation Skills",
      description: "Essential construction project management fundamentals",
      progress: 0,
      color: "bg-construction-blue",
      icon: "Building",
      courses: [{ name: "Loading...", completed: false, duration: "0h" }]
    },
    structure: {
      title: "Intermediate Skills", 
      description: "Loading intermediate skills...",
      progress: 0,
      color: "bg-confidence-teal",
      icon: "Layers",
      courses: [{ name: "Loading...", completed: false, duration: "0h" }]
    },
    leadership: {
      title: "Expert Skills",
      description: "Loading expert skills...",
      progress: 0,
      color: "bg-decision-blue", 
      icon: "Crown",
      courses: [{ name: "Loading...", completed: false, duration: "0h" }]
    },
    specialization: {
      title: "Advanced Specialization",
      description: "Loading advanced skills...",
      progress: 0,
      color: "bg-desert-gold",
      icon: "Award", 
      courses: [{ name: "Loading...", completed: false, duration: "0h" }]
    }
  };

  const currentPath = learningPaths?.[selectedPath];

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (skillData.length === 0) return 0;
    const totalProgress = Object.values(learningPaths).reduce((sum, path) => sum + path.progress, 0);
    return Math.round(totalProgress / Object.keys(learningPaths).length);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
            Learning Progress
          </h3>
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={20} className="text-accent" />
            <span className="text-sm font-medium text-professional-gray">
              Loading...
            </span>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-lg border">
                <div className="w-8 h-8 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 construction-shadow">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
            <p className="text-sm text-yellow-700">
              {error}. Showing available data.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
          Learning Progress
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={20} className="text-accent" />
          {/* <span className="text-sm font-medium text-professional-gray">
            Overall: {calculateOverallProgress()}%
          </span> */}
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
                ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
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
                    ? 'bg-warning' : 'bg-border'
              }`}>
                {course?.completed === false ? (
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
                      ? 'text-professional-gray line-through' : 'text-authority-charcoal'
                  }`}>
                    {course?.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    {/* <span className="text-xs text-professional-gray">
                      {course?.duration}
                    </span> */}
                    {course?.progress && (
                      <span className="text-xs bg-primary/10 text-primary px-1 py-0.5 rounded">
                        {course.progress}%
                      </span>
                    )}
                  </div>
                </div>
                {/* {course?.current && (
                  <div className="text-xs text-warning font-medium mt-1">
                    Currently in progress
                  </div>
                )} */}
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
