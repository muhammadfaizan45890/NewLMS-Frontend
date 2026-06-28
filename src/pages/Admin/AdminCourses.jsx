import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Clock3,
  Trash2,
  Plus,
  Loader2,
  GraduationCap,
  Search,
  Sparkles,
  BadgeCheck,
  DollarSign,
} from "lucide-react";
import API from "../../utils/api";

const AdminCourses = () => {
  // ================= STATES =================
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/courses`);
      setCourses(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= ADD COURSE =================
  const addCourse = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await axios.post(`${API}/admin/course`, form);
      setForm({ title: "", description: "", duration: "", price: "" });
      fetchCourses();
    } catch (error) {
      console.log(error);
      alert("Failed to add course");
    } finally {
      setCreating(false);
    }
  };

  // ================= DELETE COURSE =================
  const deleteCourse = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this course?"
      );
      if (!confirmDelete) return;
      setDeletingId(id);
      await axios.delete(`${API}/admin/course/${id}`);
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= FILTER COURSES =================
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-100 p-3 sm:p-6 lg:p-10">
      {/* ================= TOP HEADER ================= */}
      <div className="mb-6 sm:mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            <Sparkles size={14} />
            LMS Admin Panel
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-black">
            Course Management
          </h1>
          <p className="text-zinc-600 mt-2 text-sm sm:text-base lg:text-lg">
            Create, manage, and delete LMS courses easily.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-xs sm:text-sm">Total Courses</p>
                <h2 className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2">
                  {courses.length}
                </h2>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center">
                <BookOpen size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-xs sm:text-sm">Active System</p>
                <h2 className="text-xl sm:text-2xl font-black text-green-600 mt-1 sm:mt-2">
                  Running
                </h2>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-green-600 text-white flex items-center justify-center">
                <BadgeCheck size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ADD COURSE FORM ================= */}
      <div className="bg-white rounded-2xl sm:rounded-[35px] border border-zinc-200 shadow-sm overflow-hidden mb-6 sm:mb-10">
        {/* HEADER */}
        <div className="bg-black px-4 sm:px-6 lg:px-10 py-5 sm:py-8 text-white">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white text-black flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-black">Add New Course</h2>
              <p className="text-zinc-300 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Create a new course for students
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={addCourse} className="p-4 sm:p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* TITLE */}
            <div>
              <label className="text-xs sm:text-sm font-semibold text-zinc-700 block mb-1 sm:mb-2">
                Course Title
              </label>
              <input
                type="text"
                placeholder="Enter course title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full h-11 sm:h-14 rounded-xl sm:rounded-2xl border border-zinc-300 px-4 sm:px-5 outline-none focus:ring-2 focus:ring-black transition text-sm sm:text-base"
                required
              />
            </div>

            {/* DURATION */}
            <div>
              <label className="text-xs sm:text-sm font-semibold text-zinc-700 block mb-1 sm:mb-2">
                Course Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 6 Months"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full h-11 sm:h-14 rounded-xl sm:rounded-2xl border border-zinc-300 px-4 sm:px-5 outline-none focus:ring-2 focus:ring-black transition text-sm sm:text-base"
                required
              />
            </div>

            {/* PRICE */}
            <div className="lg:col-span-2">
              <label className="text-xs sm:text-sm font-semibold text-zinc-700 block mb-1 sm:mb-2">
                Course Price
              </label>
              <div className="relative">
                <DollarSign
                  size={16}
                  className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="number"
                  placeholder="Enter course price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full h-11 sm:h-14 rounded-xl sm:rounded-2xl border border-zinc-300 pl-9 sm:pl-12 pr-4 sm:pr-5 outline-none focus:ring-2 focus:ring-black transition text-sm sm:text-base"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="lg:col-span-2">
              <label className="text-xs sm:text-sm font-semibold text-zinc-700 block mb-1 sm:mb-2">
                Course Description
              </label>
              <textarea
                rows={4}
                placeholder="Write course description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl sm:rounded-3xl border border-zinc-300 p-3 sm:p-5 outline-none resize-none focus:ring-2 focus:ring-black transition text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={creating}
            className="mt-5 sm:mt-8 h-11 sm:h-14 px-5 sm:px-8 rounded-xl sm:rounded-2xl bg-black text-white font-bold flex items-center justify-center gap-2 sm:gap-3 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all disabled:opacity-60 w-full sm:w-fit text-sm sm:text-base"
          >
            {creating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Course
              </>
            )}
          </button>
        </form>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-sm mb-5 sm:mb-8">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 sm:h-14 rounded-xl sm:rounded-2xl border border-zinc-300 pl-9 sm:pl-12 pr-4 sm:pr-5 outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
          />
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {loading ? (
        <div className="flex items-center justify-center py-16 sm:py-24">
          <div className="flex flex-col items-center gap-3 sm:gap-5">
            <Loader2 size={36} className="animate-spin text-black" />
            <h2 className="text-xl sm:text-2xl font-bold">Loading Courses...</h2>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 p-8 sm:p-16 text-center shadow-sm">
          <BookOpen size={48} className="mx-auto text-zinc-400 mb-3 sm:mb-5" />
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            No Courses Found
          </h2>
          <p className="text-zinc-500 mt-2 text-sm sm:text-base">
            Create your first LMS course now.
          </p>
        </div>
      ) : (
        /* ================= COURSE GRID ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl sm:rounded-[35px] border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300"
            >
              {/* TOP */}
              <div className="bg-black p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white text-black flex items-center justify-center">
                    <GraduationCap size={22} />
                  </div>
                  <div className="bg-white/10 border border-white/20 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm">
                    LMS Course
                  </div>
                </div>
                <h2 className="text-xl sm:text-3xl font-black mt-4 sm:mt-6 line-clamp-2">
                  {course.title}
                </h2>
              </div>

              {/* BODY */}
              <div className="p-4 sm:p-6">
                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 min-h-[80px] sm:min-h-[110px]">
                  {course.description}
                </p>

                {/* INFO */}
                <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-6">
                  <div className="flex items-center gap-2 sm:gap-3 text-zinc-700 text-sm sm:text-base">
                    <Clock3 size={16} />
                    <span className="font-medium">Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-zinc-700 text-sm sm:text-base">
                    <DollarSign size={16} />
                    <span className="font-medium">Price: {course.price || 0}</span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-5 sm:mt-8">
                  <button
                    onClick={() => deleteCourse(course._id)}
                    disabled={deletingId === course._id}
                    className="w-full h-10 sm:h-13 rounded-xl sm:rounded-2xl bg-red-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition disabled:opacity-60 text-sm sm:text-base"
                  >
                    {deletingId === course._id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Course
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCourses;