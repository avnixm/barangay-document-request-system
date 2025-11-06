"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DocumentRequestForm from "@/components/forms/DocumentRequestForm";

export default function RequestPage() {
	const [userProfile, setUserProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchProfile() {
			try {
				const res = await fetch("/api/user/profile");
				if (res.ok) {
					const data = await res.json();
					setUserProfile(data);
				}
			} catch (error) {
				console.error("Error fetching profile:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchProfile();
	}, []);

	const handleSubmit = async (data: any, files: { validId?: FileList; residentPhoto?: FileList; additionalDocuments?: FileList }) => {
		// Handle file uploads first
		const uploadedFiles: string[] = [];

		// Upload each file
		const fileEntries = [
			{ fileList: files.validId, name: "validId" },
			{ fileList: files.residentPhoto, name: "residentPhoto" },
			{ fileList: files.additionalDocuments, name: "additionalDocuments" },
		];

		for (const { fileList } of fileEntries) {
			if (fileList && fileList.length > 0) {
				for (let i = 0; i < fileList.length; i++) {
					const file = fileList[i];
					const uploadFormData = new FormData();
					uploadFormData.append("file", file);
					const uploadRes = await fetch("/api/upload", {
						method: "POST",
						body: uploadFormData,
					});
					if (uploadRes.ok) {
						const uploadData = await uploadRes.json();
						uploadedFiles.push(uploadData.fileUrl);
					}
				}
			}
		}

		// Prepare document data (exclude files and standard fields)
		const documentData: any = {};
		const standardFields = ["documentType", "purpose", "fullName", "dateOfBirth", "sex", "civilStatus", "contactNumber", "address", "yearsInBarangay", "dateStartedLiving", "previousAddress", "deliveryMethod", "deliveryAddress", "deliveryContactNumber", "deliveryFee", "paymentMethod", "certifyInfo", "authorizeVerification", "agreePrivacy", "validId", "residentPhoto", "additionalDocuments"];

		// Include personal details in documentData
		const personalDetails: any = {};
		if (data.fullName) personalDetails.fullName = data.fullName;
		if (data.dateOfBirth) personalDetails.dateOfBirth = data.dateOfBirth;
		if (data.sex) personalDetails.sex = data.sex;
		if (data.civilStatus) personalDetails.civilStatus = data.civilStatus;
		if (data.contactNumber) personalDetails.contactNumber = data.contactNumber;
		if (data.address) personalDetails.address = data.address;

		// Include other document-specific fields
		for (const [key, value] of Object.entries(data)) {
			if (!standardFields.includes(key) && value !== undefined && value !== null && value !== "") {
				documentData[key] = value;
			}
		}

		// Merge personal details into documentData
		Object.assign(documentData, personalDetails);

		// Update user profile with new personal details
		try {
			await fetch("/api/user/profile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(personalDetails),
			});
		} catch (error) {
			console.error("Failed to update profile:", error);
		}

		// Submit request with all data
		const requestData = {
			documentType: data.documentType,
			purpose: data.purpose,
			documentData: documentData,
			fileUrls: uploadedFiles,
			deliveryMethod: data.deliveryMethod || "pickup",
			deliveryAddress: data.deliveryAddress || null,
			deliveryContactNumber: data.deliveryContactNumber || null,
			deliveryFee: data.deliveryFee ? parseFloat(data.deliveryFee) : null,
			paymentMethod: data.paymentMethod || "cash",
		};

		const res = await fetch("/api/request/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestData),
		});

		if (!res.ok) {
			throw new Error("Failed to submit request");
		}
	};

	if (loading) {
		return (
			<div className="max-w-4xl">
				<Card className="shadow-sm border bg-white">
					<CardContent className="p-8 text-center">
						<p className="text-gray-600">Loading...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-4xl">
			<Card className="shadow-sm border bg-white">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">Request a Document</CardTitle>
				</CardHeader>
				<CardContent>
					<DocumentRequestForm onSubmit={handleSubmit} userProfile={userProfile} />
				</CardContent>
			</Card>
		</div>
	);
}
