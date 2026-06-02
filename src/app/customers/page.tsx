import { AppShell } from "@/components/app-shell";
import { StatsCards } from "@/components/stats-cards";
import { TechnologyStack } from "@/components/technology-stack";
import {
  getDemoManagementStateSnapshot,
  readDemoManagementSessionId,
  type DemoCustomerDraft,
} from "@/lib/demo-management-session";
import {
  getDemoReservationStateSnapshot,
  readDemoReservationSessionId,
} from "@/lib/demo-reservation-session";
import { prisma } from "@/lib/prisma";
import {
  customerListArgs,
  customerReservationHistoryArgs,
  propertyOptionArgs,
  type CustomerListItem,
  type CustomerReservationHistoryItem,
  type DecimalStringable,
  type PropertyOption,
} from "@/lib/prisma-types";
import {
  ClipboardList,
  Mail,
  Plus,
  Save,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import { createCustomer, deleteCustomer, updateCustomer } from "./actions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Customer = CustomerListItem;

type ReservationHistoryItem = {
  id: string;
  guestId: string;
  propertyName: string;
  dates: string;
  amount: string;
  status: string;
};

const technologyStack = [
  {
    name: "Read-only database baseline",
    role: "Loads seeded guest records and reservation history from Prisma without mutating demo data.",
  },
  {
    name: "Session overlay",
    role: "Stores customer create, update, and delete operations in memory for this browser session.",
  },
  {
    name: "Server Actions",
    role: "Validates customer forms on the server and refreshes the customer route after each submit.",
  },
  {
    name: "Reservation joins",
    role: "Shows each customer row with the latest stays from reservation and property data.",
  },
];

const statusLabels = {
  REVIEWING: "Reviewing",
  CONFIRMED: "Confirmed",
  PAYMENT_DUE: "Payment due",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW: "No show",
};

function inputClassName() {
  return "h-10 min-w-0 w-full rounded-xl border border-[#e7e9f6] bg-white px-3 text-sm text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "2-digit",
  }).format(date);
}

function formatAmount(amount: DecimalStringable, currency: string) {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(Number(amount.toString()));
}

function draftToCustomer(draft: DemoCustomerDraft): Customer {
  return {
    id: draft.id,
    email: draft.email,
    name: draft.name,
    phone: draft.phone,
  };
}

