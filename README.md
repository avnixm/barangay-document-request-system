## Barangay Document Request System

A modern web application for requesting, processing, and releasing barangay documents. Built with Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, Clerk for auth, PostgreSQL, and Drizzle ORM.

### Tech Stack
- Next.js (App Router) + TypeScript
- TailwindCSS + shadcn/ui
- Clerk (authentication, user management)
- PostgreSQL + Drizzle ORM (schema first, SQL migrations)

### Getting Started
1) Clone and install

```bash
pnpm install # or npm install / yarn
```

2) Configure environment variables (create `.env.local`)

```bash
DATABASE_URL=postgres://user:password@host:port/db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

3) Generate and push database schema

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

4) Run the dev server

```bash
pnpm dev # or npm run dev / yarn dev
```

### Project Structure (key paths)
- `app/` – App Router routes (pages, API routes)
- `app/dashboard/` – Authenticated dashboard with role-aware navigation
- `app/admin/` – Admin-only pages
- `app/api/` – Backend routes (auth, requests, delivery, uploads, etc.)
- `db/schema.ts` – Drizzle schema (tables: users, requests, request_attachments, request_status_logs, announcements, deliveries)

### Implemented Features
- Clerk auth (sign in/up, protected routes)
- Role-based dashboard (Resident, Staff, Admin)
- Admin manage users and roles
- Resident request submission (React Hook Form + Zod)
- File uploads (local to `public/uploads/`)
- Announcements (staff/admin posting, resident view)
- Requests lifecycle with granular statuses and timeline logs
- Staff request verification / approval / release
- Delivery flow (assign to staff, mark delivered with proof photo)

### Currently Working On
- Phase C: staff actions in Request Details Modal
  - Buttons for Pending Review, Ready for Pick-Up/Delivery, Out for Delivery, Delivered
  - Timeline display inside modal (done)

### Planning To Add
- Phase C: Print workflow
  - Printable receipt; add a Print button from staff/official views
- Phase D: Payments & Receipts
  - `payments`, `receipts` tables; record payments; generate receipt with QR
  - Public verification endpoint for receipts
- Phase E: Notifications
  - Email/SMS notifications for key status transitions (submitted, verified, rejected, ready, out for delivery, delivered)
- Phase F: Proof of Release
  - `releases` table; capture signed acknowledgment or digital signature upon pickup/delivery
- Phase G: Admin Analytics Dashboard
  - Monthly request counts, most requested certs, completion rates, delivery vs pickup, etc.

### Scripts
- `dev` – run Next.js dev server
- `build` – production build
- `start` – start production server
- `drizzle-kit generate` – generate SQL from schema
- `drizzle-kit push` – apply migrations

### Notes
- Environment variables must be present before running Drizzle commands.
- For local uploads, files are saved under `public/uploads/` and served statically by Next.js.

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
