import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { requests, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PendingRequestsTable from "./_components/PendingRequestsTable";

export default async function StaffRequestsPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const userData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userData[0];

	if (!user || (user.role !== "staff" && user.role !== "admin")) {
		redirect("/dashboard");
	}

    const pending = await db
		.select({
			id: requests.id,
			residentId: requests.residentId,
			documentType: requests.documentType,
			purpose: requests.purpose,
			status: requests.status,
			createdAt: requests.createdAt,
			residentName: users.fullName,
			residentEmail: users.email,
		})
		.from(requests)
		.leftJoin(users, eq(requests.residentId, users.clerkId))
        .where(inArray(requests.status, ["submitted", "pending_review", "pending"]));

	return (
		<div className="max-w-4xl">
			<Card className="shadow-sm border bg-white">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">Pending Requests</CardTitle>
				</CardHeader>
				<CardContent>
					{pending.length === 0 ? (
						<p className="text-gray-600">No pending requests at this time.</p>
					) : (
						<PendingRequestsTable requests={pending} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}

