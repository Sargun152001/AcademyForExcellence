import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ForumCard from './components/ForumCard';
import MentorCard from './components/MentorCard';
import DiscussionThread from './components/DiscussionThread';
import ExpertAMACard from './components/ExpertAMACard';
import CollaborationProject from './components/CollaborationProject';
import ActivityFeed from './components/ActivityFeed';

const CommunityLearningHub = () => {
  const [activeTab, setActiveTab] = useState('forums');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock data for forums
  const forums = [
    {
      id: 1,
      title: "GCC Construction Projects",
      description: "Discuss construction challenges and opportunities across Gulf Cooperation Council countries including UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman.",
      icon: "Building2",
      tags: ["GCC", "Infrastructure"],
      memberCount: 1247,
      activeToday: 89,
      totalPosts: 3456,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      title: "Desert Construction Techniques",
      description: "Specialized forum for construction methods adapted to desert environments, extreme temperatures, and sand-related challenges.",
      icon: "Sun",
      tags: ["Infrastructure", "Commercial"],
      memberCount: 892,
      activeToday: 34,
      totalPosts: 2134,
      lastActivity: "45 minutes ago"
    },
    {
      id: 3,
      title: "Levant Market Insights",
      description: "Regional forum covering construction markets in Lebanon, Syria, Jordan, and Palestine with focus on reconstruction and development projects.",
      icon: "TrendingUp",
      tags: ["Levant", "Commercial"],
      memberCount: 567,
      activeToday: 23,
      totalPosts: 1789,
      lastActivity: "1 hour ago"
    },
    {
      id: 4,
      title: "North African Infrastructure",
      description: "Discuss large-scale infrastructure projects across Egypt, Libya, Tunisia, Algeria, and Morocco with emphasis on regional collaboration.",
      icon: "MapPin",
      tags: ["North Africa", "Infrastructure"],
      memberCount: 734,
      activeToday: 41,
      totalPosts: 2567,
      lastActivity: "30 minutes ago"
    }
  ];

  // Mock data for mentors
  const mentors = [
    {
      id: 1,
      name: "Dr. Khalid Al-Mansouri",
      title: "Senior Project Director",
      company: "Emirates Construction Group",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      expertise: ["Mega Projects", "Desert Construction", "Team Leadership"],
      location: "Dubai, UAE",
      mentees: 45,
      languages: ["Arabic", "English"]
    },
    {
      id: 2,
      name: "Sarah Al-Zahra",
      title: "Infrastructure Development Manager",
      company: "Qatar National Construction",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      expertise: ["Smart Cities", "Sustainable Construction", "Project Planning"],
      location: "Doha, Qatar",
      mentees: 32,
      languages: ["Arabic", "English", "French"]
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      title: "Regional Construction Director",
      company: "North African Development Corp",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      expertise: ["Infrastructure", "Cross-Cultural Management", "Risk Assessment"],
      location: "Cairo, Egypt",
      mentees: 28,
      languages: ["Arabic", "English"]
    }
  ];

  // Mock data for discussion threads
  const discussionThreads = [
    {
      id: 1,
      title: "Managing Construction Teams During Ramadan",
      preview: "Looking for best practices on adjusting project schedules and maintaining productivity while respecting cultural and religious observances during the holy month.",
      author: {
        name: "Omar Al-Rashid",
        title: "Project Manager",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      },
      priority: "High",
      status: "Active",
      tags: ["Cultural Management", "Scheduling", "Team Leadership"],
      replies: 23,
      views: 456,
      likes: 18,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      title: "Seismic Considerations for High-Rise Construction",
      preview: "Discussing earthquake-resistant design principles and construction techniques for tall buildings in seismically active regions of the Middle East.",
      author: {
        name: "Dr. Fatima Al-Zahra",
        title: "Structural Engineer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      priority: "Medium",
      status: "Active",
      tags: ["Structural Engineering", "Safety", "High-Rise"],
      replies: 15,
      views: 234,
      likes: 12,
      lastActivity: "4 hours ago"
    },
    {
      id: 3,
      title: "Cost Management in Fluctuating Material Markets",
      preview: "Strategies for managing project budgets when dealing with volatile steel, concrete, and other construction material prices in regional markets.",
      author: {
        name: "Hassan Al-Mahmoud",
        title: "Cost Engineer",
        avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face"
      },
      priority: "High",
      status: "Resolved",
      tags: ["Cost Management", "Procurement", "Market Analysis"],
      replies: 31,
      views: 678,
      likes: 25,
      lastActivity: "1 day ago"
    }
  ];

  // Mock data for expert AMAs
  const expertAMAs = [
    {
      id: 1,
      title: "Future of Smart Cities in the Middle East",
      description: "Join our discussion on how smart city technologies are transforming urban development across the region, with focus on sustainability and cultural integration.",
      expert: {
        name: "Dr. Amira Al-Kindi",
        title: "Smart Cities Consultant",
        company: "Future Urban Solutions",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      scheduledDate: "December 15, 2024",
      scheduledTime: "2:00 PM GST",
      duration: 90,
      status: "upcoming",
      topics: ["Smart Infrastructure", "IoT Integration", "Sustainable Development"],
      registeredCount: 234
    },
    {
      id: 2,
      title: "Mega Project Management Masterclass",
      description: "Learn from 25 years of experience managing billion-dollar construction projects across the GCC, including lessons from iconic developments.",
      expert: {
        name: "Eng. Mohammed Al-Suwaidi",
        title: "Mega Projects Director",
        company: "Regional Development Authority",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
      },
      scheduledDate: "December 18, 2024",
      scheduledTime: "4:00 PM GST",
      duration: 120,
      status: "live",
      topics: ["Project Leadership", "Stakeholder Management", "Risk Mitigation"],
      registeredCount: 456
    }
  ];

  // Mock data for collaboration projects
  const collaborationProjects = [
    {
      id: 1,
      title: "Sustainable Construction Standards Initiative",
      description: "Collaborative effort to develop region-specific sustainability guidelines for construction projects, incorporating local climate and cultural considerations.",
      location: "Regional (Multi-Country)",
      budget: "$2.5M",
      timeline: "18 months",
      status: "Active",
      progress: 65,
      teamMembers: [
        { name: "Ahmad", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
        { name: "Layla", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" },
        { name: "Omar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
        { name: "Fatima", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
      ],
      maxMembers: 12,
      skillsNeeded: ["Sustainability", "Standards Development", "Research", "Documentation"],
      discussions: 45,
      documents: 23
    },
    {
      id: 2,
      title: "Desert Construction Best Practices Guide",
      description: "Creating comprehensive documentation of proven techniques for construction in extreme desert conditions, including material selection and worker safety protocols.",
      location: "GCC Region",
      budget: "$800K",
      timeline: "12 months",
      status: "Planning",
      progress: 25,
      teamMembers: [
        { name: "Khalid", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
        { name: "Noor", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face" }
      ],
      maxMembers: 8,
      skillsNeeded: ["Desert Construction", "Technical Writing", "Safety Management"],
      discussions: 12,
      documents: 8
    }
  ];

  // Mock data for activity feed
  const recentActivities = [
    {
      type: "forum_post",
      user: {
        name: "Sarah Al-Zahra",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      description: "posted a new discussion in GCC Construction Projects",
      content: "Has anyone worked with the new sustainable concrete mixtures approved for use in Qatar? Looking for practical implementation insights.",
      timestamp: "2 hours ago",
      engagement: { likes: 12, comments: 5 }
    },
    {
      type: "mentor_connection",
      user: {
        name: "Ahmed Hassan",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      description: "accepted a new mentee connection",
      timestamp: "4 hours ago"
    },
    {
      type: "ama_registration",
      user: {
        name: "Omar Al-Rashid",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      },
      description: "registered for the Smart Cities AMA session",
      timestamp: "6 hours ago"
    },
    {
      type: "achievement",
      user: {
        name: "Dr. Fatima Al-Zahra",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      description: "earned the \'Knowledge Contributor\' badge",
      timestamp: "1 day ago"
    }
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'gcc', label: 'GCC Countries' },
    { value: 'levant', label: 'Levant Region' },
    { value: 'north-africa', label: 'North Africa' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'residential', label: 'Residential' },
    { value: 'industrial', label: 'Industrial' }
  ];

  const tabs = [
    { id: 'forums', label: 'Discussion Forums', icon: 'MessageSquare' },
    { id: 'mentors', label: 'Find Mentors', icon: 'Users' },
    { id: 'discussions', label: 'Active Discussions', icon: 'MessageCircle' },
    { id: 'amas', label: 'Expert AMAs', icon: 'Video' },
    { id: 'projects', label: 'Collaboration', icon: 'Building2' }
  ];

  const handleJoinForum = (forumId) => {
    console.log('Joining forum:', forumId);
    // Implementation for joining forum
  };

  const handleConnectMentor = (mentorId) => {
    console.log('Connecting with mentor:', mentorId);
    // Implementation for mentor connection
  };

  const handleViewThread = (threadId) => {
    console.log('Viewing thread:', threadId);
    // Implementation for viewing discussion thread
  };

  const handleJoinAMA = (amaId) => {
    console.log('Joining AMA:', amaId);
    // Implementation for AMA registration/joining
  };

  const handleSetReminder = (amaId) => {
    console.log('Setting reminder for AMA:', amaId);
    // Implementation for setting AMA reminder
  };

  const handleJoinProject = (projectId) => {
    console.log('Joining project:', projectId);
    // Implementation for joining collaboration project
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'forums':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {forums?.map((forum) => (
              <ForumCard
                key={forum?.id}
                forum={forum}
                onJoinForum={handleJoinForum}
              />
            ))}
          </div>
        );

      case 'mentors':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mentors?.map((mentor) => (
              <MentorCard
                key={mentor?.id}
                mentor={mentor}
                onConnectMentor={handleConnectMentor}
              />
            ))}
          </div>
        );

      case 'discussions':
        return (
          <div className="space-y-6">
            {discussionThreads?.map((thread) => (
              <DiscussionThread
                key={thread?.id}
                thread={thread}
                onViewThread={handleViewThread}
              />
            ))}
          </div>
        );

      case 'amas':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {expertAMAs?.map((ama) => (
              <ExpertAMACard
                key={ama?.id}
                ama={ama}
                onJoinAMA={handleJoinAMA}
                onSetReminder={handleSetReminder}
              />
            ))}
          </div>
        );

      case 'projects':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {collaborationProjects?.map((project) => (
              <CollaborationProject
                key={project?.id}
                project={project}
                onJoinProject={handleJoinProject}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Community Learning Hub - Academy for Excellence</title>
        <meta name="description" content="Connect with construction professionals across the Middle East. Join forums, find mentors, and collaborate on projects." />
      </Helmet>
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`pt-16 construction-transition ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-primary rounded-lg">
                <Icon name="Users" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-authority-charcoal">
                  Community Learning Hub
                </h1>
                <p className="text-professional-gray">
                  Connect, learn, and collaborate with construction professionals across the Middle East
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-border p-4 construction-shadow">
                <div className="flex items-center space-x-2">
                  <Icon name="MessageSquare" size={20} className="text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-authority-charcoal">24</p>
                    <p className="text-sm text-professional-gray">Active Forums</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border p-4 construction-shadow">
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={20} className="text-success" />
                  <div>
                    <p className="text-2xl font-bold text-authority-charcoal">156</p>
                    <p className="text-sm text-professional-gray">Expert Mentors</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border p-4 construction-shadow">
                <div className="flex items-center space-x-2">
                  <Icon name="Building2" size={20} className="text-confidence-teal" />
                  <div>
                    <p className="text-2xl font-bold text-authority-charcoal">12</p>
                    <p className="text-sm text-professional-gray">Active Projects</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border p-4 construction-shadow">
                <div className="flex items-center space-x-2">
                  <Icon name="Video" size={20} className="text-warning" />
                  <div>
                    <p className="text-2xl font-bold text-authority-charcoal">8</p>
                    <p className="text-sm text-professional-gray">Upcoming AMAs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Search and Filters */}
              <div className="bg-white rounded-lg border border-border p-6 construction-shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="search"
                      placeholder="Search forums, mentors, discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Select
                      options={regionOptions}
                      value={selectedRegion}
                      onChange={setSelectedRegion}
                      placeholder="Select Region"
                      className="min-w-40"
                    />
                    <Select
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="Select Category"
                      className="min-w-40"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white rounded-lg border border-border construction-shadow mb-6">
                <div className="border-b border-border">
                  <nav className="flex space-x-8 px-6">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm construction-transition ${
                          activeTab === tab?.id
                            ? 'border-primary text-primary' :'border-transparent text-professional-gray hover:text-authority-charcoal hover:border-border'
                        }`}
                      >
                        <Icon name={tab?.icon} size={18} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              <div className="space-y-6">
                {/* Activity Feed */}
                <ActivityFeed activities={recentActivities} />

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-border p-6 construction-shadow">
                  <h3 className="text-lg font-semibold text-authority-charcoal mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Start Discussion
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      iconName="UserPlus"
                      iconPosition="left"
                    >
                      Find Mentor
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      iconName="Calendar"
                      iconPosition="left"
                    >
                      Schedule AMA
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      iconName="Building2"
                      iconPosition="left"
                    >
                      Create Project
                    </Button>
                  </div>
                </div>

                {/* Community Guidelines */}
                <div className="bg-white rounded-lg border border-border p-6 construction-shadow">
                  <h3 className="text-lg font-semibold text-authority-charcoal mb-4">Community Guidelines</h3>
                  <div className="space-y-3 text-sm text-professional-gray">
                    <div className="flex items-start space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Maintain professional discourse aligned with regional business etiquette</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Respect cultural sensitivities and diverse backgrounds</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Share knowledge and experiences constructively</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Support fellow professionals in their learning journey</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityLearningHub;