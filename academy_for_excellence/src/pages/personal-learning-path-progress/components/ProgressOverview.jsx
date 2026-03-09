import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import {
  getCertificates,
  getUserBookings
} from "../../../services/businessCentralApi";

const ProgressOverview = ({ overviewData }) => {

  const [bookings, setBookings] = useState([]);
  const [metrics, setMetrics] = useState([]);

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

          if (bookingDate && bookingDate < today) {
            computedStatus = "completed";
          }
          else if (bookingDate && bookingDate >= today) {
            computedStatus = "upcoming";
          }

          return {
            bookingId: b.bookingId,
            date: bookingDate,
            duration,
            status: computedStatus
          };

        });

        console.log("[DEBUG] Mapped bookings:", normalized);
        console.log("[DEBUG] Total bookings:", normalized.length);

        setBookings(normalized);

      } catch (err) {

        console.error("❌ Failed to load bookings:", err);

      }

    };

    fetchUserBookings();

  }, []);

  // ---------------- LOAD CERTIFICATES + METRICS ----------------
  useEffect(() => {

    const loadData = async () => {

      const resourceId = getResourceId();
      if (!resourceId) return;

      try {

        console.log("[DEBUG] Overview Data received:", overviewData);

        // -------- FETCH CERTIFICATES --------
        const certs = await getCertificates(resourceId);

        const allCerts = Array.isArray(certs?.value)
          ? certs.value
          : certs || [];

        console.log("[DEBUG] Certificates fetched:", allCerts.length);

        const completedCerts = allCerts.filter(
          (c) => normalizeCertStatus(c.status) === "completed"
        ).length;

        const inProgressCerts = allCerts.filter(
          (c) => normalizeCertStatus(c.status) === "in-progress"
        ).length;

        const totalCerts = allCerts.length;

        // -------- BOOKINGS METRICS --------
        console.log("[DEBUG] Raw bookings received:", bookings);

        const totalBookings = bookings.length;

        const completedBookings = bookings.filter(
          (b) => b.status === "completed"
        ).length;

        const upcomingBookings = bookings.filter(
          (b) => b.status === "upcoming"
        ).length;

        // -------- LEARNING HOURS --------
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

        console.log(
          "[DEBUG] Learning Hours:",
          "Completed:", completedHours,
          "Remaining:", remainingHours,
          "Total:", totalHours
        );

        // -------- ASSESSMENT DEBUG LOGS --------
        console.log(
          "[DEBUG] Total Assessments:",
          overviewData?.totalSkills || 0
        );

        console.log(
          "[DEBUG] Submitted Assessments:",
          overviewData?.skillAssessments || 0
        );

        // -------- METRICS --------
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
            value: overviewData?.skillAssessments || 0,
            total: overviewData?.totalSkills || 0,
            icon: "Target",
            color: "confidence-teal",
            trend: "+2 completed",
            progress:
              overviewData?.totalSkills > 0
                ? Math.round(
                    (overviewData.skillAssessments /
                      overviewData.totalSkills) * 100
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

  }, [overviewData, bookings]);

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

            <div className="space-y-3">

              <h3 className="font-medium text-authority-charcoal">
                {metric.title}
              </h3>

              <div className="space-y-2">

                <div className="flex justify-between text-sm">

                  <span className="text-professional-gray">
                    Progress
                  </span>

                  <span className="font-medium text-authority-charcoal">
                    {percentage}%
                  </span>

                </div>

                <div className="w-full bg-border rounded-full h-2">

                  <div
                    className={`h-2 rounded-full construction-transition ${
                      metric.color === "success"
                        ? "bg-success"
                        : metric.color === "accent"
                        ? "bg-accent"
                        : metric.color === "primary"
                        ? "bg-primary"
                        : "bg-confidence-teal"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />

                </div>

              </div>

              <div className="flex items-center space-x-2">

                <Icon
                  name="TrendingUp"
                  size={14}
                  className="text-success"
                />

                <span className="text-sm text-professional-gray">
                  {metric.trend}
                </span>

              </div>

            </div>

          </div>

        );

      })}

    </div>

  );

};

export default ProgressOverview;