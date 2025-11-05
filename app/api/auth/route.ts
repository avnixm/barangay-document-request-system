import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
	const user = await currentUser();
	if (!user) return Response.json({ ok: false });

	const existing = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);

	if (existing.length === 0) {
		await db.insert(users).values({
			clerkId: user.id,
			fullName: user.fullName ?? "",
			email: user.emailAddresses[0].emailAddress,
			role: "resident",
		});
	}

	return Response.json({ ok: true });
}


