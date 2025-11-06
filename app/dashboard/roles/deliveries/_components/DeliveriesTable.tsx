"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "../../_components/StatusBadge";
import DeliveryAssignModal from "./DeliveryAssignModal";
import DeliveryCompleteModal from "./DeliveryCompleteModal";

interface DeliveriesTableProps {
	requests: any[];
	currentUserId: string;
}

export default function DeliveriesTable({ requests, currentUserId }: DeliveriesTableProps) {
	const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
	const [assignModalOpen, setAssignModalOpen] = useState(false);
	const [completeModalOpen, setCompleteModalOpen] = useState(false);

	const handleAssign = (requestId: string) => {
		setSelectedRequestId(requestId);
		setAssignModalOpen(true);
	};

	const handleComplete = (requestId: string) => {
		setSelectedRequestId(requestId);
		setCompleteModalOpen(true);
	};

	return (
		<>
			<table className="w-full border text-sm">
				<thead className="bg-gray-100 border-b">
					<tr>
						<th className="p-2 text-left">Document</th>
						<th className="p-2 text-left">Resident</th>
						<th className="p-2 text-left">Delivery Address</th>
						<th className="p-2 text-left">Status</th>
						<th className="p-2 text-left">Assigned To</th>
						<th className="p-2 text-left">Actions</th>
					</tr>
				</thead>
				<tbody>
					{requests.map((r) => {
						const isAssigned = r.assignedTo === currentUserId;
						const isAssignedToOther = r.assignedTo && r.assignedTo !== currentUserId;
						const canAssign = !r.assignedTo;
						const canComplete = isAssigned && !r.deliveredAt;

						return (
							<tr key={r.id} className="border-b">
								<td className="p-2">{r.documentType}</td>
								<td className="p-2">
									{(r.residentName && r.residentName.trim().length > 0) ? r.residentName : (r.residentEmail || r.residentId)}
								</td>
								<td className="p-2">
									<div className="max-w-xs truncate" title={r.deliveryAddress || ""}>
										{r.deliveryAddress || "N/A"}
									</div>
									{r.contactNumber && (
										<div className="text-xs text-gray-500">Contact: {r.contactNumber}</div>
									)}
								</td>
								<td className="p-2">
									<StatusBadge
										status={r.status || "ready_pickup"}
										labelOverride={r.status === "ready_pickup" ? "Ready for Delivery" : undefined}
									/>
								</td>
								<td className="p-2">
									{isAssigned ? (
										<span className="text-green-600 font-semibold">You</span>
									) : isAssignedToOther ? (
										<span className="text-gray-500">Assigned</span>
									) : (
										<span className="text-gray-400">Unassigned</span>
									)}
								</td>
								<td className="p-2">
									<div className="flex gap-2">
										{canAssign && (
											<Button
												size="sm"
												onClick={() => handleAssign(r.id)}
												className="bg-blue-600 hover:bg-blue-700"
											>
												Assign to Me
											</Button>
										)}
										{canComplete && (
											<Button
												size="sm"
												onClick={() => handleComplete(r.id)}
												className="bg-green-600 hover:bg-green-700"
											>
												Mark as Delivered
											</Button>
										)}
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<DeliveryAssignModal
				requestId={selectedRequestId}
				isOpen={assignModalOpen}
				onClose={() => {
					setAssignModalOpen(false);
					setSelectedRequestId(null);
				}}
			/>

			<DeliveryCompleteModal
				requestId={selectedRequestId}
				isOpen={completeModalOpen}
				onClose={() => {
					setCompleteModalOpen(false);
					setSelectedRequestId(null);
				}}
			/>
		</>
	);
}

