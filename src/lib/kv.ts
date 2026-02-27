import { Redis } from "@upstash/redis";
import { LifeEvent } from "./types";

// Use globalThis to persist in-memory store across hot reloads in dev
const globalForStore = globalThis as unknown as {
  __lifeUpdateStore?: Record<string, LifeEvent[]>;
};
if (!globalForStore.__lifeUpdateStore) {
  globalForStore.__lifeUpdateStore = {};
}
const memoryStore = globalForStore.__lifeUpdateStore;

function getRedis(): Redis | null {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

// ── Week-based operations ──────────────────────────────────

export async function getWeekEvents(week: number): Promise<LifeEvent[]> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<LifeEvent[]>(`week:${week}`);
    return data ?? [];
  }
  return memoryStore[`week:${week}`] ?? [];
}

export async function getAllEvents(): Promise<LifeEvent[]> {
  const all: LifeEvent[] = [];
  for (const week of [11, 12, 13, 14]) {
    const events = await getWeekEvents(week);
    all.push(...events);
  }
  return all;
}

// ── Date-based operations ──────────────────────────────────

export async function getDateEvents(date: string): Promise<LifeEvent[]> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<LifeEvent[]>(`cal:${date}`);
    return data ?? [];
  }
  return memoryStore[`cal:${date}`] ?? [];
}

// ── Write operations ───────────────────────────────────────

export async function upsertEvent(event: LifeEvent): Promise<void> {
  const redis = getRedis();

  // Update week key
  const weekKey = `week:${event.week}`;
  const weekEvents = redis
    ? ((await redis.get<LifeEvent[]>(weekKey)) ?? [])
    : (memoryStore[weekKey] ?? []);

  const existingIdx = weekEvents.findIndex((e) => e.id === event.id);
  if (existingIdx >= 0) {
    weekEvents[existingIdx] = event;
  } else {
    weekEvents.push(event);
  }

  // Update calendar key (only if date is set)
  if (event.date) {
    const calKey = `cal:${event.date}`;
    const calEvents = redis
      ? ((await redis.get<LifeEvent[]>(calKey)) ?? [])
      : (memoryStore[calKey] ?? []);

    const existingCalIdx = calEvents.findIndex((e) => e.id === event.id);
    if (existingCalIdx >= 0) {
      calEvents[existingCalIdx] = event;
    } else {
      calEvents.push(event);
    }

    if (redis) {
      await redis.set(weekKey, weekEvents);
      await redis.set(calKey, calEvents);
    } else {
      memoryStore[weekKey] = weekEvents;
      memoryStore[calKey] = calEvents;
    }
  } else {
    if (redis) {
      await redis.set(weekKey, weekEvents);
    } else {
      memoryStore[weekKey] = weekEvents;
    }
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  const redis = getRedis();

  for (const week of [11, 12, 13, 14]) {
    const weekKey = `week:${week}`;
    const weekEvents = redis
      ? ((await redis.get<LifeEvent[]>(weekKey)) ?? [])
      : (memoryStore[weekKey] ?? []);

    const found = weekEvents.find((e) => e.id === eventId);
    if (found) {
      const filtered = weekEvents.filter((e) => e.id !== eventId);
      if (redis) {
        await redis.set(weekKey, filtered);
      } else {
        memoryStore[weekKey] = filtered;
      }

      // Also remove from calendar
      if (!found.date) break;
      const calKey = `cal:${found.date}`;
      const calEvents = redis
        ? ((await redis.get<LifeEvent[]>(calKey)) ?? [])
        : (memoryStore[calKey] ?? []);
      const filteredCal = calEvents.filter((e) => e.id !== eventId);
      if (redis) {
        await redis.set(calKey, filteredCal);
      } else {
        memoryStore[calKey] = filteredCal;
      }
      break;
    }
  }
}

// ── Bulk seed ──────────────────────────────────────────────

export async function seedEvents(events: LifeEvent[]): Promise<void> {
  // Group by week
  const byWeek: Record<number, LifeEvent[]> = {};
  const byDate: Record<string, LifeEvent[]> = {};

  for (const event of events) {
    if (!byWeek[event.week]) byWeek[event.week] = [];
    byWeek[event.week].push(event);

    if (event.date) {
      if (!byDate[event.date]) byDate[event.date] = [];
      byDate[event.date].push(event);
    }
  }

  const redis = getRedis();
  if (redis) {
    for (const [week, evts] of Object.entries(byWeek)) {
      await redis.set(`week:${week}`, evts);
    }
    for (const [date, evts] of Object.entries(byDate)) {
      await redis.set(`cal:${date}`, evts);
    }
  } else {
    for (const [week, evts] of Object.entries(byWeek)) {
      memoryStore[`week:${week}`] = evts;
    }
    for (const [date, evts] of Object.entries(byDate)) {
      memoryStore[`cal:${date}`] = evts;
    }
  }
}
