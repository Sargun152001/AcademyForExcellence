import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadge = ({ achievement, size = 'default', showDetails = true }) => {
  const getBadgeSize = () => {
    switch (size) {
      case 'small': return 'w-12 h-12';
      case 'large': return 'w-20 h-20';
      default: return 'w-16 h-16';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 32;
      default: return 24;
    }
  };

  const getBadgeColor = (category) => {
    switch (category) {
      case 'certification': return 'bg-gradient-to-br from-accent to-desert-gold';
      case 'skill': return 'bg-gradient-to-br from-primary to-secondary';
      case 'milestone': return 'bg-gradient-to-br from-success to-confidence-teal';
      case 'special': return 'bg-gradient-to-br from-action-orange to-warning';
      default: return 'bg-gradient-to-br from-professional-gray to-muted';
    }
  };

  return (
    <div className={`group cursor-pointer construction-transition ${showDetails ? 'hover:scale-105' : ''}`}>
      {/* Badge Icon */}
      <div className="relative mb-3">
        <div className={`${getBadgeSize()} ${getBadgeColor(achievement?.category)} rounded-full flex items-center justify-center construction-shadow-lg`}>
          <Icon 
            name={achievement?.icon} 
            size={getIconSize()} 
            className="text-white drop-shadow-sm" 
          />
        </div>
        
        {/* Achievement Level Indicator */}
        {achievement?.level && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-authority-charcoal text-white rounded-full flex items-center justify-center text-xs font-bold">
            {achievement?.level}
          </div>
        )}

        {/* New Badge Indicator */}
        {achievement?.isNew && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-action-orange rounded-full animate-pulse"></div>
        )}
      </div>
      {showDetails && (
        <div className="text-center">
          <h4 className="font-semibold text-authority-charcoal text-sm mb-1 group-hover:text-primary construction-transition">
            {achievement?.title}
          </h4>
          <p className="text-xs text-professional-gray mb-2">
            {achievement?.description}
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs">
            <Icon name="Calendar" size={12} className="text-professional-gray" />
            <span className="text-professional-gray">
              {new Date(achievement.earnedDate)?.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      )}
      {/* Tooltip for small badges */}
      {!showDetails && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-authority-charcoal text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 construction-transition pointer-events-none whitespace-nowrap z-50">
          <div className="font-medium">{achievement?.title}</div>
          <div className="text-xs opacity-80">{achievement?.description}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-authority-charcoal"></div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;