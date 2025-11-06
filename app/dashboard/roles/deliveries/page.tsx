import { db } from "@/db";
import { requests, users, deliveries } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DeliveriesTable from "./_components/DeliveriesTable";

export default async function DeliveriesPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const userData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userData[0];

	if (!user || (user.role !== "staff" && user.role !== "admin")) {
		redirect("/dashboard");
	}

	// Fetch requests ready for delivery (status: ready_pickup or out_for_delivery, deliveryMethod: delivery)
	const deliveryRequests = await db
		.select({
			id: requests.id,
			residentId: requests.residentId,
			documentType: requests.documentType,
			purpose: requests.purpose,
			status: requests.status,
			deliveryMethod: requests.deliveryMethod,
			deliveryAddress: requests.deliveryAddress,
			contactNumber: requests.contactNumber,
			deliveryFee: requests.deliveryFee,
			paymentMethod: requests.paymentMethod,
			createdAt: requests.createdAt,
			residentName: users.fullName,
			residentEmail: users.email,
			deliveryId: deliveries.id,
			assignedTo: deliveries.assignedTo,
			startedAt: deliveries.startedAt,
			deliveredAt: deliveries.deliveredAt,
			proofPhotoUrl: deliveries.proofPhotoUrl,
		})
		.from(requests)
		.leftJoin(users, eq(requests.residentId, users.clerkId))
		.leftJoin(deliveries, eq(requests.id, deliveries.requestId))
		.where(
			and(
				eq(requests.deliveryMethod, "delivery"),
				inArray(requests.status, ["ready_pickup", "out_for_delivery"])
			)
		);

	return (
		<div className="max-w-6xl">
			<Card className="shadow-sm border bg-white">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">Delivery Management</CardTitle>
				</CardHeader>
				<CardContent>
					{deliveryRequests.length === 0 ? (
						<p className="text-gray-600">No delivery requests at this time.</p>
					) : (
						<DeliveriesTable requests={deliveryRequests} currentUserId={userId} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}

