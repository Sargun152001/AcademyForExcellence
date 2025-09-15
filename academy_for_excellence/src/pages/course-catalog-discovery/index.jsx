import React, { useState, useEffect ,useMemo} from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import SearchHeader from './components/SearchHeader';
import FilterSidebar from './components/FilterSidebar';
import CategoryTabs from './components/CategoryTabs';
import FeaturedSection from './components/FeaturedSection';
import CourseCard from './components/CourseCard';
import CourseListItem from './components/CourseListItem';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { getCourses } from "../../services/businessCentralApi"; 


const CourseCatalogDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filters, setFilters] = useState({});
  const [wishlistedCourses, setWishlistedCourses] = useState([]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 12;

useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const filters = {
          search: searchQuery,
          category: activeCategory !== 'all' ? activeCategory : undefined,
        };

        const courses = await getCourses(filters);

        setAllCourses(courses);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [searchQuery, activeCategory]);



// Dynamic categories from courses
const categories = useMemo(() => {
  const counts = {};
  allCourses?.forEach(course => {
    const cat = course?.category || 'Uncategorized';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count,
    icon: 'Book', // default icon (can map based on name if needed)
    description: `${count} course${count > 1 ? 's' : ''} in ${name}`
  }));
}, [allCourses]);

  
  // Mock data for categories
  // const categories = [
  //   {
  //     id: 'project-management',
  //     name: 'Project Management',
  //     icon: 'Briefcase',
  //     count: 24,
  //     description: 'Comprehensive project management courses covering PMI standards, PRINCE2 methodology, and regional best practices for Middle Eastern construction projects.'
  //   },
  //   {
  //     id: 'leadership',
  //     name: 'Leadership & Teams',
  //     icon: 'Users',
  //     count: 18,
  //     description: 'Develop leadership skills for managing multicultural construction teams across diverse Middle Eastern markets and international projects.'
  //   },
  //   {
  //     id: 'technical',
  //     name: 'Technical Skills',
  //     icon: 'Settings',
  //     count: 32,
  //     description: 'Technical expertise in construction methods, quality control, safety standards, and emerging technologies specific to regional conditions.'
  //   },
  //   {
  //     id: 'sustainability',
  //     name: 'Sustainability',
  //     icon: 'Leaf',
  //     count: 15,
  //     description: 'Sustainable construction practices, green building standards, and environmental compliance for Middle Eastern climate conditions.'
  //   },
  //   {
  //     id: 'risk-management',
  //     name: 'Risk Management',
  //     icon: 'Shield',
  //     count: 12,
  //     description: 'Risk assessment, mitigation strategies, and crisis management tailored for complex construction projects in volatile regional markets.'
  //   },
  //   {
  //     id: 'digital-transformation',
  //     name: 'Digital & Tech',
  //     icon: 'Smartphone',
  //     count: 20,
  //     description: 'Digital transformation, BIM implementation, IoT integration, and construction technology adoption for modern project delivery.'
  //   }
  // ];

  // Mock data for featured courses
  const featuredCourses = [
    {
      id: 'featured-1',
      title: 'Managing Mega Projects in Desert Climates',
      description: `Master the complexities of large-scale infrastructure projects in extreme Middle Eastern environments. Learn advanced scheduling techniques, resource optimization, and stakeholder management for projects exceeding $1 billion in value.`,
      //image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      badge: 'Expert Level',
      duration: '45 hours',
      enrolledCount: '2,847',
      rating: 4.9,
      instructor: {
        name: 'Dr. Khalid Al-Mansouri',
        title: 'Senior Project Director, ADNOC',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      skills: ['Mega Project Management', 'Desert Construction', 'Stakeholder Management']
    },
    {
      id: 'featured-2',
      title: 'Cultural Intelligence for International Teams',
      description: 'Navigate cultural complexities in multinational construction projects across the Middle East.',
      //image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
      badge: 'Popular',
      duration: '20 hours',
      enrolledCount: '4,521',
      rating: 4.8,
      instructor: {
        name: 'Sarah Mitchell',
        title: 'International PM Consultant',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      skills: ['Cultural Intelligence', 'Team Leadership', 'Communication']
    },
    {
      id: 'featured-3',
      title: 'Sustainable Construction in MENA',
      description: 'Implement green building practices and sustainability standards in Middle Eastern projects.',
      //image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
      badge: 'New Release',
      duration: '30 hours',
      enrolledCount: '1,892',
      rating: 4.7,
      instructor: {
        name: 'Ahmed Hassan',
        title: 'Sustainability Director',
        avatar: 'https://randomuser.me/api/portraits/men/28.jpg'
      },
      skills: ['Green Building', 'LEED Certification', 'Environmental Compliance']
    }
  ];

  // Mock data for all courses
  // const allCourses = [
  //   {
  //     id: 1,
  //     title: 'Advanced Project Scheduling for Infrastructure Projects',
  //     description: `Master critical path method, resource leveling, and schedule optimization for large-scale infrastructure developments. Learn industry-standard tools and techniques used in major Middle Eastern construction projects including metro systems, airports, and smart city developments.`,
  //     image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
  //     category: 'Project Management',
  //     level: 'Advanced',
  //     duration: '25 hours',
  //     // price: 299,
  //     // originalPrice: 399,
  //     price: 0,
  //     rating: 4.8,
  //     reviewCount: 342,
  //     enrolledCount: '2,847',
  //     isNew: true,
  //     instructor: {
  //       name: 'Omar Al-Zahra',
  //       title: 'Senior Project Manager, Emaar',
  //       avatar: 'https://randomuser.me/api/portraits/men/35.jpg'
  //     },
  //     skills: ['Critical Path Method', 'Resource Planning', 'Schedule Optimization', 'Risk Assessment'],
  //     prerequisites: ['Basic Project Management', 'MS Project Fundamentals'],
  //     certifications: ['PMI PDUs', 'PRINCE2 Credits'],
  //     projectType: 'Infrastructure',
  //     region: 'GCC'
  //   },
  //   {
  //     id: 2,
  //     title: 'Leadership Excellence in Construction Teams',
  //     description: `Develop transformational leadership skills for managing diverse construction teams across cultural boundaries. Focus on motivation techniques, conflict resolution, and performance optimization in high-pressure project environments.`,
  //     image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
  //     category: 'Leadership & Teams',
  //     level: 'Intermediate',
  //     duration: '18 hours',
  //     price: 199,
  //     rating: 4.9,
  //     reviewCount: 567,
  //     enrolledCount: '4,521',
  //     isNew: false,
  //     instructor: {
  //       name: 'Fatima Al-Rashid',
  //       title: 'Leadership Development Specialist',
  //       avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
  //     },
  //     skills: ['Team Leadership', 'Conflict Resolution', 'Performance Management', 'Cultural Intelligence'],
  //     prerequisites: ['Management Basics'],
  //     certifications: ['Leadership Certificate'],
  //     projectType: 'Commercial',
  //     region: 'GCC'
  //   },
  //   {
  //     id: 3,
  //     title: 'Quality Control in Hot Weather Concreting',
  //     description: `Specialized techniques for maintaining concrete quality in extreme Middle Eastern temperatures. Cover mix design, placement procedures, curing methods, and quality assurance protocols for desert construction conditions.`,
  //     image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
  //     category: 'Technical Skills',
  //     level: 'Expert',
  //     duration: '32 hours',
  //     // price: 449,
  //     // originalPrice: 599,
  //     price: 0,
  //     rating: 4.7,
  //     reviewCount: 189,
  //     enrolledCount: '1,234',
  //     isNew: true,
  //     instructor: {
  //       name: 'Dr. Hassan Mahmoud',
  //       title: 'Concrete Technology Expert',
  //       avatar: 'https://randomuser.me/api/portraits/men/50.jpg'
  //     },
  //     skills: ['Concrete Technology', 'Quality Assurance', 'Hot Weather Construction', 'Materials Testing'],
  //     prerequisites: ['Construction Materials', 'Quality Management'],
  //     certifications: ['ACI Certification', 'Quality Control Certificate'],
  //     projectType: 'Infrastructure',
  //     region: 'MENA'
  //   },
  //   {
  //     id: 4,
  //     title: 'Digital Transformation in Construction',
  //     description: `Embrace the future of construction with BIM, IoT, AI, and digital project management tools. Learn implementation strategies for digital technologies that are revolutionizing Middle Eastern construction industry.`,
  //     image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  //     category: 'Digital & Tech',
  //     level: 'Intermediate',
  //     duration: '28 hours',
  //     // price: 349,
  //     price: 0,
  //     rating: 4.6,
  //     reviewCount: 423,
  //     enrolledCount: '3,156',
  //     isNew: false,
  //     instructor: {
  //       name: 'Ravi Sharma',
  //       title: 'Digital Construction Consultant',
  //       avatar: 'https://randomuser.me/api/portraits/men/38.jpg'
  //     },
  //     skills: ['BIM Implementation', 'Digital Project Management', 'Construction Technology', 'Data Analytics'],
  //     prerequisites: ['Basic Computer Skills', 'Project Management Fundamentals'],
  //     certifications: ['Digital Construction Certificate'],
  //     projectType: 'Mixed-Use',
  //     region: 'Global'
  //   },
  //   {
  //     id: 5,
  //     title: 'Sustainable Building Practices for MENA Region',
  //     description: `Implement green building standards and sustainable construction practices tailored for Middle Eastern climate conditions. Focus on energy efficiency, water conservation, and environmental compliance.`,
  //     image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
  //     category: 'Sustainability',
  //     level: 'Foundation',
  //     duration: '22 hours',
  //     price: 0,
  //     rating: 4.5,
  //     reviewCount: 678,
  //     enrolledCount: '5,892',
  //     isNew: false,
  //     instructor: {
  //       name: 'Layla Al-Mansouri',
  //       title: 'Sustainability Director, ADNOC',
  //       avatar: 'https://randomuser.me/api/portraits/women/35.jpg'
  //     },
  //     skills: ['Green Building', 'LEED Standards', 'Energy Efficiency', 'Environmental Compliance'],
  //     prerequisites: [],
  //     certifications: ['LEED Green Associate', 'Sustainability Certificate'],
  //     projectType: 'Commercial',
  //     region: 'MENA'
  //   },
  //   {
  //     id: 6,
  //     title: 'Risk Management in Mega Construction Projects',
  //     description: `Advanced risk assessment and mitigation strategies for billion-dollar construction projects. Learn from real case studies of major Middle Eastern developments and international best practices.`,
  //     image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
  //     category: 'Risk Management',
  //     level: 'Expert',
  //     duration: '35 hours',
  //     price: 499,
  //     originalPrice: 699,
  //     rating: 4.9,
  //     reviewCount: 234,
  //     enrolledCount: '1,567',
  //     isNew: true,
  //     instructor: {
  //       name: 'Michael Thompson',
  //       title: 'Risk Management Director',
  //       avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
  //     },
  //     skills: ['Risk Assessment', 'Crisis Management', 'Financial Risk', 'Stakeholder Management'],
  //     prerequisites: ['Project Management Advanced', 'Financial Management'],
  //     certifications: ['PMI-RMP', 'Risk Management Professional'],
  //     projectType: 'Infrastructure',
  //     region: 'Global'
  //   },
  //   {
  //     id: 7,
  //     title: 'Cross-Cultural Communication in Construction',
  //     description: `Master effective communication strategies for multicultural construction teams. Learn cultural nuances, language barriers solutions, and team integration techniques for Middle Eastern projects.`,
  //     image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
  //     category: 'Leadership & Teams',
  //     level: 'Intermediate',
  //     duration: '16 hours',
  //     price: 179,
  //     rating: 4.7,
  //     reviewCount: 445,
  //     enrolledCount: '3,789',
  //     isNew: false,
  //     instructor: {
  //       name: 'Amira Hassan',
  //       title: 'Cultural Intelligence Expert',
  //       avatar: 'https://randomuser.me/api/portraits/women/29.jpg'
  //     },
  //     skills: ['Cultural Intelligence', 'Communication', 'Team Integration', 'Conflict Resolution'],
  //     prerequisites: ['Basic Management'],
  //     certifications: ['Cultural Intelligence Certificate'],
  //     projectType: 'Commercial',
  //     region: 'MENA'
  //   },
  //   {
  //     id: 8,
  //     title: 'Safety Management in High-Rise Construction',
  //     description: `Comprehensive safety protocols and management systems for high-rise construction projects. Focus on Middle Eastern safety standards, international compliance, and accident prevention strategies.`,
  //     image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
  //     category: 'Technical Skills',
  //     level: 'Advanced',
  //     duration: '30 hours',
  //     price: 389,
  //     rating: 4.8,
  //     reviewCount: 312,
  //     enrolledCount: '2,145',
  //     isNew: false,
  //     instructor: {
  //       name: 'John Mitchell',
  //       title: 'Safety Director, Skanska',
  //       avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
  //     },
  //     skills: ['Safety Management', 'Risk Prevention', 'Compliance', 'Emergency Response'],
  //     prerequisites: ['Basic Safety Training', 'Construction Fundamentals'],
  //     certifications: ['OSHA Certification', 'Safety Management Certificate'],
  //     projectType: 'Commercial',
  //     region: 'Global'
  //   }
  // ];

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = allCourses;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(course =>
        course?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        course?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        course?.skills?.some(skill => skill?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ||
        course?.instructor?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply category filter
    if (activeCategory !== 'all') {
     const categoryName = categories?.find(cat => cat?.id === activeCategory)?.name;
  if (categoryName) {
    filtered = filtered?.filter(course => course?.category === categoryName);
      }
    }

    // Apply other filters
    Object.entries(filters)?.forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value?.length === 0)) return;

      switch (key) {
        case 'skillLevel':
          if (Array.isArray(value) && value?.length > 0) {
            filtered = filtered?.filter(course => value?.includes(course?.level));
          }
          break;
        case 'projectType':
          if (Array.isArray(value) && value?.length > 0) {
            filtered = filtered?.filter(course => value?.includes(course?.projectType));
          }
          break;
        case 'region':
          if (Array.isArray(value) && value?.length > 0) {
            filtered = filtered?.filter(course => value?.includes(course?.region));
          }
          break;
        case 'priceRange':
          if (Array.isArray(value) && value?.length > 0) {
            filtered = filtered?.filter(course => {
              return value?.some(range => {
                switch (range) {
                  case 'free': return course?.price === 0;
                  case '1-100': return course?.price > 0 && course?.price <= 100;
                  case '101-300': return course?.price > 100 && course?.price <= 300;
                  case '301-500': return course?.price > 300 && course?.price <= 500;
                  case '500+': return course?.price > 500;
                  default: return true;
                }
              });
            });
          }
          break;
        case 'isNew':
          if (value) {
            filtered = filtered?.filter(course => course?.isNew);
          }
          break;
        case 'highlyRated':
          if (value) {
            filtered = filtered?.filter(course => course?.rating >= 4.5);
          }
          break;
      }
    });

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b?.rating - a?.rating;
        case 'popular':
          return parseInt(b?.enrolledCount?.replace(',', '')) - parseInt(a?.enrolledCount?.replace(',', ''));
        case 'newest':
          return b?.isNew - a?.isNew;
        case 'price-low':
          return a?.price - b?.price;
        case 'price-high':
          return b?.price - a?.price;
        case 'duration-short':
          return parseInt(a?.duration) - parseInt(b?.duration);
        case 'duration-long':
          return parseInt(b?.duration) - parseInt(a?.duration);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allCourses, searchQuery, activeCategory, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCourses?.length / coursesPerPage);
  const paginatedCourses = filteredAndSortedCourses?.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setActiveCategory('all');
    setCurrentPage(1);
  };

  const handleEnroll = (courseId) => {
    navigate(`/course-catalog-discovery/enrollment/${courseId}`, {
      state: {
        course: allCourses?.find(course => course?.id?.toString() === courseId?.toString()) ||
               featuredCourses?.find(course => course?.id === courseId)
      }
    });
  };

  const handleWishlist = (courseId) => {
    setWishlistedCourses(prev =>
      prev?.includes(courseId)
        ? prev?.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Course Catalog & Discovery - Academy for Excellence</title>
        <meta name="description" content="Discover comprehensive construction project management courses designed for Middle Eastern professionals. Advanced filtering, expert instructors, and industry-recognized certifications." />
      </Helmet>
      <Header />
      <div className="flex pt-16">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className={`flex-1 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} construction-transition`}>
          {/* Featured Section */}
          <FeaturedSection 
            // featuredCourses={featuredCourses}
            // onEnroll={handleEnroll}
          />

          {/* Search Header */}
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={filteredAndSortedCourses?.length}
            onToggleFilters={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
          />

          {/* Category Tabs */}
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categories={categories}
          />

          <div className="flex">
            {/* Filter Sidebar */}
            {isFilterSidebarOpen && (
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isCollapsed={false}
                onToggleCollapse={() => setIsFilterSidebarOpen(false)}
              />
            )}

            {/* Course Grid/List */}
            <div className="flex-1 p-6">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-authority-charcoal mb-2">
                    {activeCategory === 'all' ? 'All Courses' : 
                     categories?.find(cat => cat?.id === activeCategory)?.name + ' Courses'}
                  </h1>
                  <p className="text-professional-gray">
                    {filteredAndSortedCourses?.length} courses found
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>
              </div>

              {/* Course Grid/List */}
              {paginatedCourses?.length > 0 ? (
                <>
                  <div className={viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8' :'space-y-6 mb-8'
                  }>
                    {paginatedCourses?.map((course) => (
                      viewMode === 'grid' ? (
                        <CourseCard
                          key={course?.id}
                          course={course}
                          onEnroll={handleEnroll}
                          onWishlist={handleWishlist}
                          isWishlisted={wishlistedCourses?.includes(course?.id)}
                        />
                      ) : (
                        <CourseListItem
                          key={course?.id}
                          course={course}
                          onEnroll={handleEnroll}
                          onWishlist={handleWishlist}
                          isWishlisted={wishlistedCourses?.includes(course?.id)}
                        />
                      )
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        iconName="ChevronLeft"
                        iconPosition="left"
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              onClick={() => handlePageChange(page)}
                              size="sm"
                            >
                              {page}
                            </Button>
                          );
                        })}
                        
                        {totalPages > 5 && (
                          <>
                            <span className="text-professional-gray">...</span>
                            <Button
                              variant={currentPage === totalPages ? 'default' : 'outline'}
                              onClick={() => handlePageChange(totalPages)}
                              size="sm"
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        iconName="ChevronRight"
                        iconPosition="right"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                /* No Results */
                (<div className="text-center py-16">
                  <Icon name="Search" size={64} className="text-professional-gray mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-authority-charcoal mb-2">
                    No courses found
                  </h3>
                  <p className="text-professional-gray mb-6">
                    Try adjusting your search criteria or filters to find more courses.
                  </p>
                  <Button onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>)
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseCatalogDiscovery;