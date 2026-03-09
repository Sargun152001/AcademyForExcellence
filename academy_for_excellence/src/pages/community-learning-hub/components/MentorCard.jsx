import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MentorCard = ({ mentor, onConnectMentor }) => {
  return (
    <div className="bg-white rounded-lg border border-border p-6 construction-shadow hover:construction-shadow-lg construction-transition">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Image
            src={mentor?.avatar}
            alt={mentor?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white flex items-center justify-center">
            <Icon name="Check" size={12} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-authority-charcoal">{mentor?.name}</h3>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={16} className="text-accent fill-current" />
              <span className="text-sm font-medium text-authority-charcoal">{mentor?.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-primary font-medium mb-2">{mentor?.title}</p>
          <p className="text-sm text-professional-gray mb-3">{mentor?.company}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {mentor?.expertise?.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted text-xs font-medium text-authority-charcoal rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-professional-gray mb-4">
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>{mentor?.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{mentor?.mentees} mentees</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Globe" size={14} />
              <span>{mentor?.languages?.join(', ')}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onConnectMentor(mentor?.id)}
              iconName="UserPlus"
              iconPosition="left"
              className="flex-1"
            >
              Connect
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              iconName="MessageCircle"
              iconPosition="left"
            >
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;