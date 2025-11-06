import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, announcements } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

	const form = await req.formData();
	const title = form.get("title") as string;
	const message = form.get("message") as string;

	if (!title || !message) {
		return Response.json({ error: "Missing fields" }, { status: 400 });
	}

	const userRows = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userRows[0];
	if (!user || (user.role !== "staff" && user.role !== "admin")) {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}

	await db.insert(announcements).values({
		title,
		message,
		createdBy: userId,
	});

	return Response.json({ success: true });
}


