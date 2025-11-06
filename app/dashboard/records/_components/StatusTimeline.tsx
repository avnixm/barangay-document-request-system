"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StatusTimelineProps {
	requestId: string;
}

const statusLabels: Record<string, string> = {
	submitted: "Submitted",
	pending_review: "Pending Review",
	verified: "Verified",
	processing: "Processing",
	ready_pickup: "Ready for Pick-Up",
	out_for_delivery: "Out for Delivery",
	delivered: "Delivered",
	rejected: "Rejected",
};

export default function StatusTimeline({ requestId }: StatusTimelineProps) {
	const [logs, setLogs] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open && requestId) {
			setLoading(true);
			fetch(`/api/request/${requestId}/logs`)
				.then((res) => res.json())
				.then((data) => setLogs(data.logs || []))
				.catch((err) => console.error("Error fetching logs:", err))
				.finally(() => setLoading(false));
		}
	}, [open, requestId]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					View Timeline
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Request Status Timeline</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					{loading ? (
						<p className="text-gray-600">Loading...</p>
					) : logs.length === 0 ? (
						<p className="text-gray-600">No status history available.</p>
					) : (
						<div className="space-y-3">
							{[...logs].reverse().map((log, idx) => (
								<div key={log.id} className="flex gap-4">
									<div className="flex flex-col items-center">
										<div className="w-3 h-3 rounded-full bg-blue-500" />
										{idx < logs.length - 1 && <div className="w-0.5 h-full bg-gray-300 mt-1" />}
									</div>
									<div className="flex-1 pb-4">
										<div className="font-semibold">
											{statusLabels[log.newStatus] || log.newStatus}
										</div>
										{log.note && <div className="text-sm text-gray-600 mt-1">{log.note}</div>}
										<div className="text-xs text-gray-500 mt-1">
											{log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

