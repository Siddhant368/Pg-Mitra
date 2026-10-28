"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && (user.role === "OWNER" || user.role === "SUPER_ADMIN")) {
        router.replace("/owner/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#0B5A4B] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium">Redirecting...</p>
      </div>
    </div>
  );
}
