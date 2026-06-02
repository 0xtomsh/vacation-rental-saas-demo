import { AiReviewReply } from "@/components/ai-review-reply";
import { AppShell } from "@/components/app-shell";
import { ReservationsTable } from "@/components/reservations-table";
import { StatsCards } from "@/components/stats-cards";
import { TechnologyStack } from "@/components/technology-stack";
import { WeeklyCalendar } from "@/components/weekly-calendar";
import {
  BedDouble,
  CalendarCheck,
  CircleDollarSign,
  MessageSquareText,
} from "lucide-react";

const stats = [
  {
    label: "Monthly revenue",
    value: "$12,840",
    delta: "+12.4%",
    icon: CircleDollarSign,
  },
  { label: "Reservations", value: "48", delta: "+8", icon: CalendarCheck },
  { label: "Occupancy rate", value: "82%", delta: "+5.1%", icon: BedDouble },
  {
    label: "Pending reviews",
    value: "6",
    delta: "AI drafts ready",
    icon: MessageSquareText,
  },
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

const technologyStack = [
  {
    name: "Next.js 16 App Router",
    role: "Application routing, layouts, and server actions",
  },
  {
    name: "React 19",
    role: "Interactive dashboard UI components",
  },
  {
    name: "TypeScript 5",
    role: "Typed application code and data contracts",
  },
  {
    name: "Tailwind CSS 4",
    role: "Utility-first styling through PostCSS",
  },
  {
    name: "Supabase Auth",
    role: "Demo login and server-side session handling",
  },
  {
    name: "Prisma 7 + PostgreSQL",
    role: "Reservation, property, payment, and review data models",
  },
  {
    name: "lucide-react",
    role: "Consistent interface iconography",
  },
  {
    name: "ESLint + pnpm",
    role: "Code quality checks and workspace package management",
  },
];

export default function DashboardPage() {
  return (
    <AppShell
      activeHref="/dashboard"
      actionLabel="Add reservation"
      eyebrow={
        <>
          Source code copyright belongs to{" "}
          <a
            className="text-[#6d61d7] underline decoration-[#c4c7ef] underline-offset-4 hover:text-[#4f46bd]"
            href="https://github.com/0xtomsh"
            rel="noreferrer"
            target="_blank"
          >
            Tomoki.S
          </a>
        </>
      }
      title="Manage bookings, revenue, and replies in one workspace"
    >
      <StatsCards stats={stats} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <ReservationsTable reservations={reservations} />
        <WeeklyCalendar days={calendarDays} rangeLabel="6/10 - 6/16" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AiReviewReply />
        <TechnologyStack items={technologyStack} />
      </div>
    </AppShell>
  );
}
