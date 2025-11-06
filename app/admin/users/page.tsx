import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import UsersTable from "./table";

export default async function AdminUsersPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const data = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const currentUser = data[0];

	if (currentUser?.role !== "admin") {
		return redirect("/dashboard");
	}

	const allUsers = await db.select().from(users);

	return <UsersTable users={allUsers} />;
}
