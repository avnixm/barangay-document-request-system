import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, deliveries, requests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateRequestStatus } from "../../request/_utils/updateStatus";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	// Verify staff/admin access
	const staffData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const staff = staffData[0];

	if (!staff || (staff.role !== "staff" && staff.role !== "admin")) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const body = await req.json();
	const { requestId, routeNote } = body;

	if (!requestId) {
		return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
	}

	// Check if delivery already exists
	const existingDelivery = await db
		.select()
		.from(deliveries)
		.where(eq(deliveries.requestId, requestId))
		.limit(1);

	if (existingDelivery.length > 0) {
		// Update existing delivery
		await db
			.update(deliveries)
			.set({
				assignedTo: userId,
				routeNote: routeNote || null,
				startedAt: new Date(),
			})
			.where(eq(deliveries.requestId, requestId));
	} else {
		// Create new delivery record
		await db.insert(deliveries).values({
			requestId,
			assignedTo: userId,
			routeNote: routeNote || null,
			startedAt: new Date(),
		});
	}

	// Update request status to "out_for_delivery"
	await updateRequestStatus(requestId, "out_for_delivery", "Delivery assigned and started");

	return NextResponse.json({ success: true });
}

