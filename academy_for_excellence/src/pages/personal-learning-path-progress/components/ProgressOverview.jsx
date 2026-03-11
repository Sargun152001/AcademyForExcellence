import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import {
  getCertificates,
  getUserBookings,
  getSubmittedAssessments,
  getCourseAssessments
} from "../../../services/businessCentralApi";

const ProgressOverview = ({ overviewData }) => {

  const [bookings, setBookings] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [assessmentData, setAssessmentData] = useState({
    total: 0,
    submitted: 0
  });

  // ---------------- GET RESOURCE ID ----------------
  const getResourceId = () => {

    try {

      const userResource = localStorage.getItem("userResource");

      if (userResource) {
        const resource = JSON.parse(userResource);
        if (resource.id) return resource.id;
      }

      const userData = localStorage.getItem("userData");

      if (userData) {
        const user = JSON.parse(userData);
        if (user.id) return user.id;
      }

      console.warn("[DEBUG] No resource ID found");
      return null;

    } catch (err) {

      console.error("[DEBUG] Error reading localStorage:", err);
      return null;

    }

  };

  // ---------------- NORMALIZE CERT STATUS ----------------
  const normalizeCertStatus = (status) => {

    if (!status) return "locked";

    const cleanStatus = status
      .replace(/_x0020_/g, " ")
      .trim()
      .toLowerCase();

    if (cleanStatus === "completed") return "completed";
    if (cleanStatus === "in progress") return "in-progress";

    return "locked";

  };

  // ---------------- FETCH BOOKINGS ----------------
  useEffect(() => {

    const fetchUserBookings = async () => {

      try {

        const data = await getUserBookings();

        const today = new Date();
        today.setHours(0,0,0,0);

        const normalized = (data || []).map((b) => {

          const bookingDate = b.date ? new Date(b.date) : null;

          if (bookingDate) bookingDate.setHours(0,0,0,0);

          let duration = 0;

          if (b.duration) {
            const match = b.duration.toString().match(/\d+/);
            duration = match ? Number(match[0]) : 0;
          }

          let computedStatus = "pending";

          if (bookingDate && bookingDate < today)
            computedStatus = "completed";
          else if (bookingDate && bookingDate >= today)
            computedStatus = "upcoming";

          return {
            bookingId: b.bookingId,
            courseId: Number(b.courseId), // normalize here
            date: bookingDate,
            duration,
            status: computedStatus
          };

        });

        console.log("[DEBUG] Mapped bookings:", normalized);
        console.log("[DEBUG] Total bookings:", normalized.length);

        console.log(
          "[DEBUG] Course IDs from bookings:",
          normalized.map(b => b.courseId)
        );

        setBookings(normalized);

      } catch (err) {

        console.error("❌ Failed to load bookings:", err);

      }

    };

    fetchUserBookings();

  }, []);

  // ---------------- FETCH ASSESSMENTS ----------------
  useEffect(() => {

    const loadAssessments = async () => {

      const resourceId = getResourceId();
      if (!resourceId) return;

      if (!bookings.length) return;

      try {

        const answerRows = await getSubmittedAssessments(resourceId);

        console.log("[DEBUG] Raw answer rows:", answerRows);

        const rows = Array.isArray(answerRows?.value)
          ? answerRows.value
          : Array.isArray(answerRows)
          ? answerRows
          : [];

        console.log("[DEBUG] Total answer rows:", rows.length);

        // ---------------- SUBMITTED COURSES ----------------
        const submittedCourses = new Set(
          rows.map((r) => Number(r.courseId))
        );

        const submittedAssessments = submittedCourses.size;

        console.log(
          "[DEBUG] Submitted courseIds:",
          [...submittedCourses]
        );

        // ---------------- UNIQUE BOOKED COURSES ----------------
        const uniqueBookedCourses = [
          ...new Set(
            bookings
              .map((b) => Number(b.courseId))
              .filter((id) => !isNaN(id))
          )
        ];

        console.log(
          "[DEBUG] Unique booked courseIds:",
          uniqueBookedCourses
        );

        console.log(
          "[DEBUG] Unique booked courses count:",
          uniqueBookedCourses.length
        );

        // ---------------- TOTAL ASSESSMENTS ----------------
        let totalAssessments = 0;

        for (const courseId of uniqueBookedCourses) {

          try {

            console.log(
              `📡 Checking assessments for courseId: ${courseId}`
            );

            const questions = await getCourseAssessments(courseId);

            console.log(
              `📡 Questions returned for course ${courseId}:`,
              questions.length
            );

            if (questions && questions.length > 0) {

              totalAssessments++;

              console.log(
                `✅ Course ${courseId} has assessment`
              );

            }

          } catch (err) {

            console.warn(
              "⚠️ Failed fetching assessments for course:",
              courseId
            );

          }

        }

        console.log("🎯 FINAL Total Assessments:", totalAssessments);
        console.log("🎯 FINAL Submitted Assessments:", submittedAssessments);

        setAssessmentData({
          total: totalAssessments,
          submitted: submittedAssessments
        });

      } catch (err) {

        console.error("❌ Failed to fetch assessments:", err);

      }

    };

    loadAssessments();

  }, [bookings]);

  // ---------------- LOAD CERTIFICATES + METRICS ----------------
  useEffect(() => {

    const loadData = async () => {

      const resourceId = getResourceId();
      if (!resourceId) return;

      try {

        const certs = await getCertificates(resourceId);

        const allCerts = Array.isArray(certs?.value)
          ? certs.value
          : certs || [];

        const completedCerts = allCerts.filter(
          (c) => normalizeCertStatus(c.status) === "completed"
        ).length;

        const inProgressCerts = allCerts.filter(
          (c) => normalizeCertStatus(c.status) === "in-progress"
        ).length;

        const totalCerts = allCerts.length;

        const totalBookings = bookings.length;

        const completedBookings = bookings.filter(
          (b) => b.status === "completed"
        ).length;

        const upcomingBookings = bookings.filter(
          (b) => b.status === "upcoming"
        ).length;

        const totalHours = bookings.reduce(
          (sum, b) => sum + b.duration,
          0
        );

        const completedHours = bookings
          .filter((b) => b.status === "completed")
          .reduce((sum, b) => sum + b.duration, 0);

        const remainingHours = bookings
          .filter((b) => b.status === "upcoming")
          .reduce((sum, b) => sum + b.duration, 0);

        const metricsData = [

          {
            id: "courses-completed",
            title: "Courses Completed",
            value: completedBookings,
            total: totalBookings,
            icon: "BookOpen",
            color: "success",
            trend: `${upcomingBookings} upcoming`,
            progress:
              totalBookings > 0
                ? Math.round((completedBookings / totalBookings) * 100)
                : 0
          },

          {
            id: "certifications-earned",
            title: "Certifications Earned",
            value: completedCerts,
            total: totalCerts,
            icon: "Award",
            color: "accent",
            trend: `${inProgressCerts} in progress`,
            progress:
              totalCerts > 0
                ? Math.round((completedCerts / totalCerts) * 100)
                : 0
          },

          {
            id: "learning-hours",
            title: "Learning Hours",
            value: completedHours,
            total: totalHours,
            icon: "Clock",
            color: "primary",
            trend: `${remainingHours} hrs left`,
            progress:
              totalHours > 0
                ? Math.round((completedHours / totalHours) * 100)
                : 0
          },

          {
            id: "skill-assessments",
            title: "Skill Assessments",
            value: assessmentData.submitted,
            total: assessmentData.total,
            icon: "Target",
            color: "confidence-teal",
            trend: `${assessmentData.total - assessmentData.submitted} remaining`,
            progress:
              assessmentData.total > 0
                ? Math.round(
                    (assessmentData.submitted /
                      assessmentData.total) * 100
                  )
                : 0
          }

        ];

        setMetrics(metricsData);

      } catch (err) {

        console.error("❌ Error loading data:", err);

      }

    };

    loadData();

  }, [bookings, assessmentData]);

  // ---------------- COLOR CLASSES ----------------
  const getColorClasses = (color) => {

    const colorMap = {

      success: "text-success bg-success/10 border-success/20",
      accent: "text-accent bg-accent/10 border-accent/20",
      primary: "text-primary bg-primary/10 border-primary/20",
      "confidence-teal":
        "text-confidence-teal bg-confidence-teal/10 border-confidence-teal/20"

    };

    return colorMap[color] || colorMap.primary;

  };

  // ---------------- UI ----------------
  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      {metrics.map((metric) => {

        const percentage =
          metric.progress ??
          (metric.total > 0
            ? Math.round((metric.value / metric.total) * 100)
            : 0);

        return (

          <div
            key={metric.id}
            className="p-6 bg-card rounded-lg border border-border construction-shadow hover:construction-shadow-lg construction-transition"
          >

            <div className="flex items-center justify-between mb-4">

              <div className={`p-2 rounded-lg border ${getColorClasses(metric.color)}`}>
                <Icon name={metric.icon} size={20} />
              </div>

              <div className="text-right">

                <div className="text-2xl font-bold text-authority-charcoal">

                  {metric.value}

                  <span className="text-lg text-professional-gray">
                    /{metric.total}
                  </span>

                </div>

              </div>

            </div>

            <h3 className="font-medium text-authority-charcoal">
              {metric.title}
            </h3>

          </div>

        );

      })}

    </div>

  );

};

export default ProgressOverview;