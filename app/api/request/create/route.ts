import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, requests, requestAttachments, requestStatusLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await req.json();
	const { documentType, purpose, documentData, fileUrls, deliveryMethod, deliveryAddress, deliveryContactNumber, deliveryFee, paymentMethod } = body;

	const userData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userData[0];

	if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

	// Insert request with document data as JSON
	const [newRequest] = await db
		.insert(requests)
		.values({
			residentId: user.clerkId,
			documentType,
			purpose,
			status: "submitted",
			documentData: documentData || {},
			deliveryMethod: deliveryMethod || "pickup",
			deliveryAddress: deliveryAddress || null,
			contactNumber: deliveryContactNumber || null,
			deliveryFee: deliveryFee ? String(deliveryFee) : null,
			paymentMethod: paymentMethod || "cash",
		})
		.returning();

	// Create initial status log
	await db.insert(requestStatusLogs).values({
		requestId: newRequest.id,
		oldStatus: null,
		newStatus: "submitted",
		note: "Request submitted",
	});

	// Insert file attachments
	if (fileUrls && fileUrls.length > 0) {
		for (const fileUrl of fileUrls) {
			const fileName = fileUrl.split("/").pop() || "file";
			const fileType = fileName.split(".").pop() || "";
			await db.insert(requestAttachments).values({
				requestId: newRequest.id,
				fileUrl,
				fileName,
				fileType,
			});
		}
	}

	return NextResponse.json({ success: true, requestId: newRequest.id });
}

