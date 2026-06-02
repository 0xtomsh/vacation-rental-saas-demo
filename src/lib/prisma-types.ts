import type { Prisma } from "@prisma/client";

export type DecimalStringable = {
  toString: () => string;
};

export const propertyListArgs = {
  include: {
    _count: { select: { reservations: true } },
  },
  orderBy: { name: "asc" },
} as const satisfies Prisma.PropertyFindManyArgs;

export type PropertyListItem = Prisma.PropertyGetPayload<
  typeof propertyListArgs
>;

export const ownerOptionArgs = {
  orderBy: { name: "asc" },
  select: { id: true, name: true },
  where: { role: { in: ["HOST", "ADMIN"] } },
} as const satisfies Prisma.UserFindManyArgs;

export type OwnerOption = Prisma.UserGetPayload<typeof ownerOptionArgs>;

export const guestOptionArgs = {
  orderBy: { name: "asc" },
  select: { id: true, name: true },
  where: { role: "GUEST" },
} as const satisfies Prisma.UserFindManyArgs;

export type GuestOption = Prisma.UserGetPayload<typeof guestOptionArgs>;

export const propertyOptionArgs = {
  orderBy: { name: "asc" },
  select: { id: true, name: true },
} as const satisfies Prisma.PropertyFindManyArgs;

export type PropertyOption = Prisma.PropertyGetPayload<typeof propertyOptionArgs>;

export const reservationListArgs = {
  include: {
    guest: { select: { id: true, name: true } },
    property: { select: { id: true, name: true } },
  },
  orderBy: { checkInDate: "asc" },
} as const satisfies Prisma.ReservationFindManyArgs;

export type ReservationListItem = Prisma.ReservationGetPayload<
  typeof reservationListArgs
>;

export const customerListArgs = {
  orderBy: { name: "asc" },
  select: { email: true, id: true, name: true, phone: true },
  where: { role: "GUEST" },
} as const satisfies Prisma.UserFindManyArgs;

export type CustomerListItem = Prisma.UserGetPayload<typeof customerListArgs>;

export const customerReservationHistoryArgs = {
  include: {
    property: { select: { id: true, name: true } },
  },
  orderBy: { checkInDate: "desc" },
} as const satisfies Prisma.ReservationFindManyArgs;

export type CustomerReservationHistoryItem = Prisma.ReservationGetPayload<
  typeof customerReservationHistoryArgs
>;
