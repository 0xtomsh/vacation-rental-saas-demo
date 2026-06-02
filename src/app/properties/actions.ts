"use server";

import { revalidatePath } from "next/cache";

import { requireDemoUser } from "@/lib/auth";
import {
  deleteDemoPropertyDraft,
  type DemoPropertyStatus,
  getOrCreateDemoManagementSessionId,
  upsertDemoPropertyDraft,
} from "@/lib/demo-management-session";

const propertyStatuses = ["DRAFT", "ACTIVE", "PAUSED", "ARCHIVED"] as const;

type PropertyStatusValue = (typeof propertyStatuses)[number];

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

  return parsed.toFixed(2);
}

function readBathroomCount(formData: FormData) {
  const value = readString(formData, "bathrooms");
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0.5) {
    throw new Error("bathrooms must be valid.");
  }

  return parsed.toFixed(1);
}

function readSlug(formData: FormData) {
  const slug = readString(formData, "slug")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error("slug is required.");
  }

  return slug;
}

function readPropertyStatus(formData: FormData) {
  const value = readString(formData, "status");

  if (!propertyStatuses.includes(value as PropertyStatusValue)) {
    throw new Error("status is invalid.");
  }

  return value as DemoPropertyStatus;
}

function readPhotoUrls(formData: FormData) {
  const value = formData.get("photoUrls");

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function readPropertyInput(id: string, formData: FormData) {
  return {
    id,
    ownerId: readString(formData, "ownerId"),
    name: readString(formData, "name"),
    slug: readSlug(formData),
    description: readOptionalString(formData, "description"),
    addressLine1: readString(formData, "addressLine1"),
    addressLine2: readOptionalString(formData, "addressLine2"),
    city: readString(formData, "city"),
    state: readOptionalString(formData, "state"),
    country: readString(formData, "country").toUpperCase().slice(0, 2),
    postalCode: readOptionalString(formData, "postalCode"),
    timezone: readString(formData, "timezone"),
    bedrooms: readPositiveInteger(formData, "bedrooms"),
    bathrooms: readBathroomCount(formData),
    maxGuests: readPositiveInteger(formData, "maxGuests"),
    nightlyRate: readPositiveAmount(formData, "nightlyRate"),
    cleaningFee: readPositiveAmount(formData, "cleaningFee"),
    currency: readString(formData, "currency").toUpperCase().slice(0, 3),
    status: readPropertyStatus(formData),
    photoUrls: readPhotoUrls(formData),
  };
}

function refreshPropertyViews() {
  revalidatePath("/properties");
  revalidatePath("/reservations");
  revalidatePath("/calendar");
}

export async function createProperty(formData: FormData) {
  await requireDemoUser();
  const sessionId = await getOrCreateDemoManagementSessionId();

  upsertDemoPropertyDraft(
    sessionId,
    readPropertyInput(crypto.randomUUID(), formData),
  );

  refreshPropertyViews();
}

export async function updateProperty(id: string, formData: FormData) {
  await requireDemoUser();
  const sessionId = await getOrCreateDemoManagementSessionId();

  upsertDemoPropertyDraft(sessionId, readPropertyInput(id, formData));

  refreshPropertyViews();
}

export async function deleteProperty(id: string) {
  await requireDemoUser();
  const sessionId = await getOrCreateDemoManagementSessionId();

  deleteDemoPropertyDraft(sessionId, id);

  refreshPropertyViews();
}
