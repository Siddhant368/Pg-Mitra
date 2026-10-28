import { Clock } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Clock className="h-8 w-8 text-slate-400" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{title} - Coming Soon</h1>
      <p className="text-slate-500 max-w-md">
        We are actively working on this feature. Check back later to see it in action!
      </p>
    </div>
  );
}
