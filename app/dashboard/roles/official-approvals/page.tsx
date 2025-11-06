import { db } from "@/db";
import { requests, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import StatusBadge from "../_components/StatusBadge";

export default async function OfficialApprovalsPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const userData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userData[0];

	if (!user || (user.role !== "admin" && user.role !== "staff")) {
		redirect("/dashboard");
	}

	const list = await db
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
		.where(eq(requests.status, "verified"));

	return (
		<div className="max-w-4xl">
			<Card className="shadow-sm border bg-white">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">Verified Requests – For Approval</CardTitle>
				</CardHeader>
				<CardContent>
					{list.length === 0 ? (
						<p className="text-gray-600">No verified requests awaiting approval.</p>
					) : (
						<table className="w-full border text-sm">
							<thead className="bg-gray-100 border-b">
								<tr>
									<th className="p-2 text-left">Resident</th>
									<th className="p-2 text-left">Document</th>
									<th className="p-2 text-left">Status</th>
									<th className="p-2 text-left">Action</th>
								</tr>
							</thead>
							<tbody>
								{list.map((r) => (
									<tr key={r.id} className="border-b">
										<td className="p-2">
											{(r.residentName && r.residentName.trim().length > 0) ? r.residentName : (r.residentEmail || r.residentId)}
										</td>
										<td className="p-2">{r.documentType}</td>
										<td className="p-2">
											<StatusBadge status={r.status || "verified"} />
										</td>
										<td className="p-2 flex gap-2">
											<form action="/api/request/approve" method="post">
												<input type="hidden" name="id" value={r.id} />
												<Button size="sm" type="submit">Approve</Button>
											</form>
											<form action="/api/request/reject" method="post">
												<input type="hidden" name="id" value={r.id} />
												<Button size="sm" type="submit" variant="destructive">
													Reject
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

