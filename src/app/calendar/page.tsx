import { AppShell } from "@/components/app-shell";
import { StatsCards } from "@/components/stats-cards";
import { WeeklyCalendar } from "@/components/weekly-calendar";

const stats = [
  { label: "Occupancy", value: "82%", delta: "+5.1%" },
  { label: "Turnovers", value: "14", delta: "This week" },
  { label: "Blocked nights", value: "9", delta: "Maintenance" },
  { label: "Avg. stay", value: "3.4", delta: "nights" },
];

const currentWeek = [
  { day: "Mon", date: "10", occupancy: "3/4" },
  { day: "Tue", date: "11", occupancy: "4/4" },
  { day: "Wed", date: "12", occupancy: "4/4" },
  { day: "Thu", date: "13", occupancy: "2/4" },
  { day: "Fri", date: "14", occupancy: "3/4" },
  { day: "Sat", date: "15", occupancy: "4/4" },
  { day: "Sun", date: "16", occupancy: "1/4" },
];

const nextWeek = [
  { day: "Mon", date: "17", occupancy: "2/4" },
  { day: "Tue", date: "18", occupancy: "3/4" },
  { day: "Wed", date: "19", occupancy: "3/4" },
  { day: "Thu", date: "20", occupancy: "4/4" },
  { day: "Fri", date: "21", occupancy: "4/4" },
  { day: "Sat", date: "22", occupancy: "4/4" },
  { day: "Sun", date: "23", occupancy: "2/4" },
];

export default function CalendarPage() {
  return (
    <AppShell
      actionLabel="Block dates"
      eyebrow="Calendar"
      title="See occupancy and turnovers by week"
    >
      <StatsCards stats={stats} />
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <WeeklyCalendar days={currentWeek} rangeLabel="6/10 - 6/16" />
        <WeeklyCalendar days={nextWeek} rangeLabel="6/17 - 6/23" />
      </div>
    </AppShell>
  );
}
