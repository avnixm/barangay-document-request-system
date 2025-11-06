'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";

export default function UsersTable({ users }: any) {
	const [data, setData] = useState(users);

	const updateRole = async (clerkId: string, newRole: string) => {
		await fetch(`/api/admin/update-role`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ clerkId, newRole }),
		});
		setData(data.map((u: any) => (u.clerkId === clerkId ? { ...u, role: newRole } : u)));
	};

	return (
		<div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
			<Card className="w-full max-w-4xl shadow-lg border">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Manage Users</CardTitle>
				</CardHeader>
				<CardContent>
					<table className="w-full border text-sm">
						<thead>
							<tr className="border-b bg-gray-100">
								<th className="p-2 text-left">Name</th>
								<th className="p-2 text-left">Email</th>
								<th className="p-2 text-left">Role</th>
								<th className="p-2 text-left">Action</th>
							</tr>
						</thead>
						<tbody>
							{data.map((u: any) => (
								<tr key={u.clerkId} className="border-b">
									<td className="p-2">{u.fullName || "Unnamed"}</td>
									<td className="p-2">{u.email}</td>
									<td className="p-2 font-bold capitalize">{u.role}</td>
									<td className="p-2">
										<Select onValueChange={(value) => updateRole(u.clerkId, value)}>
											<SelectTrigger className="w-[140px]">
												<SelectValue placeholder="Change role" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="resident">Resident</SelectItem>
												<SelectItem value="staff">Staff</SelectItem>
												<SelectItem value="admin">Admin</SelectItem>
											</SelectContent>
										</Select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</CardContent>
			</Card>
		</div>
	);
}
