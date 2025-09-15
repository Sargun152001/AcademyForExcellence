import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ overviewData }) => {
  const progressMetrics = [
    {
      id: 'courses-completed',
      title: 'Courses Completed',
      value: overviewData?.coursesCompleted,
      total: overviewData?.totalCourses,
      icon: 'BookOpen',
      color: 'success',
      trend: '+3 this month'
    },
    {
      id: 'certifications-earned',
      title: 'Certifications Earned',
      value: overviewData?.certificationsEarned,
      total: overviewData?.targetCertifications,
      icon: 'Award',
      color: 'accent',
      trend: '+1 this quarter'
    },
    {
      id: 'learning-hours',
      title: 'Learning Hours',
      value: overviewData?.learningHours,
      total: overviewData?.targetHours,
      icon: 'Clock',
      color: 'primary',
      trend: '+12 this week'
    },
    {
      id: 'skill-assessments',
      title: 'Skill Assessments',
      value: overviewData?.skillAssessments,
      total: overviewData?.totalSkills,
      icon: 'Target',
      color: 'confidence-teal',
      trend: '+2 completed'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      success: 'text-success bg-success/10 border-success/20',
      accent: 'text-accent bg-accent/10 border-accent/20',
      primary: 'text-primary bg-primary/10 border-primary/20',
      'confidence-teal': 'text-confidence-teal bg-confidence-teal/10 border-confidence-teal/20'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const calculatePercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {progressMetrics?.map((metric) => {
        const percentage = calculatePercentage(metric?.value, metric?.total);
        
        return (
          <div
            key={metric?.id}
            className="p-6 bg-card rounded-lg border border-border construction-shadow hover:construction-shadow-lg construction-transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg border ${getColorClasses(metric?.color)}`}>
                <Icon name={metric?.icon} size={20} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-authority-charcoal">
                  {metric?.value}
                  <span className="text-lg text-professional-gray">/{metric?.total}</span>
                </div>
              </div>
            </div>
            {/* Title and Progress */}
            <div className="space-y-3">
              <h3 className="font-medium text-authority-charcoal">{metric?.title}</h3>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-professional-gray">Progress</span>
                  <span className="font-medium text-authority-charcoal">{percentage}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full construction-transition ${
                      metric?.color === 'success' ? 'bg-success' :
                      metric?.color === 'accent' ? 'bg-accent' :
                      metric?.color === 'primary'? 'bg-primary' : 'bg-confidence-teal'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Trend */}
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={14} className="text-success" />
                <span className="text-sm text-professional-gray">{metric?.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressOverview;