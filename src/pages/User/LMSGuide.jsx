import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Mail,
  User,
  Smartphone,
  CreditCard,
  ArrowRight,
  BookOpen,
  Video,
  ShieldCheck,
  Clock,
  Copy,
  Check,
} from "lucide-react";

const LMSGuide = () => {
  const paymentNumber = "03225272527";
  const whatsappNumber = "032427624272";
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const steps = [
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Explore Courses",
      desc: "Browse our catalog and choose the course that fits your goals.",
    },
    {
      icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Make Payment",
      desc: `Send the course fee to JazzCash / EasyPaisa number ${paymentNumber}.`,
    },
    {
      icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Send Slip on WhatsApp",
      desc: `Share payment screenshot with your name and email to ${whatsappNumber}.`,
    },
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Get Verified",
      desc: "Our admin verifies your payment and activates your enrollment.",
    },
    {
      icon: <Video className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Start Learning",
      desc: "Access your course dashboard and watch video lectures anytime.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-28">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-zinc-300 font-medium">
              LMS Guide
            </span>
          </div>
          <h1 className="font-black leading-tight text-3xl sm:text-5xl lg:text-6xl xl:text-7xl">
            Learn Smarter With
            <span className="block text-zinc-400 mt-1 sm:mt-2">
              Modern LMS System
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-zinc-300 max-w-2xl leading-relaxed">
            A complete guide to understanding courses, video learning,
            secure access, and the payment process with WhatsApp verification.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* ── LEFT COLUMN: STEPS ── */}
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white dark:text-black" />
                  </div>
                  <div className="mb-3">
                    <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                      How It Works
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Follow these simple steps to start learning
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex gap-4 sm:gap-5 items-start group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-black dark:text-white group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                          {step.icon}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="w-0.5 h-8 sm:h-10 bg-gray-200 dark:bg-gray-800 mt-1" />
                        )}
                      </div>
                      <div className="pt-1">
                        <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── PAYMENT DETAILS ── */}
              <div className="bg-black text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-800">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="text-lg sm:text-2xl font-black">Payment Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-300 text-xs sm:text-sm">
                          <Smartphone className="w-4 h-4" />
                          <span>JazzCash / EasyPaisa</span>
                        </div>
                        <p className="text-base sm:text-xl lg:text-2xl font-bold tracking-wider mt-1 break-all">
                          {paymentNumber}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(paymentNumber, "payment")}
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors"
                      >
                        {copied === "payment" ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied === "payment" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-400/30 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-green-300 text-xs sm:text-sm">
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp for Slip Submission</span>
                        </div>
                        <p className="text-base sm:text-xl lg:text-2xl font-bold tracking-wider mt-1 break-all">
                          {whatsappNumber}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(whatsappNumber, "whatsapp")}
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors"
                      >
                        {copied === "whatsapp" ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied === "whatsapp" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2">
                    <h4 className="font-semibold text-sm sm:text-base">
                      Required WhatsApp Message:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>Full Name</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Address</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Payment Screenshot (Slip)</span>
                      </div>
                    </div>
                    <div className="mt-2 p-3 bg-black/30 rounded-xl text-[10px] sm:text-xs font-mono text-zinc-400 overflow-x-auto">
                      Name: Ali Khan<br />
                      Email: ali@gmail.com<br />
                      Course Payment Slip Attached
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: SIDEBAR INFO ── */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-black dark:text-white">
                      Quick Summary
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      What you'll get
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Access to premium video courses
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      WhatsApp‑based payment verification
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      24/7 access to your dashboard
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Direct support via WhatsApp
                    </span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact on WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LMSGuide;