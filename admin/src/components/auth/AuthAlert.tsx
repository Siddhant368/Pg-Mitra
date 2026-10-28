import React from "react";

export function AuthAlert({ children, type = "error" }: { children: React.ReactNode, type?: "error" | "success" }) {
  const isError = type === "error";
  return (
    <div className={`p-4 rounded-xl text-sm mb-6 ${isError ? "bg-red-100 text-red-900" : "bg-mint-300/20 text-forest-900"}`} role="alert">
      {children}
    </div>
  );
}
