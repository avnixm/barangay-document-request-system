import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResidentDashboard({ user }: any) {
	return (
		<div className="min-h-screen py-10 px-4 bg-gradient-to-br from-gray-50 to-blue-100">
			<div className="max-w-4xl mx-auto">
				<Card className="shadow-lg border">
					<CardHeader>
						<CardTitle className="text-2xl">Welcome, {user.fullName}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p>Request official barangay documents online.</p>
						<Button>New Request</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


