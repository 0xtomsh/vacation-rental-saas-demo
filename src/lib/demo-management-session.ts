import { cookies } from "next/headers";

const demoManagementSessionCookieName = "demoManagementSessionId";
const sessionMaxAgeSeconds = 60 * 60;

const demoManagementSessionCookieOptions = {
  httpOnly: true,
  maxAge: sessionMaxAgeSeconds,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export type DemoCustomerDraft = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
};

export type DemoPropertyStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";

export type DemoPropertyDraft = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  country: string;
  postalCode: string | null;
  timezone: string;
  bedrooms: number;
  bathrooms: string;
  maxGuests: number;
  nightlyRate: string;
  cleaningFee: string;
  currency: string;
  status: DemoPropertyStatus;
  photoUrls: string[];
};

export type DemoManagementStateSnapshot = {
  customers: DemoCustomerDraft[];
  deletedCustomerIds: string[];
  properties: DemoPropertyDraft[];
  deletedPropertyIds: string[];
};

type DemoManagementState = {
  customers: Map<string, DemoCustomerDraft>;
  deletedCustomerIds: Set<string>;
  properties: Map<string, DemoPropertyDraft>;
  deletedPropertyIds: Set<string>;
  expiresAt: number;
};

const globalForDemoManagement = globalThis as unknown as {
  demoManagementSessions?: Map<string, DemoManagementState>;
};

const demoManagementSessions =
  globalForDemoManagement.demoManagementSessions ??
  new Map<string, DemoManagementState>();

globalForDemoManagement.demoManagementSessions = demoManagementSessions;

function getExpiresAt() {
  return Date.now() + sessionMaxAgeSeconds * 1000;
}

function pruneExpiredSessions() {
  const now = Date.now();

  for (const [sessionId, state] of demoManagementSessions) {
    if (state.expiresAt <= now) {
      demoManagementSessions.delete(sessionId);
    }
  }
}

function getOrCreateSessionState(sessionId: string) {
  pruneExpiredSessions();

  const existing = demoManagementSessions.get(sessionId);

  if (existing) {
    existing.expiresAt = getExpiresAt();
    return existing;
  }

  const created = {
    customers: new Map<string, DemoCustomerDraft>(),
    deletedCustomerIds: new Set<string>(),
    properties: new Map<string, DemoPropertyDraft>(),
    deletedPropertyIds: new Set<string>(),
    expiresAt: getExpiresAt(),
  };

  demoManagementSessions.set(sessionId, created);

  return created;
}

export async function readDemoManagementSessionId() {
  const cookieStore = await cookies();

  return cookieStore.get(demoManagementSessionCookieName)?.value ?? null;
}

export async function getOrCreateDemoManagementSessionId() {
  const cookieStore = await cookies();
  const existingSessionId =
    cookieStore.get(demoManagementSessionCookieName)?.value ?? null;

  if (existingSessionId) {
    getOrCreateSessionState(existingSessionId);
    return existingSessionId;
  }

  const sessionId = crypto.randomUUID();

  cookieStore.set(
    demoManagementSessionCookieName,
    sessionId,
    demoManagementSessionCookieOptions,
  );
  getOrCreateSessionState(sessionId);

  return sessionId;
}

export function getDemoManagementStateSnapshot(
  sessionId: string | null,
): DemoManagementStateSnapshot {
  if (!sessionId) {
    return {
      customers: [],
      deletedCustomerIds: [],
      properties: [],
      deletedPropertyIds: [],
    };
  }

  pruneExpiredSessions();

  const state = demoManagementSessions.get(sessionId);

  if (!state) {
    return {
      customers: [],
      deletedCustomerIds: [],
      properties: [],
      deletedPropertyIds: [],
    };
  }

  return {
    customers: Array.from(state.customers.values()),
    deletedCustomerIds: Array.from(state.deletedCustomerIds),
    properties: Array.from(state.properties.values()),
    deletedPropertyIds: Array.from(state.deletedPropertyIds),
  };
}

export function upsertDemoCustomerDraft(
  sessionId: string,
  draft: DemoCustomerDraft,
) {
  const state = getOrCreateSessionState(sessionId);

  state.deletedCustomerIds.delete(draft.id);
  state.customers.set(draft.id, draft);
}

export function deleteDemoCustomerDraft(sessionId: string, id: string) {
  const state = getOrCreateSessionState(sessionId);

  state.customers.delete(id);
  state.deletedCustomerIds.add(id);
}

export function upsertDemoPropertyDraft(
  sessionId: string,
  draft: DemoPropertyDraft,
) {
  const state = getOrCreateSessionState(sessionId);

  state.deletedPropertyIds.delete(draft.id);
  state.properties.set(draft.id, draft);
}

export function deleteDemoPropertyDraft(sessionId: string, id: string) {
  const state = getOrCreateSessionState(sessionId);

  state.properties.delete(id);
  state.deletedPropertyIds.add(id);
}
