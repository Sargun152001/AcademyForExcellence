import React from 'react';
import Icon from '../../../components/AppIcon';

const SkillProgressCard = ({ skill, progress, level, nextMilestone, isActive = false }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-accent';
    if (progress >= 40) return 'bg-warning';
    return 'bg-professional-gray';
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'Foundation': return 'Home';
      case 'Intermediate': return 'Building';
      case 'Advanced': return 'Award';
      case 'Expert': return 'Crown';
      default: return 'Circle';
    }
  };

  return (
    <div className={`p-6 rounded-lg border construction-shadow construction-transition ${
      isActive 
        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' :'border-border bg-card hover:border-primary/30'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <Icon name={getLevelIcon(level)} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-authority-charcoal">{skill}</h3>
            <p className="text-sm text-professional-gray">{level} Level</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-authority-charcoal">{progress}%</span>
          <p className="text-xs text-professional-gray">Complete</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-professional-gray">Progress</span>
          <span className="font-medium text-authority-charcoal">{progress}/100</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className={`h-2 rounded-full construction-transition ${getProgressColor(progress)}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {nextMilestone && (
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Target" size={16} className="text-accent" />
          <span className="text-professional-gray">Next:</span>
          <span className="font-medium text-authority-charcoal">{nextMilestone}</span>
        </div>
      )}
    </div>
  );
};

export default SkillProgressCard;