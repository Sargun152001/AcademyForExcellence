import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentCard = ({ assessment, onStartAssessment, onViewResults }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'overdue':
        return 'text-error bg-error/10';
      default:
        return 'text-professional-gray bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'overdue':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 construction-shadow hover:construction-shadow-lg construction-transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-authority-charcoal mb-2">
            {assessment?.courseName}
          </h3>
          <p className="text-sm text-professional-gray mb-3">
            {assessment?.description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-professional-gray">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>Due: {assessment?.dueDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={16} />
              <span>{assessment?.duration} mins</span>
            </div>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assessment?.status)}`}>
          <Icon name={getStatusIcon(assessment?.status)} size={16} />
          <span className="capitalize">{assessment?.status}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-professional-gray">Type: </span>
            <span className="font-medium text-authority-charcoal">{assessment?.type}</span>
          </div>
          {assessment?.score && (
            <div className="text-sm">
              <span className="text-professional-gray">Score: </span>
              <span className="font-medium text-authority-charcoal">{assessment?.score}%</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {assessment?.status === 'completed' ? (
            <Button
              variant="outline"
              onClick={() => onViewResults?.(assessment)}
              iconName="Eye"
              iconPosition="left"
              disabled={!assessment?.score}
            >
              View Results
            </Button>
          ) : assessment?.status === 'overdue' ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="danger"
                onClick={() => onStartAssessment?.(assessment)}
                iconName="AlertCircle"
                iconPosition="left"
                size="sm"
              >
                Start (Overdue)
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={() => onStartAssessment?.(assessment)}
              iconName="Play"
              iconPosition="left"
              disabled={!assessment || assessment?.status === 'completed'}
            >
              Start Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;