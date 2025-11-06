import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function ProfilePage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const userData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userData[0];

	if (!user) redirect("/sign-in");

	return (
		<div className="max-w-3xl">
			<Card className="shadow-sm border bg-white">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">Profile</CardTitle>
				</CardHeader>
				<CardContent className="text-gray-600 space-y-4">
					<div>
						<label className="text-sm font-medium text-gray-700">Full Name</label>
						<p className="mt-1">{user.fullName || "Not set"}</p>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700">Email</label>
						<p className="mt-1">{user.email}</p>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700">Role</label>
						<p className="mt-1 capitalize">{user.role}</p>
					</div>
					{user.contactNumber && (
						<div>
							<label className="text-sm font-medium text-gray-700">Contact Number</label>
							<p className="mt-1">{user.contactNumber}</p>
						</div>
					)}
					{user.address && (
						<div>
							<label className="text-sm font-medium text-gray-700">Address</label>
							<p className="mt-1">{user.address}</p>
						</div>
					)}
					<p className="text-sm text-gray-500 mt-4">Profile editing coming soon.</p>
				</CardContent>
			</Card>
		</div>
	);
}

