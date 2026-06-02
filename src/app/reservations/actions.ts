"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

const reservationStatuses = [
  "REVIEWING",
  "CONFIRMED",
  "PAYMENT_DUE",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
] as const;

type ReservationStatusValue = (typeof reservationStatuses)[number];

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function readOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

function readPositiveInteger(formData: FormData, key: string) {
  const parsed = Number.parseInt(readString(formData, key), 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${key} must be a positive integer.`);
  }

  return parsed;
}

function readPositiveAmount(formData: FormData, key: string) {
  const value = readString(formData, key);
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${key} must be a valid amount.`);
  }

  return value;
}

function readDate(formData: FormData, key: string) {
  const value = readString(formData, key);
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${key} must be a valid date.`);
  }

  return date;
}

function readReservationStatus(formData: FormData) {
  const value = readString(formData, "status");

  if (!reservationStatuses.includes(value as ReservationStatusValue)) {
    throw new Error("status is invalid.");
  }

  return value as ReservationStatusValue;
}

function readReservationInput(formData: FormData) {
  const checkInDate = readDate(formData, "checkInDate");
  const checkOutDate = readDate(formData, "checkOutDate");

  if (checkOutDate <= checkInDate) {
    throw new Error("checkOutDate must be after checkInDate.");
  }

  return {
    propertyId: readString(formData, "propertyId"),
    guestId: readString(formData, "guestId"),
    checkInDate,
    checkOutDate,
    guestCount: readPositiveInteger(formData, "guestCount"),
    status: readReservationStatus(formData),
    totalAmount: readPositiveAmount(formData, "totalAmount"),
    currency: readString(formData, "currency").toUpperCase().slice(0, 3),
    notes: readOptionalString(formData, "notes"),
  };
}

function refreshReservationViews() {
  revalidatePath("/reservations");
  revalidatePath("/dashboard");
}

export async function createReservation(formData: FormData) {
  await prisma.reservation.create({
    data: readReservationInput(formData),
  });

  refreshReservationViews();
}

export async function updateReservation(id: string, formData: FormData) {
  await prisma.reservation.update({
    where: { id },
    data: readReservationInput(formData),
  });

  refreshReservationViews();
}

export async function deleteReservation(id: string) {
  await prisma.reservation.delete({
    where: { id },
  });

  refreshReservationViews();
}
