"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AttachmentPreview } from "./AttachmentPreview";
import StatusTimeline from "../../../records/_components/StatusTimeline";

interface RequestDetailsModalProps {
	requestId: string | null;
	onClose: () => void;
	onAction: () => void;
}

export default function RequestDetailsModal({
	requestId,
	onClose,
	onAction,
}: RequestDetailsModalProps) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (requestId) {
			setLoading(true);
			setError(null);
			fetch(`/api/request/${requestId}`)
				.then((res) => {
					if (!res.ok) throw new Error("Failed to fetch request");
					return res.json();
				})
				.then((data) => setData(data))
				.catch((err) => {
					console.error("Error fetching request:", err);
					setError("Failed to load request details");
				})
				.finally(() => setLoading(false));
		} else {
			setData(null);
			setError(null);
		}
	}, [requestId]);

	const handleVerify = async () => {
		setLoading(true);
		const form = new FormData();
		form.append("id", requestId!);
		await fetch("/api/request/verify", {
			method: "POST",
			body: form,
		});
		setLoading(false);
		onAction();
		onClose();
	};

	const handleReject = async () => {
		setLoading(true);
		const form = new FormData();
		form.append("id", requestId!);
		await fetch("/api/request/reject", {
			method: "POST",
			body: form,
		});
		setLoading(false);
		onAction();
		onClose();
	};

	const updateStatus = async (newStatus: string, note?: string) => {
		if (!requestId) return;
		setLoading(true);
		try {
			const res = await fetch("/api/request/status/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: requestId, newStatus, note }),
			});
			if (!res.ok) throw new Error("Failed to update status");
			onAction();
			onClose();
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	if (!data) {
		return (
			<Dialog open={!!requestId} onOpenChange={onClose}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Request Details</DialogTitle>
					</DialogHeader>
					<div className="p-4">
						{loading ? (
							<p className="text-gray-600">Loading...</p>
						) : error ? (
							<p className="text-red-600">{error}</p>
						) : (
							<p className="text-gray-600">No data available</p>
						)}
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	const { request, resident, attachments } = data;
	const documentData = request.documentData || {};
	const deliveryInfo = {
		method: request.deliveryMethod,
		address: request.deliveryAddress,
		contact: request.contactNumber,
		fee: request.deliveryFee,
		payment: request.paymentMethod,
	};

	return (
		<Dialog open={!!requestId} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">Request Details</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Resident Information */}
					<Card>
						<CardContent className="p-4 space-y-2">
							<h3 className="font-semibold text-lg mb-3">Resident Information</h3>
							<div className="grid grid-cols-2 gap-3 text-sm">
								<div>
									<span className="font-medium">Full Name:</span>{" "}
									{resident?.fullName || documentData.fullName || request.residentId}
								</div>
								<div>
									<span className="font-medium">Email:</span> {resident?.email || "N/A"}
								</div>
								<div>
									<span className="font-medium">Contact Number:</span>{" "}
									{resident?.contactNumber || documentData.contactNumber || "N/A"}
								</div>
								<div>
									<span className="font-medium">Address:</span>{" "}
									{resident?.address || documentData.address || "N/A"}
								</div>
								<div>
									<span className="font-medium">Date of Birth:</span>{" "}
									{resident?.dateOfBirth || documentData.dateOfBirth || "N/A"}
								</div>
								<div>
									<span className="font-medium">Sex:</span>{" "}
									{resident?.sex || documentData.sex || "N/A"}
								</div>
								<div>
									<span className="font-medium">Civil Status:</span>{" "}
									{resident?.civilStatus || documentData.civilStatus || "N/A"}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Document Information */}
					<Card>
						<CardContent className="p-4 space-y-2">
							<h3 className="font-semibold text-lg mb-3">Document Information</h3>
							<div className="space-y-2 text-sm">
								<div>
									<span className="font-medium">Document Type:</span> {request.documentType}
								</div>
								<div>
									<span className="font-medium">Purpose:</span> {request.purpose || "N/A"}
								</div>
								<div>
									<span className="font-medium">Status:</span>{" "}
									<span className="capitalize font-semibold">{request.status}</span>
								</div>
								<div>
									<span className="font-medium">Date Requested:</span>{" "}
									{request.createdAt
										? new Date(request.createdAt).toLocaleString()
										: "N/A"}
								</div>
						<div className="grid grid-cols-2 gap-3 pt-2">
							<div>
								<span className="font-medium">Delivery Method:</span>{" "}
								{deliveryInfo.method || "pickup"}
							</div>
							{deliveryInfo.method === "delivery" && (
								<>
									<div>
										<span className="font-medium">Delivery Address:</span>{" "}
										{deliveryInfo.address || "N/A"}
									</div>
									<div>
										<span className="font-medium">Delivery Contact:</span>{" "}
										{deliveryInfo.contact || "N/A"}
									</div>
									<div>
										<span className="font-medium">Delivery Fee:</span>{" "}
										{deliveryInfo.fee ?? "N/A"}
									</div>
								</>
							)}
							<div>
								<span className="font-medium">Payment Method:</span>{" "}
								{deliveryInfo.payment || "N/A"}
							</div>
						</div>
							</div>
						</CardContent>
					</Card>

					{/* Document-Specific Data */}
					{Object.keys(documentData).length > 0 && (
						<Card>
							<CardContent className="p-4 space-y-2">
								<h3 className="font-semibold text-lg mb-3">Additional Information</h3>
								<div className="space-y-2 text-sm">
									{Object.entries(documentData).map(([key, value]: [string, any]) => {
										if (
											["fullName", "dateOfBirth", "sex", "civilStatus", "contactNumber", "address"].includes(
												key
											)
										) {
											return null;
										}
										return (
											<div key={key}>
												<span className="font-medium capitalize">
													{key.replace(/([A-Z])/g, " $1").trim()}:
												</span>{" "}
												{value || "N/A"}
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Attachments */}
					{attachments && attachments.length > 0 && (
						<Card>
							<CardContent className="p-4 space-y-2">
								<h3 className="font-semibold text-lg mb-3">Attachments</h3>
								<div className="space-y-2">
									{attachments.map((att: any) => (
										<div key={att.id} className="text-sm">
											<AttachmentPreview
												fileUrl={att.fileUrl}
												fileName={att.fileName}
												fileType={att.fileType}
											/>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

				{/* Timeline */}
				<Card>
					<CardContent className="p-4">
						<h3 className="font-semibold text-lg mb-3">Status Timeline</h3>
						<StatusTimeline requestId={request.id} />
					</CardContent>
				</Card>

				{/* Action Buttons */}
				<div className="flex flex-wrap gap-2 justify-end pt-4 border-t">
						<Button
							variant="outline"
							onClick={onClose}
							disabled={loading}
						>
							Close
						</Button>
						<Button
							onClick={handleVerify}
							disabled={loading}
							className="bg-green-600 hover:bg-green-700"
						>
							{loading ? "Processing..." : "Verify"}
						</Button>
						<Button
							onClick={handleReject}
							disabled={loading}
							variant="destructive"
						>
							{loading ? "Processing..." : "Reject"}
						</Button>
					<Button variant="secondary" disabled={loading} onClick={() => updateStatus("pending_review")}>
						Pending Review
					</Button>
					<Button variant="secondary" disabled={loading} onClick={() => updateStatus("ready_pickup")}>
						Ready for Pick-Up
					</Button>
					<Button variant="secondary" disabled={loading} onClick={() => updateStatus("out_for_delivery")}>
						Out for Delivery
					</Button>
					<Button className="bg-purple-600 hover:bg-purple-700" disabled={loading} onClick={() => updateStatus("delivered")}>
						Mark Delivered
					</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

