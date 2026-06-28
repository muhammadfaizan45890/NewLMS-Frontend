import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Home, Menu, X, LogOut, User,
  ChevronDown, Shield, BarChart3, UsersRound,
  Eye, Lock, Map,
  GraduationCap
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
  const accessToken = localStorage.getItem('accessToken');
  const userRole = user?.role || 'user';

  // Scroll effect
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

  // Navigation items (memoized)
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

  // Logout
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
        <div className="flex items-center justify-between h-[62px] gap-3">

          {/* Left: logo only (no menu toggle) */}
          <div className="flex items-center gap-1 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              {/* Graduation cap – hidden on mobile, visible on sm+ */}
              <div className=" bg-black text-white p-2 rounded-full">
                <GraduationCap size={20} />
              </div>
              {/* "LMS" text – always visible */}
              <span className="font-bold text-[1.1rem] tracking-wide block">
                
                <span className="text-black"></span>
                <span className="text-gray-700">LMS</span>
              </span>
            </Link>
          </div>

          {/* Right: user menu or Login */}
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
              <Link to="/login">
                <button className="h-8 px-4 text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400/50">
                  Log in
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;