import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProgressOverview from "../../pages/personal-learning-path-progress/components/ProgressOverview";
import SkillProgressCard from '../../pages/personal-learning-path-progress/components/SkillProgressCard';
import AchievementBadge from '../../pages/personal-learning-path-progress/components/AchievementBadge';
import { getSkillProgress, getCertificates } from "../../services/businessCentralApi";

const BACKEND_URL = 'https://academyforexcellence-backend-ywc2.onrender.com';

const ResourceProgressPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [resource, setResource] = useState(location.state || null);
  const [overviewData, setOverviewData] = useState(null);
  const [skillsProgress, setSkillsProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch resource by BC ID
  const fetchResourceById = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/Resources?$filter=no eq '${id}'`, {
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      console.log("Resource by ID:", data);
      if (!data?.value?.length) throw new Error('Resource not found');

      const r = data.value[0];
      return {
        no: r.no,
        name: r.name,
        email: r.eMail,
        role: r.designation,
        imageUrl: r.image ? `data:image/jpeg;base64,${r.image.replace(/\s/g, '')}` : null,
      };
    } catch (err) {
      console.error("Failed to fetch resource by ID:", err);
      return null;
    }
  };

  // Fetch resource by Email to get BC No.
  const fetchResourceByEmail = async (email) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/Resources?$filter=eMail eq '${email}'`, {
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      console.log("Resource by Email:", data);
      if (!data?.value?.length) throw new Error('Resource not found');

      const r = data.value[0];
      return {
        no: r.no,
        name: r.name,
        email: r.eMail,
        role: r.designation,
        imageUrl: r.image ? `data:image/jpeg;base64,${r.image.replace(/\s/g, '')}` : null,
      };
    } catch (err) {
      console.error("Failed to fetch resource by email:", err);
      return null;
    }
  };

  // Fetch progress using BC Resource No.
  const fetchResourceProgress = async (resourceNo) => {
    try {
      setLoading(true);

      // Fetch skills
      const skillsRes = await getSkillProgress(resourceNo);
      console.log("Skill Progress API Response:", skillsRes);

      const mappedSkills = skillsRes
        ?.filter(s => s.skillStatus === "Have")
        ?.map((s, index) => ({
          id: s.systemId || index,
          skill: s.skill,
          progress: parseInt(s.progress, 10) || 0,
          level: s.level,
          nextMilestone: s.skillStatus,
          isActive: s.skillStatus === "Active",
          // Log each skill object for debugging
          raw: s
        }));
      setSkillsProgress(mappedSkills);

      // Fetch certificates
      const certRes = await getCertificates(resourceNo);
      console.log("Certificates API Response:", certRes);

      const mappedCerts = certRes.map((c, i) => ({
        id: c.systemId || i,
        title: c.title,
        description: c.description,
        icon: "Award",
        earnedDate: c.completedAt !== "0001-01-01" ? c.completedAt : null,
        raw: c // log raw certificate data
      }));
      setAchievements(mappedCerts);

      // Calculate overview metrics
      // Use available fields, log warning if missing
      const learningHours = skillsRes.reduce((a, s) => {
        if (s.hours === undefined) console.warn("Missing 'hours' in skill:", s);
        return a + (s.hours || 0);
      }, 0);

      const targetHours = skillsRes.reduce((a, s) => {
        if (s.targetHours === undefined) console.warn("Missing 'targetHours' in skill:", s);
        return a + (s.targetHours || 0);
      }, 0);

      const overview = {
        coursesCompleted: mappedSkills.length,
        totalCourses: skillsRes.length || 0,
        certificationsEarned: certRes.filter(c => c.completedAt && c.completedAt !== "0001-01-01").length,
        targetCertifications: certRes.length || 0,
        learningHours,
        targetHours,
        skillAssessments: mappedSkills.length,
        totalSkills: skillsRes.length || 0,
      };
      console.log("Overview Data:", overview);
      setOverviewData(overview);

    } catch (err) {
      console.error("Failed to load progress:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load resource and progress
  useEffect(() => {
    const loadResource = async () => {
      setLoading(true);
      let res = location.state || null;

      if (!res && id) {
        res = await fetchResourceById();
      }

      if (!res) {
        const stored = localStorage.getItem('userData');
        if (stored) res = JSON.parse(stored);
      }

      if (res) {
        if (!res.no && res.email) {
          const resourceData = await fetchResourceByEmail(res.email);
          if (resourceData) res = { ...res, ...resourceData };
        }

        setResource(res);

        if (res.no) await fetchResourceProgress(res.no);
      }

      setLoading(false);
    };

    loadResource();
  }, [id, location.state]);

  if (loading) return <div className="p-10 text-center">Loading resource progress...</div>;
  if (!resource) return <div className="p-10 text-center text-red-500">Resource not found.</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center space-x-2">
            <Icon name="ArrowLeft" size={16} />
            <span>Back</span>
          </Button>

          <div className="flex items-center space-x-4">
            {resource.imageUrl && (
              <img
                src={resource.imageUrl}
                alt={resource.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-authority-charcoal">{resource.name}</h2>
              <p className="text-sm text-professional-gray">{resource.role}</p>
              <p className="text-xs text-professional-gray">{resource.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-authority-charcoal mb-6">Learning Progress Overview</h2>
            {overviewData ? (
              <ProgressOverview overviewData={overviewData} />
            ) : (
              <div className="text-center text-professional-gray mt-20">No progress data available.</div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-authority-charcoal mb-4">Top Skills Progress</h3>
              <div className="space-y-4">
                {skillsProgress
                  ?.sort((a, b) => b.progress - a.progress)
                  ?.slice(0, 3)
                  ?.map(skill => <SkillProgressCard key={skill.id} {...skill} />)}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-authority-charcoal mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-3 gap-4">
                {achievements?.slice(0, 6)?.map((achievement) => (
                  <div
                    key={achievement?.id}
                    className="flex justify-center transform transition-transform"
                  >
                    <AchievementBadge
                      achievement={achievement}
                      size="small"
                      showDetails={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceProgressPage;
