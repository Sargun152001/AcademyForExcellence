import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ userRole }) => {
  const getQuickActions = () => {
    const commonActions = [
      {
        title: "Continue Learning",
        description: "Resume your current course",
        icon: "Play",
        color: "bg-success",
        link: "/personal-learning-path-progress",
        urgent: false
      },
      {
        title: "Upcoming Session",
        description: "Advanced Project Planning - Today 2:00 PM",
        icon: "Clock",
        color: "bg-warning",
        link: "/schedule-management-booking?tab=mybookings",
        urgent: true
      },
      {
        title: "Browse Courses",
        description: "Discover new learning opportunities",
        icon: "BookOpen",
        color: "bg-primary",
        link: "/course-catalog-discovery",
        urgent: false
      }
    ];

    const roleSpecificActions = {
      manager: [
        {
          title: "Team Nominations",
          description: "3 pending approvals",
          icon: "UserPlus",
          color: "bg-confidence-teal",
          link: "/schedule-management-booking",
          urgent: true,
          badge: "3"
        },
        {
          title: "Team Progress",
          description: "View team learning analytics",
          icon: "TrendingUp",
          color: "bg-decision-blue",
          link: "/personal-learning-path-progress",
          urgent: false
        }
      ],
      instructor: [
        {
          title: "Today\'s Classes",
          description: "2 sessions scheduled",
          icon: "Users",
          color: "bg-confidence-teal",
          link: "/schedule-management-booking",
          urgent: true,
          badge: "2"
        },
        {
          title: "Student Assessments",
          description: "5 evaluations pending",
          icon: "ClipboardCheck",
          color: "bg-action-orange",
          link: "/assessment-feedback-center",
          urgent: true,
          badge: "5"
        }
      ],
      employee: [
        {
          title: "Assessment Due",
          description: "Complete Project Risk Management quiz",
          icon: "AlertCircle",
          color: "bg-action-orange",
          link: "/assessment-feedback-center",
          urgent: true
        }
      ]
    };

    return [...commonActions, ...(roleSpecificActions?.[userRole] || roleSpecificActions?.employee)];
  };

  const actions = getQuickActions();

  return (
    <div className="bg-card rounded-xl p-6 construction-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
          Quick Actions
        </h3>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions?.map((action, index) => (
          <Link
            key={index}
            to={action?.link}
            className="group block p-4 bg-background rounded-lg border border-border hover:border-primary construction-transition hover:construction-shadow-lg"
          >
            <div className="flex items-start space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 ${action?.color} rounded-lg flex-shrink-0 relative`}>
                <Icon name={action?.icon} size={20} className="text-white" />
                {action?.badge && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {action?.badge}
                  </span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-authority-charcoal group-hover:text-primary construction-transition">
                    {action?.title}
                  </h4>
                  {action?.urgent && (
                    <div className="w-2 h-2 bg-action-orange rounded-full animate-pulse"></div>
                  )}
                </div>
                <p className="text-sm text-professional-gray mt-1 line-clamp-2">
                  {action?.description}
                </p>
              </div>
              
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-professional-gray group-hover:text-primary construction-transition flex-shrink-0" 
              />
            </div>
          </Link>
        ))}
      </div>
      {/* Emergency Contact */}
      <div className="mt-6 p-4 bg-muted rounded-lg border-l-4 border-action-orange">
        <div className="flex items-center space-x-3">
          <Icon name="Phone" size={20} className="text-action-orange" />
          <div>
            <p className="text-sm font-medium text-authority-charcoal">
              Need immediate support?
            </p>
            <p className="text-xs text-professional-gray">
              Contact Learning Support: +971-4-XXX-XXXX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;