import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { getCertificatesForAll } from 'services/businessCentralApi';

const LiveStatistics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
    const [certificatesData, setCertificatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
 
        // console.log('[DEBUG] Fetching certificates data...');
        const certificates = await getCertificatesForAll();
 
        setCertificatesData(certificates || []);
        // console.log('[DEBUG] Successfully loaded certificates:', certificates);
      } catch (err) {
        // console.error('[DEBUG] Error fetching certificates:', err);
        setError('Failed to load certificates data');
      } finally {
        setLoading(false);
      }
    };
 
    fetchCertificates();
  }, []); // Empty dependency array - fetch once on mount

    const formatCompletionDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };
 
  // Generate recent achievements from certificates data
  const generateRecentAchievements = (certificates) => {
    return certificates
      .filter(cert => cert.status === 'Completed')
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 3) // Show top 3 recent certificates
      .map((cert) => ({
        user: cert.resourceName || `Resource ${cert.resourceNo}`,
        achievement: `Completed ${cert.title}`,
        // time: getRelativeTime(cert.completedAt),
        completedDate: formatCompletionDate(cert.completedAt), // Changed from 'time' to 'completedDate'
        avatar: cert.resourceName ? cert.resourceName.split(' ').map(n => n[0]).join('').toUpperCase() : `R${cert.resourceNo}`,
        type: "certification",
        description: cert.description,
        duration: cert.duration
      }));
  };

  const organizationStats = [
    {
      title: "Active Learners",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: "Users",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Courses Completed",
      value: "3,456",
      change: "+8%",
      trend: "up",
      icon: "BookOpen",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Certifications Earned",
      value: "892",
      change: "+15%",
      trend: "up",
      icon: "Award",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Average Score",
      value: "87.5%",
      change: "+2.3%",
      trend: "up",
      icon: "TrendingUp",
      color: "text-confidence-teal",
      bgColor: "bg-confidence-teal/10"
    }
  ];

  const upcomingDeadlines = [
    {
      title: "Project Risk Assessment",
      type: "Assessment",
      dueDate: "Today, 6:00 PM",
      priority: "high",
      course: "Advanced Risk Management"
    },
    {
      title: "Safety Protocol Quiz",
      type: "Quiz",
      dueDate: "Tomorrow, 2:00 PM",
      priority: "medium",
      course: "Construction Safety Standards"
    },
    {
      title: "Leadership Evaluation",
      type: "Peer Review",
      dueDate: "Dec 8, 10:00 AM",
      priority: "low",
      course: "Team Leadership Mastery"
    }
  ];

  // const recentAchievements = [
  //   {
  //     user: "Ahmed Al-Rashid",
  //     achievement: "Completed PMI-PMP Certification",
  //     time: "2 hours ago",
  //     avatar: "AR",
  //     type: "certification"
  //   },
  //   {
  //     user: "Fatima Hassan",
  //     achievement: "Scored 95% in Structural Analysis",
  //     time: "4 hours ago",
  //     avatar: "FH",
  //     type: "score"
  //   },
  //   {
  //     user: "Mohammed Khalil",
  //     achievement: "Earned Safety Excellence Badge",
  //     time: "6 hours ago",
  //     avatar: "MK",
  //     type: "badge"
  //   }
  // ];
  const recentAchievements = certificatesData.length > 0
    ? generateRecentAchievements(certificatesData)
    : [
      {
        user: "Loading...",
        achievement: "Fetching recent achievements",
        time: "Loading...",
        avatar: "...",
        type: "certification"
      }
    ];


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error bg-error/5';
      case 'medium': return 'border-l-warning bg-warning/5';
      case 'low': return 'border-l-success bg-success/5';
      default: return 'border-l-professional-gray bg-muted';
    }
  };

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'certification': return 'Award';
      case 'score': return 'Target';
      case 'badge': return 'Shield';
      default: return 'Star';
    }
  };

  return (
    <div className="space-y-6">
        {/* Error Display */}
      {error && (
        <div className="bg-card rounded-xl p-4 construction-shadow">
          <div className="flex items-center space-x-2 text-yellow-700">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm">{error}. Showing available data.</span>
          </div>
        </div>
      )}
      {/* Live Clock */}
      <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="text-center">
          <div className="text-3xl font-bold text-authority-charcoal mb-2">
            {currentTime?.toLocaleTimeString('en-US', { 
              hour12: false,
              timeZone: 'Asia/Dubai'
            })}
          </div>
          <div className="text-sm text-professional-gray">
            {currentTime?.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'Asia/Dubai'
            })} • UAE Time
          </div>
        </div>
      </div>
      {/* Organization Statistics */}
      {/* <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
            Live Statistics
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-professional-gray">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {organizationStats?.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg ${stat?.bgColor}`}>
              <div className="flex items-center justify-between mb-2">
                <Icon name={stat?.icon} size={20} className={stat?.color} />
                <div className={`flex items-center text-xs ${stat?.color}`}>
                  <Icon name="TrendingUp" size={12} className="mr-1" />
                  {stat?.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-authority-charcoal">
                {stat?.value}
              </div>
              <div className="text-sm text-professional-gray">
                {stat?.title}
              </div>
            </div>
          ))}
        </div>
      </div> */}


