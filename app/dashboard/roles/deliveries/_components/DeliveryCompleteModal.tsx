"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface DeliveryCompleteModalProps {
	requestId: string | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function DeliveryCompleteModal({
	requestId,
	isOpen,
	onClose,
}: DeliveryCompleteModalProps) {
	const [loading, setLoading] = useState(false);
	const [proofPhoto, setProofPhoto] = useState<File | null>(null);
	const router = useRouter();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setProofPhoto(e.target.files[0]);
		}
	};

	const handleComplete = async () => {
		if (!requestId) return;

		setLoading(true);
		try {
			let proofPhotoUrl: string | null = null;

			// Upload proof photo if provided
			if (proofPhoto) {
				const formData = new FormData();
				formData.append("file", proofPhoto);
				const uploadRes = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				if (uploadRes.ok) {
					const uploadData = await uploadRes.json();
					proofPhotoUrl = uploadData.fileUrl;
				}
			}

			// Mark delivery as complete
			const res = await fetch("/api/delivery/complete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					requestId,
					proofPhotoUrl,
				}),
			});

			if (res.ok) {
				router.refresh();
				onClose();
			} else {
				alert("Failed to complete delivery");
			}
		} catch (error) {
			console.error("Error completing delivery:", error);
			alert("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Mark Delivery as Complete</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<Label>Proof of Delivery Photo (Optional)</Label>
						<Input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							disabled={loading}
						/>
						<p className="text-sm text-gray-500 mt-1">
							Upload a photo as proof of delivery
						</p>
					</div>
					<div className="flex gap-3 justify-end">
						<Button variant="outline" onClick={onClose} disabled={loading}>
							Cancel
						</Button>
						<Button onClick={handleComplete} disabled={loading}>
							{loading ? "Completing..." : "Mark as Delivered"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

