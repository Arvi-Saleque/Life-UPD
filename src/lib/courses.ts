export interface CourseInfo {
  code: string;
  title: string;
  shortName: string;
  color: string; // tailwind color name
  bg: string; // tailwind bg class
  text: string; // tailwind text class
  badge: string; // full badge class string
}

export const COURSES: Record<string, CourseInfo> = {
  "CSE 3200": {
    code: "CSE 3200",
    title: "System Development Project",
    shortName: "SDP",
    color: "violet",
    bg: "bg-violet-100",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },
  "CSE 3209": {
    code: "CSE 3209",
    title: "Artificial Intelligence",
    shortName: "AI",
    color: "blue",
    bg: "bg-blue-100",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  "CSE 3210": {
    code: "CSE 3210",
    title: "Artificial Intelligence Laboratory",
    shortName: "AI Lab",
    color: "sky",
    bg: "bg-sky-100",
    text: "text-sky-700",
    badge: "bg-sky-100 text-sky-700 border-sky-200",
  },
  "CSE 3211": {
    code: "CSE 3211",
    title: "Compiler Design",
    shortName: "Compiler",
    color: "emerald",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  "CSE 3212": {
    code: "CSE 3212",
    title: "Compiler Design Laboratory",
    shortName: "Compiler Lab",
    color: "teal",
    bg: "bg-teal-100",
    text: "text-teal-700",
    badge: "bg-teal-100 text-teal-700 border-teal-200",
  },
  "CSE 3217": {
    code: "CSE 3217",
    title: "Mobile Computing",
    shortName: "Mobile",
    color: "orange",
    bg: "bg-orange-100",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
  },
  "CSE 3218": {
    code: "CSE 3218",
    title: "Mobile Computing Laboratory",
    shortName: "Mobile Lab",
    color: "amber",
    bg: "bg-amber-100",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  "CSE 3219": {
    code: "CSE 3219",
    title: "Software Engineering and Project Management",
    shortName: "SE & PM",
    color: "rose",
    bg: "bg-rose-100",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
  },
  "CSE 3220": {
    code: "CSE 3220",
    title: "Software Engineering and Project Management Laboratory",
    shortName: "SE Lab",
    color: "pink",
    bg: "bg-pink-100",
    text: "text-pink-700",
    badge: "bg-pink-100 text-pink-700 border-pink-200",
  },
  "CSE 3230": {
    code: "CSE 3230",
    title: "Technical Writing and Seminar",
    shortName: "Tech Writing",
    color: "indigo",
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  "HUM 3247": {
    code: "HUM 3247",
    title: "Engineers and Society",
    shortName: "Eng & Society",
    color: "slate",
    bg: "bg-slate-100",
    text: "text-slate-700",
    badge: "bg-slate-200 text-slate-700 border-slate-300",
  },
};

export const COURSE_LIST = Object.values(COURSES);

export function getCourse(code: string): CourseInfo {
  return (
    COURSES[code] ?? {
      code,
      title: code,
      shortName: code,
      color: "gray",
      bg: "bg-gray-100",
      text: "text-gray-700",
      badge: "bg-gray-100 text-gray-700 border-gray-200",
    }
  );
}
