import { NextResponse } from "next/server";
import { seedEvents } from "@/lib/kv";
import { LifeEvent } from "@/lib/types";

// Sample seed data for demo/development
const SEED_DATA: LifeEvent[] = [
  // ── Week 11 (March 28 – April 3) ──
  {
    id: "w11-1",
    title: "AI CT-1",
    course: "CSE 3209",
    type: "CT",
    description:
      "Class Test 1 covering chapters 1–3: Introduction to AI, Intelligent Agents, and Search Strategies (BFS, DFS, A*).",
    date: "2026-03-29",
    time: "10:00 AM",
    room: "Room 301",
    week: 11,
  },
  {
    id: "w11-2",
    title: "Compiler Assignment-1",
    course: "CSE 3211",
    type: "Assignment",
    description:
      "Implement a lexical analyzer for a subset of C language. Must handle keywords, identifiers, operators, and literals.",
    date: "2026-03-28",
    submissionDate: "2026-04-02",
    week: 11,
  },
  {
    id: "w11-3",
    title: "Mobile App UI Prototype",
    course: "CSE 3217",
    type: "Project",
    description:
      "Submit the UI prototype of your mobile app project. Include at least 5 screens with navigation flow using Swift/SwiftUI.",
    date: "2026-03-30",
    submissionDate: "2026-04-01",
    week: 11,
  },
  {
    id: "w11-4",
    title: "SE & PM Assignment",
    course: "CSE 3219",
    type: "Assignment",
    description:
      "Prepare a Software Requirements Specification (SRS) document for your semester project following IEEE 830 template.",
    date: "2026-03-31",
    submissionDate: "2026-04-03",
    week: 11,
  },

  // ── Week 12 (April 4 – April 10) ──
  {
    id: "w12-1",
    title: "Compiler CT-1",
    course: "CSE 3211",
    type: "CT",
    description:
      "Topics: Lexical Analysis, Regular Expressions, Finite Automata (DFA, NFA), RE to NFA conversion.",
    date: "2026-04-05",
    time: "11:00 AM",
    room: "Room 201",
    week: 12,
  },
  {
    id: "w12-2",
    title: "AI Lab Test-1",
    course: "CSE 3210",
    type: "Lab Test",
    description:
      "Implement BFS and DFS search algorithms in Python. Solve 8-puzzle problem using A* search. Viva included.",
    date: "2026-04-06",
    time: "2:00 PM",
    room: "Lab 4",
    week: 12,
  },
  {
    id: "w12-3",
    title: "Mobile Lab Test-1",
    course: "CSE 3218",
    type: "Lab Test",
    description:
      "Build a simple CRUD app in Swift with UITableView. Must include data persistence using CoreData or UserDefaults.",
    date: "2026-04-07",
    time: "9:00 AM",
    room: "Lab 3",
    week: 12,
  },
  {
    id: "w12-4",
    title: "Technical Writing Draft",
    course: "CSE 3230",
    type: "Assignment",
    description:
      "Submit first draft of your technical paper. Topic must be approved. Follow IEEE conference paper format. Minimum 4 pages.",
    date: "2026-04-08",
    submissionDate: "2026-04-10",
    week: 12,
  },
  {
    id: "w12-5",
    title: "SDP Sprint Review",
    course: "CSE 3200",
    type: "Presentation",
    description:
      "Present Sprint 2 progress to the project supervisor. Show working demo, updated Gantt chart, and burn-down chart.",
    date: "2026-04-09",
    time: "3:00 PM",
    room: "Room 501",
    week: 12,
  },

  // ── Week 13 (April 11 – April 17) ──
  {
    id: "w13-1",
    title: "SE & PM CT-1",
    course: "CSE 3219",
    type: "CT",
    description:
      "Chapters: Software Process Models (Waterfall, Agile, Scrum), Requirements Engineering, Project Planning basics.",
    date: "2026-04-12",
    time: "10:00 AM",
    room: "Room 301",
    week: 13,
  },
  {
    id: "w13-2",
    title: "Mobile CT-1",
    course: "CSE 3217",
    type: "CT",
    description:
      "Topics: iOS app lifecycle, Swift basics, Auto Layout, UIKit components, MVC pattern, and Storyboard navigation.",
    date: "2026-04-13",
    time: "11:30 AM",
    room: "Room 201",
    week: 13,
  },
  {
    id: "w13-3",
    title: "Compiler Lab Test-1",
    course: "CSE 3212",
    type: "Lab Test",
    description:
      "Implement a simple parser using recursive descent parsing. Language grammar will be given during the test.",
    date: "2026-04-14",
    time: "2:00 PM",
    room: "Lab 2",
    week: 13,
  },
  {
    id: "w13-4",
    title: "Engineers & Society Presentation",
    course: "HUM 3247",
    type: "Presentation",
    description:
      "Group presentation on ethical issues in AI and automation. 15 min per group. Q&A session follows.",
    date: "2026-04-15",
    time: "10:00 AM",
    room: "Room 401",
    week: 13,
  },

  // ── Week 14 (April 18 – April 24) ──
  {
    id: "w14-1",
    title: "AI CT-2",
    course: "CSE 3209",
    type: "CT",
    description:
      "Topics: Knowledge Representation, Propositional Logic, First-Order Logic, Inference algorithms, and Bayesian Networks.",
    date: "2026-04-19",
    time: "10:00 AM",
    room: "Room 301",
    week: 14,
  },
  {
    id: "w14-2",
    title: "SE Lab Test-1",
    course: "CSE 3220",
    type: "Lab Test",
    description:
      "Draw complete UML diagrams (Use Case, Class, Sequence, Activity) for a given problem using StarUML or any CASE tool.",
    date: "2026-04-20",
    time: "2:00 PM",
    room: "Lab 1",
    week: 14,
  },
  {
    id: "w14-3",
    title: "SDP Final Demo",
    course: "CSE 3200",
    type: "Project",
    description:
      "Final project demonstration to the evaluation panel. Complete working product, documentation, and user manual required.",
    date: "2026-04-22",
    time: "9:00 AM",
    room: "Room 501",
    week: 14,
  },
  {
    id: "w14-4",
    title: "Technical Writing Final Paper",
    course: "CSE 3230",
    type: "Assignment",
    description:
      "Submit the final version of your technical paper. Must incorporate reviewer feedback. Plagiarism check required (<15%).",
    date: "2026-04-21",
    submissionDate: "2026-04-24",
    week: 14,
  },
  {
    id: "w14-5",
    title: "Mobile App Final Submission",
    course: "CSE 3217",
    type: "Project",
    description:
      "Submit complete mobile application with source code, APK/IPA, user manual, and demo video (max 5 min).",
    date: "2026-04-23",
    submissionDate: "2026-04-24",
    week: 14,
  },
];

export async function POST() {
  try {
    await seedEvents(SEED_DATA);
    return NextResponse.json({
      success: true,
      message: `Seeded ${SEED_DATA.length} events`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
