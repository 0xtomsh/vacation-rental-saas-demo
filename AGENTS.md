<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Language

Use English for all application UI text, validation messages, error messages,
documentation, comments, and workspace-facing copy.

## Public Demo Database Policy

The public demo database is read-only for normal application user flows. Shared
demo users may read seed data, but app routes, server actions, route handlers,
and client-triggered workflows must not persistently create, update, delete, or
upsert database records.

When a public demo workflow needs to feel editable, implement it as a
session-scoped overlay instead of a database mutation:

- Read the baseline data from the database.
- Store create, update, and delete operations in server memory keyed by a secure
  session cookie.
- Merge the in-memory session state over the database result before rendering.
- Use a short TTL so the temporary session state expires naturally.

The reservations flow uses `src/lib/demo-reservation-session.ts` for this
pattern. Keep Prisma writes limited to setup and maintenance tasks such as
migrations, seed scripts, or explicitly controlled non-public admin flows.
