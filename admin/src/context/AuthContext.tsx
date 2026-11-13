"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchApi, getAuthToken, clearAuthSession } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync state and localStorage
  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (typeof window !== "undefined") {
      try {
        if (newUser) {
          localStorage.setItem("user", JSON.stringify(newUser));
        } else {
          localStorage.removeItem("user");
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const token = getAuthToken();

      // If no token at all, user is not logged in
      if (!token) {
        if (mounted) {
          setUserState(null);
          setLoading(false);
        }
        return;
      }

      // 1. Optimistic hydration: restore cached user immediately (0ms UI unblock)
      let hasCachedUser = false;
      try {
        const savedUserStr = localStorage.getItem("user");
        if (savedUserStr) {
          const cachedUser = JSON.parse(savedUserStr);
          if (cachedUser && (cachedUser.id || cachedUser._id)) {
            hasCachedUser = true;
            if (mounted) {
              setUserState(cachedUser);
              setLoading(false);
            }
          }
        }
      } catch {}

      // 2. Silent background revalidation: verify token & fetch freshest user profile
      try {
        const data = await fetchApi("/auth/me");
        if (mounted && data) {
          setUser(data);
        }
      } catch (err: any) {
        // Only invalidate if the backend explicitly rejected authentication
        if (err?.status === 401 || err?.status === 403) {
          if (mounted) {
            setUser(null);
            clearAuthSession();
          }
        }
        // If network error / cold-start timeout, cached user remains intact
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [setUser]); // Run ONCE on mount, NOT on every page navigation!

  const logout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API error:", err);
    }
    
    clearAuthSession();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
