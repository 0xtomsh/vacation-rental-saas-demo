"use server";

import { revalidatePath } from "next/cache";

import { requireDemoUser } from "@/lib/auth";
import {
  deleteDemoCustomerDraft,
  getOrCreateDemoManagementSessionId,
  upsertDemoCustomerDraft,
} from "@/lib/demo-management-session";

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

function readEmail(formData: FormData) {
  const email = readString(formData, "email").toLowerCase();

  if (!email.includes("@")) {
    throw new Error("email must be valid.");
  }

  return email;
}

function readCustomerInput(id: string, formData: FormData) {
  return {
    id,
    email: readEmail(formData),
    name: readString(formData, "name"),
    phone: readOptionalString(formData, "phone"),
  };
}

function refreshCustomerViews() {
  revalidatePath("/customers");
  revalidatePath("/reservations");
}

export async function createCustomer(formData: FormData) {
  await requireDemoUser();
  const sessionId = await getOrCreateDemoManagementSessionId();

  upsertDemoCustomerDraft(
    sessionId,
    readCustomerInput(crypto.randomUUID(), formData),
  );

  refreshCustomerViews();
}

export async function updateCustomer(id: string, formData: FormData) {
  await requireDemoUser();
  const sessionId = await getOrCreateDemoManagementSessionId();

  upsertDemoCustomerDraft(sessionId, readCustomerInput(id, formData));

  refreshCustomerViews();
}

export async function deleteCustomer(id: string) {
  await requireDemoUser();
  const sessionId = await getOrCreateDemoManagementSessionId();

  deleteDemoCustomerDraft(sessionId, id);

  refreshCustomerViews();
}
