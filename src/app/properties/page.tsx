import { AppShell } from "@/components/app-shell";
import { StatsCards } from "@/components/stats-cards";
import { TechnologyStack } from "@/components/technology-stack";
import {
  getDemoManagementStateSnapshot,
  readDemoManagementSessionId,
  type DemoPropertyDraft,
} from "@/lib/demo-management-session";
import { prisma } from "@/lib/prisma";
import {
  BedDouble,
  Camera,
  CircleDollarSign,
  Home,
  ImagePlus,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { createProperty, deleteProperty, updateProperty } from "./actions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Property = {
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
  status: string;
  photoUrls: string[];
  reservations: number;
};

type DecimalLike = {
  toString: () => string;
};

type DbProperty = {
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
  bathrooms: DecimalLike;
  maxGuests: number;
  nightlyRate: DecimalLike;
  cleaningFee: DecimalLike;
  currency: string;
  status: string;
  _count: {
    reservations: number;
  };
};

type Owner = {
  id: string;
  name: string;
};

const propertyStatuses = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "ARCHIVED", label: "Archived" },
];

const seedPhotoUrls: Record<string, string[]> = {
  "asakusa-riverside-301": [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
  ],
  "hakone-mountain-lodge": [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
  ],
  "kyoto-machiya-stay": [
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1521783988139-893ce2b0aa9e?auto=format&fit=crop&w=600&q=80",
  ],
};

const technologyStack = [
  {
    name: "Prisma property reads",
    role: "Loads seeded facilities, capacity, rates, and reservation counts as the read-only baseline.",
  },
  {
    name: "Session property drafts",
    role: "Keeps facility CRUD, photos, and rate edits temporary for the current demo browser session.",
  },
  {
    name: "Server Actions",
    role: "Handles property forms with server-side validation and route revalidation.",
  },
  {
    name: "Photo URL overlay",
    role: "Adds lightweight photo management without introducing public database writes.",
  },
];

function inputClassName() {
  return "h-10 min-w-0 w-full rounded-xl border border-[#e7e9f6] bg-white px-3 text-sm text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20";
}

function textareaClassName() {
  return "min-h-10 min-w-0 rounded-xl border border-[#e7e9f6] bg-white px-3 py-2 text-sm text-[#202238] outline-none focus:border-[#52dce6] focus:ring-3 focus:ring-[#52dce6]/20";
}

function formatAmount(amount: string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(Number(amount));
}

function draftToProperty(
  draft: DemoPropertyDraft,
  reservations: number,
): Property {
  return {
    id: draft.id,
    ownerId: draft.ownerId,
    name: draft.name,
    slug: draft.slug,
    description: draft.description,
    addressLine1: draft.addressLine1,
    addressLine2: draft.addressLine2,
    city: draft.city,
    state: draft.state,
    country: draft.country,
    postalCode: draft.postalCode,
    timezone: draft.timezone,
    bedrooms: draft.bedrooms,
    bathrooms: draft.bathrooms,
    maxGuests: draft.maxGuests,
    nightlyRate: draft.nightlyRate,
    cleaningFee: draft.cleaningFee,
    currency: draft.currency,
    status: draft.status,
    photoUrls: draft.photoUrls,
    reservations,
  };
}

