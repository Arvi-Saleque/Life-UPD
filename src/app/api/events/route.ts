import { NextRequest, NextResponse } from "next/server";
import {
  getWeekEvents,
  getAllEvents,
  getDateEvents,
  upsertEvent,
  deleteEvent,
  seedEvents,
} from "@/lib/kv";
import { getSession } from "@/lib/auth";
import { LifeEvent } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const week = searchParams.get("week");
  const date = searchParams.get("date");
  const all = searchParams.get("all");

  try {
    if (all === "true") {
      const events = await getAllEvents();
      return NextResponse.json(events);
    }
    if (week) {
      const events = await getWeekEvents(parseInt(week));
      return NextResponse.json(events);
    }
    if (date) {
      const events = await getDateEvents(date);
      return NextResponse.json(events);
    }
    // Default: return all events
    const events = await getAllEvents();
    return NextResponse.json(events);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await getSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Bulk seed
    if (Array.isArray(body)) {
      await seedEvents(body as LifeEvent[]);
      return NextResponse.json({ success: true, count: body.length });
    }

    // Single event
    const event: LifeEvent = {
      id: body.id || crypto.randomUUID(),
      title: body.title,
      course: body.course,
      type: body.type,
      description: body.description || "",
      date: body.date || undefined,
      submissionDate: body.submissionDate,
      time: body.time,
      room: body.room,
      resources: body.resources || [],
      week: body.week || undefined,
    };

    await upsertEvent(event);
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await getSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Event ID required" },
        { status: 400 }
      );
    }

    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
