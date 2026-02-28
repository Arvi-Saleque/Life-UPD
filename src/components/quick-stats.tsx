"use client";

import { LifeEvent } from "@/lib/types";
import { getCourse } from "@/lib/courses";
import { differenceInDays, parseISO, format } from "date-fns";
import {
  FileText,
  Upload,
  FlaskConical,
  FolderGit2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(v);
    });
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref}>0</span>;
}

export function QuickStats({ events }: { events: LifeEvent[] }) {
  const now = new Date();

  const upcoming = events
    .filter((e) => e.date && parseISO(e.date) >= now)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

  const cts = events.filter((e) => e.type === "CT").length;
  const assignments = events.filter((e) => e.type === "Assignment").length;
  const labTests = events.filter((e) => e.type === "Lab Test").length;
  const projects = events.filter((e) => e.type === "Project").length;

  const next = upcoming[0];
  const nextCourse = next ? getCourse(next.course) : null;
  const nextDaysLeft = next?.date
    ? differenceInDays(parseISO(next.date), now)
    : null;

  const urgentCount = upcoming.filter(
    (e) => e.date && differenceInDays(parseISO(e.date), now) <= 3
  ).length;



  const stats = [
    {
      icon: FileText,
      label: "Class Tests",
      value: cts,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      glow: "shadow-blue-500/10",
    },
    {
      icon: Upload,
      label: "Assignments",
      value: assignments,
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      glow: "shadow-emerald-500/10",
    },
    {
      icon: FlaskConical,
      label: "Lab Tests",
      value: labTests,
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      glow: "shadow-amber-500/10",
    },
    {
      icon: FolderGit2,
      label: "Projects",
      value: projects,
      gradient: "from-violet-500/20 to-purple-500/20",
      iconColor: "text-violet-400",
      iconBg: "bg-violet-500/10",
      glow: "shadow-violet-500/10",
    },
  ];

  return (
    <section className="relative py-12 sm:py-16">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-blue-600/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl glass p-5 sm:p-6 hover-card shadow-xl ${stat.glow}`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative">
                <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                  <AnimatedNumber value={stat.value} />
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banners */}
        <div className="grid gap-4 sm:grid-cols-2">
          {next && nextCourse && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="group relative overflow-hidden rounded-2xl glass p-5 hover-card"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-violet-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-0.5">Coming Up Next</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {next.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                    <span className={`${nextCourse.text} font-medium`}>{nextCourse.shortName}</span>
                    <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                    <span>{next.date ? format(parseISO(next.date), "MMM d") : "TBD"}</span>
                    <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      {nextDaysLeft === 0
                        ? "Today"
                        : nextDaysLeft === 1
                          ? "Tomorrow"
                          : `${nextDaysLeft}d left`}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`group relative overflow-hidden rounded-2xl glass p-5 hover-card ${
              urgentCount > 0 ? "border-red-500/20" : "border-emerald-500/20"
            }`}
          >
            <div className={`absolute inset-0 ${
              urgentCount > 0
                ? "bg-gradient-to-r from-red-500/5 to-orange-500/5"
                : "bg-gradient-to-r from-emerald-500/5 to-teal-500/5"
            } opacity-0 transition-opacity group-hover:opacity-100`} />
            <div className="relative flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                urgentCount > 0
                  ? "bg-gradient-to-br from-red-500/20 to-orange-500/20"
                  : "bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
              }`}>
                {urgentCount > 0 ? (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                ) : (
                  <Zap className="h-5 w-5 text-emerald-400" />
                )}
              </div>
              <div>
                {urgentCount > 0 ? (
                  <>
                    <p className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-0.5">Attention</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {urgentCount} event{urgentCount !== 1 ? "s" : ""} within 3 days
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Don&apos;t miss upcoming deadlines</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-0.5">All Clear</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">No urgent deadlines</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{upcoming.length} events ahead</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  );
}
