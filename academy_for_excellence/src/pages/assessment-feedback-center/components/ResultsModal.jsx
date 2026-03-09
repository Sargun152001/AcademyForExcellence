import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResultsModal = ({ assessment, onClose }) => {
  if (!assessment) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-accent';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const skillAreas = [
    { name: 'Technical Knowledge', score: assessment?.scores?.technical || 85, maxScore: 100 },
    { name: 'Safety Protocols', score: assessment?.scores?.safety || 92, maxScore: 100 },
    { name: 'Project Management', score: assessment?.scores?.management || 78, maxScore: 100 },
    { name: 'Cultural Awareness', score: assessment?.scores?.cultural || 88, maxScore: 100 },
    { name: 'Communication', score: assessment?.scores?.communication || 82, maxScore: 100 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto construction-shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-semibold text-authority-charcoal mb-2">
              Assessment Results
            </h2>
            <p className="text-professional-gray">
              {assessment?.courseName} - Completed on {assessment?.completedDate}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        <div className="p-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-8">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(assessment?.score)}`}>
                {assessment?.score}%
              </div>
              <div className="text-xl font-medium text-authority-charcoal mb-2">
                {getPerformanceLevel(assessment?.score)}
              </div>
              <p className="text-professional-gray">
                Overall Assessment Score
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skill Areas */}
            <div>
              <h3 className="text-lg font-semibold text-authority-charcoal mb-4 flex items-center">
                <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
                Skill Area Breakdown
              </h3>
              
              <div className="space-y-4">
                {skillAreas?.map((skill, index) => (
                  <div key={index} className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-authority-charcoal">
                        {skill?.name}
                      </span>
                      <span className={`font-semibold ${getScoreColor(skill?.score)}`}>
                        {skill?.score}%
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full construction-transition ${
                          skill?.score >= 90 ? 'bg-success' :
                          skill?.score >= 80 ? 'bg-accent' :
                          skill?.score >= 70 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ width: `${skill?.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback & Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-authority-charcoal mb-4 flex items-center">
                <Icon name="MessageSquare" size={20} className="mr-2 text-confidence-teal" />
                Instructor Feedback
              </h3>
              
              <div className="space-y-4">
                {/* Strengths */}
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <h4 className="font-medium text-success mb-2 flex items-center">
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    Strengths
                  </h4>
                  <ul className="text-sm text-authority-charcoal space-y-1">
                    <li>• Excellent understanding of safety protocols and regional regulations</li>
                    <li>• Strong cultural awareness and communication skills</li>
                    <li>• Demonstrated practical application of project management concepts</li>
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <h4 className="font-medium text-warning mb-2 flex items-center">
                    <Icon name="AlertTriangle" size={16} className="mr-2" />
                    Areas for Improvement
                  </h4>
                  <ul className="text-sm text-authority-charcoal space-y-1">
                    <li>• Focus on advanced project scheduling techniques</li>
                    <li>• Enhance stakeholder management skills</li>
                    <li>• Practice risk assessment methodologies</li>
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2 flex items-center">
                    <Icon name="Lightbulb" size={16} className="mr-2" />
                    Recommendations
                  </h4>
                  <ul className="text-sm text-authority-charcoal space-y-1">
                    <li>• Consider enrolling in "Advanced Project Scheduling" course</li>
                    <li>• Join the peer mentoring program for stakeholder management</li>
                    <li>• Attend the upcoming workshop on risk management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Certification Status */}
          <div className="mt-8 p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="Award" size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-authority-charcoal">
                    Certification Earned
                  </h3>
                  <p className="text-professional-gray">
                    {assessment?.courseName} - Professional Certificate
                  </p>
                  <p className="text-sm text-professional-gray">
                    Valid until: {assessment?.certificationExpiry}
                  </p>
                </div>
              </div>
              <Button variant="outline" iconName="Download" iconPosition="left">
                Download Certificate
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-border">
            <Button variant="outline" iconName="Share" iconPosition="left">
              Share Results
            </Button>
            <Button variant="outline" iconName="Download" iconPosition="left">
              Download Report
            </Button>
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;