"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Life Update
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/#weekly"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Weekly
          </Link>
          <Link
            href="/#calendar"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Calendar
          </Link>
          <Link
            href="/admin/login"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            CR Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
