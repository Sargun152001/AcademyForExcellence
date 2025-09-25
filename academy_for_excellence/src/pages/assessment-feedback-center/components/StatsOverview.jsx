import React from 'react';
import Icon from '../../../components/AppIcon';
// ADD THIS IMPORT
import tileBg from './tileBg2.png';

const StatsOverview = ({ stats, pendingFeedbackCount = 0, completedAssessmentCount = 0 }) => {
  const statCards = [
    {
      title: 'Completed Assessments',
      value: completedAssessmentCount,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+12%',
      changeType: 'positive',
      hasTileBg: true  // ADD THIS FLAG
    },
    {
      title: 'Pending Feedback',
      value: pendingFeedbackCount,
      icon: 'TrendingUp',
      color: 'text-red-500',
      bgColor: 'bg-primary/10',
      change: '+8%',
      changeType: 'positive',
      hasTileBg: true  // ADD THIS FLAG
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-border p-6 construction-shadow hover:construction-shadow-lg construction-transition relative overflow-hidden"
          // ADD BACKGROUND IMAGE STYLE
          style={stat.hasTileBg ? {
            backgroundImage: `url(${tileBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          } : {}}
        >
          {/* ADD OVERLAY FOR BETTER TEXT READABILITY */}
          {/* {stat.hasTileBg && (
            <div className="absolute inset-0 bg-white/80 rounded-lg"></div>
          )} */}

          {/* CONTENT WITH RELATIVE POSITIONING */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">
                {stat?.value}
              </div>
              <div className="text-sm text-white">
                {stat?.title}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