function propertyLocation(property: Property) {
  return [
    property.addressLine1,
    property.addressLine2,
    property.city,
    property.state,
    property.country,
    property.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export default async function PropertiesPage() {
  const [dbProperties, owners, managementSessionId]: [
    DbProperty[],
    Owner[],
    string | null,
  ] = await Promise.all([
    prisma.property.findMany({
      include: {
        _count: { select: { reservations: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
      where: { role: { in: ["HOST", "ADMIN"] } },
    }),
    readDemoManagementSessionId(),
  ]);

  const managementState = getDemoManagementStateSnapshot(managementSessionId);
  const deletedPropertyIds = new Set(managementState.deletedPropertyIds);
  const propertyDraftsById = new Map(
    managementState.properties.map((property) => [property.id, property]),
  );
  const dbPropertyIds = new Set(dbProperties.map((property) => property.id));
  const reservationCountsById = new Map(
    dbProperties.map((property) => [property.id, property._count.reservations]),
  );
  const properties: Property[] = dbProperties.flatMap((property) => {
    if (deletedPropertyIds.has(property.id)) {
      return [];
    }

    const draft = propertyDraftsById.get(property.id);

    if (draft) {
      return [draftToProperty(draft, property._count.reservations)];
    }

    return [
      {
        id: property.id,
        ownerId: property.ownerId,
        name: property.name,
        slug: property.slug,
        description: property.description,
        addressLine1: property.addressLine1,
        addressLine2: property.addressLine2,
        city: property.city,
        state: property.state,
        country: property.country,
        postalCode: property.postalCode,
        timezone: property.timezone,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms.toString(),
        maxGuests: property.maxGuests,
        nightlyRate: property.nightlyRate.toString(),
        cleaningFee: property.cleaningFee.toString(),
        currency: property.currency,
        status: property.status,
        photoUrls: seedPhotoUrls[property.slug] ?? [],
        reservations: property._count.reservations,
      },
    ];
  });

  for (const draft of managementState.properties) {
    if (!dbPropertyIds.has(draft.id) && !deletedPropertyIds.has(draft.id)) {
      properties.push(
        draftToProperty(draft, reservationCountsById.get(draft.id) ?? 0),
      );
    }
  }

  properties.sort((first, second) => first.name.localeCompare(second.name));

  const activeProperties = properties.filter(
    (property) => property.status === "ACTIVE",
  ).length;
  const totalPhotos = properties.reduce(
    (total, property) => total + property.photoUrls.length,
    0,
  );
  const averageNightlyRate =
    properties.length === 0
      ? 0
      : properties.reduce(
          (total, property) => total + Number(property.nightlyRate),
          0,
        ) / properties.length;
  const defaultOwnerId = owners[0]?.id ?? "";

  const stats = [
    {
      label: "Facilities",
      value: String(properties.length),
      delta: "session view",
      icon: Home,
    },
    {
      label: "Active",
      value: String(activeProperties),
      delta: "bookable",
      icon: BedDouble,
    },
    {
      label: "Avg. nightly",
      value: formatAmount(averageNightlyRate.toFixed(2), "USD"),
      delta: "rate setting",
      icon: CircleDollarSign,
    },
    {
      label: "Photos",
      value: String(totalPhotos),
      delta: "managed",
      icon: Camera,
    },
  ];

  return (
    <AppShell
      activeHref="/properties"
      actionLabel="New facility"
      eyebrow="Facility management"
      title="Manage facilities, photos, and rate settings"
    >
      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
        <div className="px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-[#202238]">
            <Home aria-hidden="true" size={18} strokeWidth={2.2} />
            Create facility
          </h3>
        </div>
        <form
          action={createProperty}
          className="grid gap-4 px-5 py-5 md:grid-cols-2 xl:grid-cols-4"
        >
          <input name="ownerId" type="hidden" value={defaultOwnerId} />
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Name
            <input className={inputClassName()} name="name" required />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Slug
            <input className={inputClassName()} name="slug" required />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            City
            <input className={inputClassName()} name="city" required />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Country
            <input
              className={inputClassName()}
              defaultValue="JP"
              maxLength={2}
              name="country"
              required
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5] md:col-span-2">
            Address
            <input className={inputClassName()} name="addressLine1" required />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Bedrooms
            <input
              className={inputClassName()}
              defaultValue="1"
              min="1"
              name="bedrooms"
              required
              type="number"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Bathrooms
            <input
              className={inputClassName()}
              defaultValue="1.0"
              min="0.5"
              name="bathrooms"
              required
              step="0.5"
              type="number"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Max guests
            <input
              className={inputClassName()}
              defaultValue="2"
              min="1"
              name="maxGuests"
              required
              type="number"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Nightly rate
            <input
              className={inputClassName()}
              defaultValue="200.00"
              min="0"
              name="nightlyRate"
              required
              step="0.01"
              type="number"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Cleaning fee
            <input
              className={inputClassName()}
              defaultValue="50.00"
              min="0"
              name="cleaningFee"
              required
              step="0.01"
              type="number"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
            Status
            <select className={inputClassName()} name="status">
              {propertyStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <input defaultValue="" name="addressLine2" type="hidden" />
          <input defaultValue="" name="state" type="hidden" />
          <input defaultValue="" name="postalCode" type="hidden" />
          <input defaultValue="Asia/Tokyo" name="timezone" type="hidden" />
          <input defaultValue="USD" name="currency" type="hidden" />
          <textarea
            className={`${textareaClassName()} md:col-span-2`}
            name="description"
            placeholder="Description"
          />
          <textarea
            className={`${textareaClassName()} md:col-span-2`}
            name="photoUrls"
            placeholder="Photo URLs, one per line"
          />
          <button
            className="flex h-10 min-w-0 items-center justify-center gap-2 rounded-full bg-[#52dce6] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(82,220,230,0.28)] hover:bg-[#45cfd9] disabled:cursor-not-allowed disabled:bg-[#b8edf2]"
            disabled={!defaultOwnerId}
            type="submit"
          >
            <Plus aria-hidden="true" size={16} strokeWidth={2.2} />
            Create
          </button>
          {!defaultOwnerId ? (
            <p className="text-sm text-[#df5473] md:col-span-2 xl:col-span-4">
              Add a host user before creating facilities.
            </p>
          ) : null}
        </form>
      </section>

      <StatsCards stats={stats} />

      <section className="mt-6 grid gap-5">
        {properties.map((property) => (
          <article
            className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]"
            key={property.id}
          >
            <div className="grid gap-5 p-5 xl:grid-cols-[260px_1fr]">
              <div>
                <div className="grid grid-cols-2 gap-2">
                  {property.photoUrls.length > 0 ? (
                    property.photoUrls.slice(0, 4).map((photoUrl, index) => (
                      <div
                        aria-label={`${property.name} photo ${index + 1}`}
                        className="aspect-[4/3] w-full rounded-xl bg-cover bg-center ring-1 ring-[#eef0fb]"
                        key={`${photoUrl}-${index}`}
                        role="img"
                        style={{ backgroundImage: `url(${photoUrl})` }}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 flex aspect-[4/3] items-center justify-center rounded-xl bg-[#fbfcff] text-[#8b91b5] ring-1 ring-[#eef0fb]">
                      <ImagePlus aria-hidden="true" size={24} strokeWidth={2.2} />
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#effbfd] px-3 py-1 text-xs font-semibold text-[#28bac6]">
                    {property.status}
                  </span>
                  <span className="rounded-full bg-[#f2f4ff] px-3 py-1 text-xs font-semibold text-[#8177dc]">
                    {property.reservations} reservations
                  </span>
                </div>
              </div>

              <form
                action={updateProperty.bind(null, property.id)}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
              >
                <input name="ownerId" type="hidden" value={property.ownerId} />
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Name
                  <input
                    className={inputClassName()}
                    defaultValue={property.name}
                    name="name"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Slug
                  <input
                    className={inputClassName()}
                    defaultValue={property.slug}
                    name="slug"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Status
                  <select
                    className={inputClassName()}
                    defaultValue={property.status}
                    name="status"
                  >
                    {propertyStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Timezone
                  <input
                    className={inputClassName()}
                    defaultValue={property.timezone}
                    name="timezone"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5] md:col-span-2">
                  Address line 1
                  <input
                    className={inputClassName()}
                    defaultValue={property.addressLine1}
                    name="addressLine1"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5] md:col-span-2">
                  Address line 2
                  <input
                    className={inputClassName()}
                    defaultValue={property.addressLine2 ?? ""}
                    name="addressLine2"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  City
                  <input
                    className={inputClassName()}
                    defaultValue={property.city}
                    name="city"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  State
                  <input
                    className={inputClassName()}
                    defaultValue={property.state ?? ""}
                    name="state"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Country
                  <input
                    className={inputClassName()}
                    defaultValue={property.country}
                    maxLength={2}
                    name="country"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Postal code
                  <input
                    className={inputClassName()}
                    defaultValue={property.postalCode ?? ""}
                    name="postalCode"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Bedrooms
                  <input
                    className={inputClassName()}
                    defaultValue={property.bedrooms}
                    min="1"
                    name="bedrooms"
                    required
                    type="number"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Bathrooms
                  <input
                    className={inputClassName()}
                    defaultValue={property.bathrooms}
                    min="0.5"
                    name="bathrooms"
                    required
                    step="0.5"
                    type="number"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Max guests
                  <input
                    className={inputClassName()}
                    defaultValue={property.maxGuests}
                    min="1"
                    name="maxGuests"
                    required
                    type="number"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Currency
                  <input
                    className={inputClassName()}
                    defaultValue={property.currency}
                    maxLength={3}
                    name="currency"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Nightly rate
                  <input
                    className={inputClassName()}
                    defaultValue={property.nightlyRate}
                    min="0"
                    name="nightlyRate"
                    required
                    step="0.01"
                    type="number"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-[#8b91b5]">
                  Cleaning fee
                  <input
                    className={inputClassName()}
                    defaultValue={property.cleaningFee}
                    min="0"
                    name="cleaningFee"
                    required
                    step="0.01"
                    type="number"
                  />
                </label>
                <div className="rounded-xl bg-[#fbfcff] px-3 py-3 ring-1 ring-[#eef0fb] md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b91b5]">
                    Rate summary
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#202238]">
                    {formatAmount(property.nightlyRate, property.currency)} nightly ·{" "}
                    {formatAmount(property.cleaningFee, property.currency)} cleaning
                  </p>
                </div>
                <textarea
                  className={`${textareaClassName()} md:col-span-2`}
                  defaultValue={property.description ?? ""}
                  name="description"
                  placeholder="Description"
                />
                <textarea
                  className={`${textareaClassName()} md:col-span-2`}
                  defaultValue={property.photoUrls.join("\n")}
                  name="photoUrls"
                  placeholder="Photo URLs, one per line"
                />
                <div className="text-sm leading-6 text-[#74799b] md:col-span-2">
                  {propertyLocation(property)}
                </div>
                <div className="flex flex-wrap gap-2 md:col-span-2">
                  <button
                    className="flex h-10 min-w-0 items-center justify-center gap-2 rounded-full bg-[#52dce6] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(82,220,230,0.28)] hover:bg-[#45cfd9]"
                    type="submit"
                  >
                    <Save aria-hidden="true" size={16} strokeWidth={2.2} />
                    Save
                  </button>
                </div>
              </form>
              <form action={deleteProperty.bind(null, property.id)} className="xl:col-start-2">
                <button
                  className="flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#ffd5de] bg-white px-3 text-xs font-semibold text-[#df5473] hover:bg-[#fff6f8]"
                  type="submit"
                >
                  <Trash2 aria-hidden="true" size={14} strokeWidth={2.2} />
                  Delete facility
                </button>
              </form>
            </div>
          </article>
        ))}
        {properties.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-[#8b91b5] shadow-[0_18px_44px_rgba(111,93,184,0.08)] ring-1 ring-[#eef0fb]">
            No facilities yet.
          </div>
        ) : null}
      </section>

      <div className="mt-6">
        <TechnologyStack
          description="Facility edits, photo changes, and rate settings are session-scoped in this public demo. The seeded property database remains read-only while the page renders your temporary draft state."
          items={technologyStack}
          title="How this page works"
        />
      </div>
    </AppShell>
  );
}
