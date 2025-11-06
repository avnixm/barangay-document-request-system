import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

	const admin = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	if (admin[0]?.role !== "admin") {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}

	const { clerkId, newRole } = await req.json();
	await db.update(users).set({ role: newRole }).where(eq(users.clerkId, clerkId));

	return Response.json({ success: true });
}
