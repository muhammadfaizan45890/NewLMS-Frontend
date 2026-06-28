import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../utils/api";
import { getData } from "@/context/userContext";

import {
  Wallet,
  GraduationCap,
  BadgeDollarSign,
  CircleAlert,
  Send,
  CheckCircle2,
  Clock3,
  Search,
  Sparkles,
  FileText,
} from "lucide-react";

const RefundRequest = () => {
  const { user } = getData();
  const userId = user?._id || user?.id || localStorage.getItem("userId");

  // ================= STATES =================
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);

  // ================= FETCH ALL ENROLLED COURSES =================
  const fetchCourses = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API}/enroll/my-courses/${userId}`);
      // ✅ Get ALL enrolled courses, not just active ones
      const allCourses = Array.isArray(res.data) ? res.data : [];
      setCourses(allCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH REQUESTS =================
  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API}/refund/user/${userId}`);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching refund requests:", error);
      setRequests([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCourses();
      fetchRequests();
    }
  }, [userId]);

  // ================= SUBMIT REFUND =================
  const submitRefund = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !reason) {
      alert("Please fill all fields");
      return;
    }
    const alreadyApplied = requests.some(
      (req) => req.courseId === selectedCourse && req.status !== "rejected"
    );
    if (alreadyApplied) {
      alert("You have already applied for refund for this course.");
      return;
    }
    try {
      setSubmitting(true);
      await axios.post(`${API}/refund/create`, {
        userId,
        courseId: selectedCourse,
        reason,
      });
      alert("Refund request submitted successfully");
      setSelectedCourse("");
      setReason("");
      fetchRequests(); // refresh list
    } catch (error) {
      console.error("Error submitting refund:", error);
      alert("Failed to submit refund request");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= HANDLE MISSING USER =================
  if (!userId && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-black">Please Login</h2>
          <p className="text-zinc-600 mt-2">
            You need to be logged in to request a refund.
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

  return (
    <div className="min-h-screen bg-zinc-100 overflow-hidden">
      {/* HERO */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 border border-white/10 backdrop-blur-xl px-2.5 py-1 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-sm mb-4 sm:mb-8">
              <Sparkles size={12} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Student Support & Refund Center</span>
              <span className="xs:hidden">Refund Center</span>
            </div>
            <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Refund Requests
              <span className="block text-zinc-400 mt-1 sm:mt-2">Fast & Secure Refund System</span>
            </h1>
            <p className="mt-3 sm:mt-8 text-zinc-300 text-sm sm:text-lg leading-relaxed max-w-2xl">
              Submit refund requests for any enrolled course and track approval status.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-10">
          {/* LEFT – Refund Form */}
          <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[35px] p-4 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-black text-white flex items-center justify-center">
                <Wallet size={20} className="sm:w-[30px] sm:h-[30px]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-black">Request Refund</h2>
                <p className="text-zinc-500 text-xs sm:text-base mt-0.5 sm:mt-1">Fill the form below to contact admin</p>
              </div>
            </div>

            <form onSubmit={submitRefund} className="space-y-4 sm:space-y-6">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 block mb-2 sm:mb-3">
                  Select Course
                </label>
                <div className="relative">
                  <GraduationCap size={14} className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full h-10 sm:h-14 rounded-xl sm:rounded-2xl border border-zinc-200 bg-zinc-50 pl-9 sm:pl-14 pr-3 sm:pr-5 outline-none focus:border-black transition-all text-sm sm:text-base"
                  >
                    <option value="">Select an enrolled course</option>
                    {courses.map((item) => {
                      const title = item.courseId?.title || "Untitled Course";
                      const id = item.courseId?._id || item.courseId;
                      const status = item.status || "unknown";
                      return (
                        <option key={item._id} value={id}>
                          {title} ({status})
                        </option>
                      );
                    })}
                  </select>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  All enrolled courses are shown – you can request a refund for any of them.
                </p>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 block mb-2 sm:mb-3">
                  Refund Reason
                </label>
                <div className="relative">
                  <FileText size={14} className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-5 top-3 sm:top-5 text-zinc-500" />
                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why you want a refund..."
                    className="w-full rounded-2xl sm:rounded-3xl border border-zinc-200 bg-zinc-50 pl-9 sm:pl-14 pr-3 sm:pr-5 py-3 sm:py-5 outline-none resize-none focus:border-black transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-start gap-2 sm:gap-4">
                <CircleAlert size={18} className="sm:w-[22px] sm:h-[22px] text-yellow-600 mt-0.5 sm:mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-700 text-sm sm:text-base">Important Notice</h3>
                  <p className="text-xs sm:text-sm text-yellow-600 mt-1 leading-relaxed">
                    Refund approval depends on admin review and refund policy.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-10 sm:h-14 rounded-xl sm:rounded-2xl bg-black hover:bg-zinc-800 text-white font-semibold flex items-center justify-center gap-2 sm:gap-3 transition-all disabled:opacity-50 text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <Clock3 size={14} className="sm:w-5 sm:h-5" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} className="sm:w-5 sm:h-5" />
                    Submit Refund Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT – My Requests */}
          <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[35px] p-4 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-black">My Requests</h2>
                <p className="text-zinc-500 text-xs sm:text-base mt-0.5 sm:mt-2">Track all submitted refund requests</p>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center">
                <Search size={18} className="sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-5">
              {requests.length === 0 ? (
                <div className="border border-dashed border-zinc-300 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center">
                  <BadgeDollarSign size={32} className="sm:w-12 sm:h-12 mx-auto text-zinc-400" />
                  <h3 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-5">No Refund Requests</h3>
                  <p className="text-zinc-500 text-sm sm:text-base mt-2 sm:mt-3">
                    Your submitted refund requests will appear here.
                  </p>
                </div>
              ) : (
                requests.map((item) => (
                  <div
                    key={item._id}
                    className="border border-zinc-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-5">
                      <div>
                        <h3 className="text-base sm:text-xl font-bold text-black">
                          {item.courseTitle || "Course"}
                        </h3>
                        <p className="text-zinc-500 text-xs sm:text-base mt-2 sm:mt-3 leading-relaxed">
                          {item.reason}
                        </p>
                      </div>
                      <div
                        className={`
                          px-2 py-0.5 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-sm font-bold
                          ${
                            item.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : item.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        `}
                      >
                        {item.status || "pending"}
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-5 flex items-center gap-2 sm:gap-3 text-zinc-500 text-[10px] sm:text-sm">
                      <Clock3 size={12} className="sm:w-4 sm:h-4" />
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                    </div>

                    {item.status === "approved" && (
                      <div className="mt-3 sm:mt-5 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                        <CheckCircle2 size={14} className="sm:w-5 sm:h-5 text-green-600" />
                        <p className="text-green-700 text-xs sm:text-sm font-medium">
                          Your refund request has been approved.
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundRequest;