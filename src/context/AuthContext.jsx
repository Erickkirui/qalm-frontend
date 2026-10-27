import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, fake, apiFetch } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState(null);

  // Check for an existing session (demo token or stored token)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = localStorage.getItem("qalm_token");
        setDemo(!token);
        if (token) {
          const res = await apiFetch("/auth/me");
          if (!cancelled) setUser(res.user);
        } else {
          // Fall back to the demo account so the app can be explored without a backend
          try {
            const { user: u, token: t } = await fake.login("user@qalm.test", "password123");
            if (!cancelled) {
              setUser(u);
              setDemo(true);
              localStorage.setItem("qalm_token", t);
            }
          } catch (_) {
            setDemo(true);
          }
        }
      } catch (_) {
        setDemo(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: u, token } = await fake.login(email, password);
    setUser(u);
    setDemo(true);
    localStorage.setItem("qalm_token", token);
  }, []);

  const register = useCallback(async (input) => {
    const { user: u, token } = await fake.register(input);
    setUser(u);
    setDemo(true);
    localStorage.setItem("qalm_token", token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("qalm_token");
    setUser(null);
  }, []);

  const value = { user, loading, demo, error, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center py-20"><div className="skeleton h-8 w-48"></div></div>;
  if (!user) return <span className="sr-only">Signed out</span>;
  return children;
}

export function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || !roles.includes(user.role)) return null;
  return children;
}
