
// import { useState, useEffect, useMemo, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import {
//   LayoutDashboard, Home, LogOut, User,
//   ChevronDown, Shield, BarChart3, UsersRound,
//   Map, GraduationCap, LogIn, UserPlus
// } from 'lucide-react';
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem,
//   DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { getData } from '@/context/userContext';
// import axios from 'axios';
// import { toast } from 'sonner';
// import API from '@/utils/api';

// // Helper to resolve avatar URL (with error handling)
// const getAvatarUrl = (avatarPath) => {
//   try {
//     if (!avatarPath) return null;
//     if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
//       return avatarPath;
//     }
//     if (!API) return null;
//     const base = API.replace(/\/+$/, '');
//     const path = avatarPath.replace(/^\/+/, '');
//     return `${base}/${path}`;
//   } catch {
//     return null;
//   }
// };

// const Navbar = () => {
//   const { user, setUser } = getData();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isMounted = useRef(true);

//   const [isScrolled, setIsScrolled] = useState(false);
//   const accessToken = localStorage.getItem('accessToken');
//   const userRole = user?.role || 'user';

//   // Inject shimmer keyframe animation
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       @keyframes shimmer {
//         0% { background-position: -200% center; }
//         100% { background-position: 200% center; }
//       }
//       .animate-shimmer {
//         animation: shimmer 4s linear infinite;
//         background-size: 200% auto;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   // Scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       isMounted.current = false;
//     };
//   }, []);

//   // Navigation items (memoized)
//   const publicNavItems = useMemo(() => [
//     { name: 'Home', path: '/', icon: Home },
//     { name: 'Guide', path: '/guide', icon: Map },
//   ], []);

//   const userNavItems = useMemo(() => [
//     { name: 'Dashboard', path: '/courses', icon: LayoutDashboard },
//   ], []);

//   const adminNavItems = useMemo(() => [
//     { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
//     { name: 'Admin Panel', path: '/admin/panel', icon: Shield },
//     { name: 'Create Account', path: '/admin/signup', icon: UsersRound },
//     { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
//     { name: 'Intel', path: '/admin/intel', icon: Shield },
//   ], []);

//   const navItems = useMemo(() => {
//     if (user) {
//       return userRole === 'admin' ? adminNavItems : userNavItems;
//     }
//     return publicNavItems;
//   }, [user, userRole, adminNavItems, userNavItems, publicNavItems]);

//   // Logout
//   const logoutHandler = async () => {
//     try {
//       const res = await axios.post(`${API}/user/logout`, {}, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       if (res.data.success) {
//         setUser(null);
//         toast.success(res.data.message);
//         localStorage.clear();
//         navigate('/');
//       }
//     } catch {
//       toast.error('Logout failed');
//     }
//   };

//   const getUserInitials = () => {
//     if (user?.fullname) {
//       const parts = user.fullname.split(' ');
//       return parts.map(n => n[0]).join('').toUpperCase().slice(0, 2);
//     }
//     if (user?.email) return user.email[0].toUpperCase();
//     return 'U';
//   };

//   const getRoleBadge = () => (userRole === 'admin' ? 'A' : null);

//   const profileRoute = userRole === 'admin' ? '/admin/profile' : '/profile';

//   return (
//     <nav
//       className={`
//         sticky top-0 z-[1000] w-full
//         transition-all duration-300
//         ${isScrolled
//           ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200'
//           : 'bg-white'
//         }
//       `}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-[62px] gap-3">

//           {/* Left: logo with text shimmer, cap static */}
//           <div className="flex items-center gap-1 shrink-0">
//             <Link to="/" className="flex items-center gap-2.5 group">
//               {/* Graduation cap – static, no animation */}
//               <div className="bg-black text-white p-2 rounded-full">
//                 <GraduationCap size={20} />
//               </div>
//               {/* Animated text – shimmer only */}
//               <span className="font-bold text-[1.1rem] tracking-wide block">
//                 <span
//                   className="
//                     bg-gradient-to-r from-black via-gray-400 to-black
//                     bg-clip-text text-transparent animate-shimmer
//                   "
//                 >
//                   Course
//                 </span>
//                 <span
//                   className="
//                     bg-gradient-to-r from-gray-700 via-gray-300 to-gray-700
//                     bg-clip-text text-transparent animate-shimmer
//                   "
//                 >
//                   Academy
//                 </span>
//               </span>
//             </Link>
//           </div>

//           {/* Right: user menu or login/signup dropdown */}
//           <div className="flex items-center gap-1.5 shrink-0">
//             {user ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <button className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95 group focus:outline-none">
//                     <div className="relative">
//                       <Avatar className="h-7 w-7 border border-gray-30 transition-all">
//                         <AvatarImage src={getAvatarUrl(user?.avatar)} />
//                         <AvatarFallback className="bg-gray-200 text-gray-700 text-[10px] font-bold">
//                           {getUserInitials()}
//                           {getRoleBadge() && <span className="ml-0.5 text-[8px]">{getRoleBadge()}</span>}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
//                     </div>
//                     <span className="hidden md:block text-[13px] font-medium text-gray-700 max-w-[90px] truncate">
//                       {user?.fullname?.split(' ')[0] || 'Profile'}
//                     </span>
//                     <ChevronDown className="hidden md:block h-3.5 w-3.5 text-gray-400 group-hover:text-black transition-transform duration-200 group-data-[state=open]:rotate-180" />
//                   </button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-2xl border border-gray-200 bg-white shadow-xl p-1.5 z-[1001]">
//                   <DropdownMenuLabel className="px-2 py-2">
//                     <div className="flex items-center gap-2.5">
//                       <Avatar className="h-9 w-9 border-2 border-gray-200">
//                         <AvatarImage src={getAvatarUrl(user?.avatar)} />
//                         <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-bold">
//                           {getUserInitials()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="min-w-0">
//                         <p className="text-sm font-semibold text-gray-900 truncate">
//                           {user?.fullname || 'Profile'}
//                         </p>
//                         <p className="text-[11px] text-gray-500 truncate">
//                           {user?.email}
//                         </p>
//                         {userRole !== 'user' && (
//                           <span className="inline-block mt-0.5 text-[9px] font-semibold uppercase bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
//                             {userRole}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </DropdownMenuLabel>

//                   <DropdownMenuSeparator className="my-1 bg-gray-100" />

//                   {[
//                     { to: profileRoute, icon: User, label: 'Profile' },
//                     { to: userRole === 'admin' ? '/admin/dashboard' : '/courses', icon: LayoutDashboard, label: 'Dashboard' },
//                   ].map((item) => (
//                     <DropdownMenuItem key={item.to} asChild>
//                       <Link to={item.to} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-150">
//                         <item.icon className="h-3.5 w-3.5 text-gray-400" />
//                         {item.label}
//                       </Link>
//                     </DropdownMenuItem>
//                   ))}

//                   {userRole === 'admin' && (
//                     <>
//                       <DropdownMenuSeparator className="my-1 bg-gray-100" />
//                       <DropdownMenuItem asChild>
//                         <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-150">
//                           <Shield className="h-3.5 w-3.5 text-gray-400" />
//                           Admin Panel
//                         </Link>
//                       </DropdownMenuItem>
//                     </>
//                   )}

//                   <DropdownMenuSeparator className="my-1 bg-gray-100" />
//                   <DropdownMenuItem onClick={logoutHandler} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-all duration-150">
//                     <LogOut className="h-3.5 w-3.5" />
//                     Sign out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <button
//                     className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-95 focus:outline-none"
//                     aria-label="User menu"
//                   >
//                     <User className="h-5 w-5 text-gray-600" />
//                   </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   align="end"
//                   sideOffset={8}
//                   className="w-48 rounded-2xl border border-gray-200 bg-white shadow-xl p-1.5 z-[1001]"
//                 >
//                   <DropdownMenuItem asChild>
//                     <Link
//                       to="/login"
//                       className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-150"
//                     >
//                       <LogIn className="h-3.5 w-3.5" />
//                       Login
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link
//                       to="/signup"
//                       className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-150"
//                     >
//                       <UserPlus className="h-3.5 w-3.5" />
//                       Signup
//                     </Link>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;






import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Home, LogOut, User,
  ChevronDown, Shield, BarChart3, UsersRound,
  Map, GraduationCap, LogIn, UserPlus, X
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getData } from '@/context/userContext';
import axios from 'axios';
import { toast } from 'sonner';
import API from '@/utils/api';

