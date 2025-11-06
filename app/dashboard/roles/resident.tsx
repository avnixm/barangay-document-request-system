import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResidentDashboard({ user }: any) {
	return (
		<div className="max-w-3xl">
			<Card className="shadow-sm border bg-white">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">Welcome, {user.fullName}</CardTitle>
				</CardHeader>
				<CardContent className="text-gray-600 space-y-4">
					<p>Request official barangay documents online.</p>
					<div className="flex gap-3">
						<Button asChild>
							<Link href="/dashboard/request">New Request</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/dashboard/records">My Requests</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


