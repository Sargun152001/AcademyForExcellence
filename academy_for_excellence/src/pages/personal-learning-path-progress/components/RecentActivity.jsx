import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'course-completed': return 'CheckCircle';
      case 'certification-earned': return 'Award';
      case 'assessment-passed': return 'Target';
      case 'skill-updated': return 'TrendingUp';
      case 'badge-earned': return 'Star';
      case 'milestone-reached': return 'Flag';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'course-completed': return 'text-success bg-success/10';
      case 'certification-earned': return 'text-accent bg-accent/10';
      case 'assessment-passed': return 'text-primary bg-primary/10';
      case 'skill-updated': return 'text-confidence-teal bg-confidence-teal/10';
      case 'badge-earned': return 'text-warning bg-warning/10';
      case 'milestone-reached': return 'text-action-orange bg-action-orange/10';
      default: return 'text-professional-gray bg-muted';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    return activityTime?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {activities?.map((activity) => (
        <div
          key={activity?.id}
          className="flex items-start space-x-4 p-4 bg-card rounded-lg border border-border construction-shadow hover:construction-shadow-lg construction-transition"
        >
          {/* Activity Icon */}
          <div className={`flex-shrink-0 p-2 rounded-lg ${getActivityColor(activity?.type)}`}>
            <Icon name={getActivityIcon(activity?.type)} size={20} />
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-authority-charcoal mb-1">
                  {activity?.title}
                </h4>
                <p className="text-sm text-professional-gray mb-2">
                  {activity?.description}
                </p>
                
                {/* Activity Details */}
                {activity?.details && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {activity?.details?.map((detail, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-muted text-professional-gray rounded-full"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                )}

                {/* Activity Metadata */}
                <div className="flex items-center space-x-4 text-xs text-professional-gray">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{formatTimeAgo(activity?.timestamp)}</span>
                  </div>
                  
                  {activity?.points && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Plus" size={12} />
                      <span>{activity?.points} points</span>
                    </div>
                  )}
                  
                  {activity?.category && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Tag" size={12} />
                      <span>{activity?.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Score/Rating */}
              {activity?.score && (
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-authority-charcoal">
                    {activity?.score}%
                  </div>
                  <div className="text-xs text-professional-gray">Score</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {activities?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Activity" size={48} className="text-professional-gray mx-auto mb-4" />
          <h3 className="text-lg font-medium text-authority-charcoal mb-2">
            No Recent Activity
          </h3>
          <p className="text-professional-gray">
            Start learning to see your progress and achievements here.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;