// Helper to resolve avatar URL (with error handling)
const getAvatarUrl = (avatarPath) => {
  try {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    if (!API) return null;
    const base = API.replace(/\/+$/, '');
    const path = avatarPath.replace(/^\/+/, '');
    return `${base}/${path}`;
  } catch {
    return null;
  }
};

const Navbar = () => {
  const { user, setUser } = getData();
  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = useRef(true);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const accessToken = localStorage.getItem('accessToken');
  const userRole = user?.role || 'user';

  // Inject shimmer & marquee keyframe animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .animate-shimmer {
        animation: shimmer 4s linear infinite;
        background-size: 200% auto;
      }

      /* Left‑to‑right marquee – slow (40s) */
      @keyframes marqueeLTR {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .marquee-track {
        animation: marqueeLTR 40s linear infinite;
        white-space: nowrap;
        display: inline-block;
        will-change: transform;
      }
      .marquee-container:hover .marquee-track {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Check if banner was dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('googleSigninBannerDismissed');
    if (!dismissed) {
      setShowBanner(true);
    }
  }, []);

  // Scroll effect (unchanged)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      isMounted.current = false;
    };
  }, []);

  // Dismiss banner
  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('googleSigninBannerDismissed', 'true');
  };

  // Navigation items (memoized, unchanged)
  const publicNavItems = useMemo(() => [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Guide', path: '/guide', icon: Map },
  ], []);

  const userNavItems = useMemo(() => [
    { name: 'Dashboard', path: '/courses', icon: LayoutDashboard },
  ], []);

  const adminNavItems = useMemo(() => [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Admin Panel', path: '/admin/panel', icon: Shield },
    { name: 'Create Account', path: '/admin/signup', icon: UsersRound },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Intel', path: '/admin/intel', icon: Shield },
  ], []);

  const navItems = useMemo(() => {
    if (user) {
      return userRole === 'admin' ? adminNavItems : userNavItems;
    }
    return publicNavItems;
  }, [user, userRole, adminNavItems, userNavItems, publicNavItems]);

  // Logout (unchanged)
  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${API}/user/logout`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data.success) {
        setUser(null);
        toast.success(res.data.message);
        localStorage.clear();
        navigate('/');
      }
    } catch {
      toast.error('Logout failed');
    }
  };

  const getUserInitials = () => {
    if (user?.fullname) {
      const parts = user.fullname.split(' ');
      return parts.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const getRoleBadge = () => (userRole === 'admin' ? 'A' : null);

  const profileRoute = userRole === 'admin' ? '/admin/profile' : '/profile';

  return (
    <nav
      className={`
        sticky top-0 z-[1000] w-full
        transition-all duration-300
        ${isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200'
          : 'bg-white'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main navbar row: logo + user menu */}
        <div className="flex items-center justify-between h-[62px] gap-3">
          {/* Left: logo with text shimmer, cap static */}
          <div className="flex items-center gap-1 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-black text-white p-2 rounded-full">
                <GraduationCap size={20} />
              </div>
              <span className="font-bold text-[1.1rem] tracking-wide block">
                <span
                  className="
                    bg-gradient-to-r from-black via-gray-400 to-black
                    bg-clip-text text-transparent animate-shimmer
                  "
                >
                  Course
                </span>
                <span
                  className="
                    bg-gradient-to-r from-gray-700 via-gray-300 to-gray-700
                    bg-clip-text text-transparent animate-shimmer
                  "
                >
                  Academy
                </span>
              </span>
            </Link>
          </div>

          {/* Right: user menu or login/signup dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95 group focus:outline-none">
                    <div className="relative">
                      <Avatar className="h-7 w-7 border border-gray-30 transition-all">
                        <AvatarImage src={getAvatarUrl(user?.avatar)} />
                        <AvatarFallback className="bg-gray-200 text-gray-700 text-[10px] font-bold">
                          {getUserInitials()}
                          {getRoleBadge() && <span className="ml-0.5 text-[8px]">{getRoleBadge()}</span>}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                    </div>
                    <span className="hidden md:block text-[13px] font-medium text-gray-700 max-w-[90px] truncate">
                      {user?.fullname?.split(' ')[0] || 'Profile'}
                    </span>
                    <ChevronDown className="hidden md:block h-3.5 w-3.5 text-gray-400 group-hover:text-black transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-2xl border border-gray-200 bg-white shadow-xl p-1.5 z-[1001]">
                  <DropdownMenuLabel className="px-2 py-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9 border-2 border-gray-200">
                        <AvatarImage src={getAvatarUrl(user?.avatar)} />
                        <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-bold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.fullname || 'Profile'}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {user?.email}
                        </p>
                        {userRole !== 'user' && (
                          <span className="inline-block mt-0.5 text-[9px] font-semibold uppercase bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                            {userRole}
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1 bg-gray-100" />

                  {[
                    { to: profileRoute, icon: User, label: 'Profile' },
                    { to: userRole === 'admin' ? '/admin/dashboard' : '/courses', icon: LayoutDashboard, label: 'Dashboard' },
                  ].map((item) => (
                    <DropdownMenuItem key={item.to} asChild>
                      <Link to={item.to} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-150">
                        <item.icon className="h-3.5 w-3.5 text-gray-400" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  {userRole === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="my-1 bg-gray-100" />
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-150">
                          <Shield className="h-3.5 w-3.5 text-gray-400" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="my-1 bg-gray-100" />
                  <DropdownMenuItem onClick={logoutHandler} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-all duration-150">
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-95 focus:outline-none"
                    aria-label="User menu"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-48 rounded-2xl border border-gray-200 bg-white shadow-xl p-1.5 z-[1001]"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to="/login"
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-150"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/signup"
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-150"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Signup
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* —————— SLIDING MESSAGE (part of navbar) —————— */}
        {showBanner && (
          <div
            className="bg-gradient-to-r from-red-100 via-red-200/80 to-red-100 rounded-lg mb-2 py-1.5 px-3 flex items-center justify-between gap-2 border border-red-300/50"
            role="alert"
            aria-live="polite"
          >
            {/* Marquee container */}
            <div className="flex-1 min-w-0 marquee-container overflow-hidden">
              <div className="marquee-track text-red-800 text-xs sm:text-sm md:text-base font-medium">
                {/* Duplicate text for seamless loop */}
                <span>⚠️ Signup is in repairing condition. Please use Sign in with Google for now. &nbsp;&nbsp;—&nbsp;&nbsp; </span>
                <span>⚠️ Signup is in repairing condition. Please use Sign in with Google for now. &nbsp;&nbsp;—&nbsp;&nbsp; </span>
                <span>⚠️ Signup is in repairing condition. Please use Sign in with Google for now. &nbsp;&nbsp;—&nbsp;&nbsp; </span>
                <span>⚠️ Signup is in repairing condition. Please use Sign in with Google for now. &nbsp;&nbsp;—&nbsp;&nbsp; </span>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={dismissBanner}
              className="flex-shrink-0 p-1 rounded-full hover:bg-red-300/50 transition-colors text-red-700"
              aria-label="Dismiss banner"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
