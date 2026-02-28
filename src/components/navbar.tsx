"use client";

import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient">
            Life Update
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/#all-events"
            className="rounded-xl px-4 py-2 text-sm text-slate-400 transition-all hover:text-white hover:bg-white/5"
          >
            Upcoming Events
          </Link>
          <Link
            href="/#weekly"
            className="rounded-xl px-4 py-2 text-sm text-slate-400 transition-all hover:text-white hover:bg-white/5"
          >
            Weekly
          </Link>
          <Link
            href="/#calendar"
            className="rounded-xl px-4 py-2 text-sm text-slate-400 transition-all hover:text-white hover:bg-white/5"
          >
            Calendar
          </Link>
          <Link
            href="/admin/login"
            className="ml-2 rounded-xl bg-gradient-to-r from-blue-600/80 to-violet-600/80 px-5 py-2 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-violet-600 hover:shadow-lg hover:shadow-blue-500/20"
          >
            CR Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/5 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-white/5 px-6 py-4 space-y-2 glass-strong">
          <Link
            href="/#all-events"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            Upcoming Events
          </Link>
          <Link
            href="/#weekly"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            Weekly Schedule
          </Link>
          <Link
            href="/#calendar"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            Calendar
          </Link>
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="block rounded-xl bg-gradient-to-r from-blue-600/80 to-violet-600/80 px-4 py-3 text-sm font-medium text-white text-center"
          >
            CR Login
          </Link>
        </div>
      )}
    </nav>
  );
}
