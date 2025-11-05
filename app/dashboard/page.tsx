import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import ResidentDashboard from "./roles/resident";
import StaffDashboard from "./roles/staff";
import AdminDashboard from "./roles/admin";
import InitUser from "./_components/InitUser";

export default async function Dashboard() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	let user: any | undefined;
	try {
		const data = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
		user = data[0];
	} catch (_) {
		// Likely migrations not applied or DB not reachable
		redirect("/sign-in");
	}
	if (!user) redirect("/sign-in");

	// Ensure the user is inserted on first access as well (belt-and-suspenders)
	// but InitUser already calls /api/auth on the client.

	if (user.role === "staff") {
		return <StaffDashboard user={user} />;
	}
	if (user.role === "admin") {
		return <AdminDashboard user={user} />;
	}
	return <ResidentDashboard user={user} />;
}


