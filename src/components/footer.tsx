import { GraduationCap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-slate-950 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20">
            <GraduationCap className="h-4 w-4 text-slate-400" />
          </div>
          <span className="text-sm font-semibold text-slate-400">
            CSE 6th Semester &bull; Life Update
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span>Weeks 11–14</span>
          <span>&bull;</span>
          <span>March 28 – April 24, 2026</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500/50" />
          <span>for the batch</span>
        </div>
      </div>
    </footer>
  );
}
