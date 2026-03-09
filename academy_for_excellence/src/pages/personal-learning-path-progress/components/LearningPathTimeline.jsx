import React from 'react';
import Icon from '../../../components/AppIcon';

const LearningPathTimeline = ({ pathData, currentStage }) => {
  const getStageStatus = (stageIndex) => {
    if (stageIndex < currentStage) return 'completed';
    if (stageIndex === currentStage) return 'current';
    return 'upcoming';
  };

  const getStageIcon = (stage, status) => {
    if (status === 'completed') return 'CheckCircle';
    if (status === 'current') return 'Play';
    return 'Circle';
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10 border-success';
      case 'current': return 'text-primary bg-primary/10 border-primary';
      default: return 'text-professional-gray bg-muted border-border';
    }
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border"></div>

      <div className="space-y-8">
        {pathData?.map((stage, index) => {
          const status = getStageStatus(index);

          return (
            <div key={stage?.id} className="relative flex items-start space-x-4">
              {/* Timeline Node */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 construction-transition ${getStageColor(status)}`}>
                <Icon name={getStageIcon(stage, status)} size={20} />
              </div>

              {/* Stage Content */}
              <div className="flex-1 min-w-0 pb-8">
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-authority-charcoal">
                    {stage?.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {status === 'completed' && (
                      <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                        Completed
                      </span>
                    )}
                    {status === 'current' && (
                      <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        In Progress
                      </span>
                    )}
                    <span className="text-sm text-professional-gray">
                      {stage?.duration}
                    </span>
                  </div>
                </div>

                <p className="text-professional-gray mb-4">{stage?.description}</p>

                {/* Stage Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  {stage?.modules?.map((module) => {
    // Determine color based on skillStatus
    const barColor = module.skillStatus === 'Have' ? 'bg-success' : 'bg-primary';
    const iconColor = module.skillStatus === 'Have' ? 'text-success' : 'text-primary';

    return (
      <div
  key={module.id}
  className={`p-3 rounded-lg border construction-transition ${
    status === 'current' ? 'bg-primary/5 border-primary/20' : 'bg-muted border-border'
  }`}
>
  <div className="flex items-center space-x-2">
    <Icon
      name={module.skillStatus === 'Have' ? 'CheckCircle' : 'PlayCircle'}
      size={16}
      className={module.skillStatus === 'Have' ? 'text-success' : 'text-primary'}
    />
    <span className="text-sm font-medium text-authority-charcoal">
      {module.name}
    </span>
  </div>

  {/* Force progress bar to show 100% */}
  <div className="mt-2">
    <div className="w-full bg-border rounded-full h-1">
      <div
        className={`h-1 rounded-full construction-transition ${
          module.skillStatus === 'Have' ? 'bg-success' : 'bg-primary'
        }`}
        style={{ width: '100%' }}
      ></div>
    </div>
  </div>
</div>
    );
  })}
</div>

                {/* Stage Skills */}
                {/* {stage?.skills && stage?.skills.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-authority-charcoal mb-2">Skills Developed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {stage?.modules?.map((module) => {
                        const skillColor = module.skillStatus === 'Have' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary';
                        return (
                          <span 
                            key={module.id}
                            className={`px-2 py-1 text-xs rounded-full ${skillColor}`}
                          >
                            {module.name}
                          </span>
                        );
                      })}
                    </div> */}
                  {/* </div> */}
                {/* )} */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPathTimeline;
