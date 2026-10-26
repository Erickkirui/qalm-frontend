import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { tokenStore } from "../api/index.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!tokenStore.get()) {
        setBooting(false);
        return;
      }
      try {
        const me = await api.auth.me();
        if (alive) setUser(me);
      } catch {
        tokenStore.clear();
      } finally {
        if (alive) setBooting(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.auth.login(email, password);
    const token = res.access_token || res.token || "";
    if (token) tokenStore.set(token);
    const next = res.user || (await api.auth.me());
    setUser(next);
    return next;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await api.auth.register(payload);
    const token = res.access_token || res.token || "";
    if (token) tokenStore.set(token);
    const next = res.user || (await api.auth.me());
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    api.auth.logout?.();
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = {
    user,
    booting,
    login,
    register,
    logout,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
