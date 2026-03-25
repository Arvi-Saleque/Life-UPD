"use client";

import { useState, useMemo } from "react";
import { LifeEvent, EventType, WEEKS } from "@/lib/types";
import { EventCard } from "./event-card";
import { format, parseISO } from "date-fns";
import {
  CalendarRange,
  Inbox,
  FileText,
  Upload,
  FlaskConical,
  FolderGit2,
  Presentation,
  HelpCircle,
  Filter,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_OPTIONS: {
  type: EventType | "All";
  label: string;
  icon: React.ElementType;
  color: string;
  activeBg: string;
  activeText: string;
}[] = [
  {
    type: "All",
    label: "All",
    icon: SlidersHorizontal,
    color: "text-slate-400",
    activeBg: "bg-slate-900/10 border-slate-900/20 dark:bg-white/10 dark:border-white/20",
    activeText: "text-slate-900 dark:text-white",
  },
  {
    type: "CT",
    label: "Class Tests",
    icon: FileText,
    color: "text-rose-400",
    activeBg: "bg-rose-500/15 border-rose-500/30",
    activeText: "text-rose-300",
  },
  {
    type: "Assignment",
    label: "Assignments",
    icon: Upload,
    color: "text-sky-400",
    activeBg: "bg-sky-500/15 border-sky-500/30",
    activeText: "text-sky-300",
  },
  {
    type: "Lab Test",
    label: "Lab Tests",
    icon: FlaskConical,
    color: "text-amber-400",
    activeBg: "bg-amber-500/15 border-amber-500/30",
    activeText: "text-amber-300",
  },
  {
    type: "Project",
    label: "Projects",
    icon: FolderGit2,
    color: "text-emerald-400",
    activeBg: "bg-emerald-500/15 border-emerald-500/30",
    activeText: "text-emerald-300",
  },
  {
    type: "Presentation",
    label: "Presentations",
    icon: Presentation,
    color: "text-pink-400",
    activeBg: "bg-pink-500/15 border-pink-500/30",
    activeText: "text-pink-300",
  },
  {
    type: "Quiz",
    label: "Quizzes",
    icon: HelpCircle,
    color: "text-orange-400",
    activeBg: "bg-orange-500/15 border-orange-500/30",
    activeText: "text-orange-300",
  },
  {
    type: "Seminar",
    label: "Seminars",
    icon: Presentation,
    color: "text-indigo-400",
    activeBg: "bg-indigo-500/15 border-indigo-500/30",
    activeText: "text-indigo-300",
  },
];

export function WeeklyTimeline({ events }: { events: LifeEvent[] }) {
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventType | "All">("All");

  // Find the first week with events
  const defaultWeek = useMemo(() => {
    return WEEKS.find((w) => events.some((e) => e.week === w.number))?.number ?? 11;
  }, [events]);

  const currentWeek = activeWeek ?? defaultWeek;

  // Events for the selected week
  const weekEvents = useMemo(() => {
    return events
      .filter((e) => e.week === currentWeek)
      .sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"));
  }, [events, currentWeek]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (activeFilter === "All") return weekEvents;
    return weekEvents.filter((e) => e.type === activeFilter);
  }, [weekEvents, activeFilter]);

  // Count per type for current week (for filter badges)
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of weekEvents) {
      counts[e.type] = (counts[e.type] ?? 0) + 1;
    }
    return counts;
  }, [weekEvents]);

  // Existing filter types in this week
  const availableFilters = FILTER_OPTIONS.filter(
    (f) => f.type === "All" || (typeCounts[f.type] ?? 0) > 0
  );

  const currentWeekInfo = WEEKS.find((w) => w.number === currentWeek)!;

  return (
    <section id="weekly" className="relative py-20 sm:py-28">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-40 -left-20 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 backdrop-blur-sm">
            <CalendarRange className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-500 dark:text-blue-300 uppercase tracking-wider">
              Week by Week
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-3">
            Weekly Schedule
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Select a week and filter by type to find what you need
          </p>
        </motion.div>

        {/* ─── Week Selector ─── */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-3 p-1.5 rounded-2xl glass overflow-x-auto max-w-full">
            {WEEKS.map((week) => {
              const count = events.filter((e) => e.week === week.number).length;
              const isActive = currentWeek === week.number;
              return (
                <button
                  key={week.number}
                  onClick={() => {
                    setActiveWeek(week.number);
                    setActiveFilter("All");
                  }}
                  className={`relative shrink-0 rounded-xl px-3 sm:px-6 py-2.5 sm:py-3.5 text-center transition-all duration-300 ${
                    isActive
                      ? "bg-slate-900/10 dark:bg-white/10 shadow-lg"
                      : "hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId="weekIndicator"
                      className="absolute inset-x-2 -bottom-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`block text-xs sm:text-sm font-bold transition-colors ${
                    isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
                  }`}>
                    W{week.number}
                  </span>
                  <span className={`hidden sm:block text-[10px] mt-0.5 transition-colors ${
                    isActive ? "text-slate-500 dark:text-slate-300" : "text-slate-400 dark:text-slate-600"
                  }`}>
                    {format(parseISO(week.startDate), "MMM d")} – {format(parseISO(week.endDate), "d")}
                  </span>
                  {count > 0 && (
                    <span className={`block text-[9px] mt-0.5 font-semibold transition-colors ${
                      isActive ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Week date range subtitle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
            <div>
              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                Week {currentWeek}
              </p>
              <p className="text-xs text-slate-500">
                {format(parseISO(currentWeekInfo.startDate), "MMMM d")} –{" "}
                {format(parseISO(currentWeekInfo.endDate), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
          <span className="rounded-xl bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400">
            {weekEvents.length} event{weekEvents.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ─── Filter Chips ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter by type</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableFilters.map((filter) => {
              const isActive = activeFilter === filter.type;
              const count = filter.type === "All" ? weekEvents.length : (typeCounts[filter.type] ?? 0);
              return (
                <button
                  key={filter.type}
                  onClick={() => setActiveFilter(filter.type)}
                  className={`group inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? `${filter.activeBg} ${filter.activeText}`
                      : "border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/10"
                  }`}
                >
                  <filter.icon className={`h-3.5 w-3.5 transition-colors ${
                    isActive ? filter.activeText : "text-slate-600 group-hover:text-slate-400"
                  }`} />
                  <span className="hidden sm:inline">{filter.label}</span>
                  <span className="sm:hidden">{filter.type === "All" ? "All" : filter.type}</span>
                  <span className={`ml-0.5 tabular-nums rounded-md px-1.5 py-0.5 text-[10px] ${
                    isActive ? "bg-black/5 dark:bg-white/10" : "bg-black/5 dark:bg-white/5"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Clear filter button */}
            {activeFilter !== "All" && (
              <button
                onClick={() => setActiveFilter("All")}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-white/5 px-2.5 py-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ─── Events List ─── */}
        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            <motion.div
              key={`${currentWeek}-${activeFilter}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* Active filter indicator */}
              {activeFilter !== "All" && (
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span>Showing</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{filteredEvents.length}</span>
                  <span>{activeFilter}{filteredEvents.length !== 1 ? "s" : ""}</span>
                  <span>in Week {currentWeek}</span>
                </div>
              )}
              {filteredEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${currentWeek}-${activeFilter}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-slate-500"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl glass">
                <Inbox className="h-7 w-7 text-slate-400 dark:text-slate-600" />
              </div>
              <p className="text-sm font-medium">
                {activeFilter !== "All"
                  ? `No ${activeFilter}s in Week ${currentWeek}`
                  : "No events scheduled"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {activeFilter !== "All"
                  ? "Try a different filter or week"
                  : "Check back later or contact the CR"}
              </p>
              {activeFilter !== "All" && (
                <button
                  onClick={() => setActiveFilter("All")}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  <X className="h-3 w-3" />
                  Clear filter
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
