import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CollaborationProject = ({ project, onJoinProject }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-success text-white',
      'Planning': 'bg-warning text-white',
      'Completed': 'bg-primary text-white',
      'On Hold': 'bg-professional-gray text-white'
    };
    return colors?.[status] || 'bg-muted text-authority-charcoal';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 construction-shadow hover:construction-shadow-lg construction-transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Building2" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-authority-charcoal">{project?.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project?.status)}`}>
              {project?.status}
            </span>
          </div>
          
          <p className="text-sm text-professional-gray mb-3 line-clamp-2">
            {project?.description}
          </p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1 text-xs text-professional-gray">
              <Icon name="MapPin" size={14} />
              <span>{project?.location}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-professional-gray">
              <Icon name="DollarSign" size={14} />
              <span>{project?.budget}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-professional-gray">
              <Icon name="Calendar" size={14} />
              <span>{project?.timeline}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-authority-charcoal">Progress</span>
          <span className="text-sm text-professional-gray">{project?.progress}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className={`h-2 rounded-full construction-transition ${getProgressColor(project?.progress)}`}
            style={{ width: `${project?.progress}%` }}
          ></div>
        </div>
      </div>
      {/* Team Members */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-authority-charcoal">Team Members</span>
          <span className="text-xs text-professional-gray">{project?.teamMembers?.length}/{project?.maxMembers}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {project?.teamMembers?.slice(0, 4)?.map((member, index) => (
              <Image
                key={index}
                src={member?.avatar}
                alt={member?.name}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ))}
            {project?.teamMembers?.length > 4 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium text-authority-charcoal">
                  +{project?.teamMembers?.length - 4}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1 ml-2">
            {project?.skillsNeeded?.slice(0, 3)?.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-accent bg-opacity-10 text-xs font-medium text-authority-charcoal rounded-full"
              >
                {skill}
              </span>
            ))}
            {project?.skillsNeeded?.length > 3 && (
              <span className="text-xs text-professional-gray">
                +{project?.skillsNeeded?.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-professional-gray">
          <div className="flex items-center space-x-1">
            <Icon name="MessageSquare" size={14} />
            <span>{project?.discussions} discussions</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="FileText" size={14} />
            <span>{project?.documents} documents</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            iconName="Eye"
          >
            View
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onJoinProject(project?.id)}
            iconName="UserPlus"
            iconPosition="left"
          >
            Join Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationProject;