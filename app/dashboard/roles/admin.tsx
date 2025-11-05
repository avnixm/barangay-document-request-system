import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard({ user }: any) {
	return (
		<div className="min-h-screen py-10 px-4 bg-gradient-to-br from-gray-50 to-amber-100">
			<div className="max-w-4xl mx-auto">
				<Card className="shadow-lg border">
					<CardHeader>
						<CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p>Manage users, roles, and system data.</p>
						<Button>Manage Residents</Button>
						<Button>Manage Staff</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


