import React from "react";
import {
  BookOpen,
  PlayCircle,
  User,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
  Video,
  LayoutDashboard,
  Sparkles,
  Award,
} from "lucide-react";

const Middle = () => {
  // ================= HOW LMS WORKS =================
  const studentSteps = [
    {
      title: "Create Account",
      desc: "Signup and verify your email to access the LMS platform.",
      icon: <User size={22} />,
    },
    {
      title: "Enroll In Courses",
      desc: "Browse available courses and enroll to start learning.",
      icon: <BookOpen size={22} />,
    },
    {
      title: "Watch Video Lectures",
      desc: "Access course modules and watch secure embedded videos.",
      icon: <Video size={22} />,
    },
    {
      title: "Track Progress",
      desc: "Monitor your active courses and continue your learning journey.",
      icon: <CheckCircle2 size={22} />,
    },
    {
      title: "Get Certificate",
      desc: "Receive a professional certificate after completing your course successfully.",
      icon: <Award size={22} />,
    },
  ];

  // ================= FEATURES =================
  const features = [
    {
      title: "Student Dashboard",
      desc: "Manage enrolled courses, profile, and progress from one place.",
      icon: <LayoutDashboard size={24} />,
    },
    {
      title: "Secure Video Learning",
      desc: "Protected course videos with custom playback controls.",
      icon: <PlayCircle size={24} />,
    },
    {
      title: "Admin Management",
      desc: "Admins can create courses, modules, and manage users easily.",
      icon: <ShieldCheck size={24} />,
    },
    {
      title: "Course Certificates",
      desc: "Students receive digital certificates after successfully completing courses.",
      icon: <Award size={24} />,
    },
    {
      title: "Responsive Design",
      desc: "Fully optimized for mobile, tablet, and desktop devices.",
      icon: <Sparkles size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 overflow-hidden relative">
      {/* ===== ANIMATED BACKGROUND ===== */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes floatSlow {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        .animated-bg {
          background: linear-gradient(-45deg, #0a0a0a, #1a1a1a, #2a2a2a, #0a0a0a);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        .floating-shape {
          animation: float 8s ease-in-out infinite;
        }
        .floating-shape-slow {
          animation: floatSlow 12s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative floating shapes – only background, no interaction */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-shape absolute top-10 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="floating-shape-slow absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="floating-shape absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="floating-shape-slow absolute top-1/3 right-10 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative animated-bg text-white px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-4 backdrop-blur-md">
              <GraduationCap size={14} />
              LMS Learning Platform Guide
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black leading-tight tracking-tight">
              Learn Smarter
              <span className="block text-zinc-400 mt-1">
                With Our LMS Platform
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl">
              Access courses, watch secure video lectures, track your learning
              progress, and earn professional certificates after completion.
            </p>

            {/* === BUTTONS REMOVED === */}
          </div>

          {/* RIGHT – Dashboard preview */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-2xl rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-[0_0_60px_rgba(255,255,255,0.06)]">
              <div className="bg-zinc-900 rounded-[24px] p-5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Student Dashboard</h3>
                    <p className="text-zinc-400 text-xs mt-0.5">Modern LMS Interface</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                    <LayoutDashboard size={20} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black rounded-xl p-4 border border-white/10">
                    <BookOpen className="mb-2 text-white" size={22} />
                    <h4 className="font-bold text-base">Courses</h4>
                    <p className="text-zinc-400 text-xs mt-1">Access enrolled courses instantly.</p>
                  </div>
                  <div className="bg-black rounded-xl p-4 border border-white/10">
                    <PlayCircle className="mb-2 text-white" size={22} />
                    <h4 className="font-bold text-base">Videos</h4>
                    <p className="text-zinc-400 text-xs mt-1">Secure embedded video lectures.</p>
                  </div>
                  <div className="bg-black rounded-xl p-4 border border-white/10">
                    <Award className="mb-2 text-yellow-400" size={22} />
                    <h4 className="font-bold text-base">Certificates</h4>
                    <p className="text-zinc-400 text-xs mt-1">Earn certificates after completion.</p>
                  </div>
                  <div className="bg-black rounded-xl p-4 border border-white/10">
                    <ShieldCheck className="mb-2 text-blue-500" size={22} />
                    <h4 className="font-bold text-base">Security</h4>
                    <p className="text-zinc-400 text-xs mt-1">Protected access and user roles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-black">How LMS Works</h2>
            <p className="text-zinc-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Follow these simple steps to start learning on the platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            {studentSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-zinc-400 mb-2">STEP {index + 1}</div>
                <h3 className="text-lg font-bold text-black mb-2">{step.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative bg-white px-4 sm:px-6 lg:px-10 py-16 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-black">Powerful LMS Features</h2>
            <p className="text-zinc-600 mt-3 max-w-2xl text-sm sm:text-base">
              Everything you need for a modern online learning experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 p-6 bg-zinc-50"
              >
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{feature.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA – No button ================= */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16">
        <div className="max-w-6xl mx-auto bg-black rounded-[30px] p-8 sm:p-10 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_40%)]" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              Ready To Start Learning?
            </h2>
            <p className="text-zinc-300 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Join the LMS platform today and unlock modern learning with
              interactive courses, secure videos, and completion certificates.
            </p>
            {/* === BUTTON REMOVED === */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Middle;
