"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface DeliveryAssignModalProps {
	requestId: string | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function DeliveryAssignModal({
	requestId,
	isOpen,
	onClose,
}: DeliveryAssignModalProps) {
	const [loading, setLoading] = useState(false);
	const [routeNote, setRouteNote] = useState("");
	const router = useRouter();

	const handleAssign = async () => {
		if (!requestId) return;

		setLoading(true);
		try {
			const res = await fetch("/api/delivery/assign", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					requestId,
					routeNote: routeNote.trim() || null,
				}),
			});

			if (res.ok) {
				router.refresh();
				onClose();
			} else {
				alert("Failed to assign delivery");
			}
		} catch (error) {
			console.error("Error assigning delivery:", error);
			alert("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Assign Delivery to Me</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<Label>Route Note (Optional)</Label>
						<Textarea
							value={routeNote}
							onChange={(e) => setRouteNote(e.target.value)}
							placeholder="Add any notes about the delivery route..."
							rows={3}
						/>
					</div>
					<div className="flex gap-3 justify-end">
						<Button variant="outline" onClick={onClose} disabled={loading}>
							Cancel
						</Button>
						<Button onClick={handleAssign} disabled={loading}>
							{loading ? "Assigning..." : "Assign to Me"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

