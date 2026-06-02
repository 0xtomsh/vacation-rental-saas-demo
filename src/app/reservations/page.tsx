import { AppShell } from "@/components/app-shell";
import { ReservationsTable } from "@/components/reservations-table";
import { StatsCards } from "@/components/stats-cards";

const stats = [
  { label: "Arrivals today", value: "7", delta: "3 ready" },
  { label: "Departures", value: "5", delta: "2 late checkouts" },
  { label: "Open requests", value: "12", delta: "+4" },
  { label: "Booked nights", value: "186", delta: "+18%" },
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
  {
    guest: "Noah Smith",
    property: "Shibuya Studio 7F",
    dates: "7/02 - 7/06",
    amount: "$1,080",
    status: "Confirmed",
  },
];

export default function ReservationsPage() {
  return (
    <AppShell
      actionLabel="New booking"
      eyebrow="Reservation pipeline"
      title="Track upcoming stays and guest requests"
    >
      <StatsCards stats={stats} />
      <div className="mt-6">
        <ReservationsTable reservations={reservations} />
      </div>
    </AppShell>
  );
}