{/* Communication Channels */}
<div className="bg-card rounded-xl p-6 construction-shadow">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
      Communication Channels
    </h3>
  </div>

  <div className="space-y-3">
    <button
      onClick={() => {
        window.open("https://teams.microsoft.com", "_blank");
      }}
      className="flex items-center px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition w-full"
    >
      <Icon name="MessageSquare" size={20} className="mr-2" />
      <span className="font-medium text-base">Open Microsoft Teams</span>
    </button>

    <button
      onClick={() => {
        window.open("https://outlook.office.com/mail/", "_blank");
      }}
      className="flex items-center px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition w-full"
    >
      <Icon name="Mail" size={20} className="mr-2" />
      <span className="font-medium text-base">Open Microsoft Outlook</span>
    </button>
  </div>
</div>



      {/* Upcoming Deadlines */}
      <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
            Upcoming Deadlines
          </h3>
          <Icon name="Clock" size={20} className="text-warning" />
        </div>

        <div className="space-y-3">
          {upcomingDeadlines?.map((deadline, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(deadline?.priority)}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-authority-charcoal">
                    {deadline?.title}
                  </h4>
                  <p className="text-sm text-professional-gray">
                    {deadline?.course} • {deadline?.type}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-authority-charcoal">
                    {deadline?.dueDate}
                  </div>
                  <div className={`text-xs capitalize ${
                    deadline?.priority === 'high' ? 'text-error' :
                    deadline?.priority === 'medium' ? 'text-warning' : 'text-success'
                  }`}>
                    {deadline?.priority} priority
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Achievements */}
      <div className="bg-card rounded-xl p-6 construction-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-authority-charcoal">
            Recent Certifications
          </h3>
          <Icon name="Trophy" size={20} className="text-accent" />
        </div>

                {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-background rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentAchievements?.length > 0 ? (
              recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {achievement?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-authority-charcoal">
                        {achievement?.user}
                      </span>
                      <Icon name={getAchievementIcon(achievement?.type)} size={14} className="text-accent" />
                    </div>
                    <p className="text-sm text-professional-gray">
                      {achievement?.achievement}
                    </p>
                    {/* {achievement?.description && (
                      <p className="text-xs text-professional-gray mt-1">
                        {achievement.description} • {achievement.duration}
                      </p>
                    )} */}
                    <p className="text-xs text-professional-gray">
                      <span className="font-medium text-green-600">Completed:</span> {achievement?.completedDate}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-professional-gray">
                <Icon name="Award" size={32} className="mx-auto mb-2 opacity-50" />
                <p>No recent achievements found</p>
                <p className="text-xs mt-1">Achievements from the last 7 days will appear here</p>
              </div>
            )}
          </div>
        )}
 

        {/* <div className="space-y-4">
          {recentAchievements?.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {achievement?.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-authority-charcoal">
                    {achievement?.user}
                  </span>
                  <Icon name={getAchievementIcon(achievement?.type)} size={14} className="text-accent" />
                </div>
                <p className="text-sm text-professional-gray">
                  {achievement?.achievement}
                </p>
                <p className="text-xs text-professional-gray">
                  {achievement?.time}
                </p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default LiveStatistics;