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
	const { requestId, proofPhotoUrl } = body;

	if (!requestId) {
		return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
	}

	// Update delivery record
	const deliveryData = await db
		.select()
		.from(deliveries)
		.where(eq(deliveries.requestId, requestId))
		.limit(1);

	if (deliveryData.length === 0) {
		return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
	}

	const delivery = deliveryData[0];

	// Verify the delivery is assigned to the current user
	if (delivery.assignedTo !== userId) {
		return NextResponse.json({ error: "You are not assigned to this delivery" }, { status: 403 });
	}

	// Update delivery record
	await db
		.update(deliveries)
		.set({
			deliveredAt: new Date(),
			proofPhotoUrl: proofPhotoUrl || null,
		})
		.where(eq(deliveries.requestId, requestId));

	// Update request status to "delivered"
	await updateRequestStatus(requestId, "delivered", "Delivery completed");

	return NextResponse.json({ success: true });
}

