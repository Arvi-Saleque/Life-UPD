"use client";

import { useState, useMemo } from "react";
import { LifeEvent } from "@/lib/types";
import { getCourse } from "@/lib/courses";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  parseISO,
  addMonths,
} from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EventCard } from "./event-card";
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WEEKDAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarView({ events }: { events: LifeEvent[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const eventsByDate = useMemo(() => {
    const map: Record<string, LifeEvent[]> = {};
    for (const event of events) {
      if (!event.date) continue;
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    }
    return map;
  }, [events]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : "";
  const selectedEvents = selectedDateStr
    ? eventsByDate[selectedDateStr] ?? []
    : [];

  function handleDateClick(day: Date) {
    setSelectedDate(day);
    setSheetOpen(true);
  }

  return (
    <section id="calendar" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-20 left-0 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 backdrop-blur-sm">
            <CalIcon className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
              Month View
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-3">
            Calendar
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Tap a date to see what&apos;s happening
          </p>
        </motion.div>

        {/* Month navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
            className="rounded-xl glass p-3 text-slate-400 transition-all hover:text-white hover:bg-white/5 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <button
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
            className="rounded-xl glass p-3 text-slate-400 transition-all hover:text-white hover:bg-white/5 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar grid */}
        <motion.div
          className="overflow-hidden rounded-2xl glass"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-white/5">
            {WEEKDAYS_FULL.map((day, i) => (
              <div
                key={day}
                className="py-3 sm:py-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDate[dateStr] ?? [];
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={i}
                  onClick={() => handleDateClick(day)}
                  className={`group relative flex min-h-[60px] sm:min-h-[100px] flex-col items-start border-b border-r border-white/[0.03] p-1.5 sm:p-2.5 text-left transition-all duration-200 ${
                    inMonth
                      ? "hover:bg-white/[0.03]"
                      : "opacity-25"
                  } ${today ? "bg-blue-500/[0.07]" : ""} ${
                    hasEvents && inMonth ? "hover:bg-blue-500/[0.05]" : ""
                  }`}
                >
                  {/* Date number */}
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      today
                        ? "flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white font-bold shadow-lg shadow-blue-500/30"
                        : inMonth
                          ? "text-slate-300"
                          : "text-slate-700"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Event pills */}
                  {hasEvents && (
                    <div className="mt-1 flex w-full flex-col gap-0.5 sm:gap-1">
                      {dayEvents.slice(0, 2).map((evt) => {
                        const c = getCourse(evt.course);
                        return (
                          <div
                            key={evt.id}
                            className={`truncate rounded-md px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-semibold leading-tight ${c.bg} ${c.text} transition-all group-hover:brightness-110`}
                          >
                            <span className="hidden sm:inline">{evt.title}</span>
                            <span className="sm:hidden">{evt.type === "CT" ? "CT" : evt.type.slice(0, 4)}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <span className="text-[8px] sm:text-[9px] text-slate-500 font-medium pl-1">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Event dot indicators for mobile */}
                  {hasEvents && (
                    <div className="sm:hidden absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 4).map((evt) => {
                        const c = getCourse(evt.course);
                        return (
                          <div
                            key={evt.id}
                            className={`h-1 w-1 rounded-full ${c.bg}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Side sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="border-white/10 bg-slate-950/95 backdrop-blur-2xl text-white w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-white text-lg">
                {selectedDate
                  ? format(selectedDate, "EEEE, MMMM d, yyyy")
                  : ""}
              </SheetTitle>
              {selectedEvents.length > 0 && (
                <p className="text-xs text-slate-500 font-medium">
                  {selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""} scheduled
                </p>
              )}
            </SheetHeader>

            <div className="mt-6 space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] pb-6">
              <AnimatePresence>
                {selectedEvents.length > 0 ? (
                  selectedEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center py-16 text-slate-500"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl glass">
                      <CalIcon className="h-6 w-6 text-slate-600" />
                    </div>
                    <p className="text-sm font-medium">Nothing scheduled</p>
                    <p className="text-xs text-slate-600 mt-1">This day is free!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
