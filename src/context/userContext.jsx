// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import API from "@/utils/api";

// export const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const logout = useCallback(() => {
//     localStorage.removeItem("accessToken");
//     setUser(null);
//   }, []);

//   const loadUser = useCallback(async () => {
//     try {
//       const token = localStorage.getItem("accessToken");

//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(`${API}/auth/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data?.success) {
//         setUser(res.data.user);
//       } else {
//         logout();
//       }
//     } catch (error) {
//       console.error("User restore failed:", error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   }, [logout]);

//   useEffect(() => {
//     loadUser();
//   }, [loadUser]); // ✅ stable dependency

//   // ✅ Prevent rendering children until auth check is complete
//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
//         <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         setUser,
//         logout,
//         loading,
//         loadUser,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const getData = () => useContext(UserContext);









import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import API from "@/utils/api";
import { GraduationCap } from "lucide-react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        setUser(res.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error("User restore failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ---------- LOADING SCREEN (LIGHT GRAY THEME) ----------
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center max-w-sm mx-auto px-4">
          {/* Brand Name */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Course<span className="text-gray-700">Academy</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 tracking-wider uppercase">
              Learn. Grow. Succeed.
            </p>
          </div>

          {/* Graduation Cap with Spinning Ring (Gray) */}
          <div className="relative w-24 h-24 mx-auto">
            {/* Outer spinning ring (gray gradient) */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-600 border-r-gray-400 border-b-gray-600 border-l-gray-400 animate-spin"></div>
            
            {/* Inner static ring (light gray) */}
            <div className="absolute inset-2 rounded-full border-2 border-gray-200"></div>
            
            {/* Graduation Cap Icon (Lucide) - Gray */}
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-gray-600 animate-pulse" />
            </div>
          </div>

          {/* Loading text with animated dots */}
          <p className="mt-6 text-gray-700 font-medium text-sm sm:text-base">
            Loading
            <span className="inline-flex gap-1 ml-1">
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          </p>

          {/* Optional sub‑message */}
          <p className="mt-2 text-xs text-gray-400">
            Preparing your learning experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
        loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const getData = () => useContext(UserContext);
