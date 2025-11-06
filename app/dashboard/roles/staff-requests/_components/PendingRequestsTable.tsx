"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RequestDetailsModal from "./RequestDetailsModal";
import { useRouter } from "next/navigation";
import StatusBadge from "../../_components/StatusBadge";

interface PendingRequestsTableProps {
	requests: any[];
}

export default function PendingRequestsTable({ requests }: PendingRequestsTableProps) {
	const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
	const router = useRouter();

	const handleAction = () => {
		router.refresh();
	};

	return (
		<>
			<table className="w-full border text-sm">
				<thead className="bg-gray-100 border-b">
					<tr>
						<th className="p-2 text-left">Resident</th>
						<th className="p-2 text-left">Document</th>
						<th className="p-2 text-left">Status</th>
						<th className="p-2 text-left">Purpose</th>
						<th className="p-2 text-left">Action</th>
					</tr>
				</thead>
				<tbody>
					{requests.map((r) => (
						<tr key={r.id} className="border-b">
							<td className="p-2">
								{r.residentName?.trim().length > 0 ? r.residentName : r.residentEmail || r.residentId}
							</td>
							<td className="p-2">{r.documentType}</td>
							<td className="p-2">
								<StatusBadge status={r.status || "pending"} />
							</td>
							<td className="p-2">{r.purpose || "N/A"}</td>
							<td className="p-2">
								<div className="flex gap-2">
									<Button
										size="sm"
										onClick={() => setSelectedRequestId(r.id)}
										className="bg-blue-500 hover:bg-blue-600"
									>
										View
									</Button>
									<form action={`/api/request/verify`} method="post" className="inline">
										<input type="hidden" name="id" value={r.id} />
										<Button size="sm" type="submit" className="bg-green-600 hover:bg-green-700">
											Verify
										</Button>
									</form>
									<form action={`/api/request/reject`} method="post" className="inline">
										<input type="hidden" name="id" value={r.id} />
										<Button size="sm" type="submit" variant="destructive">
											Reject
										</Button>
									</form>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<RequestDetailsModal
				requestId={selectedRequestId}
				onClose={() => setSelectedRequestId(null)}
				onAction={handleAction}
			/>
		</>
	);
}

