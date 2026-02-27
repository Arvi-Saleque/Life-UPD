export type EventType =
  | "CT"
  | "Assignment"
  | "Lab Test"
  | "Project"
  | "Seminar"
  | "Quiz"
  | "Presentation"
  | "Other";

export interface LifeEvent {
  id: string;
  title: string;
  course: string; // course code e.g. "CSE 3209"
  type: EventType;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  submissionDate?: string; // ISO date string
  time?: string; // e.g. "10:00 AM"
  room?: string; // e.g. "Room 301"
  resources?: string[]; // links
  week: number; // 11-14
}

export interface WeekInfo {
  number: number;
  label: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
}

export const WEEKS: WeekInfo[] = [
  {
    number: 11,
    label: "Week 11",
    startDate: "2026-03-28",
    endDate: "2026-04-03",
  },
  {
    number: 12,
    label: "Week 12",
    startDate: "2026-04-04",
    endDate: "2026-04-10",
  },
  {
    number: 13,
    label: "Week 13",
    startDate: "2026-04-11",
    endDate: "2026-04-17",
  },
  {
    number: 14,
    label: "Week 14",
    startDate: "2026-04-18",
    endDate: "2026-04-24",
  },
];
