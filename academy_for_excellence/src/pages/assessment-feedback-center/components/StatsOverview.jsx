import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ stats, pendingFeedbackCount = 0 }) => {
  const statCards = [
    {
      title: 'Completed Assessments',
      value: stats?.completedAssessments || 1,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+12%',
      changeType: 'positive'
    },
    // {
    //   title: 'Pending Evaluations',
    //   value: stats?.pendingEvaluations || 0,
    //   icon: 'Clock',
    //   color: 'text-warning',
    //   bgColor: 'bg-warning/10',
    //   change: '-5%',
    //   changeType: 'negative'
    // },
    {
      title: 'Pending Feedback',
      value: pendingFeedbackCount, // Use the prop instead of stats?.averageScore
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border border-border p-6 construction-shadow hover:construction-shadow-lg construction-transition">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
            {/* <div className={`text-sm font-medium ${
              stat?.changeType === 'positive' ? 'text-success' : 'text-error'
            }`}>
              {stat?.change}
            </div> */}
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-authority-charcoal">
              {stat?.value}
            </div>
            <div className="text-sm text-professional-gray">
              {stat?.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;