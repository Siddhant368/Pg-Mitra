import React, { ButtonHTMLAttributes } from "react";
import { ArrowRight } from "lucide-react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function AuthButton({ loading, children, ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="group w-full h-[58px] flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#087F73] to-[#0F766E] text-white font-semibold shadow-[0_4px_14px_0_rgba(15,118,110,0.39)] hover:shadow-[0_6px_20px_rgba(15,118,110,0.23)] hover:brightness-110 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
    >
      <span>{loading ? "Please wait..." : children}</span>
      {!loading && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
    </button>
  );
}
