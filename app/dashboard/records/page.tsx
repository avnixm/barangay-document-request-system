import { db } from "@/db";
import { requests, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatusTimeline from "./_components/StatusTimeline";
import StatusBadge from "../roles/_components/StatusBadge";

export default async function RecordsPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const userData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userData[0];

	if (!user) redirect("/sign-in");

	const list = await db.select().from(requests).where(eq(requests.residentId, user.clerkId));

	return (
		<div className="max-w-4xl">
			<Card className="shadow-sm border bg-white">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">My Requests</CardTitle>
				</CardHeader>
				<CardContent>
					{list.length === 0 ? (
						<p className="text-gray-600">You have no requests yet.</p>
					) : (
						<table className="w-full border text-sm">
							<thead className="bg-gray-100 border-b">
								<tr>
									<th className="p-2 text-left">Document</th>
									<th className="p-2 text-left">Status</th>
									<th className="p-2 text-left">Released</th>
									<th className="p-2 text-left">Timeline</th>
								</tr>
							</thead>
							<tbody>
								{list.map((r) => (
									<tr key={r.id} className="border-b">
										<td className="p-2">{r.documentType}</td>
							<td className="p-2">
								<StatusBadge
									status={r.status as any}
									labelOverride={r.status === "ready_pickup" && (r as any).deliveryMethod === "delivery" ? "Ready for Delivery" : undefined}
								/>
							</td>
										<td className="p-2">{r.releasedAt ? new Date(r.releasedAt).toLocaleDateString() : "-"}</td>
										<td className="p-2">
											<StatusTimeline requestId={r.id} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

