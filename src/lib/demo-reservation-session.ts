import { cookies } from "next/headers";

export const demoReservationSessionCookieName = "demoReservationSessionId";

const sessionMaxAgeSeconds = 60 * 60;

export const demoReservationSessionCookieOptions = {
  httpOnly: true,
  maxAge: sessionMaxAgeSeconds,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export type DemoReservationStatus =
  | "REVIEWING"
  | "CONFIRMED"
  | "PAYMENT_DUE"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export type DemoReservationDraft = {
  id: string;
  propertyId: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  status: DemoReservationStatus;
  totalAmount: string;
  currency: string;
  notes: string | null;
};

export type DemoReservationStateSnapshot = {
  reservations: DemoReservationDraft[];
  deletedIds: string[];
};

type DemoReservationState = {
  reservations: Map<string, DemoReservationDraft>;
  deletedIds: Set<string>;
  expiresAt: number;
};

const globalForDemoReservations = globalThis as unknown as {
  demoReservationSessions?: Map<string, DemoReservationState>;
};

const demoReservationSessions =
  globalForDemoReservations.demoReservationSessions ?? new Map<string, DemoReservationState>();

globalForDemoReservations.demoReservationSessions = demoReservationSessions;

function getExpiresAt() {
  return Date.now() + sessionMaxAgeSeconds * 1000;
}

function pruneExpiredSessions() {
  const now = Date.now();

  for (const [sessionId, state] of demoReservationSessions) {
    if (state.expiresAt <= now) {
      demoReservationSessions.delete(sessionId);
    }
  }
}

function getOrCreateSessionState(sessionId: string) {
  pruneExpiredSessions();

  const existing = demoReservationSessions.get(sessionId);

  if (existing) {
    existing.expiresAt = getExpiresAt();
    return existing;
  }

  const created = {
    reservations: new Map<string, DemoReservationDraft>(),
    deletedIds: new Set<string>(),
    expiresAt: getExpiresAt(),
  };

  demoReservationSessions.set(sessionId, created);

  return created;
}

export async function readDemoReservationSessionId() {
  const cookieStore = await cookies();

  return cookieStore.get(demoReservationSessionCookieName)?.value ?? null;
}

export async function getOrCreateDemoReservationSessionId() {
  const cookieStore = await cookies();
  const existingSessionId =
    cookieStore.get(demoReservationSessionCookieName)?.value ?? null;

  if (existingSessionId) {
    getOrCreateSessionState(existingSessionId);
    return existingSessionId;
  }

  const sessionId = crypto.randomUUID();

  cookieStore.set(
    demoReservationSessionCookieName,
    sessionId,
    demoReservationSessionCookieOptions,
  );
  getOrCreateSessionState(sessionId);

  return sessionId;
}

export function getDemoReservationStateSnapshot(
  sessionId: string | null,
): DemoReservationStateSnapshot {
  if (!sessionId) {
    return { reservations: [], deletedIds: [] };
  }

  pruneExpiredSessions();

  const state = demoReservationSessions.get(sessionId);

  if (!state) {
    return { reservations: [], deletedIds: [] };
  }

  return {
    reservations: Array.from(state.reservations.values()),
    deletedIds: Array.from(state.deletedIds),
  };
}

export function upsertDemoReservationDraft(
  sessionId: string,
  draft: DemoReservationDraft,
) {
  const state = getOrCreateSessionState(sessionId);

  state.deletedIds.delete(draft.id);
  state.reservations.set(draft.id, draft);
}

export function deleteDemoReservationDraft(sessionId: string, id: string) {
  const state = getOrCreateSessionState(sessionId);

  state.reservations.delete(id);
  state.deletedIds.add(id);
}
