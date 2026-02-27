"use client";

import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">
              CSE 6th Semester &bull; Weeks 11–14
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Life Update
        </motion.h1>

        <motion.p
          className="mx-auto mb-8 max-w-lg text-lg text-slate-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Everything you need to know for the remaining 4 weeks.
          CTs, assignments, labs, projects — all in one place.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#weekly"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40"
          >
            <Calendar className="h-4 w-4" />
            View Schedule
          </a>
          <a
            href="#calendar"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            Calendar View
          </a>
        </motion.div>

        {/* Week progress bar */}
        <motion.div
          className="mx-auto mt-16 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-3 flex justify-between text-xs text-slate-500">
            <span>Semester Progress</span>
            <span>10 / 14 weeks done</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
              style={{ width: "71.4%" }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-600">
            <span>Week 1</span>
            <span>Week 14</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
