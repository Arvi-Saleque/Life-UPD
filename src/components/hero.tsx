"use client";

import { motion } from "framer-motion";
import { Calendar, Sparkles, ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px] animate-float" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[120px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[150px] animate-float-slow" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300 tracking-wide">
              CSE 6th Semester &bull; Weeks 11–14
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="mb-6 text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <span className="text-gradient-brand">Life</span>{" "}
          <span className="text-gradient">Update</span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-10 max-w-xl text-base sm:text-lg text-slate-400 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Everything you need for the final 4 weeks — CTs, assignments,
          labs, projects — beautifully organized in one place.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <a
            href="#weekly"
            className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="h-4 w-4 transition-transform group-hover:-rotate-12" />
            View Schedule
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
          <a
            href="#calendar"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white hover:scale-[1.02] active:scale-[0.98]"
          >
            Calendar View
          </a>
        </motion.div>

        {/* Semester progress */}
        <motion.div
          className="mx-auto mt-20 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="glass rounded-2xl p-6">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Semester Progress</span>
              <span className="text-white font-semibold">71%</span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-slate-800/80">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500"
                initial={{ width: "0%" }}
                animate={{ width: "71.4%" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-white/20 to-blue-500/0 animate-shimmer" />
            </div>
            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>10 weeks completed</span>
              <span>4 weeks remaining</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5 text-slate-600" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
