import React from "react";

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-line"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-page text-muted">
          {children}
        </span>
      </div>
    </div>
  );
}
