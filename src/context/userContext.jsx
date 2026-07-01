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

  // ---------- COURSE ACADEMY LOADING SCREEN ----------
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          {/* Brand / Academy Name */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Course<span className="text-blue-600">Academy</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Learn. Grow. Succeed.</p>
          </div>

          {/* Clean Spinner (gray/blue theme) */}
          <div className="relative w-16 h-16 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            {/* Spinning gradient ring (blue) */}
            <div className="absolute inset-0 border-4 border-t-transparent border-r-transparent border-blue-600 rounded-full animate-spin"></div>
            {/* Inner dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading text with animated dots */}
          <p className="mt-6 text-gray-700 font-medium text-sm md:text-base">
            Loading
            <span className="inline-flex gap-1 ml-1">
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
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
