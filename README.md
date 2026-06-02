This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo Auth

This demo uses Supabase Auth and exposes one shared login on the login screen:

- Email: `demo@example.com`
- Password: `TomsHostingSuite2026!`

Before publishing the demo, create exactly this user in Supabase Auth. If email
confirmation is enabled for the project, either manually confirm the user in the
Supabase dashboard or disable confirmation for the demo project.

Configure the public credentials with:

```bash
NEXT_PUBLIC_DEMO_LOGIN_EMAIL="demo@example.com"
NEXT_PUBLIC_DEMO_LOGIN_PASSWORD="TomsHostingSuite2026!"
```

## Public Demo Data Policy

The public demo must treat the application database as read-only during normal
user flows. Shared demo users can browse seed data from PostgreSQL, but they
must not create, update, delete, or upsert persistent records through the app.

Interactive demo mutations should be implemented as session-scoped overlays:

- Read seed data from the database.
- Store create, update, and delete operations in server memory keyed by a
  secure session cookie.
- Merge that in-memory session state over the read-only database result when
  rendering pages.
- Expire the in-memory state after a short TTL so demo sessions reset naturally.

The reservations workflow follows this policy through
`src/lib/demo-reservation-session.ts`. Its server actions write to the
session-scoped memory store instead of calling Prisma mutation methods.

Persistent writes are only allowed for setup and maintenance tasks, such as
Prisma migrations, local seed scripts, or controlled admin-only operations
outside the shared public demo account. Do not expose `create`, `update`,
`delete`, or `upsert` database writes to public demo users unless the data store
is explicitly disposable and isolated from any shared or production data.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
