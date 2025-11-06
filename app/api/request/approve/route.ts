import { db } from "@/db";
import { requests, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateRequestStatus } from "../_utils/updateStatus";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const officialData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const official = officialData[0];

	if (!official || (official.role !== "admin" && official.role !== "staff")) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const form = await req.formData();
	const id = form.get("id") as string;

	try {
		await updateRequestStatus(id, "processing");
		// Also set approvedBy
		await db.update(requests).set({ approvedBy: userId }).where(eq(requests.id, id));
	} catch (error: any) {
		return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 });
	}

	return NextResponse.redirect(new URL("/dashboard/roles/official-approvals", req.url));
}

