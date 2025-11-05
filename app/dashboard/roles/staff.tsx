import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffDashboard({ user }: any) {
	return (
		<div className="min-h-screen py-10 px-4 bg-gradient-to-br from-gray-50 to-green-100">
			<div className="max-w-4xl mx-auto">
				<Card className="shadow-lg border">
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Staff Panel</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p>Review incoming document requests.</p>
						<Button>View Pending Requests</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


