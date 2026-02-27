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

  // Find the first week that has events for default tab
  const defaultWeek =
    WEEKS.find((w) => (eventsByWeek[w.number]?.length ?? 0) > 0)?.number ?? 11;

  return (
    <section id="weekly" className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1">
            <CalendarRange className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">
              Week by Week
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white">Weekly Schedule</h2>
          <p className="mt-2 text-slate-400">
            Click on any event to see full details
          </p>
        </motion.div>

        <Tabs defaultValue={`week-${defaultWeek}`} className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-4 rounded-2xl bg-slate-900 p-1.5">
            {WEEKS.map((week) => (
              <TabsTrigger
                key={week.number}
                value={`week-${week.number}`}
                className="rounded-xl py-3 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg sm:text-sm"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-semibold">Week {week.number}</span>
                  <span className="hidden text-[10px] opacity-70 sm:block">
                    {format(parseISO(week.startDate), "MMM d")} –{" "}
                    {format(parseISO(week.endDate), "MMM d")}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {WEEKS.map((week) => (
            <TabsContent
              key={week.number}
              value={`week-${week.number}`}
              className="space-y-3"
            >
              {eventsByWeek[week.number]?.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      {format(parseISO(week.startDate), "MMMM d")} –{" "}
                      {format(parseISO(week.endDate), "MMMM d, yyyy")}
                    </p>
                    <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                      {eventsByWeek[week.number].length} event
                      {eventsByWeek[week.number].length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {eventsByWeek[week.number].map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <Inbox className="mb-3 h-10 w-10 text-slate-600" />
                  <p className="text-sm">No events scheduled for this week</p>
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
