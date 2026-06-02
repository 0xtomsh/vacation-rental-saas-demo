import { AppShell } from "@/components/app-shell";
import type { Reservation } from "@/components/reservations-table";
import { ReservationsTable } from "@/components/reservations-table";
import { StatsCards } from "@/components/stats-cards";
import { TechnologyStack } from "@/components/technology-stack";
import {
  getDemoReservationStateSnapshot,
  readDemoReservationSessionId,
  type DemoReservationDraft,
} from "@/lib/demo-reservation-session";
import { prisma } from "@/lib/prisma";
import {
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Moon,
  Plus,
} from "lucide-react";

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

const technologyStack = [
  {
    name: "Next.js Server Components",
    role: "Loads reservations, guests, and properties on the server before the page renders.",
  },
  {
    name: "Prisma 7 + PostgreSQL",
    role: "Provides read-only seed reservations, guests, and properties for the public demo.",
  },
  {
    name: "Next.js Server Actions",
    role: "Handles create, update, and delete form submissions in a session-scoped memory store.",
  },
  {
    name: "TypeScript",
    role: "Keeps reservation rows, status values, and form payloads aligned across the UI.",
  },
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

type AmountLike = {
  toString: () => string;
};

function formatAmount(amount: AmountLike, currency: string) {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(Number(amount.toString()));
}

type ReservationOption = {
  id: string;
  name: string;
};

type DbReservation = {
  id: string;
  propertyId: string;
  guestId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  status: string;
  totalAmount: AmountLike;
  currency: string;
  notes: string | null;
  guest: ReservationOption;
  property: ReservationOption;
};

type ReservationDisplaySource = {
  id: string;
  guestName: string;
  propertyName: string;
  propertyId: string;
  guestId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  status: string;
  totalAmount: AmountLike;
  currency: string;
  notes: string | null;
};

function inputClassName() {
  return "h-10 min-w-0 w-full rounded-xl border border-[#e7e9f6] bg-white px-3 text-sm text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20";
}

export default async function ReservationsPage() {
  const [dbReservations, guests, properties, sessionId]: [
    DbReservation[],
    ReservationOption[],
    ReservationOption[],
    string | null,
  ] = await Promise.all([
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
    readDemoReservationSessionId(),
  ]);
  const demoReservationState = getDemoReservationStateSnapshot(sessionId);
  const guestNamesById = new Map(guests.map((guest) => [guest.id, guest.name]));
  const propertyNamesById = new Map(
    properties.map((property) => [property.id, property.name]),
  );

  function draftToDisplaySource(
    draft: DemoReservationDraft,
  ): ReservationDisplaySource | null {
    const guestName = guestNamesById.get(draft.guestId);
    const propertyName = propertyNamesById.get(draft.propertyId);

    if (!guestName || !propertyName) {
      return null;
    }

    return {
      id: draft.id,
      guestName,
      propertyName,
      propertyId: draft.propertyId,
      guestId: draft.guestId,
      checkInDate: new Date(`${draft.checkInDate}T00:00:00.000Z`),
      checkOutDate: new Date(`${draft.checkOutDate}T00:00:00.000Z`),
      guestCount: draft.guestCount,
      status: draft.status,
      totalAmount: { toString: () => draft.totalAmount },
      currency: draft.currency,
      notes: draft.notes,
    };
  }

  const deletedReservationIds = new Set(demoReservationState.deletedIds);
  const draftReservationsById = new Map(
    demoReservationState.reservations.map((reservation) => [
      reservation.id,
      reservation,
    ]),
  );
  const dbReservationIds = new Set(
    dbReservations.map((reservation) => reservation.id),
  );
  const displaySources: ReservationDisplaySource[] = dbReservations.flatMap(
    (reservation) => {
      if (deletedReservationIds.has(reservation.id)) {
        return [];
      }

      const draft = draftReservationsById.get(reservation.id);

      if (draft) {
        const source = draftToDisplaySource(draft);

        return source ? [source] : [];
      }

      return [
        {
          id: reservation.id,
          guestName: reservation.guest.name,
          propertyName: reservation.property.name,
          propertyId: reservation.propertyId,
          guestId: reservation.guestId,
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          guestCount: reservation.guestCount,
          status: reservation.status,
          totalAmount: reservation.totalAmount,
          currency: reservation.currency,
          notes: reservation.notes,
        },
      ];
    },
  );

  for (const draft of demoReservationState.reservations) {
    if (dbReservationIds.has(draft.id) || deletedReservationIds.has(draft.id)) {
      continue;
    }

    const source = draftToDisplaySource(draft);

    if (source) {
      displaySources.push(source);
    }
  }

  displaySources.sort(
    (first, second) =>
      first.checkInDate.getTime() - second.checkInDate.getTime(),
  );

  const today = formatDateInput(new Date());
  const reservations: Reservation[] = displaySources.map((reservation) => ({
    id: reservation.id,
    guest: reservation.guestName,
    property: reservation.propertyName,
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

  const openRequests = displaySources.filter(
    (reservation) => reservation.status === "REVIEWING",
  ).length;
  const confirmed = displaySources.filter(
    (reservation) => reservation.status === "CONFIRMED",
  ).length;
  const bookedNights = displaySources.reduce((total, reservation) => {
    const nights =
      (reservation.checkOutDate.getTime() - reservation.checkInDate.getTime()) /
      86_400_000;

    return total + Math.max(0, nights);
  }, 0);

  const stats = [
    {
      label: "Reservations",
      value: String(displaySources.length),
      delta: "session view",
      icon: CalendarCheck,
    },
    {
      label: "Confirmed",
      value: String(confirmed),
      delta: "ready",
      icon: CheckCircle2,
    },
    {
      label: "Open requests",
      value: String(openRequests),
      delta: "reviewing",
      icon: Clock,
    },
    {
      label: "Booked nights",
      value: String(bookedNights),
      delta: "current list",
      icon: Moon,
    },
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
          <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
            <CalendarPlus aria-hidden="true" size={18} strokeWidth={2.2} />
            Create reservation
          </h3>
        </div>
        <form
          action={createReservation}
          className="grid gap-4 px-5 py-5 md:grid-cols-2 xl:grid-cols-4"
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
            className="min-h-10 min-w-0 rounded-xl border border-[#e7e9f6] bg-white px-3 py-2 text-sm text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20 md:col-span-2 xl:col-span-3"
            name="notes"
            placeholder="Notes"
          />
          <button
            className="flex h-10 min-w-0 items-center justify-center gap-2 rounded-full bg-[#52dce6] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(82,220,230,0.28)] hover:bg-[#45cfd9] disabled:cursor-not-allowed disabled:bg-[#b8edf2]"
            disabled={guests.length === 0 || properties.length === 0}
            type="submit"
          >
            <Plus aria-hidden="true" size={16} strokeWidth={2.2} />
            Create
          </button>
          {guests.length === 0 || properties.length === 0 ? (
            <p className="text-sm text-[#df5473] md:col-span-2 xl:col-span-4">
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
          title="All reservations"
        />
      </div>
      <div className="mt-6">
        <TechnologyStack
          description="This page demonstrates a public-demo workflow: the table starts from read-only database records, and each form submit applies temporary changes only to this browser session."
          items={technologyStack}
          title="How this page works"
        />
      </div>
    </AppShell>
  );
}
