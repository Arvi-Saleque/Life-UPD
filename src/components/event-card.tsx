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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

function getCountdown(dateStr?: string): { text: string; urgent: boolean } | null {
  if (!dateStr) return null;
  const days = differenceInDays(parseISO(dateStr), new Date());
  if (days < 0) return { text: "Past", urgent: false };
  if (days === 0) return { text: "Today!", urgent: true };
  if (days === 1) return { text: "Tomorrow", urgent: true };
  if (days <= 3) return { text: `${days} days left`, urgent: true };
  return { text: `${days} days left`, urgent: false };
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
  const countdown = getCountdown(event.submissionDate || event.date);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur transition-all hover:border-slate-700 hover:bg-slate-800/70 hover:shadow-lg hover:shadow-blue-500/5"
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${course.bg} transition-transform group-hover:scale-110`}
            >
              <Icon className={`h-5 w-5 ${course.text}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${course.badge}`}
                >
                  {course.shortName}
                </span>
                <Badge
                  variant="outline"
                  className="border-slate-700 text-[10px] text-slate-400"
                >
                  {event.type}
                </Badge>
                {countdown?.urgent && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400 animate-pulse">
                    <AlertCircle className="h-3 w-3" />
                    {countdown.text}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                {event.title}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {event.date && (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {format(parseISO(event.date), "MMM d, yyyy")}
                  </span>
                )}
                {event.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </span>
                )}
                {event.room && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.room}
                  </span>
                )}
              </div>
            </div>
            {countdown && !countdown.urgent && (
              <span className="shrink-0 rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-400">
                {countdown.text}
              </span>
            )}
          </div>
        </motion.div>
      </DialogTrigger>

      {/* Detail Dialog */}
      <DialogContent className="border-slate-800 bg-slate-950 text-white sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${course.badge}`}
            >
              {course.shortName}
            </span>
            <Badge
              variant="outline"
              className="border-slate-700 text-xs text-slate-400"
            >
              {event.type}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Course info */}
          <div className="rounded-xl bg-slate-900 p-4">
            <p className="text-xs font-medium text-slate-500 mb-1">Course</p>
            <p className="text-sm text-slate-300">
              {course.code} — {course.title}
            </p>
          </div>

          {/* Description */}
          {event.description && (
            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">
                Description
              </p>
              <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {/* Date/Time/Room grid */}
          <div className="grid grid-cols-2 gap-3">
            {event.date && (
              <div className="rounded-xl bg-slate-900 p-3">
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                  <CalendarDays className="h-3 w-3" /> Date
                </p>
                <p className="text-sm font-medium text-white">
                  {format(parseISO(event.date), "EEEE, MMM d")}
                </p>
              </div>
            )}
            {event.time && (
              <div className="rounded-xl bg-slate-900 p-3">
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                  <Clock className="h-3 w-3" /> Time
                </p>
                <p className="text-sm font-medium text-white">{event.time}</p>
              </div>
            )}
            {event.room && (
              <div className="rounded-xl bg-slate-900 p-3">
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                  <MapPin className="h-3 w-3" /> Room
                </p>
                <p className="text-sm font-medium text-white">{event.room}</p>
              </div>
            )}
            {event.submissionDate && (
              <div className="rounded-xl bg-slate-900 p-3">
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                  <CalendarDays className="h-3 w-3" /> Submission
                </p>
                <p className="text-sm font-medium text-white">
                  {format(parseISO(event.submissionDate), "MMM d, yyyy")}
                </p>
                {countdown && (
                  <p
                    className={`mt-0.5 text-xs ${
                      countdown.urgent ? "text-red-400" : "text-slate-500"
                    }`}
                  >
                    {countdown.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Resources */}
          {event.resources && event.resources.length > 0 && (
            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Resources
              </p>
              <div className="space-y-1.5">
                {event.resources.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {url}
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
