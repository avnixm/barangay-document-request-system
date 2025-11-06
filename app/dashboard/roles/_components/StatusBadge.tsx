"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
	status: string;
	labelOverride?: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
	submitted: { label: "Submitted", variant: "default" },
	pending_review: { label: "Pending Review", variant: "secondary" },
	verified: { label: "Verified", variant: "default" },
	processing: { label: "Processing", variant: "secondary" },
	ready_pickup: { label: "Ready for Pick-Up", variant: "default" },
	out_for_delivery: { label: "Out for Delivery", variant: "secondary" },
	delivered: { label: "Delivered", variant: "default" },
	rejected: { label: "Rejected", variant: "destructive" },
	pending: { label: "Pending", variant: "secondary" },
	approved: { label: "Approved", variant: "default" },
	released: { label: "Released", variant: "default" },
};

export default function StatusBadge({ status, labelOverride }: StatusBadgeProps) {
	const config = statusConfig[status] || { label: status, variant: "outline" as const };
	const label = labelOverride || config.label;
	return (
		<Badge variant={config.variant} className="capitalize">
			{label}
		</Badge>
	);
}

