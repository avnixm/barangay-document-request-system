import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const userData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userData[0];

	if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

	return NextResponse.json(user);
}

export async function PUT(req: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await req.json();
	const userData = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
	const user = userData[0];

	if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

	await db
		.update(users)
		.set({
			fullName: body.fullName,
			dateOfBirth: body.dateOfBirth,
			sex: body.sex,
			civilStatus: body.civilStatus,
			contactNumber: body.contactNumber,
			address: body.address,
			validIdType: body.validIdType,
			validIdNumber: body.validIdNumber,
			placeOfBirth: body.placeOfBirth,
			residentPhotoUrl: body.residentPhotoUrl,
			updatedAt: new Date(),
		})
		.where(eq(users.clerkId, userId));

	return NextResponse.json({ success: true });
}

