import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../../components/ui/Header";
import Sidebar from "../../../components/ui/Sidebar";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import { getCourses } from "../../../services/businessCentralApi";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courses = await getCourses();
        const found = courses.find((c) => String(c.id) === String(courseId));
        setCourse(found || null);
      } catch (err) {
        console.error("❌ Failed to load course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleEnrollClick = () => {
    navigate(`/course-catalog-discovery/enrollment/${courseId}`, { state: { course } });
  };

  const handleBackToSearch = () => {
    navigate("/course-catalog-discovery");
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case "Foundation": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading course...</div>;
  if (!course) return <div className="flex justify-center items-center h-screen">Course not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{course?.name || course?.title} - Course Details | Academy for Excellence</title>
        <meta name="description" content={course?.description?.substring(0, 160)} />
      </Helmet>

      <Header />
      <div className="flex pt-16">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />

        <main className={`flex-1 ${isSidebarCollapsed ? "ml-16" : "ml-64"} construction-transition`}>
          {/* Back Navigation */}
          <div className="bg-white border-b border-border p-4">
            <div className="max-w-7xl mx-auto">
              <Button
                variant="ghost"
                onClick={handleBackToSearch}
                iconName="ArrowLeft"
                iconPosition="left"
                className="mb-4"
              >
                Back to Course Catalog
              </Button>
            </div>
          </div>

          {/* Course Header */}
          <div className="bg-white">
            <div className="max-w-7xl mx-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Course Image */}
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={course.imageUrl || course.image}
                      alt={course.name || course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded">
                      {course.category}
                    </span>
                    {course.duration && (
                      <div className="flex items-center text-sm text-professional-gray">
                        <Icon name="Clock" size={16} className="mr-1" />
                        {course.duration}
                      </div>
                    )}
                    {course.enrolledCount && (
                      <div className="flex items-center text-sm text-professional-gray">
                        <Icon name="Users" size={16} className="mr-1" />
                        {course.enrolledCount} enrolled
                      </div>
                    )}
                  </div>

                  <h1 className="text-3xl font-heading font-bold text-authority-charcoal mb-4">
                    {course.name || course.title}
                  </h1>

                  <p className="text-lg text-professional-gray mb-6">
                    {(course.description || "").split(".")?.[0]}.
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">{renderStars(course.rating)}</div>
                      <span className="text-lg font-semibold text-authority-charcoal">{course.rating}</span>
                      <span className="text-professional-gray">({course.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-4 mb-8">
                    {course.originalPrice && (
                      <span className="text-xl text-professional-gray line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-authority-charcoal">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                  </div>

                  {/* Enroll Button */}
                  <div className="space-y-3">
                    <Button size="lg" className="w-full" onClick={handleEnrollClick}>
                      Enroll Now
                    </Button>
                    <p className="text-center text-sm text-professional-gray">
                      30-day money-back guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content + Sidebar */}
          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Long Description */}
                <div className="bg-white rounded-lg construction-shadow p-6">
                  <h2 className="text-2xl font-heading font-bold text-authority-charcoal mb-4">
                    Course Description
                  </h2>
                  <div className="prose max-w-none text-professional-gray">
                    {(course.longDescription || "").split("\n\n").map((para, idx) => (
                      <p key={idx} className="mb-4">{para}</p>
                    ))}
                  </div>
                </div>

                {/* Curriculum */}
                {course.curriculums?.length > 0 && (
                  <div className="bg-white rounded-lg construction-shadow p-6">
                    <h2 className="text-2xl font-heading font-bold text-authority-charcoal mb-6">
                      Course Curriculum
                    </h2>
                    <div className="space-y-4">
                      {course.curriculums.map((module, idx) => (
                        <div key={idx} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-authority-charcoal">{module.module}</h3>
                            <span className="text-sm text-professional-gray">{module.duration}</span>
                          </div>
                          <ul className="space-y-2">
                            {module.lessons?.map((lesson, lidx) => (
                              <li key={lidx} className="flex items-start">
                                <Icon name="CheckCircle" size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-professional-gray">{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {course.reviews?.length > 0 && (
                  <div className="bg-white rounded-lg construction-shadow p-6">
                    <h2 className="text-2xl font-heading font-bold text-authority-charcoal mb-6">
                      Student Reviews
                    </h2>
                    <div className="space-y-6">
                      {course.reviews.map((rev) => (
                        <div key={rev.id} className="border-b border-border pb-6 last:border-b-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold">{rev.user?.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-authority-charcoal">{rev.user}</p>
                                <p className="text-sm text-professional-gray">{new Date(rev.date)?.toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center">{renderStars(rev.rating)}</div>
                          </div>
                          <p className="text-professional-gray mb-3">{rev.comment}</p>
                          <button className="text-sm text-primary hover:text-primary/80">
                            Helpful ({rev.helpful})
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {course.instructor && (
                  <div className="bg-white rounded-lg construction-shadow p-6">
                    <h3 className="text-xl font-heading font-bold text-authority-charcoal mb-4">Your Instructor</h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <Image src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-authority-charcoal">{course.instructor.name}</h4>
                        <p className="text-sm text-professional-gray">{course.instructor.title}</p>
                      </div>
                    </div>
                    <p className="text-sm text-professional-gray mb-4">{course.bio}</p>
                  </div>
                )}

                {/* Skills */}
                {course.skills?.length > 0 && (
                  <div className="bg-white rounded-lg construction-shadow p-6">
                    <h3 className="text-xl font-heading font-bold text-authority-charcoal mb-4">Skills You'll Learn</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill, idx) => (
                        <span key={idx} className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {course.prerequisites?.length > 0 && (
                  <div className="bg-white rounded-lg construction-shadow p-6">
                    <h3 className="text-xl font-heading font-bold text-authority-charcoal mb-4">Prerequisites</h3>
                    <ul className="space-y-2">
                      {course.prerequisites.map((p, idx) => (
                        <li key={idx} className="flex items-start">
                          <Icon name="CheckCircle" size={16} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-professional-gray">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetails;
