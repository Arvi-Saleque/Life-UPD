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
  isSameDay,
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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ events }: { events: LifeEvent[] }) {
  // Start at March 2026 since week 11 begins March 28
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Index events by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, LifeEvent[]> = {};
    for (const event of events) {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    }
    return map;
  }, [events]);

  // Generate calendar grid
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
    <section id="calendar" className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1">
            <CalIcon className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-medium text-violet-300">
              Month View
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white">Calendar</h2>
          <p className="mt-2 text-slate-400">
            Tap a date to see what&apos;s happening
          </p>
        </motion.div>

        {/* Month navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 transition hover:border-slate-700 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-lg font-semibold text-white">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <button
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 transition hover:border-slate-700 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-800">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold text-slate-500"
              >
                {day}
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
                  className={`relative flex min-h-[80px] flex-col items-start border-b border-r border-slate-800/50 p-2 text-left transition sm:min-h-[100px] ${
                    inMonth ? "hover:bg-slate-800/50" : "opacity-30"
                  } ${today ? "bg-blue-500/5 ring-1 ring-inset ring-blue-500/30" : ""}`}
                >
                  <span
                    className={`text-xs font-medium ${
                      today
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white"
                        : inMonth
                          ? "text-slate-300"
                          : "text-slate-600"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {hasEvents && (
                    <div className="mt-1 flex w-full flex-col gap-0.5">
                      {dayEvents.slice(0, 3).map((evt) => {
                        const c = getCourse(evt.course);
                        return (
                          <div
                            key={evt.id}
                            className={`truncate rounded px-1.5 py-0.5 text-[9px] font-medium leading-tight sm:text-[10px] ${c.bg} ${c.text}`}
                          >
                            {evt.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] text-slate-500">
                          +{dayEvents.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side sheet for selected date */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="border-slate-800 bg-slate-950 text-white sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-white">
                {selectedDate
                  ? format(selectedDate, "EEEE, MMMM d, yyyy")
                  : ""}
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-3">
              <AnimatePresence>
                {selectedEvents.length > 0 ? (
                  selectedEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center py-12 text-slate-500"
                  >
                    <CalIcon className="mb-3 h-8 w-8 text-slate-600" />
                    <p className="text-sm">Nothing scheduled for this day</p>
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
