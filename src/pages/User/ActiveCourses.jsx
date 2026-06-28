import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { getData } from "@/context/userContext";

import {
  BookOpen,
  Clock3,
  DollarSign,
  PlayCircle,
  CheckCircle2,
  ArrowLeft,
  Layers3,
  CalendarDays,
  Sparkles,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ─── Custom Hooks ────────────────────────────────────────

const useWatchedModules = () => {
  const [watched, setWatched] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("watchedModules")) || [];
    } catch {
      return [];
    }
  });

  const markWatched = useCallback((moduleId) => {
    setWatched((prev) => {
      if (prev.includes(moduleId)) return prev;
      const updated = [...prev, moduleId];
      localStorage.setItem("watchedModules", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { watched, markWatched };
};

const useActiveCourses = (userId) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API}/enroll/my-courses/${userId}`);
        const enrollments = Array.isArray(res.data) ? res.data : [];
        const active = enrollments.filter((item) => item.status === "active");
        setCourses(active);
      } catch (err) {
        console.error("Fetch enrollments error:", err);
        setError(err.message || "Failed to load courses");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  return { courses, loading, error };
};

const useCourseDetails = () => {
  const [selected, setSelected] = useState(false);
  const [courseData, setCourseData] = useState(null);

  const openCourse = useCallback(async (courseId) => {
    const id = typeof courseId === "object" ? courseId._id : courseId;
    if (!id) return;

    try {
      const [courseRes, moduleRes] = await Promise.all([
        axios.get(`${API}/admin/course/${id}`),
        axios.get(`${API}/api/modules/course/${id}`),
      ]);

      setCourseData({
        ...courseRes.data,
        modules: Array.isArray(moduleRes.data) ? moduleRes.data : [],
      });
      setSelected(true);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }, []);

  const closeCourse = useCallback(() => {
    setSelected(false);
    setCourseData(null);
  }, []);

  return { selected, courseData, openCourse, closeCourse };
};

// ─── Reusable Sub‑Components ────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl sm:rounded-[32px] border border-zinc-200/80 shadow-sm overflow-hidden animate-pulse">
    <div className="h-40 bg-zinc-200" />
    <div className="p-4 sm:p-6 space-y-4">
      <div className="h-6 bg-zinc-200 rounded w-3/4" />
      <div className="h-4 bg-zinc-200 rounded w-1/2" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 bg-zinc-200 rounded-xl" />
        <div className="h-12 bg-zinc-200 rounded-xl" />
      </div>
      <div className="h-10 bg-zinc-200 rounded-xl" />
    </div>
  </div>
);

const EmptyState = ({ icon, title, description, action }) => (
  <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 p-6 sm:p-10 lg:p-16 text-center max-w-2xl mx-auto">
    <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">{icon}</div>
    <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">{title}</h2>
    <p className="text-zinc-500 text-sm sm:text-base mt-2 sm:mt-4 max-w-xl mx-auto">
      {description}
    </p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 transition-all text-sm sm:text-base"
      >
        {action.label}
      </button>
    )}
  </div>
);

// ─── Main Component ──────────────────────────────────────

const ActiveCourses = () => {
  const { user } = getData();
  const navigate = useNavigate();
  const userId = user?._id || user?.id || localStorage.getItem("userId");

  const { courses, loading, error } = useActiveCourses(userId);
  const { watched, markWatched } = useWatchedModules();
  const { selected, courseData, openCourse, closeCourse } = useCourseDetails();

  const handleWatchVideo = (module) => {
    markWatched(module._id);
    navigate("/video", { state: { youtubeUrl: module.youtubeUrl } });
  };

  // ─── Not logged in ─────────────────────────────────────
  if (!userId && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-black">Please Login</h2>
          <p className="text-zinc-600 mt-2">
            You need to be logged in to view your active courses.
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

  // ─── Course Detail View ───────────────────────────────
  if (selected && courseData) {
    const modules = courseData.modules || [];
    const totalModules = modules.length;
    const watchedCount = modules.filter((m) => watched.includes(m._id)).length;
    const progress = totalModules > 0 ? Math.round((watchedCount / totalModules) * 100) : 0;

    return (
      <div className="min-h-screen bg-zinc-100">
        {/* Hero */}
        <div className="relative overflow-hidden bg-black text-white">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_35%)]" />
          <div className="relative px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-14">
            <button
              onClick={closeCourse}
              className="flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl transition-all backdrop-blur-md text-sm sm:text-base"
            >
              <ArrowLeft size={14} className="sm:w-[18px] sm:h-[18px]" />
              Back To Courses
            </button>

            <div className="mt-6 sm:mt-10 flex flex-col xl:flex-row gap-6 sm:gap-10 items-start justify-between">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm mb-3 sm:mb-6">
                  <Sparkles size={12} className="sm:w-4 sm:h-4" />
                  <span>Premium Learning Experience</span>
                </div>
                <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/10 flex items-center justify-center mb-4 sm:mb-6 backdrop-blur-md">
                  <BookOpen size={24} className="sm:w-10 sm:h-10" />
                </div>
                <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black leading-tight">
                  {courseData.title}
                </h1>
                <p className="mt-3 sm:mt-6 text-zinc-300 text-sm sm:text-lg leading-relaxed max-w-3xl">
                  {courseData.description}
                </p>
              </div>

              <div className="w-full xl:w-[300px] bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6">
                <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-6">Course Info</h3>
                <div className="space-y-3 sm:space-y-5">
                  <InfoRow icon={<Clock3 size={14} className="sm:w-[18px] sm:h-[18px]" />} label="Duration" value={courseData.duration || "N/A"} />
                  <InfoRow icon={<DollarSign size={14} className="sm:w-[18px] sm:h-[18px]" />} label="Price" value={courseData.price || "Free"} />
                  <InfoRow icon={<Layers3 size={14} className="sm:w-[18px] sm:h-[18px]" />} label="Modules" value={totalModules} />
                  <InfoRow icon={<CheckCircle2 size={14} className="sm:w-[18px] sm:h-[18px] text-green-400" />} label="Progress" value={`${progress}%`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
          <div className="flex items-center justify-between mb-5 sm:mb-8 flex-wrap gap-3 sm:gap-4">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-zinc-900">Course Modules</h2>
              <p className="text-zinc-500 text-xs sm:text-base mt-1">Watch lectures and continue learning</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-5 sm:py-3 shadow-sm">
              <p className="text-[10px] sm:text-sm text-zinc-500">Progress</p>
              <h3 className="text-lg sm:text-2xl font-bold text-black">{watchedCount}/{totalModules}</h3>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-5">
            {modules.length > 0 ? (
              modules.map((m, i) => {
                const isWatched = watched.includes(m._id);
                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 p-3 sm:p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`
                            min-w-[40px] sm:min-w-[60px] h-[40px] sm:h-[60px]
                            rounded-xl sm:rounded-2xl flex items-center justify-center
                            text-sm sm:text-lg font-bold
                            ${isWatched ? "bg-green-600 text-white" : "bg-black text-white"}
                          `}
                        >
                          {isWatched ? <CheckCircle size={18} className="sm:w-7 sm:h-7" /> : i + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <h3 className="text-sm sm:text-xl font-bold text-zinc-900">{m.title}</h3>
                            {isWatched ? (
                              <span className="bg-green-100 text-green-700 text-[9px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-semibold">
                                Watched
                              </span>
                            ) : (
                              <span className="bg-zinc-100 text-zinc-600 text-[9px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-semibold">
                                Not Watched
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-500 text-xs sm:text-base mt-1 sm:mt-2 leading-relaxed line-clamp-2">
                            {m.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleWatchVideo(m)}
                        className={`
                          flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-4
                          rounded-xl sm:rounded-2xl transition-all w-full lg:w-auto text-sm sm:text-base
                          ${isWatched ? "bg-green-600 hover:bg-green-700 text-white" : "bg-black hover:bg-zinc-800 text-white"}
                        `}
                      >
                        {isWatched ? (
                          <>
                            <CheckCircle2 size={14} className="sm:w-5 sm:h-5" />
                            Watched
                          </>
                        ) : (
                          <>
                            <PlayCircle size={14} className="sm:w-5 sm:h-5" />
                            Watch Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon="📂"
                title="No Modules Available"
                description="Admin has not uploaded modules for this course yet."
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Main List View ────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-100 overflow-x-hidden">
      {/* Hero */}
      <div className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_35%)]" />
        <div className="relative px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-14">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm mb-3 sm:mb-6">
              <Sparkles size={12} className="sm:w-4 sm:h-4" />
              Continue Your Learning Journey
            </div>
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black leading-tight">Active Courses</h1>
            <p className="text-zinc-300 mt-3 sm:mt-5 text-sm sm:text-base lg:text-lg max-w-2xl">
              Access your enrolled courses, continue learning, and watch premium modules anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon="⚠️"
            title="Something Went Wrong"
            description={error || "Failed to load your courses. Please try again later."}
            action={{
              label: "Retry",
              onClick: () => window.location.reload(),
            }}
          />
        ) : courses.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No Active Courses"
            description="Once admin approves your enrollment request, your active courses will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {courses.map((item) => {
              const course = item.courseId || {};
              const courseTitle = course.title || "Untitled Course";
              const courseDesc = course.description || "No description";
              const courseDuration = course.duration || "N/A";
              const coursePrice = course.price || "Free";
              const courseModules = course.modules || [];
              const courseId = course._id || course;

              const totalModules = courseModules.length;
              const watchedCount = courseModules.filter((m) => watched.includes(m._id)).length;
              const progress = totalModules > 0 ? Math.round((watchedCount / totalModules) * 100) : 0;

              return (
                <div
                  key={item._id}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-zinc-200/80 bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2"
                >
                  <div className="absolute -top-20 -right-20 w-40 sm:w-52 h-40 sm:h-52 bg-zinc-300/20 blur-3xl rounded-full" />

                  {/* Card Header */}
                  <div className="relative bg-gradient-to-br from-black via-zinc-900 to-zinc-800 p-4 sm:p-8 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_35%)]" />
                    <div className="absolute top-3 right-3 sm:top-5 sm:right-5">
                      <div className="flex items-center gap-1 sm:gap-2 bg-green-500/20 border border-green-500/30 text-green-300 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-md">
                        <CheckCircle2 size={10} className="sm:w-3.5 sm:h-3.5" />
                        Active
                      </div>
                    </div>
                    <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl">
                      <BookOpen size={24} className="relative text-white sm:w-10 sm:h-10" strokeWidth={2.2} />
                    </div>
                    <div className="relative mt-3 sm:mt-6">
                      <h2 className="text-lg sm:text-2xl font-black text-white leading-tight line-clamp-2">
                        {courseTitle}
                      </h2>
                      <p className="mt-2 sm:mt-4 text-zinc-300 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {courseDesc}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 sm:p-6">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="rounded-xl sm:rounded-2xl border border-zinc-200 bg-zinc-50 p-2 sm:p-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-zinc-500 text-[9px] sm:text-sm mb-1 sm:mb-2">
                          <Clock3 size={10} className="sm:w-4 sm:h-4" />
                          Duration
                        </div>
                        <h3 className="font-bold text-zinc-900 text-xs sm:text-lg">{courseDuration}</h3>
                      </div>
                      <div className="rounded-xl sm:rounded-2xl border border-zinc-200 bg-zinc-50 p-2 sm:p-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-zinc-500 text-[9px] sm:text-sm mb-1 sm:mb-2">
                          <DollarSign size={10} className="sm:w-4 sm:h-4" />
                          Price
                        </div>
                        <h3 className="font-bold text-zinc-900 text-xs sm:text-lg">{coursePrice}</h3>
                      </div>
                      <div className="col-span-2 rounded-xl sm:rounded-2xl border border-zinc-200 bg-zinc-50 p-2 sm:p-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-zinc-500 text-[9px] sm:text-sm mb-1 sm:mb-2">
                          <CalendarDays size={10} className="sm:w-4 sm:h-4" />
                          Enrolled On
                        </div>
                        <h3 className="font-bold text-zinc-900 text-xs sm:text-base">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                        </h3>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 sm:mt-6">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500 mb-1">
                        <span>Progress</span>
                        <span className="font-bold text-zinc-900">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => openCourse(courseId)}
                        className="flex-1 bg-black hover:bg-zinc-800 text-white py-2 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-base font-semibold transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:shadow-black/20"
                      >
                        <PlayCircle size={14} className="sm:w-5 sm:h-5" />
                        Continue Learning
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Helper Components ──────────────────────────────────

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 sm:gap-3">
      {icon}
      <span className="text-sm sm:text-base">{label}</span>
    </div>
    <span className="font-semibold text-sm sm:text-base">{value}</span>
  </div>
);

export default ActiveCourses;