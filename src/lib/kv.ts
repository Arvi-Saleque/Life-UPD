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
  // Also include unscheduled events (no week assigned)
  const unscheduled = await getUnscheduledEvents();
  all.push(...unscheduled);
  return all;
}

// ── Unscheduled events (no week) ───────────────────────────

export async function getUnscheduledEvents(): Promise<LifeEvent[]> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<LifeEvent[]>("unscheduled");
    return data ?? [];
  }
  return memoryStore["unscheduled"] ?? [];
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

  // Determine storage key: week-based or unscheduled
  const storageKey = event.week ? `week:${event.week}` : "unscheduled";
  const storedEvents = redis
    ? ((await redis.get<LifeEvent[]>(storageKey)) ?? [])
    : (memoryStore[storageKey] ?? []);

  // Remove from old location if it moved (e.g. week changed or removed)
  // Check all possible keys
  const allKeys = ["unscheduled", ...([11, 12, 13, 14].map(w => `week:${w}`))];
  for (const key of allKeys) {
    if (key === storageKey) continue;
    const items = redis
      ? ((await redis.get<LifeEvent[]>(key)) ?? [])
      : (memoryStore[key] ?? []);
    const oldIdx = items.findIndex((e) => e.id === event.id);
    if (oldIdx >= 0) {
      items.splice(oldIdx, 1);
      if (redis) await redis.set(key, items);
      else memoryStore[key] = items;
    }
  }

  const existingIdx = storedEvents.findIndex((e) => e.id === event.id);
  if (existingIdx >= 0) {
    storedEvents[existingIdx] = event;
  } else {
    storedEvents.push(event);
  }

  if (redis) {
    await redis.set(storageKey, storedEvents);
  } else {
    memoryStore[storageKey] = storedEvents;
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
      await redis.set(calKey, calEvents);
    } else {
      memoryStore[calKey] = calEvents;
    }
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  const redis = getRedis();

  const allKeys = ["unscheduled", ...([11, 12, 13, 14].map(w => `week:${w}`))];
  for (const key of allKeys) {
    const items = redis
      ? ((await redis.get<LifeEvent[]>(key)) ?? [])
      : (memoryStore[key] ?? []);

    const found = items.find((e) => e.id === eventId);
    if (found) {
      const filtered = items.filter((e) => e.id !== eventId);
      if (redis) {
        await redis.set(key, filtered);
      } else {
        memoryStore[key] = filtered;
      }

      // Also remove from calendar
      if (found.date) {
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
    if (event.week) {
      if (!byWeek[event.week]) byWeek[event.week] = [];
      byWeek[event.week].push(event);
    } else {
      if (!byWeek[0]) byWeek[0] = []; // 0 = unscheduled
      byWeek[0].push(event);
    }

    if (event.date) {
      if (!byDate[event.date]) byDate[event.date] = [];
      byDate[event.date].push(event);
    }
  }

  const redis = getRedis();
  if (redis) {
    for (const [week, evts] of Object.entries(byWeek)) {
      const key = week === "0" ? "unscheduled" : `week:${week}`;
      await redis.set(key, evts);
    }
    for (const [date, evts] of Object.entries(byDate)) {
      await redis.set(`cal:${date}`, evts);
    }
  } else {
    for (const [week, evts] of Object.entries(byWeek)) {
      const key = week === "0" ? "unscheduled" : `week:${week}`;
      memoryStore[key] = evts;
    }
    for (const [date, evts] of Object.entries(byDate)) {
      memoryStore[`cal:${date}`] = evts;
    }
  }
}
