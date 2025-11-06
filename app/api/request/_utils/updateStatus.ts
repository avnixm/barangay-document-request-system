import { db } from "@/db";
import { requests, requestStatusLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateRequestStatus(
	requestId: string,
	newStatus: string,
	note?: string
) {
	// Load current request
	const reqRows = await db.select().from(requests).where(eq(requests.id, requestId)).limit(1);
	const current = reqRows[0];
	if (!current) throw new Error("Request not found");

	// Insert status log
	await db.insert(requestStatusLogs).values({
		requestId,
		oldStatus: current.status ?? null,
		newStatus,
		note: note ?? null,
	});

	// Compute additional field updates
	const update: any = { status: newStatus };
	if (newStatus === "rejected" && note) update.rejectedReason = note;
	if (newStatus === "delivered") update.releasedAt = new Date();
	if (newStatus === "ready_pickup") update.releaseMethod = "pickup";
	if (newStatus === "out_for_delivery") update.releaseMethod = "delivery";

	await db.update(requests).set(update).where(eq(requests.id, requestId));
}

