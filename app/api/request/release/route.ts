import { db } from "@/db";
import { requests, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateRequestStatus } from "../_utils/updateStatus";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const staffData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const staff = staffData[0];

	if (!staff || (staff.role !== "staff" && staff.role !== "admin")) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const form = await req.formData();
	const id = form.get("id") as string;

	// Get request to check delivery method
	const requestData = await db.select().from(requests).where(eq(requests.id, id)).limit(1);
	const request = requestData[0];

	if (!request) {
		return NextResponse.json({ error: "Request not found" }, { status: 404 });
	}

	// Set status to "ready_pickup" for both pickup and delivery
	// Delivery requests will be assigned later and status will change to "out_for_delivery"
	await updateRequestStatus(id, "ready_pickup", "Document ready for pickup/delivery");
	
	// Set releasedAt timestamp
	await db.update(requests).set({ releasedAt: new Date() }).where(eq(requests.id, id));

	return NextResponse.redirect(new URL("/dashboard/roles/release", req.url));
}

