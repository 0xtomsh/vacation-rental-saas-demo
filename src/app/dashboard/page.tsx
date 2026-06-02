import { AiReviewReply } from "@/components/ai-review-reply";
import { AppShell } from "@/components/app-shell";
import { DevelopmentRoadmap } from "@/components/development-roadmap";
import { ReservationsTable } from "@/components/reservations-table";
import { StatsCards } from "@/components/stats-cards";
import { WeeklyCalendar } from "@/components/weekly-calendar";

const stats = [
  { label: "Monthly revenue", value: "$12,840", delta: "+12.4%" },
  { label: "Reservations", value: "48", delta: "+8" },
  { label: "Occupancy rate", value: "82%", delta: "+5.1%" },
  { label: "Pending reviews", value: "6", delta: "AI drafts ready" },
];

const reservations = [
  {
    guest: "Mika Tanaka",
    property: "Asakusa Riverside 301",
    dates: "6/12 - 6/15",
    amount: "$864",
    status: "Confirmed",
  },
  {
    guest: "Alex Kim",
    property: "Hakone Mountain Lodge",
    dates: "6/18 - 6/22",
    amount: "$1,420",
    status: "Payment due",
  },
  {
    guest: "Sara Ito",
    property: "Kyoto Machiya Stay",
    dates: "6/26 - 6/28",
    amount: "$748",
    status: "Reviewing",
  },
];

const calendarDays = [
  { day: "Mon", date: "10", occupancy: "3/4" },
  { day: "Tue", date: "11", occupancy: "4/4" },
  { day: "Wed", date: "12", occupancy: "4/4" },
  { day: "Thu", date: "13", occupancy: "2/4" },
  { day: "Fri", date: "14", occupancy: "3/4" },
  { day: "Sat", date: "15", occupancy: "4/4" },
  { day: "Sun", date: "16", occupancy: "1/4" },
];

const roadmap = [
  "Next.js App Router",
  "Supabase Auth",
  "Prisma CRUD",
  "Stripe Checkout",
  "OpenAI Review Reply",
];

export default function DashboardPage() {
  return (
    <AppShell
      activeHref="/dashboard"
      actionLabel="Add reservation"
      eyebrow="June 2026 operations"
      title="Manage bookings, revenue, and replies in one workspace"
    >
      <StatsCards stats={stats} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <ReservationsTable reservations={reservations} />
        <WeeklyCalendar days={calendarDays} rangeLabel="6/10 - 6/16" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AiReviewReply />
        <DevelopmentRoadmap items={roadmap} />
      </div>
    </AppShell>
  );
}
