export const instant = false;

import { Suspense } from "react";
import RoomsClient from "./RoomsClient";

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-slate-200 rounded w-48"></div>
            <div className="h-10 bg-slate-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl mt-6"></div>
        </div>
      }
    >
      <RoomsClient />
    </Suspense>
  );
}
