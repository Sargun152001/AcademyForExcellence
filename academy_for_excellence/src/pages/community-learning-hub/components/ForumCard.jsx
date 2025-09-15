import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ForumCard = ({ forum, onJoinForum }) => {
  const getRegionColor = (region) => {
    const colors = {
      'GCC': 'bg-blue-100 text-blue-800',
      'Levant': 'bg-green-100 text-green-800',
      'North Africa': 'bg-purple-100 text-purple-800',
      'Infrastructure': 'bg-orange-100 text-orange-800',
      'Commercial': 'bg-teal-100 text-teal-800',
      'Residential': 'bg-pink-100 text-pink-800'
    };
    return colors?.[region] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 construction-shadow hover:construction-shadow-lg construction-transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={forum?.icon} size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-authority-charcoal">{forum?.title}</h3>
          </div>
          <p className="text-sm text-professional-gray mb-3">{forum?.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {forum?.tags?.map((tag, index) => (
              <span 
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRegionColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-professional-gray mb-1">
            {forum?.memberCount} members
          </div>
          <div className="text-xs text-professional-gray">
            {forum?.activeToday} active today
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-professional-gray">
          <div className="flex items-center space-x-1">
            <Icon name="MessageSquare" size={14} />
            <span>{forum?.totalPosts} posts</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>Last active {forum?.lastActivity}</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onJoinForum(forum?.id)}
          iconName="Plus"
          iconPosition="left"
        >
          Join Forum
        </Button>
      </div>
    </div>
  );
};

export default ForumCard;