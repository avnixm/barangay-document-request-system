import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard({ user }: any) {
	return (
		<div className="max-w-3xl">
			<Card className="shadow-sm border bg-white">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">Admin Panel</CardTitle>
				</CardHeader>
				<CardContent className="text-gray-600 space-y-4">
					<p>Manage users, roles, and system data.</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<Link href="/admin/users">Manage Users</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/dashboard/roles/official-approvals">Approvals</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/dashboard/roles/release">Release</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


