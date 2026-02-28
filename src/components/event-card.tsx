"use client";

import { LifeEvent } from "@/lib/types";
import { getCourse } from "@/lib/courses";
import {
  FileText,
  Upload,
  FlaskConical,
  FolderGit2,
  Presentation,
  HelpCircle,
  Clock,
  MapPin,
  CalendarDays,
  ExternalLink,
  AlertCircle,
  Flame,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { differenceInDays, parseISO, format } from "date-fns";
import { motion } from "framer-motion";

const typeIcons: Record<string, React.ElementType> = {
  CT: FileText,
  Assignment: Upload,
  "Lab Test": FlaskConical,
  Project: FolderGit2,
  Seminar: Presentation,
  Presentation: Presentation,
  Quiz: HelpCircle,
  Other: HelpCircle,
};

const typeColors: Record<string, string> = {
  CT: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  Assignment: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  "Lab Test": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Project: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Seminar: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  Presentation: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Quiz: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Other: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

function getCountdown(dateStr?: string): { text: string; urgent: boolean } | null {
  if (!dateStr) return null;
  const days = differenceInDays(parseISO(dateStr), new Date());
  if (days < 0) return { text: "Past", urgent: false };
  if (days === 0) return { text: "Today!", urgent: true };
  if (days === 1) return { text: "Tomorrow", urgent: true };
  if (days <= 3) return { text: `${days}d left`, urgent: true };
  return { text: `${days}d left`, urgent: false };
}

export function EventCard({
  event,
  index = 0,
}: {
  event: LifeEvent;
  index?: number;
}) {
  const course = getCourse(event.course);
  const Icon = typeIcons[event.type] || HelpCircle;
  const countdown = getCountdown(event.submissionDate || event.date || undefined);
  const typeColor = typeColors[event.type] || typeColors.Other;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
          className="group cursor-pointer rounded-2xl glass p-4 sm:p-5 hover-card relative overflow-hidden"
        >
          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-violet-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative flex items-start gap-4">
            {/* Icon with course color */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${course.bg} ring-1 ring-slate-200 dark:ring-white/5 transition-all duration-300 group-hover:scale-110 group-hover:ring-slate-300 dark:group-hover:ring-white/10`}
            >
              <Icon className={`h-5 w-5 ${course.text}`} />
            </div>

            <div className="min-w-0 flex-1">
              {/* Badges row */}
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${course.badge}`}
                >
                  {course.shortName}
                </span>
                <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-semibold ${typeColor}`}>
                  {event.type}
                </span>
                {countdown?.urgent && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-red-500/15 border border-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                    <Flame className="h-3 w-3" />
                    {countdown.text}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-200 leading-snug">
                {event.title}
              </h3>

              {/* Meta info */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                {event.date ? (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                    {format(parseISO(event.date), "MMM d, yyyy")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-500/70">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Date TBD
                  </span>
                )}
                {event.time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                    {event.time}
                  </span>
                )}
                {event.room && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                    {event.room}
                  </span>
                )}
              </div>
            </div>

            {/* Countdown badge (non-urgent) */}
            {countdown && !countdown.urgent && (
              <span className="shrink-0 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {countdown.text}
              </span>
            )}
          </div>
        </motion.div>
      </DialogTrigger>

      {/* ── Detail Dialog ─────────────────────────── */}
      <DialogContent className="border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl text-slate-900 dark:text-white sm:max-w-lg rounded-3xl overflow-hidden">
        <DialogHeader>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wider ${course.badge}`}
            >
              {course.shortName}
            </span>
            <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold ${typeColor}`}>
              {event.type}
            </span>
            {countdown?.urgent && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/15 border border-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 animate-pulse">
                <AlertCircle className="h-3.5 w-3.5" />
                {countdown.text}
              </span>
            )}
          </div>
          <DialogTitle className="text-xl font-bold leading-tight">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2 overflow-hidden">
          {/* Course */}
          <div className="rounded-2xl glass p-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Course</p>
            <p className="text-sm text-slate-600 dark:text-slate-200">
              {course.code} — {course.title}
            </p>
          </div>

          {/* Description */}
          {event.description && (
            <div className="rounded-2xl glass p-4">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl glass p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                <CalendarDays className="h-3 w-3" /> Date
              </p>
              {event.date ? (
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {format(parseISO(event.date), "EEE, MMM d")}
                </p>
              ) : (
                <p className="text-sm font-medium text-amber-500 dark:text-amber-400/80">TBD</p>
              )}
            </div>
            {event.time && (
              <div className="rounded-2xl glass p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  <Clock className="h-3 w-3" /> Time
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{event.time}</p>
              </div>
            )}
            {event.room && (
              <div className="rounded-2xl glass p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  <MapPin className="h-3 w-3" /> Room
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{event.room}</p>
              </div>
            )}
            {event.submissionDate && (
              <div className="rounded-2xl glass p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  <CalendarDays className="h-3 w-3" /> Due
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {format(parseISO(event.submissionDate), "MMM d, yyyy")}
                </p>
                {countdown && (
                  <p className={`mt-1 text-xs ${countdown.urgent ? "text-red-400" : "text-slate-500"}`}>
                    {countdown.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Resources */}
          {event.resources && event.resources.length > 0 && (
            <div className="rounded-2xl glass p-4">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Resources</p>
              <div className="space-y-2">
                {event.resources.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition rounded-lg hover:bg-blue-500/5 px-2 py-1.5 -mx-2 min-w-0 overflow-hidden"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate block min-w-0">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
