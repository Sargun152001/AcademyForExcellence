import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 added
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeHero = ({ userRole, userName, userTitle }) => {
  const navigate = useNavigate(); // 👈 added

  const getRoleSpecificContent = () => {
    switch (userRole) {
      case 'manager':
        return {
          title: `Welcome back, ${userName}`,
          subtitle: "Empower your team's construction expertise",
          description: "Monitor team progress, nominate for specialized training, and drive project excellence across your construction portfolio.",
          primaryAction: "View Team Progress",
          secondaryAction: "Nominate Team Members",
          icon: "Users",
          bgGradient: "from-construction-blue to-decision-blue",
          primaryLink: "/personal-learning-path-progress", // 👈 added
          secondaryLink: "/schedule-management-booking"     // 👈 added
        };
      case 'instructor':
        return {
          title: `Good morning, ${userName}`,
          subtitle: "Shape the future of construction excellence",
          description: "Access your teaching dashboard, review upcoming sessions, and continue building the next generation of construction leaders.",
          primaryAction: "View Teaching Schedule",
          secondaryAction: "Course Materials",
          icon: "GraduationCap",
          bgGradient: "from-confidence-teal to-construction-blue",
          primaryLink: "/schedule-management-booking",       // 👈 added
          secondaryLink: "/course-catalog-discovery"         // 👈 added
        };
      default:
        return {
          title: `Welcome, ${userName}`,
          subtitle: "Your Journey to Competence Building continues",
          description: "Advance your project management skills with specialized training.",
          primaryAction: "Continue Learning",
          secondaryAction: "Explore Courses",
          icon: "Award",
          bgGradient: "from-primary to-secondary",
          primaryLink: "/personal-learning-path-progress",   // 👈 added
          secondaryLink: "/course-catalog-discovery"         // 👈 added
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <div className={`relative bg-gradient-to-r ${content?.bgGradient} rounded-xl p-8 text-white overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg">
                <Icon name={content?.icon} size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-heading font-bold">
                  {content?.title}
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  {userTitle}
                </p>
              </div>
            </div>

            <h2 className="text-xl lg:text-2xl font-semibold mb-3 text-accent">
              {content?.subtitle}
            </h2>
            
            <p className="text-white/90 text-base lg:text-lg leading-relaxed max-w-2xl">
              {content?.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-0 lg:space-y-3">
            <Button 
              variant="secondary"
              className="bg-white text-construction-blue hover:bg-white/90 border-0"
              onClick={() => navigate(content?.primaryLink)} // 👈 redirect
            >
              {content?.primaryAction}
            </Button>
            <Button 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate(content?.secondaryLink)} // 👈 redirect
            >
              {content?.secondaryAction}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">12</div>
            <div className="text-sm text-white/80">Courses Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">85%</div>
            <div className="text-sm text-white/80">Progress Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">3</div>
            <div className="text-sm text-white/80">Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">24h</div>
            <div className="text-sm text-white/80">Learning Time</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default WelcomeHero;
