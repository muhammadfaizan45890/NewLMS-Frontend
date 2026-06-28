import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import axios from "axios";
import UserPayment from "./UserPayment";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { getData } from "@/context/userContext";

import {
  Search,
  BookOpen,
  Clock3,
  Wallet,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers3,
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  Award,
} from "lucide-react";

// ---------- Custom Hooks ----------
// Debounce hook
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Intersection Observer for animated counters
const useScrollReveal = (ref, options = { threshold: 0.3 }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: options.threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options.threshold]);
  return isVisible;
};

// Animated counter
const AnimatedCounter = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isVisible = useScrollReveal(ref, { threshold: 0.5 });

  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return (
    <span ref={ref} className="text-xl sm:text-3xl lg:text-4xl font-black">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// ---------- Main Component ----------
const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = getData();

  // ================= STATES =================
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState(null);

  // Filter, sort, pagination
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const debouncedSearch = useDebounce(search, 300);

  // ================= USER ID =================
  const userId = user?._id || user?.id || localStorage.getItem("userId");

  // ================= FETCH COURSES =================
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/admin/courses`);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("COURSE ERROR:", err);
      setError("Failed to load courses. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= FETCH ENROLLMENTS =================
  const fetchEnrollments = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API}/enroll/my-courses/${userId}`);
      setEnrolledCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("ENROLLMENT ERROR:", err);
      setEnrolledCourses([]);
    }
  }, [userId]);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, [fetchCourses, fetchEnrollments]);

  // ================= FILTER, SORT, PAGINATE =================
  const processedCourses = useMemo(() => {
    let result = [...courses];

    // Search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (course) =>
          course.title?.toLowerCase().includes(q) ||
          course.description?.toLowerCase().includes(q) ||
          course.category?.toLowerCase().includes(q)
      );
    }

    // Category filter (if courses have category field)
    if (filterCategory !== "all") {
      result = result.filter(
        (course) => course.category?.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortBy] || "";
      let bVal = b[sortBy] || "";
      if (sortBy === "price") {
        aVal = parseFloat(aVal.replace(/[^0-9.]/g, "")) || 0;
        bVal = parseFloat(bVal.replace(/[^0-9.]/g, "")) || 0;
      }
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [courses, debouncedSearch, filterCategory, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedCourses.slice(start, start + itemsPerPage);
  }, [processedCourses, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterCategory, sortBy, sortOrder]);

  // ================= CHECK ENROLLMENT =================
  const getEnrollment = (courseId) => {
    if (!courseId || !Array.isArray(enrolledCourses)) return null;
    return enrolledCourses.find(
      (item) => item.courseId?._id === courseId || item.courseId === courseId
    );
  };

  // ================= STATS =================
  const activeCourses = Array.isArray(enrolledCourses)
    ? enrolledCourses.filter((item) => item.status === "active").length
    : 0;
  const pendingCourses = Array.isArray(enrolledCourses)
    ? enrolledCourses.filter((item) => item.status === "pending").length
    : 0;
  const totalCourses = courses.length;

  // ================= CATEGORIES =================
  // const categories = useMemo(() => {
  //   const cats = new Set();
  //   courses.forEach((c) => {
  //     if (c.category) cats.add(c.category);
  //   });
  //   return ["all", ...Array.from(cats)];
  // }, [courses]);

  // ================= HANDLE MISSING USER =================
  if (!user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-black">Please Login</h2>
          <p className="text-zinc-600 mt-2">
            You need to be logged in to view your dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-black">Something went wrong</h2>
          <p className="text-zinc-600 mt-2">{error}</p>
          <button
            onClick={() => fetchCourses()}
            className="mt-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-zinc-100 overflow-x-hidden">
      {/* HERO SECTION with animated stats */}
      <div className="relative overflow-hidden bg-black text-white">
        <div className="absolute top-0 left-0 w-56 sm:w-96 h-56 sm:h-96 bg-white/10 blur-[80px] sm:blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-56 sm:w-96 h-56 sm:h-96 bg-white/10 blur-[80px] sm:blur-[120px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12 lg:py-16">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 sm:gap-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 border border-white/10 backdrop-blur-md rounded-full px-2.5 py-1 sm:px-5 sm:py-2 text-[10px] sm:text-sm font-semibold mb-3 sm:mb-6">
                <Sparkles size={12} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Modern LMS Platform</span>
                <span className="xs:hidden">LMS</span>
              </div>
              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black leading-tight">
                Learn New Skills
                <span className="block text-zinc-400 mt-0.5 sm:mt-2">
                  Anytime Anywhere
                </span>
              </h1>
              <p className="text-zinc-300 mt-2 sm:mt-6 text-xs sm:text-lg leading-relaxed max-w-2xl">
                Explore premium courses, watch secure lectures,
                track progress, and build your future with
                our powerful LMS learning platform.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-5 w-full xl:max-w-2xl">
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl p-2.5 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-white text-black flex items-center justify-center mx-auto mb-1.5 sm:mb-5">
                  <Layers3 size={16} className="sm:w-7 sm:h-7" />
                </div>
                <p className="text-zinc-300 text-[9px] sm:text-sm">Total Courses</p>
                <AnimatedCounter target={totalCourses} />
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl p-2.5 sm:p-6 text-center">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-green-500 text-white flex items-center justify-center mx-auto mb-1.5 sm:mb-5">
                  <CheckCircle2 size={16} className="sm:w-7 sm:h-7" />
                </div>
                <p className="text-zinc-300 text-[9px] sm:text-sm">Active Courses</p>
                <AnimatedCounter target={activeCourses} />
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl p-2.5 sm:p-6 text-center col-span-2 sm:col-span-1">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-yellow-500 text-white flex items-center justify-center mx-auto mb-1.5 sm:mb-5">
                  <AlertCircle size={16} className="sm:w-7 sm:h-7" />
                </div>
                <p className="text-zinc-300 text-[9px] sm:text-sm">Pending</p>
                <AnimatedCounter target={pendingCourses} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-5 mb-6 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-black">
              Explore Courses
            </h2>
            <p className="text-zinc-600 text-xs sm:text-base mt-0.5 sm:mt-2">
              {processedCourses.length} courses available
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 sm:h-12 pl-8 sm:pl-10 pr-3 rounded-xl border border-zinc-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all text-xs sm:text-sm"
              />
            </div>

            {/* Category Filter */}
            {/* <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-36 h-9 sm:h-12 pl-8 sm:pl-10 pr-3 rounded-xl border border-zinc-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all text-xs sm:text-sm appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 sm:h-12 px-3 rounded-xl border border-zinc-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all text-xs sm:text-sm"
              >
                <option value="title">Sort by Title</option>
                <option value="price">Sort by Price</option>
                <option value="duration">Sort by Duration</option>
              </select>
              <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="h-9 sm:h-12 px-3 rounded-xl border border-zinc-300 bg-white shadow-sm hover:bg-zinc-50 transition-all text-xs sm:text-sm"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-3xl p-2.5 sm:p-5 shadow-sm border border-zinc-200 animate-pulse"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-14 sm:h-14 bg-zinc-200 rounded-lg sm:rounded-2xl" />
                  <div className="w-12 h-4 sm:w-20 sm:h-7 bg-zinc-200 rounded-full" />
                </div>
                <div className="h-4 sm:h-6 bg-zinc-200 rounded mb-1.5" />
                <div className="h-2.5 bg-zinc-200 rounded mb-1" />
                <div className="h-2.5 bg-zinc-200 rounded mb-1" />
                <div className="h-2.5 bg-zinc-200 rounded w-2/3 mb-3 sm:mb-6" />
                <div className="h-7 sm:h-10 bg-zinc-300 rounded-lg sm:rounded-xl" />
              </div>
            ))}
          </div>
        ) : paginatedCourses.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-14 text-center border border-zinc-200 shadow-sm">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3 sm:mb-6">
              <BookOpen size={28} className="sm:w-10 sm:h-10 text-zinc-500" />
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-black">
              {search || filterCategory !== "all" ? "No Courses Found" : "No Courses Available"}
            </h2>
            <p className="text-zinc-500 mt-2 sm:mt-4 text-sm sm:text-lg">
              {search || filterCategory !== "all"
                ? "Try adjusting your filters or search terms."
                : "There are no courses available at the moment."}
            </p>
            {(search || filterCategory !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterCategory("all");
                }}
                className="mt-4 px-4 py-2 bg-black text-white rounded-xl hover:bg-zinc-800 transition text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Course Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5 lg:gap-7">
              {paginatedCourses.map((course) => {
                const enrollment = getEnrollment(course._id);
                return (
                  <div
                    key={course._id}
                    className="group bg-white rounded-xl sm:rounded-3xl border border-zinc-200 p-2.5 sm:p-5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 sm:hover:-translate-y-2 transition-all duration-200 sm:duration-300 flex flex-col overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
                        <GraduationCap size={16} className="sm:w-7 sm:h-7" />
                      </div>
                      {enrollment && (
                        <span
                          className={`px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold capitalize ${
                            enrollment.status === "active"
                              ? "bg-green-100 text-green-700"
                              : enrollment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {enrollment.status === "active"
                            ? "Active"
                            : enrollment.status === "pending"
                            ? "Pending"
                            : "Refund"}
                        </span>
                      )}
                    </div>

                    <h2 className="text-sm sm:text-xl md:text-2xl font-black text-black leading-tight line-clamp-2">
                      {course.title || "Untitled Course"}
                    </h2>

                    {course.category && (
                      <span className="inline-block mt-1 text-[8px] sm:text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full self-start">
                        {course.category}
                      </span>
                    )}

                    <p className="hidden sm:block text-zinc-600 mt-2 leading-relaxed text-xs sm:text-sm line-clamp-2">
                      {course.description || "No description available."}
                    </p>

                    <div className="mt-2 sm:mt-5 space-y-1.5 sm:space-y-3">
                      <div className="flex items-center gap-1.5 sm:gap-3 text-zinc-700">
                        <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-md bg-zinc-100 flex items-center justify-center">
                          <Clock3 size={10} className="sm:w-4 sm:h-4" />
                        </div>
                        <div>
                          <p className="text-[8px] sm:text-xs text-zinc-500">Duration</p>
                          <h4 className="font-bold text-[10px] sm:text-sm">
                            {course.duration || "N/A"}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-3 text-zinc-700">
                        <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-md bg-zinc-100 flex items-center justify-center">
                          <Wallet size={10} className="sm:w-4 sm:h-4" />
                        </div>
                        <div>
                          <p className="text-[8px] sm:text-xs text-zinc-500">Price</p>
                          <h4 className="font-bold text-[10px] sm:text-sm">
                            {course.price || "Free"}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {enrollment ? (
                      <button
                        disabled
                        className={`mt-3 sm:mt-6 w-full py-1.5 sm:py-3 rounded-lg sm:rounded-2xl font-bold cursor-not-allowed text-[10px] sm:text-sm ${
                          enrollment.status === "active"
                            ? "bg-green-600 text-white"
                            : enrollment.status === "pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {enrollment.status === "active"
                          ? "Enrolled"
                          : enrollment.status === "pending"
                          ? "Pending"
                          : "Refunded"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="mt-3 sm:mt-6 w-full bg-black text-white py-1.5 sm:py-3 rounded-lg sm:rounded-2xl font-bold hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-sm"
                      >
                        Enroll Now
                        <ArrowRight size={10} className="sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-xl bg-white border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50 transition disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                </button>
                <span className="text-xs sm:text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-xl bg-white border border-zinc-200 disabled:opacity-40 hover:bg-zinc-50 transition disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= PAYMENT MODAL ================= */}
      {selectedCourse && (
        <UserPayment
          course={selectedCourse}
          userId={userId}
          onClose={() => {
            setSelectedCourse(null);
            fetchEnrollments();
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard;