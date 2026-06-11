"use client";

import { useMemo, useState } from "react";

type DataStatus = "confirmed" | "historical" | "not posted";
type DayLength = "full" | "half" | "both";

type Camp = {
  id: string;
  name: string;
  providerType: "Town" | "Nonprofit" | "Private" | "Specialty";
  town: string;
  distanceByTown: Record<string, number>;
  grades: number[];
  weeks: number[];
  dayLength: DayLength;
  cost: number;
  hours: string;
  activities: string[];
  registration: string;
  registrationMonth: "Sep" | "Oct" | "Nov" | "Dec" | "Jan" | "Feb" | "Mar";
  status: DataStatus;
  source: string;
  sourceLabel: string;
  lastChecked: string;
  popularity: number;
  note: string;
};

const towns = ["Natick", "Framingham", "Wayland", "Sudbury"];
const grades = [
  { label: "K", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];
const activities = ["swim", "sports", "arts", "STEM", "outdoor", "theater"];
const registrationOrder = { Sep: 1, Oct: 2, Nov: 3, Dec: 4, Jan: 5, Feb: 6, Mar: 7 };
const weeks = [
  { id: 1, label: "Jun 28", short: "6/28" },
  { id: 2, label: "Jul 5", short: "7/5" },
  { id: 3, label: "Jul 12", short: "7/12" },
  { id: 4, label: "Jul 19", short: "7/19" },
  { id: 5, label: "Jul 26", short: "7/26" },
  { id: 6, label: "Aug 2", short: "8/2" },
  { id: 7, label: "Aug 9", short: "8/9" },
  { id: 8, label: "Aug 16", short: "8/16" },
];

const camps: Camp[] = [
  {
    id: "natick-rec",
    name: "Natick Recreation Summer Programs",
    providerType: "Town",
    town: "Natick",
    distanceByTown: { Natick: 2, Framingham: 6, Wayland: 7, Sudbury: 10 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [1, 2, 3, 4, 5, 6, 7],
    dayLength: "both",
    cost: 360,
    hours: "8:30 AM - 3:00 PM",
    activities: ["sports", "arts", "outdoor"],
    registration: "Likely January",
    registrationMonth: "Jan",
    status: "historical",
    source: "https://www.natickma.gov/331/Recreation-Parks",
    sourceLabel: "Official town recreation site",
    lastChecked: "Source attached",
    popularity: 84,
    note: "Town-run programs are often strong coverage anchors.",
  },
  {
    id: "framingham-rec",
    name: "Framingham Parks and Recreation Camps",
    providerType: "Town",
    town: "Framingham",
    distanceByTown: { Natick: 7, Framingham: 2, Wayland: 9, Sudbury: 10 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [1, 2, 3, 4, 5, 6, 7, 8],
    dayLength: "full",
    cost: 335,
    hours: "8:00 AM - 4:00 PM",
    activities: ["sports", "arts", "outdoor"],
    registration: "Likely January",
    registrationMonth: "Jan",
    status: "historical",
    source: "https://www.framinghamma.gov/310/Parks-Recreation",
    sourceLabel: "Official town recreation site",
    lastChecked: "Source attached",
    popularity: 79,
    note: "Good fit for families prioritizing cost and full-day coverage.",
  },
  {
    id: "wayland-rec",
    name: "Wayland Recreation Summer Programs",
    providerType: "Town",
    town: "Wayland",
    distanceByTown: { Natick: 7, Framingham: 8, Wayland: 2, Sudbury: 5 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [2, 3, 4, 5, 6, 7],
    dayLength: "both",
    cost: 385,
    hours: "9:00 AM - 3:00 PM",
    activities: ["sports", "arts", "outdoor"],
    registration: "Likely January",
    registrationMonth: "Jan",
    status: "historical",
    source: "https://www.wayland.ma.us/parks-recreation",
    sourceLabel: "Official town recreation site",
    lastChecked: "Source attached",
    popularity: 77,
    note: "Useful for Wayland families who want local drop-off.",
  },
  {
    id: "sudbury-rec",
    name: "Sudbury Park and Recreation Camps",
    providerType: "Town",
    town: "Sudbury",
    distanceByTown: { Natick: 10, Framingham: 10, Wayland: 5, Sudbury: 2 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [1, 2, 3, 4, 5, 6, 7],
    dayLength: "both",
    cost: 395,
    hours: "8:30 AM - 3:30 PM",
    activities: ["sports", "arts", "outdoor"],
    registration: "Likely January",
    registrationMonth: "Jan",
    status: "historical",
    source: "https://sudburyrec.com/",
    sourceLabel: "Official recreation registration site",
    lastChecked: "Source attached",
    popularity: 81,
    note: "Likely to matter for families watching January openings.",
  },
  {
    id: "metrowest-y",
    name: "MetroWest YMCA Day Camp",
    providerType: "Nonprofit",
    town: "Framingham",
    distanceByTown: { Natick: 8, Framingham: 3, Wayland: 10, Sudbury: 11 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [1, 2, 3, 4, 5, 6, 7, 8],
    dayLength: "full",
    cost: 515,
    hours: "8:00 AM - 5:00 PM",
    activities: ["swim", "sports", "arts", "outdoor"],
    registration: "Watch September",
    registrationMonth: "Sep",
    status: "historical",
    source: "https://www.metrowestymca.org/",
    sourceLabel: "Official YMCA site",
    lastChecked: "Source attached",
    popularity: 92,
    note: "High-utility option because swim and extended coverage may align.",
  },
  {
    id: "linx",
    name: "LINX Camps",
    providerType: "Private",
    town: "Wellesley",
    distanceByTown: { Natick: 12, Framingham: 16, Wayland: 9, Sudbury: 13 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [1, 2, 3, 4, 5, 6, 7, 8],
    dayLength: "full",
    cost: 760,
    hours: "9:00 AM - 4:00 PM",
    activities: ["swim", "sports", "arts", "STEM", "theater"],
    registration: "Watch September",
    registrationMonth: "Sep",
    status: "historical",
    source: "https://www.linxcamps.com/",
    sourceLabel: "Official provider site",
    lastChecked: "Source attached",
    popularity: 89,
    note: "Broader activity menu, but higher weekly cost.",
  },
  {
    id: "broadmoor",
    name: "Mass Audubon Broadmoor Nature Camp",
    providerType: "Nonprofit",
    town: "Natick",
    distanceByTown: { Natick: 4, Framingham: 8, Wayland: 5, Sudbury: 9 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [2, 3, 4, 5, 6, 7],
    dayLength: "full",
    cost: 560,
    hours: "8:45 AM - 3:15 PM",
    activities: ["outdoor", "arts", "STEM"],
    registration: "Likely January",
    registrationMonth: "Jan",
    status: "historical",
    source: "https://www.massaudubon.org/places-to-explore/wildlife-sanctuaries/broadmoor",
    sourceLabel: "Official sanctuary site",
    lastChecked: "Source attached",
    popularity: 73,
    note: "Nature-heavy fit for outdoor and science interests.",
  },
  {
    id: "code-wiz",
    name: "Code Wiz Framingham Camps",
    providerType: "Specialty",
    town: "Framingham",
    distanceByTown: { Natick: 8, Framingham: 3, Wayland: 11, Sudbury: 12 },
    grades: [1, 2, 3, 4, 5],
    weeks: [2, 3, 4, 5, 6, 7, 8],
    dayLength: "half",
    cost: 420,
    hours: "9:00 AM - 12:00 PM",
    activities: ["STEM"],
    registration: "Likely January",
    registrationMonth: "Jan",
    status: "historical",
    source: "https://thecodewiz.com/framingham-ma/",
    sourceLabel: "Official provider site",
    lastChecked: "Source attached",
    popularity: 68,
    note: "Good filler for STEM weeks, but not full-day coverage.",
  },
  {
    id: "danforth",
    name: "Danforth Art School Summer Workshops",
    providerType: "Specialty",
    town: "Framingham",
    distanceByTown: { Natick: 7, Framingham: 2, Wayland: 10, Sudbury: 11 },
    grades: [1, 2, 3, 4, 5],
    weeks: [3, 4, 5, 6],
    dayLength: "half",
    cost: 390,
    hours: "9:30 AM - 12:30 PM",
    activities: ["arts"],
    registration: "Likely February",
    registrationMonth: "Feb",
    status: "not posted",
    source: "https://danforth.framingham.edu/",
    sourceLabel: "Official program site",
    lastChecked: "Source attached",
    popularity: 61,
    note: "Potential arts enrichment, not a full coverage anchor.",
  },
  {
    id: "viking",
    name: "Viking Sports Summer Clinics",
    providerType: "Specialty",
    town: "Natick",
    distanceByTown: { Natick: 6, Framingham: 10, Wayland: 8, Sudbury: 12 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [1, 2, 3, 4, 5, 6, 7, 8],
    dayLength: "half",
    cost: 295,
    hours: "9:00 AM - 12:00 PM",
    activities: ["sports", "outdoor"],
    registration: "Likely January",
    registrationMonth: "Jan",
    status: "historical",
    source: "https://www.vikingcamps.com/",
    sourceLabel: "Official provider site",
    lastChecked: "Source attached",
    popularity: 71,
    note: "Strong sports filler for open mornings.",
  },
  {
    id: "new-art",
    name: "New Art Center Summer Programs",
    providerType: "Specialty",
    town: "Newton",
    distanceByTown: { Natick: 15, Framingham: 20, Wayland: 12, Sudbury: 16 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [2, 3, 4, 5, 6],
    dayLength: "both",
    cost: 615,
    hours: "9:00 AM - 3:30 PM",
    activities: ["arts"],
    registration: "Likely January",
    registrationMonth: "Jan",
    status: "historical",
    source: "https://newartcenter.org/",
    sourceLabel: "Official provider site",
    lastChecked: "Source attached",
    popularity: 64,
    note: "Nearby art-focused option for families willing to drive farther.",
  },
  {
    id: "camp-chickami",
    name: "Camp Chickami",
    providerType: "Nonprofit",
    town: "Wayland",
    distanceByTown: { Natick: 6, Framingham: 8, Wayland: 3, Sudbury: 5 },
    grades: [0, 1, 2, 3, 4, 5],
    weeks: [1, 2, 3, 4, 5, 6, 7, 8],
    dayLength: "full",
    cost: 545,
    hours: "8:45 AM - 4:00 PM",
    activities: ["swim", "sports", "arts", "outdoor"],
    registration: "Watch September",
    registrationMonth: "Sep",
    status: "historical",
    source: "https://www.campchickami.org/",
    sourceLabel: "Official provider site",
    lastChecked: "Source attached",
    popularity: 91,
    note: "High-demand style option to watch before January.",
  },
];

const sponsorOffers = [
  {
    label: "Sponsored",
    title: "Winter swim tune-up",
    body: "Local swim lessons for kids preparing for summer camp swim checks.",
  },
  {
    label: "Sponsored",
    title: "January planning night",
    body: "PTO-ready registration reminder guide for elementary families.",
  },
];

function hasOverlap(a: number[], b: number[]) {
  return a.some((value) => b.includes(value));
}

function statusClass(status: DataStatus) {
  if (status === "confirmed") return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  if (status === "historical") return "bg-amber-50 text-amber-800 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function dayLabel(dayLength: DayLength) {
  if (dayLength === "full") return "Full day";
  if (dayLength === "half") return "Half day";
  return "Full or half";
}

function gradeLabel(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const first = sorted[0] === 0 ? "K" : String(sorted[0]);
  const last = sorted[sorted.length - 1] === 0 ? "K" : String(sorted[sorted.length - 1]);
  return `${first}-${last}`;
}

function currency(value: number) {
  return `$${value.toLocaleString()}`;
}

function distanceFrom(camp: Camp, town: string) {
  return camp.distanceByTown[town] ?? camp.distanceByTown.Natick ?? 25;
}

export default function Home() {
  const [selectedTown, setSelectedTown] = useState("Natick");
  const [selectedGrade, setSelectedGrade] = useState(2);
  const [selectedWeeks, setSelectedWeeks] = useState([2, 3, 4, 5, 6]);
  const [selectedActivities, setSelectedActivities] = useState(["swim", "outdoor"]);
  const [dayLength, setDayLength] = useState<DayLength>("full");
  const [maxCost, setMaxCost] = useState(700);
  const [maxDistance, setMaxDistance] = useState(15);
  const [query, setQuery] = useState(
    "Full-day camps near Natick in July with swimming or outdoor time under $700",
  );
  const [aiSummary, setAiSummary] = useState("Matched swim, outdoor, full-day, July, under $700.");
  const [savedIds, setSavedIds] = useState<string[]>(["metrowest-y"]);

  const selectedCampMap = useMemo(() => new Map(camps.map((camp) => [camp.id, camp])), []);

  const filteredCamps = useMemo(() => {
    return camps
      .map((camp) => {
        const distance = distanceFrom(camp, selectedTown);
        const proximityScore = Math.max(0, 5 - Math.floor(distance / 5));
        const townScore = camp.town === selectedTown ? 5 : proximityScore;
        const weekScore = camp.weeks.filter((week) => selectedWeeks.includes(week)).length * 3;
        const activityScore = camp.activities.filter((activity) =>
          selectedActivities.includes(activity),
        ).length * 2;
        const dayScore =
          dayLength === "both" ||
          camp.dayLength === "both" ||
          camp.dayLength === dayLength
            ? 4
            : 0;
        const gradeScore = camp.grades.includes(selectedGrade) ? 5 : 0;
        const costScore = camp.cost <= maxCost ? 3 : -8;
        const distanceScore = distance <= maxDistance ? 3 : -8;
        const statusScore = camp.status === "confirmed" ? 2 : camp.status === "historical" ? 1 : 0;

        return {
          camp,
          score:
            townScore +
            weekScore +
            activityScore +
            dayScore +
            gradeScore +
            costScore +
            distanceScore +
            statusScore +
            camp.popularity / 25,
        };
      })
      .filter(({ camp }) => {
        const distance = distanceFrom(camp, selectedTown);
        const matchesGrade = camp.grades.includes(selectedGrade);
        const matchesWeeks = hasOverlap(camp.weeks, selectedWeeks);
        const matchesActivities =
          selectedActivities.length === 0 || hasOverlap(camp.activities, selectedActivities);
        const matchesDay =
          dayLength === "both" || camp.dayLength === "both" || camp.dayLength === dayLength;
        const matchesCost = camp.cost <= maxCost;
        const matchesDistance = distance <= maxDistance;
        return (
          matchesGrade &&
          matchesWeeks &&
          matchesActivities &&
          matchesDay &&
          matchesCost &&
          matchesDistance
        );
      })
      .sort((a, b) => b.score - a.score)
      .map(({ camp }) => camp);
  }, [
    dayLength,
    maxCost,
    maxDistance,
    selectedActivities,
    selectedGrade,
    selectedTown,
    selectedWeeks,
  ]);

  const savedCamps = savedIds
    .map((id) => selectedCampMap.get(id))
    .filter((camp): camp is Camp => Boolean(camp));

  const coveredWeeks = new Set(savedCamps.flatMap((camp) => camp.weeks));
  const uncoveredWeeks = selectedWeeks.filter((week) => !coveredWeeks.has(week));
  const calendarWeeks = weeks.filter((week) => selectedWeeks.includes(week.id));
  const openingSoon = [...camps]
    .filter((camp) => camp.registrationMonth === "Sep" || camp.registrationMonth === "Jan")
    .sort((a, b) => registrationOrder[a.registrationMonth] - registrationOrder[b.registrationMonth])
    .slice(0, 5);

  function toggleActivity(activity: string) {
    setSelectedActivities((current) =>
      current.includes(activity)
        ? current.filter((item) => item !== activity)
        : [...current, activity],
    );
  }

  function toggleWeek(week: number) {
    setSelectedWeeks((current) =>
      current.includes(week) ? current.filter((item) => item !== week) : [...current, week].sort(),
    );
  }

  function toggleSaved(id: string) {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
    );
  }

  function applyAiSearch() {
    const text = query.toLowerCase();
    const nextActivities = activities.filter((activity) => text.includes(activity.toLowerCase()));
    const inferredWeeks = text.includes("aug")
      ? [6, 7, 8]
      : text.includes("july") || text.includes("jul")
        ? [2, 3, 4, 5]
        : selectedWeeks;
    const town = towns.find((item) => text.includes(item.toLowerCase()));
    const gradeMatch = text.match(/(?:rising|grade|grader|g)\s*(k|[1-5])/);
    const costMatch = text.match(/under\s*\$?(\d{3,4})/);
    const distanceMatch = text.match(/(?:within|under)\s*(\d{1,2})\s*(?:min|minute|miles|mi)/);

    if (town) setSelectedTown(town);
    if (gradeMatch) setSelectedGrade(gradeMatch[1] === "k" ? 0 : Number(gradeMatch[1]));
    if (text.includes("half")) setDayLength("half");
    if (text.includes("full")) setDayLength("full");
    if (nextActivities.length > 0) setSelectedActivities(nextActivities);
    if (costMatch) setMaxCost(Number(costMatch[1]));
    if (distanceMatch) setMaxDistance(Number(distanceMatch[1]));
    setSelectedWeeks(inferredWeeks);
    setAiSummary(
      [
        town ? town : selectedTown,
        gradeMatch ? `grade ${gradeMatch[1].toUpperCase()}` : `grade ${selectedGrade || "K"}`,
        nextActivities.length > 0 ? nextActivities.join(", ") : selectedActivities.join(", "),
        text.includes("half") ? "half-day" : "full-day",
      ].join(" | "),
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between lg:px-6">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">OnlyCamps</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950 md:text-3xl">
              Summer camp discovery for MetroWest families
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="font-semibold text-slate-950">4 towns</div>
              <div className="text-slate-600">local start</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="font-semibold text-slate-950">12 camps</div>
              <div className="text-slate-600">seed catalog</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="font-semibold text-slate-950">Sep-Jan</div>
              <div className="text-slate-600">key windows</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-4 lg:grid-cols-[320px_minmax(0,1fr)_360px] lg:px-6">
        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">AI Search</h2>
              <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800">
                source-backed
              </span>
            </div>
            <textarea
              className="mt-3 min-h-24 w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm leading-6 outline-none ring-teal-500 transition focus:ring-2"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              className="mt-3 w-full rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
              type="button"
              onClick={applyAiSearch}
            >
              Generate matches
            </button>
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              {aiSummary}
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Filters</h2>

            <div className="mt-4">
              <label className="text-sm font-semibold text-slate-700">Home town</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {towns.map((town) => (
                  <button
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                      selectedTown === town
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-teal-500"
                    }`}
                    type="button"
                    key={town}
                    onClick={() => setSelectedTown(town)}
                  >
                    {town}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-slate-700">Rising grade</label>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {grades.map((grade) => (
                  <button
                    className={`rounded-lg border py-2 text-sm font-semibold ${
                      selectedGrade === grade.value
                        ? "border-[#b54a35] bg-[#b54a35] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#b54a35]"
                    }`}
                    type="button"
                    key={grade.label}
                    onClick={() => setSelectedGrade(grade.value)}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-slate-700">Weeks needed</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {weeks.map((week) => (
                  <button
                    className={`rounded-lg border px-2 py-2 text-sm font-semibold ${
                      selectedWeeks.includes(week.id)
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-500"
                    }`}
                    type="button"
                    key={week.id}
                    onClick={() => toggleWeek(week.id)}
                  >
                    {week.short}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-slate-700">Activities</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {activities.map((activity) => (
                  <label
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                    key={activity}
                  >
                    <input
                      checked={selectedActivities.includes(activity)}
                      className="h-4 w-4 accent-teal-700"
                      onChange={() => toggleActivity(activity)}
                      type="checkbox"
                    />
                    {activity}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-slate-700">Day length</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["full", "half", "both"] as DayLength[]).map((option) => (
                  <button
                    className={`rounded-lg border px-2 py-2 text-sm font-semibold ${
                      dayLength === option
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-teal-500"
                    }`}
                    type="button"
                    key={option}
                    onClick={() => setDayLength(option)}
                  >
                    {dayLabel(option)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <label>Max cost</label>
                <span>{currency(maxCost)}</span>
              </div>
              <input
                className="mt-2 w-full accent-teal-700"
                max="900"
                min="250"
                onChange={(event) => setMaxCost(Number(event.target.value))}
                step="25"
                type="range"
                value={maxCost}
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <label>Max drive</label>
                <span>{maxDistance} mi</span>
              </div>
              <input
                className="mt-2 w-full accent-teal-700"
                max="25"
                min="3"
                onChange={(event) => setMaxDistance(Number(event.target.value))}
                step="1"
                type="range"
                value={maxDistance}
              />
            </div>
          </section>
        </aside>

        <section className="min-w-0 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Matching camps</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {filteredCamps.length} options for {selectedTown}, rising{" "}
                  {selectedGrade === 0 ? "K" : selectedGrade}, {dayLabel(dayLength).toLowerCase()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedActivities.map((activity) => (
                  <span
                    className="rounded-md bg-[#fff3d2] px-2 py-1 text-xs font-semibold text-slate-800"
                    key={activity}
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            {filteredCamps.map((camp) => {
              const saved = savedIds.includes(camp.id);
              const homeDistance = distanceFrom(camp, selectedTown);
              const matchingWeeks = camp.weeks.filter((week) => selectedWeeks.includes(week));
              const matchingActivities = camp.activities.filter((activity) =>
                selectedActivities.includes(activity),
              );

              return (
                <article
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                  key={camp.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {camp.providerType}
                        </span>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${statusClass(
                            camp.status,
                          )}`}
                        >
                          {camp.status}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-slate-950">{camp.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {camp.town} | {homeDistance} mi from {selectedTown} | grades{" "}
                        {gradeLabel(camp.grades)}
                      </p>
                    </div>
                    <button
                      className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold ${
                        saved
                          ? "border-[#b54a35] bg-[#b54a35] text-white"
                          : "border-slate-300 bg-white text-slate-800 hover:border-[#b54a35]"
                      }`}
                      type="button"
                      onClick={() => toggleSaved(camp.id)}
                    >
                      {saved ? "Saved" : "Save"}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-slate-500">Est. cost</div>
                      <div className="font-semibold">{currency(camp.cost)}/wk</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-slate-500">Hours</div>
                      <div className="font-semibold">{camp.hours}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-slate-500">Weeks</div>
                      <div className="font-semibold">
                        {matchingWeeks.length}/{selectedWeeks.length} match
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-slate-500">Registration</div>
                      <div className="font-semibold">{camp.registration}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {camp.activities.map((activity) => (
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          matchingActivities.includes(activity)
                            ? "bg-teal-50 text-teal-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                        key={activity}
                      >
                        {activity}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-700">{camp.note}</p>

                  <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm md:flex-row md:items-center md:justify-between">
                    <div className="text-slate-600">
                      {camp.sourceLabel} | {camp.lastChecked}
                    </div>
                    <a
                      className="font-semibold text-teal-800 underline decoration-teal-200 underline-offset-4"
                      href={camp.source}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Official link
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Summer Plan</h2>
              <span className="text-sm font-semibold text-slate-600">
                {savedCamps.length} saved
              </span>
            </div>

            <div className="mt-4 grid gap-2">
              {calendarWeeks.map((week) => {
                const covering = savedCamps.filter((camp) => camp.weeks.includes(week.id));
                const isCovered = covering.length > 0;

                return (
                  <div
                    className={`rounded-lg border p-3 ${
                      isCovered
                        ? "border-teal-200 bg-teal-50"
                        : "border-[#e8c466] bg-[#fff8dc]"
                    }`}
                    key={week.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{week.label}</div>
                      <div
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          isCovered ? "bg-white text-teal-800" : "bg-white text-[#8a5b00]"
                        }`}
                      >
                        {isCovered ? "covered" : "gap"}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      {isCovered ? covering.map((camp) => camp.name).join(", ") : "No saved camp"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <div className="text-sm font-semibold text-slate-700">Uncovered weeks</div>
              <div className="mt-1 text-2xl font-semibold text-slate-950">
                {uncoveredWeeks.length}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {uncoveredWeeks.length > 0
                  ? uncoveredWeeks
                      .map((weekId) => weeks.find((week) => week.id === weekId)?.short)
                      .join(", ")
                  : "Plan covers all selected weeks"}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Registration Watch</h2>
            <div className="mt-4 space-y-3">
              {openingSoon.map((camp) => (
                <div className="rounded-lg border border-slate-200 p-3" key={camp.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{camp.name}</div>
                      <div className="mt-1 text-sm text-slate-600">{camp.registration}</div>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {camp.registrationMonth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Local Offers</h2>
            <div className="mt-4 space-y-3">
              {sponsorOffers.map((offer) => (
                <div className="rounded-lg border border-dashed border-slate-300 p-3" key={offer.title}>
                  <div className="text-xs font-semibold uppercase text-[#b54a35]">{offer.label}</div>
                  <div className="mt-1 font-semibold">{offer.title}</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{offer.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
            Demo planning data. Parents should verify dates, prices, eligibility, availability,
            licensing, and registration rules on each official provider site before booking.
          </section>
        </aside>
      </div>
    </main>
  );
}
