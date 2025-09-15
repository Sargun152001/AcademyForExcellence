import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CertificationRoadmap = ({ certifications, userProgress }) => {
  const [selectedTrack, setSelectedTrack] = useState('project-management');

  const certificationTracks = {
    'project-management': {
      title: 'Project Management Track',
      description: 'Core PM certifications for construction leadership',
      color: 'primary'
    },
    'regional-expertise': {
      title: 'Regional Expertise Track',
      description: 'Middle Eastern construction specializations',
      color: 'accent'
    },
    'technical-skills': {
      title: 'Technical Skills Track',
      description: 'Advanced technical and digital competencies',
      color: 'confidence-teal'
    }
  };

  const getCertificationStatus = (cert) => {
    const userCert = userProgress?.certifications?.find(uc => uc?.id === cert?.id);
    if (userCert?.completed) return 'completed';
    if (userCert?.inProgress) return 'in-progress';
    if (cert?.prerequisites?.every(prereq => 
      userProgress?.certifications?.some(uc => uc?.id === prereq && uc?.completed)
    )) return 'available';
    return 'locked';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'in-progress': return 'Clock';
      case 'available': return 'Play';
      default: return 'Lock';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10 border-success';
      case 'in-progress': return 'text-primary bg-primary/10 border-primary';
      case 'available': return 'text-accent bg-accent/10 border-accent';
      default: return 'text-professional-gray bg-muted border-border';
    }
  };

  const filteredCertifications = certifications?.filter(cert => cert?.track === selectedTrack);

  return (
    <div className="space-y-6">
      {/* Track Selection */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(certificationTracks)?.map(([key, track]) => (
          <Button
            key={key}
            variant={selectedTrack === key ? 'default' : 'outline'}
            onClick={() => setSelectedTrack(key)}
            className="flex-1 sm:flex-none"
          >
            {track?.title}
          </Button>
        ))}
      </div>
      {/* Track Description */}
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-semibold text-authority-charcoal mb-1">
          {certificationTracks?.[selectedTrack]?.title}
        </h3>
        <p className="text-professional-gray text-sm">
          {certificationTracks?.[selectedTrack]?.description}
        </p>
      </div>
      {/* Certification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertifications?.map((cert) => {
          const status = getCertificationStatus(cert);
          const userCert = userProgress?.certifications?.find(uc => uc?.id === cert?.id);
          
          return (
            <div
              key={cert?.id}
              className={`p-6 rounded-lg border construction-shadow construction-transition ${
                status === 'locked' ?'opacity-60 cursor-not-allowed' :'hover:construction-shadow-lg cursor-pointer'
              } ${getStatusColor(status)}`}
            >
              {/* Certification Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                    <Icon name={getStatusIcon(status)} size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-authority-charcoal">{cert?.title}</h4>
                    <p className="text-sm text-professional-gray">{cert?.provider}</p>
                  </div>
                </div>
                {cert?.isPopular && (
                  <span className="px-2 py-1 text-xs bg-action-orange/10 text-action-orange rounded-full">
                    Popular
                  </span>
                )}
              </div>
              {/* Progress Bar (for in-progress certifications) */}
              {status === 'in-progress' && userCert?.progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-professional-gray">Progress</span>
                    <span className="font-medium text-authority-charcoal">{userCert?.progress}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full construction-transition"
                      style={{ width: `${userCert?.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {/* Certification Details */}
              <div className="space-y-3">
                <p className="text-sm text-professional-gray">{cert?.description}</p>
                
                {/* Duration & Difficulty */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} className="text-professional-gray" />
                    <span className="text-professional-gray">{cert?.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={12}
                        className={i < cert?.difficulty ? 'text-accent' : 'text-border'}
                      />
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                {cert?.prerequisites && cert?.prerequisites?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-authority-charcoal mb-2">Prerequisites:</h5>
                    <div className="space-y-1">
                      {cert?.prerequisites?.map((prereqId) => {
                        const prereq = certifications?.find(c => c?.id === prereqId);
                        const prereqCompleted = userProgress?.certifications?.some(
                          uc => uc?.id === prereqId && uc?.completed
                        );
                        
                        return (
                          <div key={prereqId} className="flex items-center space-x-2 text-xs">
                            <Icon 
                              name={prereqCompleted ? 'CheckCircle' : 'Circle'} 
                              size={12}
                              className={prereqCompleted ? 'text-success' : 'text-professional-gray'}
                            />
                            <span className={prereqCompleted ? 'text-success' : 'text-professional-gray'}>
                              {prereq?.title || 'Unknown Prerequisite'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {status === 'completed' && (
                    <div className="flex items-center space-x-2 text-success">
                      <Icon name="Award" size={16} />
                      <span className="text-sm font-medium">Certified</span>
                      {userCert?.earnedDate && (
                        <span className="text-xs text-professional-gray">
                          {new Date(userCert.earnedDate)?.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {status === 'in-progress' && (
                    <Button variant="outline" size="sm" className="w-full">
                      Continue Learning
                    </Button>
                  )}
                  
                  {status === 'available' && (
                    <Button variant="default" size="sm" className="w-full">
                      Start Certification
                    </Button>
                  )}
                  
                  {status === 'locked' && (
                    <Button variant="ghost" size="sm" className="w-full" disabled>
                      Prerequisites Required
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CertificationRoadmap;