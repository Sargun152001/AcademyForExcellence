import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'forum_post': 'MessageSquare',
      'mentor_connection': 'UserPlus',
      'ama_registration': 'Calendar',
      'project_join': 'Building2',
      'achievement': 'Award',
      'discussion_reply': 'MessageCircle'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      'forum_post': 'text-primary',
      'mentor_connection': 'text-success',
      'ama_registration': 'text-warning',
      'project_join': 'text-confidence-teal',
      'achievement': 'text-accent',
      'discussion_reply': 'text-secondary'
    };
    return colors?.[type] || 'text-professional-gray';
  };

  return (
    <div className="bg-white rounded-lg border border-border construction-shadow">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-authority-charcoal">Recent Activity</h3>
        <p className="text-sm text-professional-gray">Stay updated with community happenings</p>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {activities?.map((activity, index) => (
          <div key={index} className="p-4 border-b border-border last:border-b-0 hover:bg-muted construction-transition">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Image
                    src={activity?.user?.avatar}
                    alt={activity?.user?.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-authority-charcoal">
                    {activity?.user?.name}
                  </span>
                  <span className="text-xs text-professional-gray">
                    {activity?.timestamp}
                  </span>
                </div>
                
                <p className="text-sm text-professional-gray mb-2">
                  {activity?.description}
                </p>
                
                {activity?.content && (
                  <div className="bg-muted rounded-lg p-3 text-sm text-authority-charcoal">
                    {activity?.content}
                  </div>
                )}
                
                {activity?.engagement && (
                  <div className="flex items-center space-x-4 mt-2 text-xs text-professional-gray">
                    <div className="flex items-center space-x-1">
                      <Icon name="ThumbsUp" size={12} />
                      <span>{activity?.engagement?.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={12} />
                      <span>{activity?.engagement?.comments}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 construction-transition">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;