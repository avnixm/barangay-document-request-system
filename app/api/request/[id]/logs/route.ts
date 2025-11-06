import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { requestStatusLogs, requests, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> | { id: string } }
) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const resolved = typeof params === "object" && "then" in params ? await params : params;
	const requestId = resolved.id;

	// Allow owner or staff/admin
	const userRow = (await db.select().from(users).where(eq(users.clerkId, userId)).limit(1))[0];
	const reqRow = (await db.select().from(requests).where(eq(requests.id, requestId)).limit(1))[0];
	if (!reqRow) return NextResponse.json({ error: "Not found" }, { status: 404 });

	const isOwner = reqRow.residentId === userId;
	const isStaff = !!userRow && (userRow.role === "staff" || userRow.role === "admin");
	if (!isOwner && !isStaff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

	const logs = await db
		.select()
		.from(requestStatusLogs)
		.where(eq(requestStatusLogs.requestId, requestId))
		.orderBy(desc(requestStatusLogs.createdAt));

	return NextResponse.json({ logs });
}


