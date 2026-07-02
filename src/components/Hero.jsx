import {
  ArrowRight,
  Zap,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Star,
  Play,
  X,
  Shield,
  Crown,
  Search,
  BookOpen,
  Code,
  Briefcase,
  Globe,
  ArrowUp,
  Loader2,
  AlertCircle,
  GraduationCap,
  DollarSign,
  Users,
  Palette,
  BarChart,
  Coffee,
  Database,
  Smartphone,
  Cloud,
  PenTool,
  Music,
  Camera,
  Film,
  Heart,
  Activity,
  Clock3,
  Wallet,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { getData } from '@/context/userContext';
import axios from 'axios';
import API from '@/utils/api';

// ---------- Custom Hook: Scroll Animation ----------
const useScrollReveal = (ref, options = { threshold: 0.2 }) => {
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

// ---------- Search suggestions (static) ----------
const suggestions = ['React', 'JavaScript', 'Python', 'Data Science', 'Marketing', 'Leadership'];

// ---------- Main Component ----------
const Hero = () => {
  const { user } = getData();
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // ─── Courses state ──────────────────────────────────────
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  // ─── Back to top visibility ─────────────────────────────
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Fetch featured courses ─────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        let res;
        try {
          res = await axios.get(`${API}/admin/courses`);
        } catch {
          res = await axios.get(`${API}/courses`);
        }
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setFeaturedCourses(data.slice(0, 6));
        setCoursesError(null);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCoursesError('Could not load courses. Please try again later.');
        setFeaturedCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // ─── Handlers ──────────────────────────────────────────
  const userRole = user?.role || 'user';

  const getUserName = () => {
    if (!user) return null;
    if (user.fullname) return user.fullname.split(' ')[0];
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    return 'there';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/courses?q=${encodeURIComponent(suggestion)}`);
  };

  const handleEnrollNow = (courseId) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${courseId}`)}`);
    } else {
      navigate("/courses");
    }
  };

  // ─── Get a random color for icon background ──────────
  const iconBgColors = [
    'bg-blue-100 dark:bg-blue-900/30',
    'bg-green-100 dark:bg-green-900/30',
    'bg-purple-100 dark:bg-purple-900/30',
    'bg-amber-100 dark:bg-amber-900/30',
    'bg-pink-100 dark:bg-pink-900/30',
    'bg-cyan-100 dark:bg-cyan-900/30',
  ];
  const getRandomColor = (id) => {
    const index = (id?.length || 0) % iconBgColors.length;
    return iconBgColors[index];
  };

  const categories = [
    { name: 'Programming', icon: Code, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50' },
    { name: 'Business', icon: Briefcase, color: 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50' },
    { name: 'Data Science', icon: BookOpen, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50' },
    { name: 'Languages', icon: Globe, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50' },
  ];

  return (
    <div
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-300"
    >
      {/* Background decorative gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      {/* Big Graduation Cap HD Logo – floating background decoration */}
      <div className="absolute right-0 top-1/4 opacity-5 dark:opacity-10 pointer-events-none hidden lg:block">
        <GraduationCap className="w-96 h-96 text-black dark:text-white" strokeWidth={1} />
      </div>

      <section className="relative w-full min-h-screen flex items-center justify-center py-12 md:py-24 lg:py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* ─── Brand badge ───────────── */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">
              <GraduationCap className="w-5 h-5 text-black dark:text-white" />
              <span className="font-bold text-black dark:text-white">Learning Management System</span>
            </div>
          </div>

          {/* Two‑column layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column – text and search */}
            <div className="space-y-6 md:space-y-8">
              {user && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 shadow-sm border border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-all hover:shadow-md">
                  <Sparkles className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Welcome back, {getUserName()}! 👋
                  </span>
                  {userRole !== 'user' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {userRole === 'admin' ? <Shield className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                      {userRole === 'admin' ? 'Admin' : 'CEO'}
                    </span>
                  )}
                </div>
              )}

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Learn without limits
                <span className="block text-gray-600 dark:text-gray-400">
                  anytime, anywhere.
                </span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                Choose from 5,000+ courses taught by top instructors. Gain new skills, advance your career, and join millions of learners worldwide.
              </p>

              {/* Search bar with autocomplete */}
              <form onSubmit={handleSearch} className="relative max-w-lg">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="What do you want to learn today?"
                    aria-label="Search courses"
                    className="w-full pl-12 pr-32 py-6 text-base rounded-xl border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-black/20 dark:focus:ring-white/20 shadow-sm bg-white dark:bg-black transition-shadow hover:shadow-md"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg px-6 shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    Search
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                {showSuggestions && (
                  <div className="absolute z-20 mt-1 w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                    {suggestions
                      .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestionClick(s)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    {suggestions.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                      .length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">No suggestions</div>
                    )}
                  </div>
                )}
              </form>

              {/* Category chips with active state */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-sm text-gray-500 dark:text-gray-500 mr-2">Popular topics:</span>
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      navigate(`/courses?category=${cat.name.toLowerCase()}`);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:shadow-md ${
                      activeCategory === cat.name
                        ? 'ring-2 ring-offset-2 ring-black dark:ring-white ' + cat.color
                        : cat.color
                    }`}
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">4.8 / 5 (50k+ reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">7-day free trial</span>
                </div>
              </div>
            </div>

            {/* Right column – video placeholder */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-black/50 backdrop-blur-sm">
                <div
                  className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-8 cursor-pointer group"
                  onClick={() => setShowDemoModal(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setShowDemoModal(true)}
                  aria-label="Watch demo video"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-2xl">
                      <Play className="w-10 h-10 text-black dark:text-white ml-1" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Watch how it works</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 hover:underline">See demo video →</p>
                  </div>
                </div>
              </div>

              {/* Testimonial badge */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-black rounded-xl shadow-lg p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-800">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">S</div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">J</div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">M</div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">2M+ learners</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">active this month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div ref={statsRef} className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 dark:border-gray-800 pt-12">
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">5,000+</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Courses available</p>
            </div>
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">2M+</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active learners</p>
            </div>
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">1,200+</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Expert instructors</p>
            </div>
          </div>

          {/* ─── Featured Courses Section ────── */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                <Zap className="inline-block mr-2 w-6 h-6 text-yellow-400" />
                Featured Courses
              </h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/courses')}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                See all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {coursesLoading ? (
              // Skeleton – now two columns
              <div className="grid grid-cols-2 gap-2 sm:gap-5 lg:gap-7">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-black rounded-xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 p-2.5 sm:p-5 shadow-sm animate-pulse">
                    <div className="flex items-start justify-between mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                      <div className="w-12 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                    </div>
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-4" />
                    <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-full mb-4" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                      <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                    </div>
                    <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : coursesError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 dark:text-red-300">{coursesError}</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-3"
                >
                  Retry
                </Button>
              </div>
            ) : featuredCourses.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
                <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No courses available right now.</p>
              </div>
            ) : (
              // Course Grid – two columns on all screens
              <div className="grid grid-cols-2 gap-2 sm:gap-5 lg:gap-7">
                {featuredCourses.map((course) => {
                  const bgColor = getRandomColor(course._id);
                  return (
                    <div
                      key={course._id}
                      className="group bg-white dark:bg-black rounded-xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 p-2.5 sm:p-5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 sm:hover:-translate-y-2 transition-all duration-200 sm:duration-300 flex flex-col overflow-hidden"
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-4">
                        <div className={`w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl ${bgColor} text-black dark:text-white flex items-center justify-center shadow-md`}>
                          <GraduationCap size={16} className="sm:w-7 sm:h-7" />
                        </div>
                      </div>

                      <h2 className="text-sm sm:text-xl md:text-2xl font-black text-black dark:text-white leading-tight line-clamp-2">
                        {course.title || "Untitled Course"}
                      </h2>

                      {course.category && (
                        <span className="inline-block mt-1 text-[8px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full self-start">
                          {course.category}
                        </span>
                      )}

                      <p className="hidden sm:block text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed text-xs sm:text-sm line-clamp-2">
                        {course.description || "No description available."}
                      </p>

                      <div className="mt-2 sm:mt-5 space-y-1.5 sm:space-y-3">
                        <div className="flex items-center gap-1.5 sm:gap-3 text-zinc-700 dark:text-zinc-300">
                          <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Clock3 size={10} className="sm:w-4 sm:h-4" />
                          </div>
                          <div>
                            <p className="text-[8px] sm:text-xs text-zinc-500 dark:text-zinc-400">Duration</p>
                            <h4 className="font-bold text-[10px] sm:text-sm">
                              {course.duration || "N/A"}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-3 text-zinc-700 dark:text-zinc-300">
                          <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Wallet size={10} className="sm:w-4 sm:h-4" />
                          </div>
                          <div>
                            <p className="text-[8px] sm:text-xs text-zinc-500 dark:text-zinc-400">Price</p>
                            <h4 className="font-bold text-[10px] sm:text-sm">
                              {course.price ? `$${course.price}` : "Free"}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnrollNow(course._id)}
                        className="mt-3 sm:mt-6 w-full bg-black dark:bg-white text-white dark:text-black py-1.5 sm:py-3 rounded-lg sm:rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-sm"
                      >
                        Enroll Now
                        <ArrowRight size={10} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Company logos bar */}
          <div className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by learners from top companies</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale">
              {['Google', 'Microsoft', 'Amazon', 'Netflix', 'Meta'].map((company) => (
                <span key={company} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:opacity-100 transition-opacity">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Modal */}
      {showDemoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-300"
          onClick={() => setShowDemoModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Demo video modal"
        >
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 z-10 p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Demo video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                See how LearnHub transforms your learning experience.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Hero;










// import {
//   ArrowRight,
//   Zap,
//   Sparkles,
//   ChevronRight,
//   CheckCircle,
//   Star,
//   Play,
//   X,
//   Shield,
//   Crown,
//   Search,
//   BookOpen,
//   Code,
//   Briefcase,
//   Globe,
//   ArrowUp,
//   AlertCircle,
//   GraduationCap,
//   Clock3,
//   Wallet,
//   Users,
// } from 'lucide-react';
// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { useNavigate } from 'react-router-dom';
// import { getData } from '@/context/userContext';
// import axios from 'axios';
// import API from '@/utils/api';

// // ---------- Custom Hooks ----------
// const useScrollReveal = (ref, options = { threshold: 0.2 }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   useEffect(() => {
//     if (!ref.current) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.unobserve(entry.target);
//         }
//       },
//       { threshold: options.threshold }
//     );
//     observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [ref, options.threshold]);
//   return isVisible;
// };

// const useAnimatedCounter = (targetValue, duration = 1000) => {
//   const [current, setCurrent] = useState(0);
//   useEffect(() => {
//     if (targetValue === undefined || targetValue === null) return;
//     const start = performance.now();
//     const startValue = current;
//     const animate = (now) => {
//       const elapsed = now - start;
//       const progress = Math.min(elapsed / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setCurrent(Math.floor(startValue + (targetValue - startValue) * eased));
//       if (progress < 1) requestAnimationFrame(animate);
//     };
//     requestAnimationFrame(animate);
//   }, [targetValue, duration]);
//   return current;
// };

// // ---------- Static data ----------
// const suggestions = ['React', 'JavaScript', 'Python', 'Data Science', 'Marketing', 'Leadership'];
// const categories = [
//   { name: 'Programming', icon: Code, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50' },
//   { name: 'Business', icon: Briefcase, color: 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50' },
//   { name: 'Data Science', icon: BookOpen, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50' },
//   { name: 'Languages', icon: Globe, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50' },
// ];
// const iconBgColors = [
//   'bg-blue-100 dark:bg-blue-900/30',
//   'bg-green-100 dark:bg-green-900/30',
//   'bg-purple-100 dark:bg-purple-900/30',
//   'bg-amber-100 dark:bg-amber-900/30',
//   'bg-pink-100 dark:bg-pink-900/30',
//   'bg-cyan-100 dark:bg-cyan-900/30',
// ];
// const getRandomColor = (id) => iconBgColors[(id?.length || 0) % iconBgColors.length];

// // ---------- Main Component ----------
// const Hero = () => {
//   const { user } = getData();
//   const navigate = useNavigate();

//   // ---- UI state ----
//   const [showDemoModal, setShowDemoModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   // ---- Live stats ----
//   const [stats, setStats] = useState({ courses: 5000, learners: 2000000, instructors: 1200 });
//   const [onlineUsers, setOnlineUsers] = useState(142);
//   const [recentActivity, setRecentActivity] = useState([]);

//   // ---- Featured courses ----
//   const [featuredCourses, setFeaturedCourses] = useState([]);
//   const [coursesLoading, setCoursesLoading] = useState(true);
//   const [coursesError, setCoursesError] = useState(null);

//   // ---- Refs for scroll ----
//   const scrollContainerRef = useRef(null);

//   // ---- Animated counters ----
//   const animatedCourses = useAnimatedCounter(stats.courses, 1200);
//   const animatedLearners = useAnimatedCounter(stats.learners, 1200);
//   const animatedInstructors = useAnimatedCounter(stats.instructors, 1200);

//   // ---- Back to top ----
//   useEffect(() => {
//     const handleScroll = () => setShowBackToTop(window.scrollY > 500);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // ---- Fetch featured courses ----
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setCoursesLoading(true);
//         let res;
//         try {
//           res = await axios.get(`${API}/admin/courses`);
//         } catch {
//           res = await axios.get(`${API}/courses`);
//         }
//         const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
//         setFeaturedCourses(data.slice(0, 8)); // fetch up to 8 for scrolling
//         setCoursesError(null);
//       } catch (err) {
//         console.error('Failed to fetch courses:', err);
//         setCoursesError('Could not load courses. Please try again later.');
//         setFeaturedCourses([]);
//       } finally {
//         setCoursesLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   // ---- Simulate live stats update ----
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setStats((prev) => ({
//         courses: prev.courses + Math.floor(Math.random() * 3),
//         learners: prev.learners + Math.floor(Math.random() * 50),
//         instructors: prev.instructors + Math.floor(Math.random() * 2),
//       }));
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // ---- Simulate online users ----
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setOnlineUsers(80 + Math.floor(Math.random() * 120));
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // ---- Simulate recent activity ----
//   useEffect(() => {
//     const names = ['Sarah', 'Mike', 'Emma', 'James', 'Olivia', 'Liam', 'Sophia', 'Noah'];
//     const courses = ['React Mastery', 'Python 101', 'Data Science', 'Marketing 101', 'Leadership', 'Design Thinking'];
//     const interval = setInterval(() => {
//       const newActivity = {
//         user: names[Math.floor(Math.random() * names.length)],
//         course: courses[Math.floor(Math.random() * courses.length)],
//         time: 'just now',
//       };
//       setRecentActivity((prev) => [newActivity, ...prev.slice(0, 4)]);
//     }, 8000);
//     return () => clearInterval(interval);
//   }, []);

//   // ---- Scroll handlers ----
//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
//     }
//   };
//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
//     }
//   };

//   // ---- Handlers ----
//   const userRole = user?.role || 'user';
//   const getUserName = () => {
//     if (!user) return null;
//     if (user.fullname) return user.fullname.split(' ')[0];
//     if (user.username) return user.username;
//     if (user.email) return user.email.split('@')[0];
//     return 'there';
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
//       setShowSuggestions(false);
//     }
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setSearchQuery(suggestion);
//     setShowSuggestions(false);
//     navigate(`/courses?q=${encodeURIComponent(suggestion)}`);
//   };

//   const handleEnrollNow = (courseId) => {
//     if (!user) {
//       navigate(`/login?redirect=${encodeURIComponent(`/courses/${courseId}`)}`);
//     } else {
//       navigate("/courses");
//     }
//   };

//   return (
//     <div className="relative w-full min-h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-300">
//       {/* Background gradients */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full blur-3xl" />
//         <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
//       </div>

//       {/* Floating Graduation Cap */}
//       <div className="absolute right-0 top-1/4 opacity-5 dark:opacity-10 pointer-events-none hidden lg:block">
//         <GraduationCap className="w-96 h-96 text-black dark:text-white" strokeWidth={1} />
//       </div>

//       <section className="relative w-full min-h-screen flex items-center justify-center py-12 md:py-24 lg:py-32 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//           {/* Brand badge */}
//           <div className="flex justify-center mb-8">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">
//               <GraduationCap className="w-5 h-5 text-black dark:text-white" />
//               <span className="font-bold text-black dark:text-white">Learning Management System</span>
//             </div>
//           </div>

//           {/* Two‑column layout */}
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             {/* Left column */}
//             <div className="space-y-6 md:space-y-8">
//               {user && (
//                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 shadow-sm border border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-all hover:shadow-md">
//                   <Sparkles className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//                   <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                     Welcome back, {getUserName()}! 👋
//                   </span>
//                   {userRole !== 'user' && (
//                     <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
//                       {userRole === 'admin' ? <Shield className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
//                       {userRole === 'admin' ? 'Admin' : 'CEO'}
//                     </span>
//                   )}
//                 </div>
//               )}

//               <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
//                 Learn without limits
//                 <span className="block text-gray-600 dark:text-gray-400">
//                   anytime, anywhere.
//                 </span>
//               </h1>

//               <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
//                 Choose from 5,000+ courses taught by top instructors. Gain new skills, advance your career, and join millions of learners worldwide.
//               </p>

//               {/* Search bar */}
//               <form onSubmit={handleSearch} className="relative max-w-lg">
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
//                   <Input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => {
//                       setSearchQuery(e.target.value);
//                       setShowSuggestions(e.target.value.length > 0);
//                     }}
//                     onFocus={() => setShowSuggestions(searchQuery.length > 0)}
//                     onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//                     placeholder="What do you want to learn today?"
//                     aria-label="Search courses"
//                     className="w-full pl-12 pr-32 py-6 text-base rounded-xl border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-black/20 dark:focus:ring-white/20 shadow-sm bg-white dark:bg-black transition-shadow hover:shadow-md"
//                   />
//                   <Button
//                     type="submit"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg px-6 shadow-md hover:shadow-lg transition-all active:scale-95"
//                   >
//                     Search
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//                 {showSuggestions && (
//                   <div className="absolute z-20 mt-1 w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
//                     {suggestions
//                       .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
//                       .map((s) => (
//                         <button
//                           key={s}
//                           onClick={() => handleSuggestionClick(s)}
//                           className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                         >
//                           {s}
//                         </button>
//                       ))}
//                     {suggestions.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
//                       .length === 0 && (
//                       <div className="px-4 py-2 text-sm text-gray-500">No suggestions</div>
//                     )}
//                   </div>
//                 )}
//               </form>

//               {/* Category chips */}
//               <div className="flex flex-wrap gap-2 pt-2">
//                 <span className="text-sm text-gray-500 dark:text-gray-500 mr-2">Popular topics:</span>
//                 {categories.map((cat, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => {
//                       setActiveCategory(cat.name);
//                       navigate(`/courses?category=${cat.name.toLowerCase()}`);
//                     }}
//                     className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:shadow-md ${
//                       activeCategory === cat.name
//                         ? 'ring-2 ring-offset-2 ring-black dark:ring-white ' + cat.color
//                         : cat.color
//                     }`}
//                   >
//                     <cat.icon className="w-3.5 h-3.5" />
//                     {cat.name}
//                   </button>
//                 ))}
//               </div>

//               {/* Trust indicators */}
//               <div className="flex flex-wrap items-center gap-6 pt-4">
//                 <div className="flex items-center gap-2">
//                   <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                   <span className="text-sm text-gray-600 dark:text-gray-400">4.8 / 5 (50k+ reviews)</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                   <span className="text-sm text-gray-600 dark:text-gray-400">7-day free trial</span>
//                 </div>
//               </div>
//             </div>

//             {/* Right column - video placeholder */}
//             <div className="relative">
//               <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-black/50 backdrop-blur-sm">
//                 <div
//                   className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-8 cursor-pointer group"
//                   onClick={() => setShowDemoModal(true)}
//                   role="button"
//                   tabIndex={0}
//                   onKeyDown={(e) => e.key === 'Enter' && setShowDemoModal(true)}
//                   aria-label="Watch demo video"
//                 >
//                   <div className="text-center">
//                     <div className="w-20 h-20 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-2xl">
//                       <Play className="w-10 h-10 text-black dark:text-white ml-1" />
//                     </div>
//                     <p className="text-gray-700 dark:text-gray-300 font-medium">Watch how it works</p>
//                     <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 hover:underline">See demo video →</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Online users badge */}
//               <div className="absolute -bottom-6 -left-6 bg-white dark:bg-black rounded-xl shadow-lg p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-800">
//                 <div className="flex -space-x-2">
//                   <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">S</div>
//                   <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">J</div>
//                   <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">M</div>
//                 </div>
//                 <div>
//                   <p className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
//                     <span className="relative flex h-2 w-2">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
//                     </span>
//                     {onlineUsers}+ online
//                   </p>
//                   <p className="text-[10px] text-gray-500 dark:text-gray-400">active now</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Row with animated counters */}
//           <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 dark:border-gray-800 pt-12">
//             <div className="text-center">
//               <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
//                 {animatedCourses.toLocaleString()}+
//               </span>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Courses available</p>
//             </div>
//             <div className="text-center">
//               <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
//                 {animatedLearners.toLocaleString()}+
//               </span>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active learners</p>
//             </div>
//             <div className="text-center">
//               <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
//                 {animatedInstructors.toLocaleString()}+
//               </span>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Expert instructors</p>
//             </div>
//           </div>

//           {/* ─── Featured Courses Section – Horizontal Scroll ─── */}
//           <div className="mt-16">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                 <Zap className="w-6 h-6 text-yellow-400" />
//                 Featured Courses
//                 <span className="ml-3 text-xs font-normal text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
//                   scroll →
//                 </span>
//               </h2>
//               <Button
//                 variant="ghost"
//                 onClick={() => navigate('/courses')}
//                 className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//               >
//                 See all <ChevronRight className="ml-1 h-4 w-4" />
//               </Button>
//             </div>

//             {coursesLoading ? (
//               // Skeleton for horizontal scroll (4 items)
//               <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
//                 {[...Array(4)].map((_, i) => (
//                   <div key={i} className="min-w-[280px] sm:min-w-[300px] snap-start bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm animate-pulse flex-shrink-0">
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
//                       <div className="w-16 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
//                     </div>
//                     <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
//                     <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-4" />
//                     <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
//                   </div>
//                 ))}
//               </div>
//             ) : coursesError ? (
//               <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
//                 <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
//                 <p className="text-red-700 dark:text-red-300">{coursesError}</p>
//                 <Button variant="outline" onClick={() => window.location.reload()} className="mt-3">
//                   Retry
//                 </Button>
//               </div>
//             ) : featuredCourses.length === 0 ? (
//               <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
//                 <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
//                 <p className="text-gray-600 dark:text-gray-400">No courses available right now.</p>
//               </div>
//             ) : (
//               // Horizontal scroll container with arrows
//               <div className="relative group">
//                 {/* Left Arrow */}
//                 <button
//                   onClick={scrollLeft}
//                   className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/90 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 hover:scale-105"
//                   disabled={scrollContainerRef.current?.scrollLeft === 0}
//                   aria-label="Scroll left"
//                 >
//                   <ChevronRight className="w-5 h-5 rotate-180" />
//                 </button>

//                 {/* Scrollable container */}
//                 <div
//                   ref={scrollContainerRef}
//                   className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
//                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//                 >
//                   {featuredCourses.map((course) => {
//                     const bgColor = getRandomColor(course._id);
//                     return (
//                       <div
//                         key={course._id}
//                         className="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] snap-start bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0 flex flex-col"
//                       >
//                         <div className="flex items-start justify-between mb-3">
//                           <div className={`w-12 h-12 rounded-xl ${bgColor} text-black dark:text-white flex items-center justify-center shadow-md`}>
//                             <GraduationCap size={20} />
//                           </div>
//                           <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
//                             {course.category || 'General'}
//                           </span>
//                         </div>

//                         <h3 className="text-lg font-bold text-black dark:text-white leading-tight line-clamp-2">
//                           {course.title || 'Untitled Course'}
//                         </h3>

//                         <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2 flex-1">
//                           {course.description || 'No description available.'}
//                         </p>

//                         <div className="mt-3 flex items-center justify-between text-sm">
//                           <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
//                             <Clock3 size={14} />
//                             <span>{course.duration || 'N/A'}</span>
//                           </div>
//                           <div className="font-bold text-black dark:text-white">
//                             {course.price ? `$${course.price}` : 'Free'}
//                           </div>
//                         </div>

//                         <button
//                           onClick={() => handleEnrollNow(course._id)}
//                           className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
//                         >
//                           Enroll Now
//                           <ArrowRight size={16} />
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Right Arrow */}
//                 <button
//                   onClick={scrollRight}
//                   className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/90 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 hover:scale-105"
//                   disabled={
//                     scrollContainerRef.current &&
//                     scrollContainerRef.current.scrollLeft + scrollContainerRef.current.clientWidth >=
//                       scrollContainerRef.current.scrollWidth
//                   }
//                   aria-label="Scroll right"
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Recent activity ticker */}
//           <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
//             <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 overflow-hidden">
//               <span className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">🔔 Live enrollments:</span>
//               <div className="relative h-6 overflow-hidden flex-1">
//                 {recentActivity.map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="absolute w-full animate-[slideUp_6s_ease-in-out] whitespace-nowrap text-ellipsis overflow-hidden"
//                     style={{ animationDelay: `${idx * 0.5}s`, opacity: idx === 0 ? 1 : 0 }}
//                   >
//                     <span className="font-medium text-gray-800 dark:text-gray-200">{item.user}</span>
//                     {' enrolled in '}
//                     <span className="font-medium text-blue-600 dark:text-blue-400">{item.course}</span>
//                     {' • '}
//                     <span className="text-xs text-gray-400">{item.time}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Company logos */}
//           <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
//             <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by learners from top companies</p>
//             <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale">
//               {['Google', 'Microsoft', 'Amazon', 'Netflix', 'Meta'].map((company) => (
//                 <span key={company} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:opacity-100 transition-opacity">
//                   {company}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Demo Modal */}
//       {showDemoModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-300"
//           onClick={() => setShowDemoModal(false)}
//           role="dialog"
//           aria-modal="true"
//           aria-label="Demo video modal"
//         >
//           <div
//             className="relative w-full max-w-4xl bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setShowDemoModal(false)}
//               className="absolute top-4 right-4 z-10 p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
//               aria-label="Close modal"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <div className="aspect-video">
//               <iframe
//                 className="w-full h-full"
//                 src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
//                 title="Demo video"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               />
//             </div>
//             <div className="p-4 text-center">
//               <p className="text-gray-600 dark:text-gray-300 text-sm">
//                 See how LearnHub transforms your learning experience.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Back to Top */}
//       {showBackToTop && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//           className="fixed bottom-6 right-6 z-50 p-3 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
//           aria-label="Back to top"
//         >
//           <ArrowUp className="w-5 h-5" />
//         </button>
//       )}

//       {/* Add this CSS to hide scrollbar and animate ticker */}
//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         @keyframes slideUp {
//           0% { transform: translateY(100%); opacity: 0; }
//           10% { transform: translateY(0); opacity: 1; }
//           90% { transform: translateY(0); opacity: 1; }
//           100% { transform: translateY(-100%); opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Hero;
