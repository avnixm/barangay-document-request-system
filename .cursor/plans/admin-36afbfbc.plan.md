<!-- 36afbfbc-e5f5-4d02-9654-779b857e8ed8 02f3bbfa-d6bd-42c5-8cc9-7a3bad3504cd -->
# Step 4: Document Request Submission & Staff Validation Plan

## Scope

- Add requests table to database schema
- Create resident request submission form page
- Create staff dashboard to view and validate pending requests
- Add API endpoints for create/verify/reject
- Update resident and staff dashboards with navigation links

## Files To Add/Change

- Update `db/schema.ts`: add `requests` table with fields: id, residentId, documentType, purpose, status (default "pending"), createdAt
- Add `app/dashboard/request/page.tsx`: client form page for residents to submit requests (uses Input, Textarea, Card, Button)
- Add `app/api/request/create/route.ts`: POST endpoint to create request (checks auth, gets user, inserts request)
- Add `app/dashboard/roles/staff-requests.tsx`: server component to display pending requests table with verify/reject actions
- Add `app/api/request/verify/route.ts`: POST endpoint to update request status to "verified" (staff/admin only)
- Add `app/api/request/reject/route.ts`: POST endpoint to update request status to "rejected" (staff/admin only)
- Update `app/dashboard/roles/resident.tsx`: add Link to "/dashboard/request" for "New Request" button
- Update `app/dashboard/roles/staff.tsx`: add Link to "/dashboard/roles/staff-requests" for "View Pending Requests" button
- Install shadcn Textarea if missing: `npx shadcn@latest add textarea`

## Implementation Notes

- Request status: "pending" (default) → "verified" or "rejected"
- Staff dashboard uses server actions (form POST) for verify/reject
- API routes check role: staff or admin for verify/reject
- Resident form uses FormData and client-side submission with loading state
- Staff requests table shows residentId, documentType, purpose with action buttons

## Post-Change Commands

- Run migrations: `npx drizzle-kit generate` then `npx drizzle-kit push`