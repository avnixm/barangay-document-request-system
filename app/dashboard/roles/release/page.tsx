import { db } from "@/db";
import { requests, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import StatusBadge from "../_components/StatusBadge";

export default async function ReleaseDocsPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const userData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userData[0];

	if (!user || (user.role !== "staff" && user.role !== "admin")) {
		redirect("/dashboard");
	}

	const approved = await db
		.select({
			id: requests.id,
			residentId: requests.residentId,
			documentType: requests.documentType,
			purpose: requests.purpose,
			status: requests.status,
			createdAt: requests.createdAt,
			releasedAt: requests.releasedAt,
			deliveryMethod: requests.deliveryMethod,
			residentName: users.fullName,
			residentEmail: users.email,
		})
		.from(requests)
		.leftJoin(users, eq(requests.residentId, users.clerkId))
		.where(inArray(requests.status, ["processing", "ready_pickup"]));

	return (
		<div className="max-w-5xl">
			<Card className="shadow-sm border bg-white">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">Approved – Ready for Release</CardTitle>
				</CardHeader>
				<CardContent>
					{approved.length === 0 ? (
						<p className="text-gray-600">No approved requests ready for release.</p>
					) : (
						<table className="w-full border text-sm">
							<thead className="bg-gray-100 border-b">
								<tr>
									<th className="p-2 text-left">Document</th>
									<th className="p-2 text-left">Resident</th>
									<th className="p-2 text-left">Status</th>
									<th className="p-2 text-left">Release</th>
								</tr>
							</thead>
							<tbody>
								{approved.map((r) => (
									<tr key={r.id} className="border-b">
										<td className="p-2">{r.documentType}</td>
										<td className="p-2">
											{(r.residentName && r.residentName.trim().length > 0) ? r.residentName : (r.residentEmail || r.residentId)}
										</td>
					<td className="p-2">
						<StatusBadge
							status={r.status || "approved"}
							labelOverride={r.status === "ready_pickup" && r.deliveryMethod === "delivery" ? "Ready for Delivery" : undefined}
						/>
					</td>
										<td className="p-2 flex gap-2">
											<form action="/api/request/release" method="post">
												<input type="hidden" name="id" value={r.id} />
												<Button size="sm" type="submit">
													Mark as Released
												</Button>
											</form>
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

