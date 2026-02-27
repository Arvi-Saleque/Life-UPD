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
} from "lucide-react";
import { motion } from "framer-motion";

export function QuickStats({ events }: { events: LifeEvent[] }) {
  const now = new Date();

  // Upcoming events sorted by date
  const upcoming = events
    .filter((e) => parseISO(e.date) >= now)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Count by type
  const cts = events.filter((e) => e.type === "CT").length;
  const assignments = events.filter((e) => e.type === "Assignment").length;
  const labTests = events.filter((e) => e.type === "Lab Test").length;
  const projects = events.filter((e) => e.type === "Project").length;

  // Next event
  const next = upcoming[0];
  const nextCourse = next ? getCourse(next.course) : null;
  const nextDaysLeft = next
    ? differenceInDays(parseISO(next.date), now)
    : null;

  // Urgent events (within 3 days)
  const urgentCount = upcoming.filter(
    (e) => differenceInDays(parseISO(e.date), now) <= 3
  ).length;

  const stats = [
    {
      icon: FileText,
      label: "Class Tests",
      value: cts,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: Upload,
      label: "Assignments",
      value: assignments,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: FlaskConical,
      label: "Lab Tests",
      value: labTests,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      icon: FolderGit2,
      label: "Projects",
      value: projects,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <section className="border-b border-slate-800 bg-slate-950/50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center"
            >
              <div
                className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Next up + urgent banner */}
        <div className="grid gap-3 sm:grid-cols-2">
          {next && nextCourse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-500/5 to-violet-500/5 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Coming Up Next</p>
                <p className="text-sm font-semibold text-white">
                  {next.title}
                  <span className={`ml-2 text-xs font-normal ${nextCourse.text}`}>
                    {nextCourse.shortName}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  {format(parseISO(next.date), "MMM d")} •{" "}
                  {nextDaysLeft === 0
                    ? "Today"
                    : nextDaysLeft === 1
                      ? "Tomorrow"
                      : `${nextDaysLeft} days`}
                </p>
              </div>
            </motion.div>
          )}

          {urgentCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-red-400/70">Attention</p>
                <p className="text-sm font-semibold text-white">
                  {urgentCount} event{urgentCount !== 1 ? "s" : ""} within 3 days
                </p>
                <p className="text-xs text-slate-400">
                  Don&apos;t miss upcoming deadlines
                </p>
              </div>
            </motion.div>
          )}

          {urgentCount === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Clock className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-emerald-400/70">All Clear</p>
                <p className="text-sm font-semibold text-white">
                  No urgent deadlines
                </p>
                <p className="text-xs text-slate-400">
                  {upcoming.length} events coming up
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
