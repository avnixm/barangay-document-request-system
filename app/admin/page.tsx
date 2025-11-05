import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminOnlyPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const data = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = data[0];

	if (!user || user.role !== "admin") {
		return redirect("/dashboard");
	}

	return <div className="p-6">Admin only content here</div>;
}


