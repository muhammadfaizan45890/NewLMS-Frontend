import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added import
import axios from "axios";
import { getData } from "@/context/userContext";
import API from "../../utils/api";

import {
  FileText,
  Download,
  BookOpen,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ─── Skeleton loader ──────────────────────────────────────
const NoteSkeleton = () => (
  <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm animate-pulse">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
    </div>
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4" />
    <div className="space-y-2 mb-6">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
    </div>
    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
  </div>
);

// ─── Main Component ──────────────────────────────────────
const Notes = () => {
  const { user } = getData();
  const navigate = useNavigate();
  const userId = user?._id || user?.id || localStorage.getItem("userId");

  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ─── Fetch all data ─────────────────────────────────────
  const fetchData = useCallback(
    async (showRefreshing = false) => {
      if (!userId) {
        setLoading(false);
        setError("Please login to access your notes.");
        return;
      }

      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      setError(null);

      try {
        // 1. Get active courses
        const coursesRes = await axios.get(`${API}/enroll/my-courses/${userId}`);
        const enrolled = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        const activeCourses = enrolled.filter((c) => c.status === "active");
        setCourses(activeCourses);

        // 2. Fetch notes for each course
        let allNotes = [];
        for (const course of activeCourses) {
          const courseId = course.courseId?._id || course.courseId;
          if (!courseId) continue;

          try {
            const notesRes = await axios.get(
              `${API}/notes/course/${courseId}/${userId}`
            );
            if (Array.isArray(notesRes.data)) {
              allNotes = [...allNotes, ...notesRes.data];
            }
          } catch (noteErr) {
            console.warn(`Notes fetch failed for course ${courseId}:`, noteErr);
          }
        }
        setNotes(allNotes);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load your notes.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Handle refresh ─────────────────────────────────────
  const handleRefresh = () => {
    fetchData(true);
  };

  // ─── Not logged in ──────────────────────────────────────
  if (!userId && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-4">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-lg text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-gray-600 dark:text-gray-300" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You need to be logged in to view your notes.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 py-6 sm:px-6 lg:px-8">
      {/* ─── Header ─── */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
            <FileText className="w-6 h-6 text-white dark:text-black" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-white">
              Course Notes
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {notes.length} note{notes.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <NoteSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-black text-black dark:text-white mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-6 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition"
            >
              Try Again
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h2 className="text-2xl font-black text-black dark:text-white">
              No Notes Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
              {courses.length > 0
                ? "Your active courses don't have notes uploaded yet."
                : "You don't have any active courses. Enroll in a course to see notes."}
            </p>
            {courses.length === 0 && (
              <button
                onClick={() => navigate("/courses")}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition"
              >
                Browse Courses
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-black dark:text-white flex-shrink-0 mt-1" />
                  <h3 className="font-bold text-lg text-black dark:text-white line-clamp-2">
                    {note.title || "Untitled Note"}
                  </h3>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {note.courseId?.title || "Course"}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-1 line-clamp-3">
                  {note.description || "No description provided."}
                </p>

                {note.pdf ? (
                  <a
                    href={`${API}/files/notes/${note.pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                  >
                    <Download className="w-4 h-4" />
                    View PDF
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-2xl cursor-not-allowed">
                    <FileText className="w-4 h-4" />
                    No PDF
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;