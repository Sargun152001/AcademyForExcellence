import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import CalendarView from './components/CalendarView';
import CourseCard from './components/CourseCard';
import BookingForm from './components/BookingForm';
import FilterPanel from './components/FilterPanel';
import UpcomingBookings from './components/UpcomingBookings';
import { getCourses } from "../../services/businessCentralApi";
import { createBooking,getUserBookings } from "../../services/businessCentralApi";



const ScheduleManagementBooking = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookings, setBookings] = useState([]);
const [bookingsLoading, setBookingsLoading] = useState(false);
const [bookingsError, setBookingsError] = useState(null);
  const [showDirectBookingForm, setShowDirectBookingForm] = useState(false);
  const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    duration: '',
    timeSlot: '',
    instructor: '',
    dateFrom: '',
    dateTo: '',
    minRating: 0,
    availableOnly: true,
    newCoursesOnly: false
  });




useEffect(() => {
  const loadCourses = async () => {
    setLoading(true);
    try {
      const queryFilters = {
        search: searchQuery,
        category: filters?.category || undefined,
      };

      const fetchedCourses = await getCourses(queryFilters);
      setCourses(fetchedCourses);
    } catch (err) {
      console.error("❌ Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  loadCourses();
}, [searchQuery, filters?.category]);


useEffect(() => {
  if (activeTab === 'bookings') {
    fetchUserBookings();
  }
}, [activeTab]);

const fetchUserBookings = async () => {
  setBookingsLoading(true);
  setBookingsError(null);
  try {
    // Fetch bookings merged with courses
    const data = await getUserBookings();

    // ✅ No extra remapping needed, just pass fields as-is
    const normalized = data.map(b => ({
      bookingId: b.bookingId,
      courseTitle: b.courseName,
      date: b.date,
      time: b.time,
      location: b.location,
      status: b.status,
      duration: b.duration,
      instructor: b.instructor || { name: "TBD", title: "", rating: 0 },
      specialRequirements: b.specialRequirements,
      rating: b.rating,
      totalRatings: b.totalRatings,
      imageUrl: b.imageUrl,
    }));

    console.log("Mapped bookings:", normalized);
    setBookings(normalized || []);
  } catch (err) {
    console.error('Failed to load bookings:', err);
    setBookingsError('Failed to load bookings. Please try again.');
  } finally {
    setBookingsLoading(false);
  }
};


  // Mock data for courses
  // const mockCourses = [
  //   {
  //     id: 1,
  //     title: "Advanced Project Management for Large-Scale Construction",
  //     description: `Master the complexities of managing multi-billion dollar construction projects in the Middle East. This comprehensive course covers stakeholder management, risk assessment, and cultural considerations specific to regional construction practices.\n\nLearn from real case studies including Dubai Creek Tower, NEOM City development, and Qatar World Cup infrastructure projects.`,
  //     category: "Project Management",
  //     level: "Advanced",
  //     duration: 8,
  //     rating: 4.8,
  //     enrolled: 156,
  //     availableSlots: 12,
  //     isNew: true,
  //     image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop",
  //     instructor: {
  //       name: "Dr. Hassan Al-Mahmoud",
  //       title: "Former Project Director, Emaar Properties",
  //       experience: 18,
  //       rating: 4.9
  //     },
  //     prerequisites: ["Basic Project Management", "Construction Fundamentals"]
  //   },
  //   {
  //     id: 2,
  //     title: "Safety Compliance & Risk Management in Construction",
  //     description: `Comprehensive safety training covering OSHA standards, regional safety regulations, and best practices for construction site management. Focus on preventing accidents and ensuring compliance with UAE, Saudi Arabia, and Qatar safety standards.\n\nIncludes hands-on workshops with safety equipment and emergency response procedures.`,
  //     category: "Safety & Compliance",
  //     level: "Intermediate",
  //     duration: 6,
  //     rating: 4.7,
  //     enrolled: 203,
  //     availableSlots: 8,
  //     isNew: false,
  //     image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
  //     instructor: {
  //       name: "Sarah Johnson",
  //       title: "Safety Director, ALEC Engineering",
  //       experience: 12,
  //       rating: 4.8
  //     },
  //     prerequisites: ["Construction Basics"]
  //   },
  //   {
  //     id: 3,
  //     title: "Digital Construction Technologies & BIM Implementation",
  //     description: `Stay ahead of the digital transformation in construction with this cutting-edge course on Building Information Modeling (BIM), IoT sensors, and AI-powered project management tools.\n\nHands-on training with Autodesk Revit, Bentley MicroStation, and emerging technologies used in smart city projects across the Gulf region.`,
  //     category: "Digital Tools",
  //     level: "Intermediate",
  //     duration: 4,
  //     rating: 4.6,
  //     enrolled: 89,
  //     availableSlots: 15,
  //     isNew: true,
  //     image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=250&fit=crop",
  //     instructor: {
  //       name: "Ahmed Al-Rashid",
  //       title: "BIM Manager, Arabtec Construction",
  //       experience: 10,
  //       rating: 4.7
  //     },
  //     prerequisites: ["Basic CAD Knowledge"]
  //   },
  //   {
  //     id: 4,
  //     title: "Leadership Excellence in Construction Teams",
  //     description: `Develop exceptional leadership skills tailored for the multicultural construction environment of the Middle East. Learn to manage diverse teams, resolve conflicts, and drive project success through effective communication.\n\nIncludes cultural sensitivity training and case studies from successful regional construction leaders.`,
  //     category: "Leadership",
  //     level: "Advanced",
  //     duration: 6,
  //     rating: 4.9,
  //     enrolled: 134,
  //     availableSlots: 6,
  //     isNew: false,
  //     image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
  //     instructor: {
  //       name: "Maria Gonzalez",
  //       title: "Executive Coach & Former VP, Bechtel",
  //       experience: 15,
  //       rating: 4.9
  //     },
  //     prerequisites: ["Team Management Basics"]
  //   },
  //   {
  //     id: 5,
  //     title: "Quality Control & Assurance in Construction",
  //     description: `Master quality control processes and assurance methodologies specific to construction projects. Learn inspection techniques, testing procedures, and quality documentation standards used in major regional developments.\n\nPractical training with quality control tools and real-world inspection scenarios.`,
  //     category: "Quality Control",
  //     level: "Intermediate",
  //     duration: 5,
  //     rating: 4.5,
  //     enrolled: 167,
  //     availableSlots: 10,
  //     isNew: false,
  //     image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop",
  //     instructor: {
  //       name: "Khalid Bin Salem",
  //       title: "Quality Manager, Saudi Binladin Group",
  //       experience: 14,
  //       rating: 4.6
  //     },
  //     prerequisites: ["Construction Fundamentals"]
  //   },
  //   {
  //     id: 6,
  //     title: "Sustainable Construction Practices",
  //     description: `Learn sustainable building practices and green construction techniques aligned with regional environmental goals. Covers LEED certification, energy-efficient design, and sustainable material selection.\n\nFocus on UAE Green Building Council standards and Saudi Green Building Code requirements.`,
  //     category: "Technical Skills",
  //     level: "Beginner",
  //     duration: 3,
  //     rating: 4.4,
  //     enrolled: 92,
  //     availableSlots: 18,
  //     isNew: true,
  //     image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
  //     instructor: {
  //       name: "Dr. Hassan Al-Mahmoud",
  //       title: "Former Project Director, Emaar Properties",
  //       experience: 18,
  //       rating: 4.9
  //     },
  //     prerequisites: []
  //   }
  // ];

// Enhanced mock data with dynamic dates for current and future dates
  const generateDynamicSlots = () => {
    const slots = [];
    const today = new Date();
    const courseCount = courses?.length || 6;
    
    // Generate slots for the next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date?.setDate(today?.getDate() + i);
      
      // Skip weekends for business training
      if (date?.getDay() === 0 || date?.getDay() === 6) continue;
      
      const dateStr = `${date?.getFullYear()}-${String(date?.getMonth() + 1)?.padStart(2, '0')}-${String(date?.getDate())?.padStart(2, '0')}`;
      
      // Random number of courses per day (1-3)
      const coursesPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < coursesPerDay; j++) {
        const courseIndex = Math.floor(Math.random() * courseCount);
        const times = ['09:00 AM', '02:00 PM', '10:00 AM', '03:00 PM', '08:00 AM', '01:00 PM'];
        const timeIndex = Math.floor(Math.random() * times?.length);
        const availableSpots = Math.floor(Math.random() * 18) + 3; // 3-20 spots
        
        slots?.push({
          id: slots?.length + 1,
          date: dateStr,
          time: times?.[timeIndex],
          availableSpots: availableSpots,
          courseId: courseIndex + 1
        });
      }
    }
    
    return slots;
  };

  const [dynamicSlots] = useState(generateDynamicSlots());


  // Mock data for available slots
  const mockAvailableSlots = [
    { id: 1, date: "2025-01-08", time: "09:00 AM", availableSpots: 12, courseId: 1 },
    { id: 2, date: "2025-01-08", time: "02:00 PM", availableSpots: 8, courseId: 1 },
    { id: 3, date: "2025-01-09", time: "10:00 AM", availableSpots: 15, courseId: 2 },
    { id: 4, date: "2025-01-09", time: "03:00 PM", availableSpots: 6, courseId: 2 },
    { id: 5, date: "2025-01-10", time: "09:00 AM", availableSpots: 10, courseId: 3 },
    { id: 6, date: "2025-01-10", time: "01:00 PM", availableSpots: 18, courseId: 3 },
    { id: 7, date: "2025-01-11", time: "08:00 AM", availableSpots: 5, courseId: 4 },
    { id: 8, date: "2025-01-11", time: "04:00 PM", availableSpots: 12, courseId: 4 },
    { id: 9, date: "2025-01-12", time: "10:00 AM", availableSpots: 8, courseId: 5 },
    { id: 10, date: "2025-01-12", time: "02:30 PM", availableSpots: 14, courseId: 5 },
    { id: 11, date: "2025-01-13", time: "09:30 AM", availableSpots: 16, courseId: 6 },
    { id: 12, date: "2025-01-13", time: "03:30 PM", availableSpots: 9, courseId: 6 }
  ];

  // Mock data for upcoming bookings
  // const mockUpcomingBookings = [
  //   {
  //     id: 1,
  //     courseTitle: "Advanced Project Management for Large-Scale Construction",
  //     date: "2025-01-15",
  //     time: "09:00 AM",
  //     duration: 8,
  //     location: "Training Center A, Dubai",
  //     status: "Confirmed",
  //     bookingId: "BK-2025-001",
  //     instructor: {
  //       name: "Dr. Hassan Al-Mahmoud",
  //       title: "Former Project Director, Emaar Properties",
  //       rating: 4.9
  //     },
  //     specialRequirements: "Vegetarian meal, wheelchair accessible seating"
  //   },
  //   {
  //     id: 2,
  //     courseTitle: "Safety Compliance & Risk Management",
  //     date: "2025-01-22",
  //     time: "02:00 PM",
  //     duration: 6,
  //     location: "Safety Training Facility, Abu Dhabi",
  //     status: "Pending",
  //     bookingId: "BK-2025-002",
  //     instructor: {
  //       name: "Sarah Johnson",
  //       title: "Safety Director, ALEC Engineering",
  //       rating: 4.8
  //     }
  //   }
  // ];

  // Filter courses based on search and filters
const filteredCourses = courses?.filter(course => {
  const searchLower = searchQuery?.toLowerCase() || "";

  const matchesSearch =
    !searchLower ||
    course?.name?.toLowerCase().includes(searchLower) ||
    course?.description?.toLowerCase().includes(searchLower) ||
    course?.instructor?.name?.toLowerCase().includes(searchLower);

  const matchesCategory =
    !filters?.category || (course?.category?.toLowerCase().includes(filters?.category?.toLowerCase()));

  const matchesLevel =
    !filters?.level || (course?.level?.toLowerCase() === filters?.level?.toLowerCase());

  const matchesRating =
    !filters?.minRating || (course?.rating ?? 0) >= filters?.minRating;

  const availableSlots = (course?.maxParticipants ?? Infinity) - (course?.currentEnrollments ?? 0);
  const matchesAvailable =
    !filters?.availableOnly || availableSlots > 0;

  const matchesNew =
    !filters?.newCoursesOnly || course?.isNew;

  return matchesSearch && matchesCategory && matchesLevel && matchesRating && matchesAvailable && matchesNew;
});

console.log("Filtered courses:", filteredCourses);


  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedDate(null);
    setSelectedSlot(null);
    setShowBookingForm(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setShowBookingForm(false);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingForm(false);
  };

  const handleProceedToBooking = () => {
    if (selectedCourse && selectedSlot) {
      setShowBookingForm(true);
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    // Mock booking submission
    console.log('Booking submitted:', bookingData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form and show success
    setShowBookingForm(false);
    setSelectedCourse(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setActiveTab('bookings');
    
    // In a real app, you would show a success notification
    alert('Booking confirmed successfully!');
  };

  const handleCancelBooking = (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      console.log('Cancelling booking:', booking?.id);
      // In a real app, you would make an API call to cancel the booking
    }
  };

  const handleRescheduleBooking = (booking) => {
    console.log('Rescheduling booking:', booking?.id);
    // In a real app, you would open a reschedule modal
  };

  const handleDirectScheduleCourse = (course) => {
    setSelectedCourse(course); 
    setShowDirectBookingForm(true);
    setActiveTab('browse'); // Ensure we're on the browse tab to see the form
  };

 const handleDirectBookingSubmit = async (bookingData) => {
  try {
    console.log("Direct booking submitted:", bookingData);

    const response = await createBooking({
      ...bookingData,
      isDirectBooking: true, // make sure backend knows
    });

    console.log(" Booking API response:", response);

    // Reset form and show success
    setShowDirectBookingForm(false);
    setActiveTab("bookings");

    alert("Course scheduled successfully!");
  } catch (error) {
    console.error(" Error submitting booking:", error);
    alert("Failed to schedule course. Please try again.");
  }
};


  const clearFilters = () => {
    setFilters({
      category: '',
      level: '',
      duration: '',
      timeSlot: '',
      instructor: '',
      dateFrom: '',
      dateTo: '',
      minRating: 0,
      availableOnly: true,
      newCoursesOnly: false
    });
  };

  const tabs = [
    { id: 'browse', label: 'Browse Courses', icon: 'Search' },
    { id: 'calendar', label: 'Calendar View', icon: 'Calendar' },
    { id: 'bookings', label: 'My Bookings', icon: 'BookOpen' }
  ];

  return (
    <>
      <Helmet>
        <title>Schedule Management & Booking - Academy for Excellence</title>
        <meta name="description" content="Book construction training courses with flexible scheduling options. Real-time availability, instructor profiles, and seamless booking experience for Middle Eastern construction professionals." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className={`pt-16 construction-transition ${
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}>
          <div className="p-4 lg:p-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Icon name="Calendar" size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-heading font-bold text-authority-charcoal">
                      Schedule Management & Booking
                    </h1>
                    <p className="text-professional-gray">
                      Book training sessions with flexible scheduling and real-time availability
                    </p>
                  </div>
                </div>
                
                {/* Schedule Course Button */}
                <div className="hidden sm:block">
                  <Button
                    onClick={handleDirectScheduleCourse}
                    iconName="Plus"
                    iconPosition="left"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl construction-transition"
                  >
                    Schedule Course
                  </Button>
                </div>
              </div>

              {/* Mobile Schedule Course Button */}
              <div className="sm:hidden mb-4">
                <Button
                  onClick={handleDirectScheduleCourse}
                  iconName="Plus"
                  iconPosition="left"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl construction-transition"
                >
                  Schedule Course
                </Button>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg w-fit">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium construction-transition ${
                      activeTab === tab?.id
                        ? 'bg-background text-primary construction-shadow'
                        : 'text-professional-gray hover:text-authority-charcoal'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="hidden sm:inline">{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Booking Form Modal Overlay */}
            {showDirectBookingForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-card rounded-xl construction-shadow-premium max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-heading font-semibold text-authority-charcoal">
                          Schedule Course
                        </h2>
                        <p className="text-sm text-professional-gray mt-1">
                          Fill out the form below to schedule your course booking
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDirectBookingForm(false)}
                        className="p-2 hover:bg-muted rounded-lg construction-transition"
                      >
                        <Icon name="X" size={20} className="text-professional-gray" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                  <BookingForm
      selectedCourse={selectedCourse}
      selectedSlot={selectedSlot}
      onSubmit={handleDirectBookingSubmit}
      onCancel={() => setShowDirectBookingForm(false)}
      isDirectBooking={true}
    />
  </div>
                </div>
              </div>
            )}

            {/* Browse Courses Tab */}
            {activeTab === 'browse' && (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="xl:col-span-1">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={clearFilters}
                  />
                </div>

                {/* Main Content */}
                <div className="xl:col-span-3 space-y-6">
                  {/* Search Bar */}
                  <div className="bg-card rounded-xl construction-shadow-premium p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          type="search"
                          placeholder="Search courses, instructors, or topics..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e?.target?.value)}
                        />
                      </div>
                      <Button iconName="Search" iconPosition="left">
                        Search
                      </Button>
                    </div>
                  </div>

                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-heading font-semibold text-authority-charcoal">
                        Available Courses
                      </h2>
                      <p className="text-sm text-professional-gray">
                        {filteredCourses?.length} course{filteredCourses?.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                    {selectedCourse && selectedSlot && (
                      <Button
                        onClick={handleProceedToBooking}
                        iconName="ArrowRight"
                        iconPosition="right"
                      >
                        Proceed to Booking
                      </Button>
                    )}
                  </div>

                  {/* Course Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredCourses?.map((course) => (
                      <CourseCard
                        key={course?.id}
                        course={course}
                        isSelected={selectedCourse?.id === course.id}
                        onScheduleCourse={() => handleDirectScheduleCourse(course)}
                      />
                    ))}
                  </div>

                          {/* Selected Course Scheduling
                  {selectedCourse && (
                    <div className="mt-8">
                      <div className="bg-accent/20 border border-accent rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mt-1">
                            <Icon name="Info" size={16} className="text-accent-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-authority-charcoal mb-1">
                              Selected Course: {selectedCourse?.title}
                            </h4>
                            <p className="text-sm text-professional-gray">
                              Choose a date and time slot below to schedule your training session.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                   <CalendarView
  selectedDate={selectedDate}
  onDateSelect={handleDateSelect}
  availableSlots={bookings
    ?.filter(b => {
      if (!selectedDate) return false;
      const bDate = new Date(b.date);
      return (
        bDate.getFullYear() === selectedDate.getFullYear() &&
        bDate.getMonth() === selectedDate.getMonth() &&
        bDate.getDate() === selectedDate.getDate()
      );
    })
    ?.map(b => ({
      id: b.bookingId,
      courseId: b.courseId, // make sure your booking object has courseId
      time: b.time,
      availableSpots: 1, // optional, just to fill the shape
    }))
  }
  onSlotSelect={handleSlotSelect}
  selectedSlot={selectedSlot}
/>

                    </div>
                  )} */}

                  {/* Booking Form */}
                  {showBookingForm && (
                    <div className="mt-8">
                      <BookingForm
                        selectedCourse={selectedCourse}
                        selectedSlot={selectedSlot}
                        onSubmit={handleBookingSubmit}
                        onCancel={() => setShowBookingForm(false)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Calendar View Tab */}
            {activeTab === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CalendarView
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    availableSlots={dynamicSlots}
                    onSlotSelect={handleSlotSelect}
                    selectedSlot={selectedSlot}
                  />
                </div>
                <div>
                  {selectedDate ? (
  <div className="bg-card rounded-xl construction-shadow-premium p-6">
    <h3 className="text-lg font-heading font-semibold text-authority-charcoal mb-4">
      Bookings on {selectedDate.toLocaleDateString()}
    </h3>
    <div className="space-y-3">
      {bookings?.filter(b => {
        const bookingDateStr = new Date(b.date).toDateString();
        return bookingDateStr === selectedDate.toDateString();
      })?.map(booking => (
        <div 
          key={booking.bookingId} 
          className="p-4 border rounded-lg bg-muted text-sm"
        >
          <h4 className="font-semibold text-authority-charcoal mb-1">
            {booking.courseTitle}
          </h4>
          <p className="text-professional-gray mb-1">
            Time: {booking.time} | Duration: {booking.duration} hrs
          </p>
          <p className="text-professional-gray mb-1">
            Location: {booking.location || 'TBD'}
          </p>
          <p className={`font-medium ${booking.status === 'Confirmed' ? 'text-success' : 'text-yellow-600'}`}>
            Status: {booking.status}
          </p>
        </div>
      )) || (
        <p className="text-professional-gray text-sm">
          No bookings on this date.
        </p>
      )}
    </div>
  </div>
) : (
  <div className="bg-card rounded-xl construction-shadow-premium p-6 text-center">
    <Icon name="Calendar" size={48} className="text-professional-gray mx-auto mb-4 opacity-50" />
    <h3 className="text-lg font-heading font-semibold text-authority-charcoal mb-2">
      Select a Date
    </h3>
    <p className="text-professional-gray">
      Click on a date in the calendar to view bookings for that day.
    </p>
  </div>
)}

                </div>
              </div>
            )}

          {/* My Bookings Tab */}
{activeTab === 'bookings' && (
  <div className="max-w-4xl">
    {bookingsLoading && (
      <p className="text-sm text-professional-gray">Loading your bookings...</p>
    )}

    {bookingsError && (
      <p className="text-sm text-red-500">{bookingsError}</p>
    )}

    {!bookingsLoading && !bookingsError && (
      <>
        {bookings?.length > 0 ? (
          <UpcomingBookings
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onReschedule={handleRescheduleBooking}
          />
        ) : (
          <p className="text-sm text-professional-gray">
            You have no upcoming bookings.
          </p>
        )}
      </>
    )}
  </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ScheduleManagementBooking;