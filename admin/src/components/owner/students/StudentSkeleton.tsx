"use client";

import React from "react";

export default function StudentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 6 Analytics Cards Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-200" />
              <div className="w-12 h-4 rounded-full bg-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="w-16 h-7 rounded-lg bg-slate-200" />
              <div className="w-24 h-3.5 rounded bg-slate-100" />
              <div className="w-32 h-3 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs and Filter Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-white border border-[#E1EAF4] space-y-4">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-28 h-8 rounded-xl bg-slate-100" />
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-10 rounded-xl bg-slate-100" />
          <div className="w-32 h-10 rounded-xl bg-slate-100" />
          <div className="w-32 h-10 rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl bg-white border border-[#E1EAF4] overflow-hidden">
        <div className="h-12 bg-[#F5F8FC] border-b border-[#E1EAF4]" />
        <div className="divide-y divide-[#E1EAF4]/50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="w-5 h-5 rounded bg-slate-200" />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
                <div className="space-y-1.5 flex-1 max-w-xs">
                  <div className="w-32 h-4 rounded bg-slate-200" />
                  <div className="w-20 h-3 rounded bg-slate-100" />
                </div>
              </div>
              <div className="w-28 h-4 rounded bg-slate-100 hidden md:block" />
              <div className="w-24 h-4 rounded bg-slate-100 hidden lg:block" />
              <div className="w-16 h-6 rounded-full bg-slate-200" />
              <div className="w-16 h-6 rounded-full bg-slate-200" />
              <div className="w-8 h-8 rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
