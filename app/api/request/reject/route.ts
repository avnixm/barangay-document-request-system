import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
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
	const reason = form.get("reason") as string || "Request rejected";

	try {
		await updateRequestStatus(id, "rejected", reason);
	} catch (error: any) {
		return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 });
	}

	// Redirect based on referer to go back to the correct page
	const referer = req.headers.get("referer");
	if (referer?.includes("/official-approvals")) {
		return NextResponse.redirect(new URL("/dashboard/roles/official-approvals", req.url));
	} else {
		return NextResponse.redirect(new URL("/dashboard/roles/staff-requests", req.url));
	}
}

