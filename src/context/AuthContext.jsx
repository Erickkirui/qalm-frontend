import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getApiPrefix } from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Check for an existing session on page load/refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("qalm_user");
        const token = localStorage.getItem("access_token");

        if (storedUser && token) {
          setUser(JSON.parse(storedUser).user);
        }
      } catch (err) {
        console.error("Failed to restore session", err);
        localStorage.removeItem("qalm_user");
        localStorage.removeItem("access_token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 2. Login function
  const login = useCallback(async (email, password) => {
    setError(null);
    const apiBase = getApiPrefix();
    
    const response = await fetch(`${apiBase}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("qalm_user", JSON.stringify(data));
    
    setUser(data.user);
    return data;
  }, []);

  // 3. Register function
  const register = useCallback(async (formData) => {
    setError(null);
    const apiBase = getApiPrefix();

    const response = await fetch(`${apiBase}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data; 
  }, []);

  // 4. Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("qalm_user");
    setUser(null);
    navigate("/auth");
  }, [navigate]);

  const value = { user, setUser, loading, error, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return children;
}

export function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
        return;
      }

      // Allow access if the user's role is in the list, 
      // OR if the route accepts "therapist" and the user has the profile flag.
      const hasRole = roles.includes(user.role);
      const isTherapist = user.has_therapist_profile === true && roles.includes("therapist");

      if (!hasRole && !isTherapist) {
        navigate("/dashboard"); 
      }
    }
  }, [user, loading, roles, navigate]);

  if (loading) return null;
  if (!user) return null;

  const hasRole = roles.includes(user.role);
  const isTherapist = user.has_therapist_profile === true && roles.includes("therapist");

  if (!hasRole && !isTherapist) return null;
  
  return children;
}