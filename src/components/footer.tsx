import { GraduationCap, Heart, Github } from "lucide-react";

const ENCOURAGING = [
  "You're closer to the finish line than you think 🚀",
  "4 weeks left — you've survived 10. Keep going 💪",
  "Future engineers don't quit. They debug 🔧",
];

export function Footer() {
  const msg = ENCOURAGING[Math.floor(Math.random() * ENCOURAGING.length)];

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20">
            <GraduationCap className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </div>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            CSE 6th Semester &bull; Life Update
          </span>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 italic max-w-xs">{msg}</p>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-600">
          <span>Weeks 11–14</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>March 28 – April 24, 2026</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-700">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500/50" />
            <span>for the batch</span>
          </div>
          <a
            href="https://github.com/Arvi-Saleque/Life-UPD"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 dark:text-slate-700 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
