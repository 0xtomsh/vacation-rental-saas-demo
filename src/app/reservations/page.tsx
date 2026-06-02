import { AppShell } from "@/components/app-shell";
import type { Reservation } from "@/components/reservations-table";
import { ReservationsTable } from "@/components/reservations-table";
import { StatsCards } from "@/components/stats-cards";
import { prisma } from "@/lib/prisma";

import {
  createReservation,
  deleteReservation,
  updateReservation,
} from "./actions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const statusLabels = {
  REVIEWING: "Reviewing",
  CONFIRMED: "Confirmed",
  PAYMENT_DUE: "Payment due",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW: "No show",
};

const statuses = [
  { value: "REVIEWING", label: "Reviewing" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PAYMENT_DUE", label: "Payment due" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "NO_SHOW", label: "No show" },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "2-digit",
  }).format(date);
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatAmount(amount: { toString: () => string }, currency: string) {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(Number(amount.toString()));
}

function inputClassName() {
  return "h-10 rounded-xl border border-[#e7e9f6] bg-white px-3 text-sm text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20";
}

export default async function ReservationsPage() {
  const [dbReservations, guests, properties] = await Promise.all([
    prisma.reservation.findMany({
      include: {
        guest: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
      },
      orderBy: { checkInDate: "asc" },
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
      where: { role: "GUEST" },
    }),
    prisma.property.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const today = formatDateInput(new Date());
  const reservations: Reservation[] = dbReservations.map((reservation) => ({
    id: reservation.id,
    guest: reservation.guest.name,
    property: reservation.property.name,
    dates: `${formatDate(reservation.checkInDate)} - ${formatDate(
      reservation.checkOutDate,
    )}`,
    amount: formatAmount(reservation.totalAmount, reservation.currency),
    status:
      statusLabels[reservation.status as keyof typeof statusLabels] ??
      reservation.status,
    statusValue: reservation.status,
    propertyId: reservation.propertyId,
    guestId: reservation.guestId,
    checkInDate: formatDateInput(reservation.checkInDate),
    checkOutDate: formatDateInput(reservation.checkOutDate),
    guestCount: reservation.guestCount,
    totalAmount: reservation.totalAmount.toString(),
    currency: reservation.currency,
    notes: reservation.notes,
  }));

  const openRequests = dbReservations.filter(
    (reservation) => reservation.status === "REVIEWING",
  ).length;
  const confirmed = dbReservations.filter(
    (reservation) => reservation.status === "CONFIRMED",
  ).length;
  const bookedNights = dbReservations.reduce((total, reservation) => {
    const nights =
      (reservation.checkOutDate.getTime() - reservation.checkInDate.getTime()) /
      86_400_000;

    return total + Math.max(0, nights);
  }, 0);

  const stats = [
    { label: "Reservations", value: String(dbReservations.length), delta: "total" },
    { label: "Confirmed", value: String(confirmed), delta: "ready" },
    { label: "Open requests", value: String(openRequests), delta: "reviewing" },
    { label: "Booked nights", value: String(bookedNights), delta: "current list" },
  ];

  return (
    <AppShell
      activeHref="/reservations"
      actionLabel="New booking"
      eyebrow="Reservation pipeline"
      title="Track upcoming stays and guest requests"
    >
      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
        <div className="px-5 py-4">
          <h3 className="font-semibold text-[#202238]">Create reservation</h3>
        </div>
        <form
          action={createReservation}
          className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_1fr_150px_150px_110px_140px_130px]"
        >
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Guest
            <select
              className={inputClassName()}
              disabled={guests.length === 0}
              name="guestId"
              required
            >
              {guests.map((guest) => (
                <option key={guest.id} value={guest.id}>
                  {guest.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Property
            <select
              className={inputClassName()}
              disabled={properties.length === 0}
              name="propertyId"
              required
            >
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Check in
            <input
              className={inputClassName()}
              defaultValue={today}
              name="checkInDate"
              required
              type="date"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Check out
            <input
              className={inputClassName()}
              name="checkOutDate"
              required
              type="date"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Guests
            <input
              className={inputClassName()}
              defaultValue="1"
              min="1"
              name="guestCount"
              required
              type="number"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Amount
            <input
              className={inputClassName()}
              min="0"
              name="totalAmount"
              required
              step="0.01"
              type="number"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Status
            <select className={inputClassName()} name="status">
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <input defaultValue="USD" name="currency" type="hidden" />
          <textarea
            className="min-h-10 rounded-xl border border-[#e7e9f6] bg-white px-3 py-2 text-sm text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20 lg:col-span-6"
            name="notes"
            placeholder="Notes"
          />
          <button
            className="h-10 rounded-full bg-[#52dce6] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(82,220,230,0.28)] hover:bg-[#45cfd9] disabled:cursor-not-allowed disabled:bg-[#b8edf2]"
            disabled={guests.length === 0 || properties.length === 0}
            type="submit"
          >
            Create
          </button>
          {guests.length === 0 || properties.length === 0 ? (
            <p className="text-sm text-[#df5473] lg:col-span-7">
              Add at least one guest and one property before creating reservations.
            </p>
          ) : null}
        </form>
      </section>
      <StatsCards stats={stats} />
      <div className="mt-6">
        <ReservationsTable
          actions={{
            delete: deleteReservation,
            update: updateReservation,
          }}
          guests={guests}
          properties={properties}
          reservations={reservations}
        />
      </div>
    </AppShell>
  );
}