export default async function CustomersPage() {
  const [
    dbCustomers,
    dbReservations,
    properties,
    managementSessionId,
    reservationSessionId,
  ]: [
    Customer[],
    CustomerReservationHistoryItem[],
    PropertyOption[],
    string | null,
    string | null,
  ] = await Promise.all([
    prisma.user.findMany(customerListArgs),
    prisma.reservation.findMany(customerReservationHistoryArgs),
    prisma.property.findMany(propertyOptionArgs),
    readDemoManagementSessionId(),
    readDemoReservationSessionId(),
  ]);

  const managementState = getDemoManagementStateSnapshot(managementSessionId);
  const reservationState = getDemoReservationStateSnapshot(reservationSessionId);
  const deletedCustomerIds = new Set(managementState.deletedCustomerIds);
  const customerDraftsById = new Map(
    managementState.customers.map((customer) => [customer.id, customer]),
  );
  const dbCustomerIds = new Set(dbCustomers.map((customer) => customer.id));

  const customers: Customer[] = dbCustomers.flatMap((customer) => {
    if (deletedCustomerIds.has(customer.id)) {
      return [];
    }

    const draft = customerDraftsById.get(customer.id);

    return [
      draft
        ? draftToCustomer(draft)
        : {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
          },
    ];
  });

  for (const draft of managementState.customers) {
    if (!dbCustomerIds.has(draft.id) && !deletedCustomerIds.has(draft.id)) {
      customers.push(draftToCustomer(draft));
    }
  }

  customers.sort((first, second) => first.name.localeCompare(second.name));

  const propertyNamesById = new Map(
    properties.map((property) => [property.id, property.name]),
  );
  const deletedReservationIds = new Set(reservationState.deletedIds);
  const reservationDraftsById = new Map(
    reservationState.reservations.map((reservation) => [
      reservation.id,
      reservation,
    ]),
  );
  const dbReservationIds = new Set(
    dbReservations.map((reservation) => reservation.id),
  );
  const history: ReservationHistoryItem[] = dbReservations.flatMap(
    (reservation) => {
      if (deletedReservationIds.has(reservation.id)) {
        return [];
      }

      const draft = reservationDraftsById.get(reservation.id);
      const source = draft
        ? {
            id: draft.id,
            guestId: draft.guestId,
            propertyName:
              propertyNamesById.get(draft.propertyId) ?? "Unknown property",
            checkInDate: new Date(`${draft.checkInDate}T00:00:00.000Z`),
            checkOutDate: new Date(`${draft.checkOutDate}T00:00:00.000Z`),
            totalAmount: { toString: () => draft.totalAmount },
            currency: draft.currency,
            status: draft.status,
          }
        : {
            id: reservation.id,
            guestId: reservation.guestId,
            propertyName: reservation.property.name,
            checkInDate: reservation.checkInDate,
            checkOutDate: reservation.checkOutDate,
            totalAmount: reservation.totalAmount,
            currency: reservation.currency,
            status: reservation.status,
          };

      return [
        {
          id: source.id,
          guestId: source.guestId,
          propertyName: source.propertyName,
          dates: `${formatDate(source.checkInDate)} - ${formatDate(
            source.checkOutDate,
          )}`,
          amount: formatAmount(source.totalAmount, source.currency),
          status:
            statusLabels[source.status as keyof typeof statusLabels] ??
            source.status,
        },
      ];
    },
  );

  for (const draft of reservationState.reservations) {
    if (dbReservationIds.has(draft.id) || deletedReservationIds.has(draft.id)) {
      continue;
    }

    history.push({
      id: draft.id,
      guestId: draft.guestId,
      propertyName: propertyNamesById.get(draft.propertyId) ?? "Unknown property",
      dates: `${formatDate(new Date(`${draft.checkInDate}T00:00:00.000Z`))} - ${formatDate(
        new Date(`${draft.checkOutDate}T00:00:00.000Z`),
      )}`,
      amount: formatAmount({ toString: () => draft.totalAmount }, draft.currency),
      status: statusLabels[draft.status] ?? draft.status,
    });
  }

  const customerIds = new Set(customers.map((customer) => customer.id));
  const visibleHistory = history.filter((item) => customerIds.has(item.guestId));
  const customersWithReservations = new Set(
    visibleHistory.map((item) => item.guestId),
  ).size;

  const stats = [
    {
      label: "Customers",
      value: String(customers.length),
      delta: "session view",
      icon: Users,
    },
    {
      label: "With bookings",
      value: String(customersWithReservations),
      delta: "active guests",
      icon: ClipboardList,
    },
    {
      label: "Reservation rows",
      value: String(visibleHistory.length),
      delta: "history",
      icon: Save,
    },
    {
      label: "Email contacts",
      value: String(customers.filter((customer) => customer.email).length),
      delta: "reachable",
      icon: Mail,
    },
  ];

  return (
    <AppShell
      activeHref="/customers"
      actionLabel="New customer"
      eyebrow="Customer management"
      title="Manage guest profiles and reservation history"
    >
      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
        <div className="px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
            <UserPlus aria-hidden="true" size={18} strokeWidth={2.2} />
            Create customer
          </h3>
        </div>
        <form
          action={createCustomer}
          className="grid gap-4 px-5 py-5 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Name
            <input className={inputClassName()} name="name" required />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Email
            <input className={inputClassName()} name="email" required type="email" />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Phone
            <input className={inputClassName()} name="phone" type="tel" />
          </label>
          <button
            className="flex h-10 min-w-0 items-center justify-center gap-2 self-end rounded-full bg-[#52dce6] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(82,220,230,0.28)] hover:bg-[#45cfd9]"
            type="submit"
          >
            <Plus aria-hidden="true" size={16} strokeWidth={2.2} />
            Create
          </button>
        </form>
      </section>

      <StatsCards stats={stats} />

      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
        <div className="px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
            <Users aria-hidden="true" size={18} strokeWidth={2.2} />
            Customers
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left text-sm">
            <thead className="bg-[#fafbff] text-[#8b91b5]">
              <tr>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Reservation history</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const customerHistory = visibleHistory.filter(
                  (item) => item.guestId === customer.id,
                );

                return (
                  <tr className="border-t border-[#f0f2fb]" key={customer.id}>
                    <td className="px-5 py-4 align-top">
                      <form
                        action={updateCustomer.bind(null, customer.id)}
                        className="grid gap-3"
                      >
                        <input
                          className={inputClassName()}
                          defaultValue={customer.name}
                          name="name"
                          required
                        />
                        <input
                          className={inputClassName()}
                          defaultValue={customer.email}
                          name="email"
                          required
                          type="email"
                        />
                        <input
                          className={inputClassName()}
                          defaultValue={customer.phone ?? ""}
                          name="phone"
                          type="tel"
                        />
                        <button
                          className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#52dce6] px-3 text-xs font-semibold text-white hover:bg-[#45cfd9]"
                          type="submit"
                        >
                          <Save aria-hidden="true" size={14} strokeWidth={2.2} />
                          Save
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4 align-top text-[#74799b]">
                      <span className="block font-semibold text-[#202238]">
                        {customer.email}
                      </span>
                      <span className="mt-1 block">{customer.phone ?? "No phone"}</span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="grid gap-2">
                        {customerHistory.length > 0 ? (
                          customerHistory.map((item) => (
                            <div
                              className="rounded-xl bg-[#fbfcff] px-3 py-2 ring-1 ring-[#eef0fb]"
                              key={item.id}
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-[#202238]">
                                  {item.propertyName}
                                </span>
                                <span className="rounded-full bg-[#effbfd] px-2.5 py-1 text-xs font-semibold text-[#28bac6]">
                                  {item.status}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-[#74799b]">
                                {item.dates} · {item.amount}
                              </p>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-[#8b91b5]">
                            No reservation history.
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <form action={deleteCustomer.bind(null, customer.id)}>
                        <button
                          className="flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#ffd5de] bg-white px-3 text-xs font-semibold text-[#df5473] hover:bg-[#fff6f8]"
                          type="submit"
                        >
                          <Trash2 aria-hidden="true" size={14} strokeWidth={2.2} />
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {customers.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#8b91b5]">
              No customers yet.
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-6">
        <TechnologyStack
          description="Customer changes are intentionally temporary in this public demo. Seeded database records stay read-only while this page renders session-scoped edits over them."
          items={technologyStack}
          title="How this page works"
        />
      </div>
    </AppShell>
  );
}
