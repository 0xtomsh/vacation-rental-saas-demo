import { AppShell } from "@/components/app-shell";
import {
  MonthlyCalendar,
  type MonthlyCalendarDay,
} from "@/components/monthly-calendar";
import { StatsCards } from "@/components/stats-cards";
import { TechnologyStack } from "@/components/technology-stack";
import { Ban, BedDouble, CalendarCheck, Moon } from "lucide-react";

const stats = [
  { label: "Occupancy", value: "82%", delta: "+5.1%", icon: BedDouble },
  { label: "Turnovers", value: "14", delta: "This month", icon: CalendarCheck },
  { label: "Blocked nights", value: "9", delta: "Maintenance", icon: Ban },
  { label: "Avg. stay", value: "3.4", delta: "nights", icon: Moon },
];

const technologyStack = [
  {
    name: "Server-rendered page",
    role: "Ships the monthly calendar view as ready HTML, which keeps the schedule fast to open.",
  },
  {
    name: "Reusable React components",
    role: "Renders the full month from the same typed calendar data structure.",
  },
  {
    name: "Tailwind CSS 4",
    role: "Builds the responsive month grid, badges, spacing, and occupancy states.",
  },
  {
    name: "TypeScript",
    role: "Defines the date, month, and occupancy fields that the monthly calendar expects.",
  },
];

function getMondayFirstOffset(date: Date) {
  return (date.getDay() + 6) % 7;
}

function getOccupancyForDate(date: Date) {
  const score = (date.getDate() + date.getMonth() * 2) % 7;
  const occupiedRooms = Math.min(4, Math.max(1, score > 4 ? 4 : score + 1));

  return `${occupiedRooms}/4`;
}

function getStatusForDate(date: Date) {
  const day = date.getDate();

  if (day === 1 || day === 15) {
    return "Turnover";
  }

  if (day % 11 === 0 || day % 13 === 0) {
    return "Blocked";
  }

  if (day % 6 === 0) {
    return "Peak";
  }
}

function buildMonthDays(baseDate: Date): MonthlyCalendarDay[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const startOffset = getMondayFirstOffset(firstDate);
  const calendarStartDate = new Date(year, month, 1 - startOffset);
  const totalDays = 42;

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(
      calendarStartDate.getFullYear(),
      calendarStartDate.getMonth(),
      calendarStartDate.getDate() + index,
    );

    return {
      date: date.toISOString(),
      dayOfMonth: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      occupancy: getOccupancyForDate(date),
      status: date.getMonth() === month ? getStatusForDate(date) : undefined,
    };
  });
}

export default function CalendarPage() {
  const currentDate = new Date();
  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const monthDays = buildMonthDays(currentDate);

  return (
    <AppShell
      activeHref="/calendar"
      actionLabel="Block dates"
      eyebrow="Calendar"
      title="See occupancy and turnovers for the current month"
    >
      <StatsCards stats={stats} />
      <div className="mt-6">
        <MonthlyCalendar days={monthDays} monthLabel={monthLabel} />
      </div>
      <div className="mt-6">
        <TechnologyStack
          description="This page shows the visual layer of the demo: structured monthly data is turned into an occupancy calendar with reusable components and responsive styling."
          items={technologyStack}
          title="How this page works"
        />
      </div>
    </AppShell>
  );
}
