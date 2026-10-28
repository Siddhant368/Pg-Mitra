"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      try {
        const data = await fetchApi("/auth/me");
        if (mounted) {
          setUser(data);
        }
      } catch (err) {
        if (mounted) {
          setUser(null);
          // Redirect to login if user is null and not on auth pages
          if (!pathname.startsWith('/login') && !pathname.startsWith('/signup') && pathname !== '/') {
            router.push('/login');
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    loadUser();
    
    return () => {
      mounted = false;
    };
  }, [pathname, router]); // Reload user if pathname changes (helps with state sync)

  const logout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API error:", err);
    }
    
    try {
      // Clear cookie explicitly on the Next.js side to ensure middleware syncs perfectly
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Frontend logout error:", err);
    }
    
    setUser(null);
    // Force a hard navigation to clear Next.js client-side router cache and reset state completely
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
