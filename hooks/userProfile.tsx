import { useEffect, useState, useCallback } from "react";
import { fetchUserProfile } from "@/services/userService";

export default function useUser() {
  const [user, setUser] = useState<any>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ reusable fetch function
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchUserProfile(token);
      setUser(data);
      setIsAuth(true);
    } catch (err) {
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ✅ logout helper
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsAuth(false);
  };

  return {
    user,
    isAuth,
    loading,
    setUser,          // 🔥 manual updates (streak, profile)
    refreshUser: loadUser, // 🔥 refetch anytime
    logout,           // 🔥 central logout
  };
}