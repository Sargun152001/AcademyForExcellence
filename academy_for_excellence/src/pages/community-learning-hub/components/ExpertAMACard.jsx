import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ExpertAMACard = ({ ama, onJoinAMA, onSetReminder }) => {
  const isUpcoming = new Date(ama.scheduledDate) > new Date();
  const isLive = ama?.status === 'live';

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden construction-shadow hover:construction-shadow-lg construction-transition">
      {/* Header with status indicator */}
      <div className={`px-6 py-3 ${isLive ? 'bg-error' : isUpcoming ? 'bg-warning' : 'bg-muted'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-white'}`}></div>
            <span className="text-sm font-medium text-white">
              {isLive ? 'LIVE NOW' : isUpcoming ? 'UPCOMING' : 'COMPLETED'}
            </span>
          </div>
          <span className="text-sm text-white">
            {ama?.duration} minutes
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <Image
              src={ama?.expert?.avatar}
              alt={ama?.expert?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-white flex items-center justify-center">
              <Icon name="Award" size={12} className="text-authority-charcoal" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-authority-charcoal mb-1">
              {ama?.title}
            </h3>
            <p className="text-sm text-primary font-medium mb-1">{ama?.expert?.name}</p>
            <p className="text-sm text-professional-gray mb-2">{ama?.expert?.title}</p>
            <p className="text-sm text-professional-gray">{ama?.expert?.company}</p>
          </div>
        </div>

        <p className="text-sm text-professional-gray mb-4 line-clamp-3">
          {ama?.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {ama?.topics?.map((topic, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-accent bg-opacity-10 text-xs font-medium text-authority-charcoal rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-professional-gray mb-4">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} />
            <span>{ama?.scheduledDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{ama?.scheduledTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>{ama?.registeredCount} registered</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {isLive ? (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onJoinAMA(ama?.id)}
              iconName="Video"
              iconPosition="left"
              className="flex-1 bg-error hover:bg-error/90"
            >
              Join Live
            </Button>
          ) : isUpcoming ? (
            <>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => onJoinAMA(ama?.id)}
                iconName="UserPlus"
                iconPosition="left"
                className="flex-1"
              >
                Register
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSetReminder(ama?.id)}
                iconName="Bell"
              >
                Remind
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              iconName="Play"
              iconPosition="left"
              className="flex-1"
            >
              Watch Recording
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertAMACard;