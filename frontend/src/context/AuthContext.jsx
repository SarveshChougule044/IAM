import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }

    setAuthLoading(false);
  }, []);

  const transferGuestAssessment = (userData) => {
    if (!userData || !userData.uid) return;
    const guestResult = localStorage.getItem("assessmentResult_guest");
    if (guestResult) {
      localStorage.setItem(`assessmentResult_${userData.uid}`, guestResult);
      localStorage.removeItem("assessmentResult_guest");
    }
  };

  const login = ({ user: userData, token: authToken }) => {
    if (authToken) {
      localStorage.setItem("token", authToken);
      setToken(authToken);
    }

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      transferGuestAssessment(userData);
    }
  };

  const register = ({ user: userData, token: authToken }) => {
    if (authToken) {
      localStorage.setItem("token", authToken);
      setToken(authToken);
    }

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      transferGuestAssessment(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      authLoading,
      login,
      register,
      logout,
    }),
    [user, token, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}