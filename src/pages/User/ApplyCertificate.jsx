import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import API from "../../utils/api";

import {
  Award,
  GraduationCap,
  Clock3,
  Sparkles,
  FileText,
  Send,
  Search,
  ShieldCheck,
  Download,
  BadgeCheck,
} from "lucide-react";

const ApplyCertificate = () => {
  // ================= STATES =================
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applications, setApplications] = useState([]);
  const [userId, setUserId] = useState(null);

  // ================= GET USER ID =================
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (userData && token) {
      try {
        const user = JSON.parse(userData);
        setUserId(user._id || user.id);
      } catch {
        setUserId(null);
      }
    } else {
      toast.warning("Please log in to view your certificates.");
    }
  }, []);

  // ================= FETCH COURSES =================
  const fetchCourses = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API}/enroll/my-courses/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enrollments = res.data?.data || res.data || [];
      // Filter courses with status 'active' or 'completed' (adjust to your backend)
      const completedCourses = enrollments.filter(
        (item) => item.status === "active" || item.status === "completed"
      );
      setCourses(completedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load your courses. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ================= FETCH APPLICATIONS =================
  const fetchApplications = useCallback(async () => {
    if (!userId) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API}/certificate/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const apps = res.data?.data || [];
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load your applications.");
    }
  }, [userId]);

  // ================= INITIAL LOAD =================
  useEffect(() => {
    if (userId) {
      fetchCourses();
      fetchApplications();
    }
  }, [userId, fetchCourses, fetchApplications]);

  // ================= APPLY =================
  const applyCertificate = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    if (!selectedCourse) {
      toast.error("Please select a course.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a request message.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${API}/certificate/apply`,
        {
          userId,
          courseId: selectedCourse,
          message: message.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Application submitted!");
        setSelectedCourse("");
        setMessage("");
        // Refresh the list
        await fetchApplications();
      } else {
        toast.error(res.data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Apply error:", error);
      const errMsg =
        error.response?.data?.message ||
        "Course time isn't completed yet. Contact admin.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-zinc-100 overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 border border-white/10 backdrop-blur-xl px-2.5 py-1 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-sm mb-4 sm:mb-8">
              <Sparkles size={12} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Professional Certificate System</span>
              <span className="xs:hidden">Certificate</span>
            </div>
            <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Apply For Certificate
              <span className="block text-zinc-400 mt-1 sm:mt-2">
                Get Your Official Learning Certificate
              </span>
            </h1>
            <p className="mt-3 sm:mt-8 text-zinc-300 text-sm sm:text-lg leading-relaxed max-w-2xl">
              Submit your certificate request after course completion
              and track approval status directly from your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-10">
          {/* LEFT SIDE – Certificate Request Form */}
          <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[35px] p-4 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-black text-white flex items-center justify-center">
                <Award size={20} className="sm:w-[30px] sm:h-[30px]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-black">Certificate Request</h2>
                <p className="text-zinc-500 text-xs sm:text-base mt-0.5 sm:mt-1">
                  Apply for your course completion certificate
                </p>
              </div>
            </div>

            <form onSubmit={applyCertificate} className="space-y-4 sm:space-y-6">
              {/* COURSE SELECT */}
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
                    disabled={loading || !userId}
                  >
                    <option value="">Select completed course</option>
                    {courses.length > 0 ? (
                      courses.map((item) => (
                        <option key={item._id} value={item.courseId?._id}>
                          {item.courseId?.title || "Untitled Course"}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No completed courses found</option>
                    )}
                  </select>
                </div>
                {loading && <p className="text-xs text-zinc-400 mt-1">Loading courses...</p>}
                {!userId && <p className="text-xs text-red-500 mt-1">Please log in to see your courses.</p>}
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 block mb-2 sm:mb-3">
                  Application Message
                </label>
                <div className="relative">
                  <FileText size={14} className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-5 top-3 sm:top-5 text-zinc-500" />
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your certificate request..."
                    className="w-full rounded-2xl sm:rounded-3xl border border-zinc-200 bg-zinc-50 pl-9 sm:pl-14 pr-3 sm:pr-5 py-3 sm:py-5 outline-none resize-none focus:border-black transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* INFO CARD */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-3xl p-3 sm:p-5 flex items-start gap-2 sm:gap-4">
                <ShieldCheck size={18} className="sm:w-6 sm:h-6 text-black mt-0.5 sm:mt-1" />
                <div>
                  <h3 className="font-bold text-black text-sm sm:text-base">Verification Process</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">
                    Admin will verify your course completion before approving the certificate request.
                  </p>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting || loading || !userId}
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
                    Apply For Certificate
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT SIDE – My Applications */}
          <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[35px] p-4 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-black">My Applications</h2>
                <p className="text-zinc-500 text-xs sm:text-base mt-0.5 sm:mt-2">
                  Track all certificate requests
                </p>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center">
                <Search size={18} className="sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-5">
              {applications.length === 0 ? (
                <div className="border border-dashed border-zinc-300 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center">
                  <Award size={32} className="sm:w-12 sm:h-12 mx-auto text-zinc-400" />
                  <h3 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-5">No Applications Yet</h3>
                  <p className="text-zinc-500 text-sm sm:text-base mt-2 sm:mt-3">
                    Your certificate applications will appear here.
                  </p>
                </div>
              ) : (
                applications.map((item) => (
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
                          {item.message}
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
                      <div className="mt-3 sm:mt-5 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <BadgeCheck size={16} className="sm:w-5 sm:h-5 text-green-600" />
                          <p className="text-green-700 text-xs sm:text-sm font-medium">
                            {item.certificateUrl
                              ? "Certificate ready for download."
                              : "Certificate approved, file will be uploaded shortly."}
                          </p>
                        </div>
                        {item.certificateUrl ? (
                          <a
                            href={item.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-9 sm:h-11 px-3 sm:px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all"
                          >
                            <Download size={12} className="sm:w-4 sm:h-4" />
                            Download
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-500 italic">Awaiting file</span>
                        )}
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

export default ApplyCertificate;







// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import API from "../../utils/api";

// import {
//   Award,
//   GraduationCap,
//   Clock3,
//   Sparkles,
//   FileText,
//   Send,
//   Search,
//   ShieldCheck,
//   Download,
//   BadgeCheck,
// } from "lucide-react";

// const ApplyCertificate = () => {
//   // ================= STATES =================
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [applications, setApplications] = useState([]);
//   const [userId, setUserId] = useState(null);

//   // ================= GET USER ID =================
//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     const token = localStorage.getItem("accessToken");
//     if (userData && token) {
//       try {
//         const user = JSON.parse(userData);
//         setUserId(user._id || user.id);
//       } catch {
//         setUserId(null);
//       }
//     } else {
//       toast.warning("Please log in to view your certificates.");
//     }
//   }, []);

//   // ================= FETCH COURSES =================
//   const fetchCourses = useCallback(async () => {
//     if (!userId) return;
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("accessToken");
//       const res = await axios.get(`${API}/enroll/my-courses/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const enrollments = res.data?.data || res.data || [];
//       // Filter courses with status 'active' or 'completed' (adjust to your backend)
//       const completedCourses = enrollments.filter(
//         (item) => item.status === "active" || item.status === "completed"
//       );
//       setCourses(completedCourses);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast.error("Failed to load your courses. Please refresh.");
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   // ================= FETCH APPLICATIONS =================
//   const fetchApplications = useCallback(async () => {
//     if (!userId) return;
//     try {
//       const token = localStorage.getItem("accessToken");
//       const res = await axios.get(`${API}/certificate/user/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const apps = res.data?.data || [];
//       setApplications(apps);
//     } catch (error) {
//       console.error("Error fetching applications:", error);
//       toast.error("Failed to load your applications.");
//     }
//   }, [userId]);

//   // ================= INITIAL LOAD =================
//   useEffect(() => {
//     if (userId) {
//       fetchCourses();
//       fetchApplications();
//     }
//   }, [userId, fetchCourses, fetchApplications]);

//   // ================= APPLY =================
//   const applyCertificate = async (e) => {
//     e.preventDefault();

//     if (!userId) {
//       toast.error("Please log in first.");
//       return;
//     }
//     if (!selectedCourse) {
//       toast.error("Please select a course.");
//       return;
//     }
//     if (!message.trim()) {
//       toast.error("Please write a request message.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem("accessToken");
//       const res = await axios.post(
//         `${API}/certificate/apply`,
//         {
//           userId,
//           courseId: selectedCourse,
//           message: message.trim(),
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         toast.success(res.data.message || "Application submitted!");
//         setSelectedCourse("");
//         setMessage("");
//         // Refresh the list
//         await fetchApplications();
//       } else {
//         toast.error(res.data.message || "Submission failed.");
//       }
//     } catch (error) {
//       console.error("Apply error:", error);
//       const errMsg =
//         error.response?.data?.message ||
//         "Course time isn't completed yet. Contact admin.";
//       toast.error(errMsg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ================= DOWNLOAD CERTIFICATE (mobile‑friendly) =================
//   const downloadCertificate = async (url) => {
//     try {
//       // Build absolute URL if needed
//       const fullUrl = url.startsWith("http") ? url : `${API}${url}`;
//       const response = await fetch(fullUrl, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });
//       if (!response.ok) throw new Error("Download failed");
//       const blob = await response.blob();
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       // Extract filename from URL or use default
//       const fileName = url.split("/").pop() || "certificate.pdf";
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(link.href);
//       toast.success("Download started!");
//     } catch (error) {
//       console.error("Download error:", error);
//       toast.error("Could not download certificate. Please try again.");
//     }
//   };

//   // ================= RENDER =================
//   return (
//     <div className="min-h-screen bg-zinc-100 overflow-hidden">
//       {/* ================= HERO ================= */}
//       <section className="relative bg-black text-white overflow-hidden">
//         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-16 lg:py-20">
//           <div className="max-w-4xl">
//             <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 border border-white/10 backdrop-blur-xl px-2.5 py-1 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-sm mb-4 sm:mb-8">
//               <Sparkles size={12} className="sm:w-4 sm:h-4" />
//               <span className="hidden xs:inline">Professional Certificate System</span>
//               <span className="xs:hidden">Certificate</span>
//             </div>
//             <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
//               Apply For Certificate
//               <span className="block text-zinc-400 mt-1 sm:mt-2">
//                 Get Your Official Learning Certificate
//               </span>
//             </h1>
//             <p className="mt-3 sm:mt-8 text-zinc-300 text-sm sm:text-lg leading-relaxed max-w-2xl">
//               Submit your certificate request after course completion
//               and track approval status directly from your dashboard.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ================= CONTENT ================= */}
//       <section className="relative px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-10">
//           {/* LEFT SIDE – Certificate Request Form */}
//           <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[35px] p-4 sm:p-8 shadow-sm">
//             <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
//               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-black text-white flex items-center justify-center">
//                 <Award size={20} className="sm:w-[30px] sm:h-[30px]" />
//               </div>
//               <div>
//                 <h2 className="text-xl sm:text-3xl font-black text-black">Certificate Request</h2>
//                 <p className="text-zinc-500 text-xs sm:text-base mt-0.5 sm:mt-1">
//                   Apply for your course completion certificate
//                 </p>
//               </div>
//             </div>

//             <form onSubmit={applyCertificate} className="space-y-4 sm:space-y-6">
//               {/* COURSE SELECT */}
//               <div>
//                 <label className="text-xs sm:text-sm font-semibold text-zinc-700 block mb-2 sm:mb-3">
//                   Select Course
//                 </label>
//                 <div className="relative">
//                   <GraduationCap size={14} className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
//                   <select
//                     value={selectedCourse}
//                     onChange={(e) => setSelectedCourse(e.target.value)}
//                     className="w-full h-10 sm:h-14 rounded-xl sm:rounded-2xl border border-zinc-200 bg-zinc-50 pl-9 sm:pl-14 pr-3 sm:pr-5 outline-none focus:border-black transition-all text-sm sm:text-base"
//                     disabled={loading || !userId}
//                   >
//                     <option value="">Select completed course</option>
//                     {courses.length > 0 ? (
//                       courses.map((item) => (
//                         <option key={item._id} value={item.courseId?._id}>
//                           {item.courseId?.title || "Untitled Course"}
//                         </option>
//                       ))
//                     ) : (
//                       <option value="" disabled>No completed courses found</option>
//                     )}
//                   </select>
//                 </div>
//                 {loading && <p className="text-xs text-zinc-400 mt-1">Loading courses...</p>}
//                 {!userId && <p className="text-xs text-red-500 mt-1">Please log in to see your courses.</p>}
//               </div>

//               {/* MESSAGE */}
//               <div>
//                 <label className="text-xs sm:text-sm font-semibold text-zinc-700 block mb-2 sm:mb-3">
//                   Application Message
//                 </label>
//                 <div className="relative">
//                   <FileText size={14} className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-5 top-3 sm:top-5 text-zinc-500" />
//                   <textarea
//                     rows={4}
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Write your certificate request..."
//                     className="w-full rounded-2xl sm:rounded-3xl border border-zinc-200 bg-zinc-50 pl-9 sm:pl-14 pr-3 sm:pr-5 py-3 sm:py-5 outline-none resize-none focus:border-black transition-all text-sm sm:text-base"
//                   />
//                 </div>
//               </div>

//               {/* INFO CARD */}
//               <div className="bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-3xl p-3 sm:p-5 flex items-start gap-2 sm:gap-4">
//                 <ShieldCheck size={18} className="sm:w-6 sm:h-6 text-black mt-0.5 sm:mt-1" />
//                 <div>
//                   <h3 className="font-bold text-black text-sm sm:text-base">Verification Process</h3>
//                   <p className="text-zinc-500 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">
//                     Admin will verify your course completion before approving the certificate request.
//                   </p>
//                 </div>
//               </div>

//               {/* SUBMIT BUTTON */}
//               <button
//                 type="submit"
//                 disabled={submitting || loading || !userId}
//                 className="w-full h-10 sm:h-14 rounded-xl sm:rounded-2xl bg-black hover:bg-zinc-800 text-white font-semibold flex items-center justify-center gap-2 sm:gap-3 transition-all disabled:opacity-50 text-sm sm:text-base"
//               >
//                 {submitting ? (
//                   <>
//                     <Clock3 size={14} className="sm:w-5 sm:h-5" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Send size={14} className="sm:w-5 sm:h-5" />
//                     Apply For Certificate
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* RIGHT SIDE – My Applications */}
//           <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[35px] p-4 sm:p-8 shadow-sm">
//             <div className="flex items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
//               <div>
//                 <h2 className="text-xl sm:text-3xl font-black text-black">My Applications</h2>
//                 <p className="text-zinc-500 text-xs sm:text-base mt-0.5 sm:mt-2">
//                   Track all certificate requests
//                 </p>
//               </div>
//               <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center">
//                 <Search size={18} className="sm:w-6 sm:h-6" />
//               </div>
//             </div>

//             <div className="space-y-3 sm:space-y-5">
//               {applications.length === 0 ? (
//                 <div className="border border-dashed border-zinc-300 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center">
//                   <Award size={32} className="sm:w-12 sm:h-12 mx-auto text-zinc-400" />
//                   <h3 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-5">No Applications Yet</h3>
//                   <p className="text-zinc-500 text-sm sm:text-base mt-2 sm:mt-3">
//                     Your certificate applications will appear here.
//                   </p>
//                 </div>
//               ) : (
//                 applications.map((item) => (
//                   <div
//                     key={item._id}
//                     className="border border-zinc-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
//                   >
//                     <div className="flex items-start justify-between gap-3 sm:gap-5">
//                       <div>
//                         <h3 className="text-base sm:text-xl font-bold text-black">
//                           {item.courseTitle || "Course"}
//                         </h3>
//                         <p className="text-zinc-500 text-xs sm:text-base mt-2 sm:mt-3 leading-relaxed">
//                           {item.message}
//                         </p>
//                       </div>
//                       <div
//                         className={`
//                           px-2 py-0.5 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-sm font-bold
//                           ${
//                             item.status === "approved"
//                               ? "bg-green-100 text-green-700"
//                               : item.status === "rejected"
//                               ? "bg-red-100 text-red-700"
//                               : "bg-yellow-100 text-yellow-700"
//                           }
//                         `}
//                       >
//                         {item.status || "pending"}
//                       </div>
//                     </div>

//                     <div className="mt-3 sm:mt-5 flex items-center gap-2 sm:gap-3 text-zinc-500 text-[10px] sm:text-sm">
//                       <Clock3 size={12} className="sm:w-4 sm:h-4" />
//                       {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
//                     </div>

//                     {item.status === "approved" && (
//                       <div className="mt-3 sm:mt-5 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//                         <div className="flex items-center gap-2 sm:gap-3">
//                           <BadgeCheck size={16} className="sm:w-5 sm:h-5 text-green-600" />
//                           <p className="text-green-700 text-xs sm:text-sm font-medium">
//                             {item.certificateUrl
//                               ? "Certificate ready for download."
//                               : "Certificate approved, file will be uploaded shortly."}
//                           </p>
//                         </div>
//                         {item.certificateUrl ? (
//                           // ===== DOWNLOAD BUTTON (UPDATED) =====
//                           <button
//                             onClick={() => downloadCertificate(item.certificateUrl)}
//                             className="h-9 sm:h-11 px-3 sm:px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all"
//                           >
//                             <Download size={12} className="sm:w-4 sm:h-4" />
//                             Download
//                           </button>
//                         ) : (
//                           <span className="text-xs text-zinc-500 italic">Awaiting file</span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ApplyCertificate;
