"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LifeEvent, WEEKS, EventType } from "@/lib/types";
import { COURSE_LIST } from "@/lib/courses";
import { getCourse } from "@/lib/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Edit3,
  LogOut,
  Loader2,
  CalendarDays,
  Save,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";

const EVENT_TYPES: EventType[] = [
  "CT",
  "Assignment",
  "Lab Test",
  "Project",
  "Seminar",
  "Presentation",
  "Quiz",
  "Other",
];

interface EventFormData {
  title: string;
  course: string;
  type: EventType;
  description: string;
  date: string;
  submissionDate: string;
  time: string;
  room: string;
  resources: string;
  week: string; // "" for unset, or "11"-"14"
}

const emptyForm: EventFormData = {
  title: "",
  course: "",
  type: "CT",
  description: "",
  date: "",
  submissionDate: "",
  time: "",
  room: "",
  resources: "",
  week: "",
};

function getWeekFromDate(dateStr: string): string {
  for (const w of WEEKS) {
    if (dateStr >= w.startDate && dateStr <= w.endDate) return String(w.number);
  }
  return "";
}

export default function AdminPage() {
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [form, setForm] = useState<EventFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events?all=true");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function handleDateChange(dateStr: string) {
    setForm((prev) => ({
      ...prev,
      date: dateStr,
      week: getWeekFromDate(dateStr),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        title: form.title,
        course: form.course,
        type: form.type,
        description: form.description,
        date: form.date || undefined,
        submissionDate: form.submissionDate || undefined,
        time: form.time || undefined,
        room: form.room || undefined,
        resources: form.resources
          ? form.resources.split(",").map((s) => s.trim())
          : [],
        week: form.week ? parseInt(form.week) : undefined,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setForm(emptyForm);
        setEditingId(null);
        await fetchEvents();
      }
    } catch (err) {
      console.error("Failed to save event:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;

    try {
      await fetch(`/api/events?id=${id}`, { method: "DELETE" });
      await fetchEvents();
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  }

  function handleEdit(event: LifeEvent) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      course: event.course,
      type: event.type,
      description: event.description,
      date: event.date || "",
      submissionDate: event.submissionDate || "",
      time: event.time || "",
      room: event.room || "",
      resources: event.resources?.join(", ") || "",
      week: event.week ? String(event.week) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage events for weeks 11–14
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Event Form */}
      <div className="mb-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 backdrop-blur">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          {editingId ? (
            <>
              <Edit3 className="h-5 w-5 text-amber-400" />
              Edit Event
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-blue-400" />
              Add New Event
            </>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-slate-600 dark:text-slate-300">Title *</Label>
              <Input
                required
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. AI CT-1"
                className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Course */}
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Course *</Label>
              <Select
                required
                value={form.course}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, course: val }))
                }
              >
                <SelectTrigger className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {COURSE_LIST.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} — {c.shortName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Event Type *</Label>
              <Select
                required
                value={form.type}
                onValueChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    type: val as EventType,
                  }))
                }
              >
                <SelectTrigger className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Date <span className="text-slate-400 dark:text-slate-600 text-xs">(optional)</span></Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Time</Label>
              <Input
                value={form.time}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, time: e.target.value }))
                }
                placeholder="e.g. 10:00 AM"
                className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Room</Label>
              <Input
                value={form.room}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, room: e.target.value }))
                }
                placeholder="e.g. Room 301"
                className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Submission Date */}
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Submission Date</Label>
              <Input
                type="date"
                value={form.submissionDate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    submissionDate: e.target.value,
                  }))
                }
                className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Week (auto-calculated from date, or manual) */}
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Week <span className="text-slate-400 dark:text-slate-600 text-xs">(optional)</span></Label>
              <Select
                value={form.week}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, week: val === "none" ? "" : val }))
                }
              >
                <SelectTrigger className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  <SelectValue placeholder="No week (TBD)" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  <SelectItem value="none">No week (TBD)</SelectItem>
                  {WEEKS.map((w) => (
                    <SelectItem key={w.number} value={String(w.number)}>
                      Week {w.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!form.week && !form.date && (
                <p className="text-[11px] text-amber-500/70">No week or date — event will appear in “Upcoming Events” only</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-slate-600 dark:text-slate-300">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Syllabus, instructions, notes..."
                rows={3}
                className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Resources */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-slate-600 dark:text-slate-300">
                Resources (comma-separated URLs)
              </Label>
              <Input
                value={form.resources}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    resources: e.target.value,
                  }))
                }
                placeholder="https://link1.com, https://link2.com"
                className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-violet-600 font-semibold text-white"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {editingId ? "Update Event" : "Add Event"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                className="border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Events List */}
      <div>
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <CalendarDays className="h-5 w-5 text-blue-400" />
          Upcoming Events
          <span className="ml-2 rounded-lg bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
            {events.length}
          </span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 py-12 text-center text-slate-500">
            <p className="text-sm">No events yet. Add one above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events
              .sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"))
              .map((event) => {
                const course = getCourse(event.course);
                return (
                  <div
                    key={event.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 transition hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span
                          className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${course.badge}`}
                        >
                          {course.shortName}
                        </span>
                        <Badge
                          variant="outline"
                          className="border-slate-300 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400"
                        >
                          {event.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-slate-300 dark:border-slate-700 text-[10px] text-slate-400 dark:text-slate-500"
                        >
                          {event.week ? `W${event.week}` : "No week"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {event.date ? format(parseISO(event.date), "MMM d, yyyy") : "Date TBD"}
                        {event.time ? ` • ${event.time}` : ""}
                        {event.room ? ` • ${event.room}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(event)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(event.id)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
