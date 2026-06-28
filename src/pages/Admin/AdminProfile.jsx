import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { getData } from "@/context/userContext";
import { toast } from "sonner";
import {
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle2,
  Clock3,
  Camera,
  GraduationCap,
  Trophy,
  Sparkles,
  BookMarked,
  Activity,
  Crown,
  BadgeCheck,
  ChevronRight,
  Edit2,
  Save,
  X,
  Loader2,
  AtSign,
  Award,
  TrendingUp,
  BarChart3,
  FileText,
} from "lucide-react";

// ---------- Helpers ----------
const stringToColor = (str) => {
  if (!str || typeof str !== "string") return "hsl(220, 70%, 45%)";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 45%)`;
};

const getAvatarUrl = (avatarPath) => {
  if (!API) return null;
  if (!avatarPath || typeof avatarPath !== "string") return null;
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
    return avatarPath;
  }
  const base = API.replace(/\/+$/, "");
  const path = avatarPath.replace(/^\/+/, "");
  return `${base}/${path}`;
};

// ---------- Animated Counter ----------
const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count}</span>;
};

// ---------- Sub-components ----------
const SkeletonProfile = () => (
  <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center px-4 pt-14 sm:pt-16">
    <div className="bg-white dark:bg-black rounded-2xl sm:rounded-[32px] p-6 sm:p-10 shadow-xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full text-center">
      <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-black dark:border-t-white animate-spin mx-auto mb-4 sm:mb-6" />
      <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">Loading Profile</h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2">Preparing your admin dashboard</p>
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color = "zinc", change, animated = false }) => (
  <div className="bg-white dark:bg-black rounded-3xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white mt-1">
          {animated ? <AnimatedCounter value={value} /> : value}
        </h3>
        {change && (
          <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> {change}% from last month
          </p>
        )}
      </div>
      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon size={20} className="sm:w-7 sm:h-7" />
      </div>
    </div>
  </div>
);

const AchievementBadge = ({ title, description, icon, unlocked }) => (
  <div className={`flex items-center gap-3 p-3 sm:p-4 rounded-2xl border transition-all ${unlocked ? 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:shadow-md' : 'bg-zinc-100/50 dark:bg-zinc-800/30 border-zinc-200/50 dark:border-zinc-800/50 opacity-60'}`}>
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl ${unlocked ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">{title}</h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
    {unlocked && <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />}
  </div>
);

// ---------- Main Component ----------
const AdminProfile = () => {
  const { user: contextUser, setUser } = getData();
  const userId = contextUser?._id || contextUser?.id || localStorage.getItem("userId");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ─── State ─────────────────────────────────────────────
  const [user, setUserState] = useState(contextUser || null);
  const [loading, setLoading] = useState(!contextUser);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullname: contextUser?.fullname || "",
    username: contextUser?.username || "",
    bio: contextUser?.bio || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    contextUser?.avatar ? getAvatarUrl(contextUser.avatar) : null
  );

  // ─── Fetch Functions ──────────────────────────────────
  const fetchEnrollments = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API}/enroll/my-courses/${userId}`);
      setEnrollments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Enrollments error:", error);
      setEnrollments([]);
    }
  }, [userId]);

  const fetchCertificates = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API}/certificate/user/${userId}`);
      setCertificates(res.data?.data || []);
    } catch (error) {
      console.error("Certificates error:", error);
      setCertificates([]);
    }
  }, [userId]);

  const fetchProfile = useCallback(async () => {
    if (contextUser) {
      setUserState(contextUser);
      setFormData({
        fullname: contextUser.fullname || "",
        username: contextUser.username || "",
        bio: contextUser.bio || "",
      });
      setAvatarPreview(getAvatarUrl(contextUser.avatar));
      setLoading(false);
      return;
    }

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (token) {
        const res = await axios.get(`${API}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data.data;
        if (userData) {
          setUserState(userData);
          setFormData({
            fullname: userData.fullname || "",
            username: userData.username || "",
            bio: userData.bio || "",
          });
          setAvatarPreview(getAvatarUrl(userData.avatar));
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          setLoading(false);
          return;
        }
      }

      const res2 = await axios.get(`${API}/admin/users`);
      const found = res2.data.find((u) => u._id === userId);
      if (found) {
        setUserState(found);
        setFormData({
          fullname: found.fullname || "",
          username: found.username || "",
          bio: found.bio || "",
        });
        setAvatarPreview(getAvatarUrl(found.avatar));
        setUser(found);
        localStorage.setItem("user", JSON.stringify(found));
      } else {
        setUserState(null);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, [contextUser, userId, setUser]);

  useEffect(() => {
    fetchProfile();
    fetchEnrollments();
    fetchCertificates();
  }, [fetchProfile, fetchEnrollments, fetchCertificates]);

  // ─── Handlers ──────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("No authentication token. Please login again.");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("bio", formData.bio);
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const res = await axios.put(`${API}/user/profile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data.data;
      if (!updatedUser) throw new Error("No updated user data");

      setUserState(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAvatarPreview(getAvatarUrl(updatedUser.avatar));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullname: user?.fullname || "",
      username: user?.username || "",
      bio: user?.bio || "",
    });
    setAvatarPreview(getAvatarUrl(user?.avatar));
    setAvatarFile(null);
    setIsEditing(false);
  };

  // ─── Computed ──────────────────────────────────────────
  const activeCourses = enrollments.filter((c) => c.status === "active");
  const completedEnrollments = enrollments.filter((c) => c.status === "completed" || c.status === "active");
  const earnedCertificates = certificates.filter((c) => c.status === "approved").length;
  const avatarColor = stringToColor(user?.username || user?.email);
  const avatarUrl = avatarPreview || (user?.avatar ? getAvatarUrl(user.avatar) : null);

  // Profile completion
  const profileFields = [user?.fullname, user?.username, user?.email, user?.bio, user?.avatar];
  const filled = profileFields.filter(Boolean).length;
  const completion = Math.round((filled / profileFields.length) * 100);

  const achievements = [
    { id: 1, title: "Beginner Learner", description: "Joined the LMS platform", icon: "🏆", unlocked: true },
    { id: 2, title: "Verified User", description: "Account successfully verified", icon: "✓", unlocked: user?.isVerified || false },
    { id: 3, title: "Course Explorer", description: "Enrolled in courses", icon: "🎓", unlocked: enrollments.length > 0 },
    { id: 4, title: "Certificate Holder", description: "Earned a certificate", icon: "📜", unlocked: earnedCertificates > 0 },
    { id: 5, title: "Active Learner", description: "Active in courses", icon: "🔥", unlocked: activeCourses.length > 0 },
  ];

  // ─── Loading ────────────────────────────────────────────
  if (loading) return <SkeletonProfile />;
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center px-4 pt-14 sm:pt-16">
        <div className="bg-white dark:bg-black rounded-2xl sm:rounded-[32px] p-6 sm:p-10 shadow-xl border border-zinc-200 dark:border-zinc-800 text-center max-w-md w-full">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <User size={28} className="sm:w-10 sm:h-10 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">User Not Found</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2">
            Your account session may have expired. Please login again.
          </p>
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 overflow-x-hidden transition-colors duration-300">
      {/* ====== HERO ====== */}
      <div className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_white,_transparent_70%)]" />
        <div className="relative px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-14">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 sm:gap-10">
              {/* LEFT: AVATAR + INFO */}
              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 lg:items-center">
                <div className="relative w-fit">
                  <div
                    className="w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border border-white/10 bg-white/10 backdrop-blur-xl shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: avatarUrl ? undefined : avatarColor }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap size={40} className="sm:w-[72px] sm:h-[72px] text-white" />
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <button
                        onClick={handleAvatarClick}
                        className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        <Camera size={14} className="sm:w-5 sm:h-5" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 py-1 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-sm mb-3 sm:mb-5 backdrop-blur-md">
                    <Sparkles size={12} className="sm:w-4 sm:h-4" />
                    <span>Admin Dashboard</span>
                  </div>
                  {isEditing ? (
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="text-xl sm:text-4xl lg:text-5xl font-black bg-transparent border-b-2 border-white/30 focus:border-white outline-none w-full transition-colors text-white placeholder-white/50"
                      placeholder="Username"
                    />
                  ) : (
                    <h1 className="text-xl sm:text-4xl lg:text-5xl font-black leading-tight">{user.username}</h1>
                  )}
                  <p className="text-zinc-300 text-xs sm:text-base md:text-lg mt-2 sm:mt-4 break-all">{user.email}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-6">
                    <div className="bg-green-500/20 border border-green-500/20 text-green-300 px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                      <BadgeCheck size={12} className="sm:w-4 sm:h-4" />
                      {user.isVerified ? "Verified" : "Unverified"}
                    </div>
                    <div className="bg-white/10 border border-white/10 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm font-semibold capitalize flex items-center gap-1 sm:gap-2">
                      <Shield size={12} className="sm:w-4 sm:h-4" />
                      {user.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Edit / Save buttons */}
              <div className="flex gap-2 w-full md:w-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-1 px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all font-medium text-sm w-full md:w-auto backdrop-blur-sm"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1 px-5 py-2 bg-white text-black rounded-xl hover:bg-zinc-100 transition-all font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1 px-5 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-medium text-sm"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="mt-6 sm:mt-10 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-zinc-300">Profile Completion</p>
                  <span className="text-xl font-black">{completion}%</span>
                </div>
                <div className="flex-1 min-w-[100px] h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400">
                  {filled}/{profileFields.length} fields filled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== STATS ROW ====== */}
      <div className="px-4 sm:px-6 lg:px-10 -mt-6 sm:-mt-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Active Courses" value={activeCourses.length} icon={GraduationCap} color="black" animated />
          <StatCard label="Certificates Earned" value={earnedCertificates} icon={Award} color="green" animated />
          <StatCard label="Total Enrollments" value={enrollments.length} icon={BookMarked} color="blue" animated />
          <StatCard label="Learning Hours" value="24" icon={Clock3} color="amber" change="12" />
        </div>
      </div>

      {/* ====== MAIN CONTENT ====== */}
      <div className="px-3 sm:px-6 lg:px-10 py-5 sm:py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 2xl:grid-cols-3 gap-4 sm:gap-8">
          {/* LEFT COLUMN */}
          <div className="2xl:col-span-2 space-y-5 sm:space-y-8">
            {/* ACCOUNT INFORMATION */}
            <div className="bg-white dark:bg-black rounded-2xl sm:rounded-[35px] border border-zinc-200 dark:border-zinc-800 p-4 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-8 flex-wrap gap-2 sm:gap-4">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">Account Information</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-base mt-1">Personal details and account data</p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Secure Profile</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-3xl p-3 sm:p-6 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User size={14} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400">Full Name</p>
                      {isEditing ? (
                        <input
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleInputChange}
                          className="w-full mt-1 border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white outline-none bg-transparent transition-colors py-1 text-zinc-900 dark:text-white text-sm sm:text-base"
                          placeholder="Full name"
                        />
                      ) : (
                        <h3 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-base mt-1 break-all">{user.fullname || "Not set"}</h3>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-3xl p-3 sm:p-6 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AtSign size={14} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400">Username</p>
                      {isEditing ? (
                        <input
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full mt-1 border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white outline-none bg-transparent transition-colors py-1 text-zinc-900 dark:text-white text-sm sm:text-base"
                          placeholder="Username"
                        />
                      ) : (
                        <h3 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-base mt-1">{user.username}</h3>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-3xl p-3 sm:p-6 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail size={14} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400">Email Address</p>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-base mt-1 break-all">{user.email}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-3xl p-3 sm:p-6 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Activity size={14} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400">Bio</p>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full mt-1 border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white outline-none bg-transparent transition-colors resize-none py-1 text-zinc-900 dark:text-white text-sm sm:text-base"
                          placeholder="Tell us about yourself"
                        />
                      ) : (
                        <p className="font-medium text-zinc-900 dark:text-white text-xs sm:text-base mt-1 break-all">{user.bio || "No bio yet"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT ENROLLMENTS */}
            <div className="bg-white dark:bg-black rounded-2xl sm:rounded-[35px] border border-zinc-200 dark:border-zinc-800 p-4 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">Recent Enrollments</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-base mt-1">Your latest learning activity</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-5">
                {enrollments.length > 0 ? (
                  enrollments.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-5 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-3xl p-3 sm:p-5 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                          <GraduationCap size={20} className="sm:w-7 sm:h-7" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-xl font-bold text-zinc-900 dark:text-white">{item.courseId?.title || "Course"}</h3>
                          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-base mt-1 line-clamp-1 sm:line-clamp-2">
                            {item.courseId?.description?.slice(0, 60) || "No description"}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                        <span
                          className={`px-2 py-0.5 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-sm font-semibold ${
                            item.status === "active"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : item.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {item.status}
                        </span>
                        <button className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black flex items-center justify-center transition-all hover:scale-110">
                          <ChevronRight size={14} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-14">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 sm:mb-6">
                      <BookMarked size={28} className="sm:w-10 sm:h-10 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">No Courses Yet</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2">Enrolled courses will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5 sm:space-y-8">
            {/* ACHIEVEMENTS */}
            <div className="bg-white dark:bg-black rounded-2xl sm:rounded-[35px] border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-black text-white flex items-center justify-center">
                  <Trophy size={20} className="sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">Achievements</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">Your LMS milestones</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-5">
                {achievements.map((ach) => (
                  <AchievementBadge
                    key={ach.id}
                    title={ach.title}
                    description={ach.description}
                    icon={ach.icon}
                    unlocked={ach.unlocked}
                  />
                ))}
              </div>
            </div>

            {/* LEARNING PROGRESS */}
            <div className="bg-black text-white rounded-2xl sm:rounded-[35px] p-4 sm:p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_40%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-1 sm:gap-2 bg-white/10 px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm mb-3 sm:mb-6">
                  <Sparkles size={10} className="sm:w-4 sm:h-4" />
                  Learning Progress
                </div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black leading-tight">Keep Growing</h2>
                <p className="text-zinc-300 text-xs sm:text-base mt-2 sm:mt-4 leading-relaxed">
                  Continue learning to unlock certificates and achievements.
                </p>
                <div className="mt-4 sm:mt-8">
                  <div className="flex items-center justify-between text-[10px] sm:text-sm mb-1 sm:mb-3">
                    <span>Active Courses</span>
                    <span>{activeCourses.length}/10</span>
                  </div>
                  <div className="w-full h-2 sm:h-4 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(activeCourses.length * 10, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CERTIFICATES SUMMARY */}
            <div className="bg-white dark:bg-black rounded-2xl sm:rounded-[35px] border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-black text-white flex items-center justify-center">
                  <FileText size={20} className="sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">Certificates</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">Your earned certificates</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Total earned</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{earnedCertificates}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">Pending</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {certificates.filter((c) => c.status === "pending").length}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/apply-certificate")}
                  className="w-full mt-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition text-sm"
                >
                  View All Certificates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;