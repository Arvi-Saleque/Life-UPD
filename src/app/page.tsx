import { Hero } from "@/components/hero";
import { QuickStats } from "@/components/quick-stats";
import { Motivation } from "@/components/motivation";
import { WeeklyTimeline } from "@/components/weekly-timeline";
import { CalendarView } from "@/components/calendar";
import { getAllEvents } from "@/lib/kv";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await getAllEvents();

  return (
    <>
      <Hero />
      <QuickStats events={events} />
      <Motivation />
      <WeeklyTimeline events={events} />
      <CalendarView events={events} />
    </>
  );
}
