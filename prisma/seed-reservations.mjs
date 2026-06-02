import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed reservations.");
}

function withLibpqCompatibleSslMode(value) {
  const url = new URL(value);
  const sslMode = url.searchParams.get("sslmode");

  if (
    (sslMode === "prefer" || sslMode === "require") &&
    !url.searchParams.has("uselibpqcompat")
  ) {
    url.searchParams.set("uselibpqcompat", "true");
  }

  return url.toString();
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: withLibpqCompatibleSslMode(connectionString),
  }),
});

const hostId = "11111111-1111-4111-8111-111111111111";

const guests = [
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "mika.tanaka@example.com",
    name: "Mika Tanaka",
    phone: "+81-90-0000-0001",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    email: "alex.kim@example.com",
    name: "Alex Kim",
    phone: "+1-555-0101",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    email: "sara.ito@example.com",
    name: "Sara Ito",
    phone: "+81-90-0000-0002",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    email: "noah.smith@example.com",
    name: "Noah Smith",
    phone: "+1-555-0102",
  },
];

const properties = [
  {
    id: "66666666-6666-4666-8666-666666666666",
    name: "Asakusa Riverside 301",
    slug: "asakusa-riverside-301",
    description: "Compact riverside apartment near Asakusa Station.",
    addressLine1: "1-2-3 Hanakawado",
    addressLine2: "Room 301",
    city: "Taito",
    state: "Tokyo",
    country: "JP",
    postalCode: "111-0033",
    bedrooms: 2,
    bathrooms: "1.0",
    maxGuests: 4,
    nightlyRate: "228.00",
    cleaningFee: "68.00",
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    name: "Hakone Mountain Lodge",
    slug: "hakone-mountain-lodge",
    description: "Quiet lodge with mountain views and private bath access.",
    addressLine1: "88 Gora",
    addressLine2: null,
    city: "Hakone",
    state: "Kanagawa",
    country: "JP",
    postalCode: "250-0408",
    bedrooms: 3,
    bathrooms: "2.0",
    maxGuests: 6,
    nightlyRate: "315.00",
    cleaningFee: "120.00",
  },
  {
    id: "88888888-8888-4888-8888-888888888888",
    name: "Kyoto Machiya Stay",
    slug: "kyoto-machiya-stay",
    description: "Renovated machiya for small families near Gion.",
    addressLine1: "42 Yamato Oji",
    addressLine2: null,
    city: "Kyoto",
    state: "Kyoto",
    country: "JP",
    postalCode: "605-0073",
    bedrooms: 2,
    bathrooms: "1.5",
    maxGuests: 5,
    nightlyRate: "274.00",
    cleaningFee: "96.00",
  },
];

const reservations = [
  {
    id: "99999999-9999-4999-8999-999999999999",
    propertyId: "66666666-6666-4666-8666-666666666666",
    guestId: "22222222-2222-4222-8222-222222222222",
    checkInDate: new Date("2026-06-12T00:00:00.000Z"),
    checkOutDate: new Date("2026-06-15T00:00:00.000Z"),
    guestCount: 2,
    status: "CONFIRMED",
    totalAmount: "864.00",
    notes: "Airport pickup requested.",
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    propertyId: "77777777-7777-4777-8777-777777777777",
    guestId: "33333333-3333-4333-8333-333333333333",
    checkInDate: new Date("2026-06-18T00:00:00.000Z"),
    checkOutDate: new Date("2026-06-22T00:00:00.000Z"),
    guestCount: 4,
    status: "PAYMENT_DUE",
    totalAmount: "1420.00",
    notes: "Guest asked about early check-in.",
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    propertyId: "88888888-8888-4888-8888-888888888888",
    guestId: "44444444-4444-4444-8444-444444444444",
    checkInDate: new Date("2026-06-26T00:00:00.000Z"),
    checkOutDate: new Date("2026-06-28T00:00:00.000Z"),
    guestCount: 3,
    status: "REVIEWING",
    totalAmount: "748.00",
    notes: "Needs host approval before confirming.",
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    propertyId: "66666666-6666-4666-8666-666666666666",
    guestId: "55555555-5555-4555-8555-555555555555",
    checkInDate: new Date("2026-07-02T00:00:00.000Z"),
    checkOutDate: new Date("2026-07-06T00:00:00.000Z"),
    guestCount: 1,
    status: "CONFIRMED",
    totalAmount: "1080.00",
    notes: null,
  },
];

await prisma.user.upsert({
  create: {
    id: hostId,
    email: "host@example.com",
    name: "Demo Host",
    phone: "+1-555-0100",
    role: "HOST",
  },
  update: {
    name: "Demo Host",
    phone: "+1-555-0100",
    role: "HOST",
  },
  where: { email: "host@example.com" },
});

for (const guest of guests) {
  await prisma.user.upsert({
    create: { ...guest, role: "GUEST" },
    update: { name: guest.name, phone: guest.phone, role: "GUEST" },
    where: { email: guest.email },
  });
}

for (const property of properties) {
  await prisma.property.upsert({
    create: {
      ...property,
      ownerId: hostId,
      timezone: "Asia/Tokyo",
      currency: "USD",
      status: "ACTIVE",
    },
    update: {
      ...property,
      ownerId: hostId,
      timezone: "Asia/Tokyo",
      currency: "USD",
      status: "ACTIVE",
    },
    where: { slug: property.slug },
  });
}

for (const reservation of reservations) {
  await prisma.reservation.upsert({
    create: {
      ...reservation,
      currency: "USD",
    },
    update: {
      ...reservation,
      currency: "USD",
    },
    where: { id: reservation.id },
  });
}

const counts = await prisma.$transaction([
  prisma.user.count(),
  prisma.property.count(),
  prisma.reservation.count(),
]);

console.log(
  `Seeded demo data: ${counts[0]} users, ${counts[1]} properties, ${counts[2]} reservations.`,
);

await prisma.$disconnect();
