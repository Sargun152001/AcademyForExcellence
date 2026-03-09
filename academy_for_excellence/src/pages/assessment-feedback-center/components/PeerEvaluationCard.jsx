import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PeerEvaluationCard = ({ evaluation, onSubmitEvaluation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ratings, setRatings] = useState({
    collaboration: 0,
    communication: 0,
    technicalSkills: 0,
    leadership: 0,
    culturalAdaptability: 0
  });
  const [comments, setComments] = useState('');

  const evaluationCriteria = [
    {
      key: 'collaboration',
      label: 'Collaboration & Teamwork',
      description: 'Works effectively with diverse team members'
    },
    {
      key: 'communication',
      label: 'Communication Skills',
      description: 'Communicates clearly across cultural contexts'
    },
    {
      key: 'technicalSkills',
      label: 'Technical Application',
      description: 'Applies learned concepts effectively'
    },
    {
      key: 'leadership',
      label: 'Leadership Potential',
      description: 'Shows leadership qualities and initiative'
    },
    {
      key: 'culturalAdaptability',
      label: 'Cultural Adaptability',
      description: 'Adapts well to regional business practices'
    }
  ];

  const handleRatingChange = (criterion, rating) => {
    setRatings(prev => ({
      ...prev,
      [criterion]: rating
    }));
  };

  const handleSubmit = () => {
    const evaluationData = {
      evaluationId: evaluation?.id,
      ratings,
      comments,
      submittedAt: new Date()?.toISOString()
    };
    onSubmitEvaluation(evaluationData);
    setIsExpanded(false);
  };

  const StarRating = ({ rating, onRatingChange, criterion }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5]?.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(criterion, star)}
            className={`w-6 h-6 construction-transition ${
              star <= rating ? 'text-accent' : 'text-border'
            } hover:text-accent`}
          >
            <Icon name="Star" size={20} className={star <= rating ? 'fill-current' : ''} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-border construction-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Image
              src={evaluation?.colleague?.avatar}
              alt={evaluation?.colleague?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-authority-charcoal">
                {evaluation?.colleague?.name}
              </h3>
              <p className="text-sm text-professional-gray">
                {evaluation?.colleague?.role} • {evaluation?.courseName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {evaluation?.status === 'completed' ? (
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={20} />
                <span className="text-sm font-medium">Completed</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-warning">
                <Icon name="Clock" size={20} />
                <span className="text-sm font-medium">Pending</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-professional-gray mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>Due: {evaluation?.dueDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={16} />
              <span>Project Collaboration</span>
            </div>
          </div>
        </div>

        {evaluation?.status === 'pending' && (
          <div className="flex items-center justify-end">
            <Button
              variant={isExpanded ? "outline" : "default"}
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {isExpanded ? 'Cancel Evaluation' : 'Start Peer Evaluation'}
            </Button>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="border-t border-border p-6 bg-muted/30">
          <h4 className="text-lg font-medium text-authority-charcoal mb-6 flex items-center">
            <Icon name="Users" size={20} className="mr-2 text-confidence-teal" />
            Peer Evaluation Form
          </h4>

          <div className="space-y-6">
            {evaluationCriteria?.map((criterion) => (
              <div key={criterion?.key} className="bg-white rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="font-medium text-authority-charcoal mb-1">
                      {criterion?.label}
                    </h5>
                    <p className="text-sm text-professional-gray">
                      {criterion?.description}
                    </p>
                  </div>
                  <StarRating
                    rating={ratings?.[criterion?.key]}
                    onRatingChange={handleRatingChange}
                    criterion={criterion?.key}
                  />
                </div>
              </div>
            ))}

            <div className="bg-white rounded-lg p-4 border border-border">
              <label className="block text-sm font-medium text-authority-charcoal mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="4"
                placeholder="Share specific observations about your colleague's performance and collaboration during the course..."
                value={comments}
                onChange={(e) => setComments(e?.target?.value)}
              />
              <p className="text-xs text-professional-gray mt-2">
                Your feedback will be shared anonymously to respect cultural hierarchies and encourage honest input.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit}
                iconName="Send"
                iconPosition="left"
                disabled={Object.values(ratings)?.some(rating => rating === 0)}
              >
                Submit Evaluation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerEvaluationCard;