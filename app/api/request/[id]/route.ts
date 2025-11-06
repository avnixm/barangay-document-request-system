import { db } from "@/db";
import { requests, users, requestAttachments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> | { id: string } }
) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	// Verify staff/admin access
	const staffData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const staff = staffData[0];

	if (!staff || (staff.role !== "staff" && staff.role !== "admin")) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const resolvedParams = typeof params === "object" && "then" in params ? await params : params;
	const requestId = resolvedParams.id;

	// Fetch request
	const requestData = await db.select().from(requests).where(eq(requests.id, requestId)).limit(1);
	const request = requestData[0];

	if (!request) {
		return NextResponse.json({ error: "Request not found" }, { status: 404 });
	}

	// Fetch resident user info
	const residentData = await db.select().from(users).where(eq(users.clerkId, request.residentId)).limit(1);
	const resident = residentData[0];

	// Fetch attachments
	const attachments = await db.select().from(requestAttachments).where(eq(requestAttachments.requestId, requestId));

	return NextResponse.json({
		request,
		resident: resident || null,
		attachments,
	});
}

