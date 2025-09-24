import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import JobTargetsTree from "./components/RecentActivity"; 
import ProgressOverview from './components/ProgressOverview';
import SkillProgressCard from './components/SkillProgressCard';
import LearningPathTimeline from './components/LearningPathTimeline';
import AchievementBadge from './components/AchievementBadge';
import CertificationRoadmap from './components/CertificationRoadmap';
import RecentActivity from './components/RecentActivity';
import SubmittedDocuments from './components/SubmittedDocuments';
import { getSkillProgress, getCertificates } from "../../services/businessCentralApi";

const PersonalLearningPathProgress = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loading, setLoading] = useState(true); // start with true
  const [skillsProgress, setSkillsProgress] = useState([]);
  const [certifications, setCertifications] = useState([]); 
  const [error, setError] = useState(null);
  const [learningPathData, setLearningPathData] = useState([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
const [currentStageTitle, setCurrentStageTitle] = useState('');

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const userProfile = JSON.parse(localStorage.getItem('userData') || '{}');
  const resourceId = userProfile?.id;

  // Map skills to learning phases
const mapSkillsToPhases = (skills) => {
  const phaseMap = {
    Foundation: "Foundation Phase",
    Intermediate: "Intermediate Development",
    Advance: "Advanced Specialization",
    Expert: "Expert Mastery"
  };

  const grouped = {
    "Foundation Phase": [],
    "Intermediate Development": [],
    "Advanced Specialization": [],
    "Expert Mastery": []
  };

  skills.forEach((skill) => {
    const phase = phaseMap[skill.level];
    if (phase) {
      grouped[phase].push({
        id: skill.id,
        name: skill.skill,
        skillStatus: skill.skillStatus,
        completed: skill.skillStatus === "Have",
        progress: 100 // visually force 100%
      });
    }
  });

  const phases = Object.keys(grouped).map((phaseTitle, idx) => ({
    id: idx + 1,
    title: phaseTitle,
    description: "",
    duration: "",
    modules: grouped[phaseTitle],
    skills: grouped[phaseTitle].map((s) => s.name)
  }));

  // 🔥 Fixed: Use skillStatus to determine current stage
  let currentIndex = phases.findIndex(phase =>
    phase.modules.some(module => module.skillStatus === "Needed")
  );

  if (currentIndex === -1) {
    currentIndex = phases.length; // means all completed
  }

  return {
    phases,
    currentIndex,
    currentTitle: phases[currentIndex]?.title || "Completed"
  };
};


  // Load skill progress
useEffect(() => {
  const loadSkills = async () => {
    try {
      setLoading(true);
      const skills = await getSkillProgress(resourceId);
      const { phases, currentIndex, currentTitle } = mapSkillsToPhases(skills);
      setLearningPathData(phases);
      setCurrentStageIndex(currentIndex);
      setCurrentStageTitle(currentTitle);
    } catch (err) {
      console.error("Failed to load skills:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (resourceId) {
    loadSkills();
  }
}, [resourceId]);


  // Mock data for user progress


// **Add this line**

  const overviewData = {
    coursesCompleted: 18,
    totalCourses: 25,
    certificationsEarned: 4,
    targetCertifications: 8,
    learningHours: 156,
    targetHours: 200,
    skillAssessments: 12,
    totalSkills: 15
  };

  // const skillsProgress = [
  //   {
  //     id: 1,
  //     skill: "Project Planning & Scheduling",
  //     progress: 92,
  //     level: "Expert",
  //     nextMilestone: "Advanced Risk Management",
  //     isActive: true
  //   },
  //   {
  //     id: 2,
  //     skill: "Middle Eastern Construction Standards",
  //     progress: 78,
  //     level: "Advanced",
  //     nextMilestone: "Regional Compliance Certification"
  //   },
  //   {
  //     id: 3,
  //     skill: "Team Leadership & Communication",
  //     progress: 85,
  //     level: "Advanced",
  //     nextMilestone: "Cross-Cultural Management"
  //   },
  //   {
  //     id: 4,
  //     skill: "Digital Project Management Tools",
  //     progress: 65,
  //     level: "Intermediate",
  //     nextMilestone: "BIM Integration Mastery"
  //   },
  //   {
  //     id: 5,
  //     skill: "Quality Control & Assurance",
  //     progress: 71,
  //     level: "Intermediate",
  //     nextMilestone: "ISO Certification Prep"
  //   },
  //   {
  //     id: 6,
  //     skill: "Sustainable Construction Practices",
  //     progress: 43,
  //     level: "Foundation",
  //     nextMilestone: "Green Building Fundamentals"
  //   }
  // ];

   useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
       console.log("Fetching skills for resourceId:", resourceId);
      const res = await getSkillProgress(resourceId);
      console.log("✅ API Response:", res);

      const mapped = res.filter(item => item.skillStatus === "Have")
      .map((item, index) => ({
        id: item.systemId || index, // unique key
        skill: item.skill,
        progress: parseInt(item.progress, 10) || 0,
        level: item.level,
        nextMilestone: item.skillStatus,
        isActive: item.skillStatus === "Active",
      }));
  console.log("✅ Mapped skills:", mapped);
      setSkillsProgress(mapped);
    } catch (err) {
      console.error("❌ Failed to fetch skills progress:", err);
      setError("Failed to load skill progress");
    } finally {
      setLoading(false);
    }
  };

  if (resourceId) fetchData();
}, [resourceId]);


