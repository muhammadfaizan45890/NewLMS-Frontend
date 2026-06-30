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
      icon: <User size={26} />,
    },
    {
      title: "Enroll In Courses",
      desc: "Browse available courses and enroll to start learning.",
      icon: <BookOpen size={26} />,
    },
    {
      title: "Watch Video Lectures",
      desc: "Access course modules and watch secure embedded videos.",
      icon: <Video size={26} />,
    },
    {
      title: "Track Progress",
      desc: "Monitor your active courses and continue your learning journey.",
      icon: <CheckCircle2 size={26} />,
    },
    {
      title: "Get Certificate",
      desc: "Receive a professional certificate after completing your course successfully.",
      icon: <Award size={26} />,
    },
  ];

  // ================= FEATURES =================
  const features = [
    {
      title: "Student Dashboard",
      desc: "Manage enrolled courses, profile, and progress from one place.",
      icon: <LayoutDashboard size={28} />,
    },
    {
      title: "Secure Video Learning",
      desc: "Protected course videos with custom playback controls.",
      icon: <PlayCircle size={28} />,
    },
    {
      title: "Admin Management",
      desc: "Admins can create courses, modules, and manage users easily.",
      icon: <ShieldCheck size={28} />,
    },
    {
      title: "Course Certificates",
      desc: "Students receive digital certificates after successfully completing courses.",
      icon: <Award size={28} />,
    },
    {
      title: "Responsive Design",
      desc: "Fully optimized for mobile, tablet, and desktop devices.",
      icon: <Sparkles size={28} />,
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
      <section className="relative animated-bg text-white px-4 sm:px-6 lg:px-10 py-20 lg:py-32">
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm font-medium mb-6 backdrop-blur-md">
              <GraduationCap size={18} />
              LMS Learning Platform Guide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Learn Smarter
              <span className="block text-zinc-400 mt-2">
                With Our LMS Platform
              </span>
            </h1>

            <p className="text-zinc-300 text-lg mt-8 leading-relaxed max-w-2xl">
              Access courses, watch secure video lectures, track your learning
              progress, and earn professional certificates after completion.
            </p>

            {/* === BUTTONS REMOVED === */}
          </div>

          {/* RIGHT – Dashboard preview */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-2xl rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_0_80px_rgba(255,255,255,0.08)]">
              <div className="bg-zinc-900 rounded-[30px] p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">Student Dashboard</h3>
                    <p className="text-zinc-400 mt-1">Modern LMS Interface</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center">
                    <LayoutDashboard size={28} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black rounded-2xl p-5 border border-white/10">
                    <BookOpen className="mb-4 text-white" size={28} />
                    <h4 className="font-bold text-xl">Courses</h4>
                    <p className="text-zinc-400 text-sm mt-2">Access enrolled courses instantly.</p>
                  </div>
                  <div className="bg-black rounded-2xl p-5 border border-white/10">
                    <PlayCircle className="mb-4 text-white" size={28} />
                    <h4 className="font-bold text-xl">Videos</h4>
                    <p className="text-zinc-400 text-sm mt-2">Secure embedded video lectures.</p>
                  </div>
                  <div className="bg-black rounded-2xl p-5 border border-white/10">
                    <Award className="mb-4 text-yellow-400" size={28} />
                    <h4 className="font-bold text-xl">Certificates</h4>
                    <p className="text-zinc-400 text-sm mt-2">Earn certificates after completion.</p>
                  </div>
                  <div className="bg-black rounded-2xl p-5 border border-white/10">
                    <ShieldCheck className="mb-4 text-blue-500" size={28} />
                    <h4 className="font-bold text-xl">Security</h4>
                    <p className="text-zinc-400 text-sm mt-2">Protected access and user roles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-20 bg-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-black">How LMS Works</h2>
            <p className="text-zinc-600 mt-5 max-w-2xl mx-auto text-lg">
              Follow these simple steps to start learning on the platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-7">
            {studentSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-[30px] p-8 border border-zinc-200 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-zinc-400 mb-3">STEP {index + 1}</div>
                <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative bg-white px-4 sm:px-6 lg:px-10 py-20 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-black">Powerful LMS Features</h2>
            <p className="text-zinc-600 mt-5 max-w-2xl text-lg">
              Everything you need for a modern online learning experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-[35px] border border-zinc-200 p-8 bg-zinc-50"
              >
                <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-bold text-black mb-4">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA – No button ================= */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-20">
        <div className="max-w-6xl mx-auto bg-black rounded-[40px] p-10 sm:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_40%)]" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">
              Ready To Start Learning?
            </h2>
            <p className="text-zinc-300 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
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
