import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-500">
            CSE 6th Semester &bull; Life Update
          </span>
        </div>
        <p className="text-xs text-slate-600">
          Weeks 11–14 &bull; March 28 – April 24, 2026
        </p>
      </div>
    </footer>
  );
}
