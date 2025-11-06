"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function NewAnnouncement() {
	const [loading, setLoading] = useState(false);

	async function submit(e: any) {
		e.preventDefault();
		setLoading(true);

		const data = new FormData(e.target as HTMLFormElement);
		await fetch("/api/announcements/create", {
			method: "POST",
			body: data,
		});

		setLoading(false);
		alert("Announcement posted!");
	}

	return (
		<div className="max-w-xl">
			<Card className="border bg-white shadow-sm">
				<CardHeader>
					<CardTitle>Create Announcement</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={submit} className="space-y-3">
						<Input name="title" placeholder="Title" required />
						<Textarea name="message" placeholder="Message" required />
						<Button type="submit" disabled={loading}>
							{loading ? "Posting..." : "Post Announcement"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}


