import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Verify from './pages/Verify';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';
import AuthSuccess from './pages/AuthSuccess';
import NotFound from './pages/NotFound';
import UserLayout from './pages/User/UserLayout';
import UserDashboard from './pages/User/UserDashboard';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserProfile from './pages/User/UserProfile';
import AdminProfile from './pages/Admin/AdminProfile';
import AdminCourses from './pages/Admin/AdminCourses';
import AdminModules from './pages/Admin/AdminModules';
import AdminNotes from './pages/Admin/AdminNotes';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminRefund from './pages/Admin/AdminRefund';
import ActiveCourses from './pages/User/ActiveCourses';
import Notes from './pages/User/Notes';
import RefundRequest from './pages/User/RefundRequest';
import Video from './pages/User/Video';
import ApplyCertificate from './pages/User/ApplyCertificate';
import LMSGuide from './pages/User/LMSGuide'; // <-- ADDED THIS
import AdminCertificate from './pages/Admin/AdminCertificate';

// Layout component that conditionally shows Navbar
const RootLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Paths where navbar should be hidden (auth pages)
  const isAuthPage =
    path === '/signup' ||
    path === '/login' ||
    path === '/forgot-password' ||
    path === '/auth-success' ||
    path.startsWith('/verify') ||
    path.startsWith('/verify-otp') ||
    path.startsWith('/change-password');

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      { path: '/', element: <Home /> },
      { path: '/verify', element: <VerifyEmail /> },
      { path: '/verify/:token', element: <Verify /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/auth-success', element: <AuthSuccess /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/verify-otp/:email', element: <VerifyOTP /> },
      { path: '/change-password/:email', element: <ChangePassword /> },


      // ---- Protected user routes (with sidebar) ----
      {
        element: <ProtectedRoute requiredRole="user"><UserLayout /></ProtectedRoute>,
        children: [
          { path: '/courses', element: <UserDashboard /> },
          { path: '/profile', element: <UserProfile /> },
          { path: '/active-courses', element: <ActiveCourses /> },
          { path: '/notes', element: <Notes /> },
          { path: '/guide', element: <LMSGuide /> },
          { path: '/apply-refund', element: <RefundRequest /> },
          { path: '/certificate', element: <ApplyCertificate /> },
          { path: '/video', element: <Video /> },
        ],
      },

      // ---- Admin‑only routes ----
      {
        element: <ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>,
        children: [
          { path: '/admin/dashboard', element: <AdminDashboard /> },
          { path: '/admin/profile', element: <AdminProfile /> },
          { path: '/admin/courses', element: <AdminCourses /> },
          { path: '/admin/modules', element: <AdminModules /> },
          { path: '/admin/notes', element: <AdminNotes /> },
          { path: '/admin/refund', element: <AdminRefund /> },
          { path: '/admin/users', element: <AdminUsers /> },
          { path: '/admin/certificaterequests', element: <AdminCertificate /> },

        ],
      },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;