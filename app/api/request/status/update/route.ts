import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateRequestStatus } from "../../_utils/updateStatus";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	// Only staff/admin can update status
	const staffRow = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const actor = staffRow[0];
	if (!actor || (actor.role !== "staff" && actor.role !== "admin")) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const body = await req.json();
	const { id, newStatus, note } = body as { id: string; newStatus: string; note?: string };
	if (!id || !newStatus) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

	try {
		await updateRequestStatus(id, newStatus, note);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 });
	}
}


