"use client";

import React from "react";

export default function StudentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 6 Bento Analytics Cards Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white border border-[#E1EAF4] shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-200" />
              <div className="w-14 h-4 rounded-full bg-slate-100" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="w-16 h-7 rounded-lg bg-slate-200" />
              <div className="w-24 h-3.5 rounded bg-slate-100" />
              <div className="w-28 h-3 rounded bg-slate-100" />
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2" />
          </div>
        ))}
      </div>

      {/* Tabs and Command Search Skeleton */}
      <div className="p-4 rounded-2xl bg-white border border-[#E1EAF4] space-y-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-28 h-9 rounded-xl bg-slate-100 shrink-0" />
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-3 pt-2">
          <div className="flex-1 h-11 rounded-xl bg-slate-100" />
          <div className="flex gap-2">
            <div className="w-32 h-11 rounded-xl bg-slate-100" />
            <div className="w-28 h-11 rounded-xl bg-slate-100" />
            <div className="w-28 h-11 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl bg-white border border-[#E1EAF4] overflow-hidden shadow-2xs">
        <div className="h-12 bg-[#F5F8FC] border-b border-[#E1EAF4]" />
        <div className="divide-y divide-[#E1EAF4]/60">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="w-4 h-4 rounded bg-slate-200" />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-slate-200 shrink-0" />
                <div className="space-y-1.5 flex-1 max-w-xs">
                  <div className="w-32 h-4 rounded bg-slate-200" />
                  <div className="w-20 h-3 rounded bg-slate-100" />
                </div>
              </div>
              <div className="w-24 h-6 rounded-xl bg-slate-100 hidden md:block" />
              <div className="w-32 h-4 rounded bg-slate-100 hidden lg:block" />
              <div className="w-24 h-6 rounded-xl bg-slate-100" />
              <div className="w-20 h-6 rounded-full bg-slate-200" />
              <div className="w-16 h-6 rounded-lg bg-slate-100" />
              <div className="w-8 h-8 rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}