useEffect(() => {
  const fetchCerts = async () => {
    try {
      setLoading(true);
      console.log("Fetching certificates for resourceId:", resourceId);
      const res = await getCertificates(resourceId);

      const mapped = res.map((item, index) => ({
        id: item.systemId || index,
        title: item.title,
        description: item.description,
        duration: item.duration,
        provider: item.provider || "",    
        track: "project-management",        
        difficulty: null,                
        completed: item.status === "Completed",
        inProgress: item.status?.includes("In_x0020_Progress"),
        earnedDate: item.completedAt !== "0001-01-01" ? item.completedAt : null,
      }));

      console.log("✅ Mapped certificates:", mapped);
      setCertifications(mapped);
    } catch (err) {
      console.error("❌ Failed to fetch certificates:", err);
      setError("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  if (resourceId) fetchCerts();
}, [resourceId]);


  // const learningPathData = [
  //   {
  //     id: 1,
  //     title: "Foundation Phase",
  //     description: "Essential project management principles and construction basics",
  //     duration: "3 months",
  //     modules: [
  //       { id: 1, name: "PM Fundamentals", completed: true, progress: 100 },
  //       { id: 2, name: "Construction Basics", completed: true, progress: 100 },
  //       { id: 3, name: "Safety Protocols", completed: true, progress: 100 },
  //       { id: 4, name: "Regional Overview", completed: true, progress: 100 }
  //     ],
  //     skills: ["Project Planning", "Safety Management", "Basic Scheduling"]
  //   },
  //   {
  //     id: 2,
  //     title: "Intermediate Development",
  //     description: "Advanced project management techniques and regional specializations",
  //     duration: "4 months",
  //     modules: [
  //       { id: 5, name: "Advanced Planning", completed: true, progress: 100 },
  //       { id: 6, name: "Risk Management", completed: true, progress: 100 },
  //       { id: 7, name: "Cultural Competency", completed: false, progress: 75 },
  //       { id: 8, name: "Digital Tools Mastery", completed: false, progress: 60 }
  //     ],
  //     skills: ["Risk Assessment", "Cultural Intelligence", "Digital Proficiency"]
  //   },
  //   {
  //     id: 3,
  //     title: "Advanced Specialization",
  //     description: "Leadership skills and complex project management scenarios",
  //     duration: "5 months",
  //     modules: [
  //       { id: 9, name: "Leadership Excellence", completed: false, progress: 30 },
  //       { id: 10, name: "Mega-Project Management", completed: false, progress: 0 },
  //       { id: 11, name: "Stakeholder Relations", completed: false, progress: 0 },
  //       { id: 12, name: "Innovation Integration", completed: false, progress: 0 }
  //     ],
  //     skills: ["Executive Leadership", "Strategic Planning", "Innovation Management"]
  //   },
  //   {
  //     id: 4,
  //     title: "Expert Mastery",
  //     description: "Industry leadership and specialized regional expertise",
  //     duration: "6 months",
  //     modules: [
  //       { id: 13, name: "Industry Leadership", completed: false, progress: 0 },
  //       { id: 14, name: "Sustainable Practices", completed: false, progress: 0 },
  //       { id: 15, name: "Mentorship Skills", completed: false, progress: 0 },
  //       { id: 16, name: "Strategic Consulting", completed: false, progress: 0 }
  //     ],
  //     skills: ["Thought Leadership", "Sustainability", "Mentoring", "Consulting"]
  //   }
  // ];

  const achievements = [
    {
      id: 1,
      title: "Desert Construction Expert",
      description: "Mastered extreme weather project management",
      icon: "Sun",
      category: "special",
      level: 3,
      earnedDate: "2024-08-15",
      isNew: true
    },
    {
      id: 2,
      title: "Ramadan Project Coordinator",
      description: "Successfully managed projects during Ramadan",
      icon: "Moon",
      category: "special",
      earnedDate: "2024-07-20"
    },
    {
      id: 3,
      title: "PMI Certification",
      description: "Project Management Professional certified",
      icon: "Award",
      category: "certification",
      level: 1,
      earnedDate: "2024-06-10"
    },
    {
      id: 4,
      title: "Team Builder",
      description: "Excellent leadership and team development",
      icon: "Users",
      category: "skill",
      earnedDate: "2024-05-25"
    },
    {
      id: 5,
      title: "Safety Champion",
      description: "Zero incidents across multiple projects",
      icon: "Shield",
      category: "milestone",
      earnedDate: "2024-04-18"
    },
    {
      id: 6,
      title: "Digital Pioneer",
      description: "Early adopter of construction technology",
      icon: "Smartphone",
      category: "skill",
      earnedDate: "2024-03-12"
    }
  ];

  // const certifications = [
  //   {
  //     id: 'pmp',
  //     title: 'Project Management Professional (PMP)',
  //     provider: 'PMI',
  //     track: 'project-management',
  //     description: 'Globally recognized project management certification',
  //     duration: '6 months',
  //     difficulty: 4,
  //     isPopular: true,
  //     prerequisites: []
  //   },
  //   {
  //     id: 'capm',
  //     title: 'Certified Associate in Project Management',
  //     provider: 'PMI',
  //     track: 'project-management',
  //     description: 'Entry-level project management certification',
  //     duration: '3 months',
  //     difficulty: 2,
  //     prerequisites: []
  //   },
  //   {
  //     id: 'regional-compliance',
  //     title: 'Middle Eastern Construction Compliance',
  //     provider: 'Regional Construction Council',
  //     track: 'regional-expertise',
  //     description: 'Specialized certification for regional construction standards',
  //     duration: '4 months',
  //     difficulty: 3,
  //     prerequisites: ['capm']
  //   },
  //   {
  //     id: 'cultural-management',
  //     title: 'Cross-Cultural Project Management',
  //     provider: 'Academy for Excellence',
  //     track: 'regional-expertise',
  //     description: 'Managing diverse teams in Middle Eastern contexts',
  //     duration: '2 months',
  //     difficulty: 3,
  //     prerequisites: []
  //   },
  //   {
  //     id: 'bim-integration',
  //     title: 'BIM Integration Specialist',
  //     provider: 'Digital Construction Institute',
  //     track: 'technical-skills',
  //     description: 'Advanced Building Information Modeling techniques',
  //     duration: '5 months',
  //     difficulty: 4,
  //     prerequisites: []
  //   },
  //   {
  //     id: 'sustainable-construction',
  //     title: 'Sustainable Construction Practices',
  //     provider: 'Green Building Council',
  //     track: 'technical-skills',
  //     description: 'Environmental and sustainable construction methods',
  //     duration: '3 months',
  //     difficulty: 3,
  //     prerequisites: []
  //   }
  // ];

  const userProgress = {
    certifications: [
      { id: 'pmp', completed: true, earnedDate: '2024-06-10' },
      { id: 'capm', completed: true, earnedDate: '2024-02-15' },
      { id: 'regional-compliance', inProgress: true, progress: 65 },
      { id: 'cultural-management', completed: true, earnedDate: '2024-05-20' }
    ]
  };

  const recentActivities = [
    {
      id: 1,
      type: 'badge-earned',
      title: 'Desert Construction Expert Badge Earned',
      description: 'Completed advanced module on extreme weather project management',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      points: 150,
      category: 'Achievement',
      details: ['Level 3 Badge', 'Special Recognition']
    },
    {
      id: 2,
      type: 'assessment-passed',
      title: 'Cultural Competency Assessment Passed',
      description: 'Successfully completed cross-cultural management evaluation',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      score: 87,
      category: 'Assessment'
    },
    {
      id: 3,
      type: 'course-completed',
      title: 'Risk Management Fundamentals Completed',
      description: 'Finished comprehensive risk assessment and mitigation course',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      points: 100,
      category: 'Course',
      details: ['8 hours', 'Certificate earned']
    },
    {
      id: 4,
      type: 'milestone-reached',
      title: '150 Learning Hours Milestone',
      description: 'Reached significant learning milestone in professional development',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      points: 200,
      category: 'Milestone'
    },
    {
      id: 5,
      type: 'skill-updated',
      title: 'Digital Tools Proficiency Updated',
      description: 'Skill level increased from Beginner to Intermediate',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      category: 'Skill Development'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'learning-path', label: 'Learning Path', icon: 'Route' },
    { id: 'skills', label: 'Skills Progress', icon: 'TrendingUp' },
    { id: 'achievements', label: 'Achievements', icon: 'Award' },
    { id: 'certifications', label: 'Certifications', icon: 'Certificate' },
    { id: 'activity', label: 'KPIs', icon: 'Activity' },
   { id: 'submitted-documents', label: 'Submitted Documents', icon: 'Document' }

  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                <div className="relative">
                  <img
                    src={userProfile?.imageUrl}
                    alt={userProfile?.name}
                    className="w-24 h-24 rounded-full border-4 border-primary-foreground/20"
                  />
                  {/* <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground rounded-full px-2 py-1 text-xs font-bold">
                    #{userProfile?.rank}
                  </div> */}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{userProfile?.name}</h1>
                  <p className="text-primary-foreground/80 mb-1">{userProfile?.role}</p>
                  <p className="text-primary-foreground/60 text-sm">{userProfile?.department}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      {/* <Icon name="Calendar" size={16} /> */}
                      <span className="text-sm">
                        {/* Joined {new Date(userProfile.joinDate)?.toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric' */}
                        {/* })} */}
                      </span>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <Icon name="Star" size={16} />
                      <span className="text-sm">{userProfile?.totalPoints} points</span>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-right">
                <div className="bg-primary-foreground/10 rounded-lg p-6 backdrop-blur-sm">
                  {/* <h3 className="text-lg font-semibold mb-2">{userProfile?.currentLevel}</h3> */}
                  <div className="space-y-2">
                    {/* <div className="flex justify-between text-sm">
                      <span>Progress to Expert</span>
                      <span>{userProfile?.totalPoints}/{userProfile?.nextLevelPoints}</span>
                    </div> */}
                    <div className="w-48 bg-primary-foreground/20 rounded-full h-2">
                      {/* <div 
                        className="bg-accent h-2 rounded-full construction-transition"
                        style={{ width: `${(userProfile?.totalPoints / userProfile?.nextLevelPoints) * 100}%` }}
                      ></div> */}
                    </div>
                    {/* <p className="text-xs text-primary-foreground/70">
                      {userProfile?.nextLevelPoints - userProfile?.totalPoints} points to next level
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-card border-b border-border sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto py-4">
              {tabs?.map((tab) => (
                <Button
                  key={tab?.id}
                  variant={activeTab === tab?.id ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab?.id)}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-authority-charcoal mb-6">Learning Progress Overview</h2>
                  <ProgressOverview overviewData={overviewData} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-authority-charcoal mb-4">Top Skills Progress</h3>
                    <div className="space-y-4">
                     {skillsProgress
  ?.sort((a, b) => b.progress - a.progress)   
  ?.slice(0, 3)                               
  ?.map((skill) => (
    <SkillProgressCard key={skill?.id} {...skill} />
  ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-authority-charcoal mb-4">Recent Achievements</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {achievements?.slice(0, 6)?.map((achievement) => (
                        <AchievementBadge key={achievement?.id} achievement={achievement} size="small" showDetails={true} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'learning-path' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                 <div className="text-sm text-professional-gray">
    Current Stage:{" "}
    <span className="font-medium text-authority-charcoal">
      {currentStageTitle || "N/A"}
    </span>
  </div>
                </div>
                <LearningPathTimeline
  pathData={learningPathData}
  currentStage={currentStageIndex}
/>
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-authority-charcoal">Skills Development</h2>
                  <Button variant="outline" iconName="Plus">
                    Add New Skill
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skillsProgress?.map((skill) => (
                    <SkillProgressCard key={skill?.id} {...skill} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-authority-charcoal">Achievements & Badges</h2>
                  <div className="text-sm text-professional-gray">
                    {achievements?.length} badges earned
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {achievements?.map((achievement) => (
                    <AchievementBadge key={achievement?.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'certifications' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-authority-charcoal">Certification Roadmap</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-professional-gray">
                      {certifications?.filter(c => c?.completed)?.length || 0} of {certifications?.length} completed
                    </div>
                    {/* <Button variant="outline" iconName="ExternalLink">
                      View All Certifications
                    </Button> */}
                  </div>
                </div>
                <CertificationRoadmap certifications={certifications} userProgress={userProgress} />
              </div>
            )}

       {activeTab === 'activity' && (
  <div>
    <div className="flex items-center justify-between mb-6">
    </div>

  {userProfile?.id ? (
      <JobTargetsTree resourceCode={userProfile.id} />
    ) : (
      <div>Loading resource info...</div>
    )}
  </div>
)}
{activeTab === 'submitted-documents' && (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-authority-charcoal">Submitted Documents</h2>
    </div>
    <SubmittedDocuments />
  </div>
)}
          </div>
        </section>

        {/* Quick Actions Footer */}
        <section className="bg-muted py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-authority-charcoal mb-2">Continue Your Learning Journey</h3>
              <p className="text-professional-gray">Explore more courses and advance your career</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/course-catalog-discovery">
                <Button variant="default" iconName="BookOpen">
                  Browse Courses
                </Button>
              </Link>
              <Link to="/schedule-management-booking">
                <Button variant="outline" iconName="Calendar">
                  Schedule Learning
                </Button>
              </Link>
              <Link to="/assessment-feedback-center">
                <Button variant="outline" iconName="Target">
                  Take Assessment
                </Button>
              </Link>
              <Link to="/community-learning-hub">
                <Button variant="outline" iconName="Users">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PersonalLearningPathProgress;