"use client";

import { LifeEvent, WEEKS } from "@/lib/types";
import { EventCard } from "./event-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { CalendarRange, Inbox } from "lucide-react";
import { motion } from "framer-motion";

export function WeeklyTimeline({ events }: { events: LifeEvent[] }) {
  const eventsByWeek: Record<number, LifeEvent[]> = {};

  for (const week of WEEKS) {
    eventsByWeek[week.number] = events
      .filter((e) => e.week === week.number)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  const defaultWeek =
    WEEKS.find((w) => (eventsByWeek[w.number]?.length ?? 0) > 0)?.number ?? 11;

  return (
    <section id="weekly" className="relative py-20 sm:py-28">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-40 -left-20 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 backdrop-blur-sm">
            <CalendarRange className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              Week by Week
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-3">
            Weekly Schedule
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Click on any event to see full details
          </p>
        </motion.div>

        <Tabs defaultValue={`week-${defaultWeek}`} className="w-full">
          <TabsList className="mb-10 grid w-full grid-cols-4 rounded-2xl glass p-1.5 gap-1.5">
            {WEEKS.map((week) => {
              const count = eventsByWeek[week.number]?.length ?? 0;
              return (
                <TabsTrigger
                  key={week.number}
                  value={`week-${week.number}`}
                  className="relative rounded-xl py-3 sm:py-4 text-xs transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/20 data-[state=inactive]:hover:bg-white/5 sm:text-sm"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-bold">Week {week.number}</span>
                    <span className="hidden text-[10px] opacity-70 sm:block">
                      {format(parseISO(week.startDate), "MMM d")} –{" "}
                      {format(parseISO(week.endDate), "MMM d")}
                    </span>
                    {count > 0 && (
                      <span className="mt-0.5 text-[9px] font-medium opacity-60">
                        {count} event{count !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {WEEKS.map((week) => (
            <TabsContent
              key={week.number}
              value={`week-${week.number}`}
              className="space-y-3"
            >
              {eventsByWeek[week.number]?.length > 0 ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">
                      {format(parseISO(week.startDate), "MMMM d")} –{" "}
                      {format(parseISO(week.endDate), "MMMM d, yyyy")}
                    </p>
                    <span className="rounded-xl bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400">
                      {eventsByWeek[week.number].length} event
                      {eventsByWeek[week.number].length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {eventsByWeek[week.number].map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl glass">
                    <Inbox className="h-7 w-7 text-slate-600" />
                  </div>
                  <p className="text-sm font-medium">No events scheduled</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Check back later or contact the CR
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
