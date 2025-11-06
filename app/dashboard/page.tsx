import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, announcements } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import ResidentDashboard from "./roles/resident";
import StaffDashboard from "./roles/staff";
import AdminDashboard from "./roles/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import InitUser from "./_components/InitUser";

export default async function Dashboard() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	let user: any | undefined;
	try {
		const data = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
		user = data[0];
	} catch (_) {
		// fall through to fallback UI
	}
	if (!user) {
		return (
			<>
				<InitUser />
				<div className="max-w-3xl">
					<Card className="shadow-sm border bg-white">
						<CardContent className="p-6 text-gray-700">Setting up your account...</CardContent>
					</Card>
				</div>
			</>
		);
	}

	if (user.role === "staff") {
		return <StaffDashboard user={user} />;
	}
	if (user.role === "admin") {
		return <AdminDashboard user={user} />;
	}

	// Fetch announcements for residents (with error handling if table doesn't exist yet)
	let notices: any[] = [];
	try {
		notices = await db
			.select()
			.from(announcements)
			.where(eq(announcements.isPublished, true))
			.orderBy(desc(announcements.createdAt))
			.limit(5);
	} catch (_) {
		// Table doesn't exist yet - skip announcements
	}

	return (
		<>
			<ResidentDashboard user={user} />
			{notices.length > 0 && (
				<div className="max-w-3xl mt-6">
					<Card className="shadow-sm border bg-white">
						<CardHeader>
							<CardTitle className="text-lg font-semibold">Announcements</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{notices.map((n: any) => (
								<div key={n.id} className="border-b pb-2">
									<p className="font-medium">{n.title}</p>
									<p className="text-sm text-gray-600">{n.message}</p>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}


