"use client";
import React, { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
}

export function AuthInput({ id, label, type, icon: Icon, error, ...inputProps }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col space-y-1">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-600/70 group-focus-within:text-forest-600 transition-colors z-10">
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="relative w-full h-[60px] bg-white rounded-xl border border-line shadow-sm hover:border-forest-600/30 focus-within:border-forest-600 focus-within:ring-4 focus-within:ring-forest-600/10 transition-all">
          <label 
            htmlFor={id} 
            className="absolute left-[44px] top-[10px] text-[11px] font-semibold text-muted tracking-wide select-none pointer-events-none uppercase"
          >
            {label}
          </label>
          <input
            id={id}
            type={currentType}
            className="w-full h-full bg-transparent outline-none border-none text-ink text-[15px] font-medium pl-[44px] pr-12 pt-[22px] pb-[6px] placeholder:text-muted/40 placeholder:font-normal"
            {...inputProps}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-forest-600 transition-colors z-10"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="text-red-700 text-sm pl-2 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
