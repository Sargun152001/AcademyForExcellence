import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const DiscussionThread = ({ thread, onViewThread }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'text-error',
      'Medium': 'text-warning',
      'Low': 'text-success'
    };
    return colors?.[priority] || 'text-professional-gray';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-success text-white',
      'Resolved': 'bg-primary text-white',
      'Pending': 'bg-warning text-white'
    };
    return colors?.[status] || 'bg-muted text-authority-charcoal';
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 construction-shadow hover:construction-shadow-lg construction-transition cursor-pointer"
         onClick={() => onViewThread(thread?.id)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon 
              name="AlertCircle" 
              size={16} 
              className={getPriorityColor(thread?.priority)} 
            />
            <h3 className="text-lg font-semibold text-authority-charcoal hover:text-primary construction-transition">
              {thread?.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(thread?.status)}`}>
              {thread?.status}
            </span>
          </div>
          
          <p className="text-sm text-professional-gray mb-3 line-clamp-2">
            {thread?.preview}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {thread?.tags?.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted text-xs font-medium text-authority-charcoal rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Image
              src={thread?.author?.avatar}
              alt={thread?.author?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-authority-charcoal">{thread?.author?.name}</p>
              <p className="text-xs text-professional-gray">{thread?.author?.title}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-professional-gray">
          <div className="flex items-center space-x-1">
            <Icon name="MessageSquare" size={14} />
            <span>{thread?.replies}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={14} />
            <span>{thread?.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="ThumbsUp" size={14} />
            <span>{thread?.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{thread?.lastActivity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionThread;