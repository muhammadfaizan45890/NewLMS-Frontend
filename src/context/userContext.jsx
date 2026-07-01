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

  // ---------- ADVANCED LOADING SCREEN ----------
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-50">
        <div className="text-center">
          {/* Brand Logo / Name */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                WebCraft
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-lg md:text-xl ml-1">
                Studio
              </span>
            </h1>
          </div>

          {/* Advanced Spinner */}
          <div className="relative w-20 h-20 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 border-4 border-t-transparent border-r-transparent border-purple-600 rounded-full animate-spin"></div>
            {/* Inner dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading text with animated dots */}
          <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base">
            Loading
            <span className="inline-flex gap-1 ml-1">
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          </p>

          {/* Optional subtle tagline */}
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Crafting digital experiences
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
