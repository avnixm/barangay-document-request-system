import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Create uploads directory if it doesn't exist
		const uploadsDir = join(process.cwd(), "public", "uploads");
		if (!existsSync(uploadsDir)) {
			await mkdir(uploadsDir, { recursive: true });
		}

		// Generate unique filename
		const timestamp = Date.now();
		const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
		const filename = `${timestamp}-${safeFileName}`;
		const filepath = join(uploadsDir, filename);

		// Write file to public/uploads directory
		await writeFile(filepath, buffer);

		// Return public URL
		const fileUrl = `/uploads/${filename}`;

		return NextResponse.json({ success: true, fileUrl, fileName: file.name, fileType: file.type });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}

