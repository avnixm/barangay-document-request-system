"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload from "./FileUpload";
import { useState, useEffect } from "react";

const documentTypeSchema = z.enum([
	"Barangay Clearance",
	"Barangay Indigency Certificate",
	"Barangay Residency Certificate",
	"Barangay Business Clearance",
	"Barangay Solo Parent Certification",
	"Barangay Good Moral Certificate",
	"Barangay Certificate of No Complaint",
	"Barangay Certification for Lost ID or Documents",
]);

const baseSchema = z.object({
	documentType: documentTypeSchema,
	purpose: z.string().min(1, "Purpose is required"),
	// Personal details
	fullName: z.string().optional(),
	dateOfBirth: z.string().optional(),
	sex: z.string().optional(),
	civilStatus: z.string().optional(),
	contactNumber: z.string().optional(),
	address: z.string().optional(),
	// Residency details
	yearsInBarangay: z.string().optional(),
	dateStartedLiving: z.string().optional(),
	previousAddress: z.string().optional(),
	// Delivery & Payment
	deliveryMethod: z.enum(["pickup", "delivery"]),
	deliveryAddress: z.string().optional(),
	deliveryContactNumber: z.string().optional(),
	deliveryFee: z.string().optional(),
	paymentMethod: z.enum(["cash", "gcash", "maya", "cod"]).optional(),
	certifyInfo: z.boolean().refine((val) => val === true, "You must certify the information"),
	authorizeVerification: z.boolean().refine((val) => val === true, "Authorization is required"),
	agreePrivacy: z.boolean().refine((val) => val === true, "You must agree to privacy policy"),
});

type FormData = z.infer<typeof baseSchema> & Record<string, any>;

interface DocumentRequestFormProps {
	onSubmit: (data: any, files: { validId?: FileList; residentPhoto?: FileList; additionalDocuments?: FileList }) => Promise<void>;
	userProfile?: any;
}

export default function DocumentRequestForm({ onSubmit, userProfile }: DocumentRequestFormProps) {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [selectedDocType, setSelectedDocType] = useState<string>("");

	const form = useForm<FormData>({
		resolver: zodResolver(baseSchema),
		defaultValues: {
			fullName: userProfile?.fullName || "",
			dateOfBirth: userProfile?.dateOfBirth || "",
			sex: userProfile?.sex || "",
			civilStatus: userProfile?.civilStatus || "",
			contactNumber: userProfile?.contactNumber || "",
			address: userProfile?.address || "",
			deliveryMethod: "pickup",
			deliveryAddress: userProfile?.address || "",
			deliveryContactNumber: userProfile?.contactNumber || "",
			deliveryFee: "50.00",
			paymentMethod: "cash",
			certifyInfo: false,
			authorizeVerification: false,
			agreePrivacy: false,
		},
	});

	// Update form values when userProfile loads
	useEffect(() => {
		if (userProfile) {
			form.reset({
				fullName: userProfile.fullName || "",
				dateOfBirth: userProfile.dateOfBirth || "",
				sex: userProfile.sex || "",
				civilStatus: userProfile.civilStatus || "",
				contactNumber: userProfile.contactNumber || "",
				address: userProfile.address || "",
				deliveryMethod: "pickup",
				deliveryAddress: userProfile.address || "",
				deliveryContactNumber: userProfile.contactNumber || "",
				deliveryFee: "50.00",
				paymentMethod: "cash",
				certifyInfo: false,
				authorizeVerification: false,
				agreePrivacy: false,
			});
		}
	}, [userProfile, form]);

	const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

	const documentType = watch("documentType");
	const deliveryMethod = watch("deliveryMethod");

	useEffect(() => {
		if (documentType) {
			setSelectedDocType(documentType);
		}
	}, [documentType]);

	const submitForm = async (data: FormData) => {
		setLoading(true);
		setMessage("");
		try {
			// Validate delivery fields if delivery method is "delivery"
			if (data.deliveryMethod === "delivery") {
				if (!data.deliveryAddress || data.deliveryAddress.trim() === "") {
					setMessage("Delivery address is required for delivery method");
					setLoading(false);
					return;
				}
				if (!data.deliveryContactNumber || data.deliveryContactNumber.trim() === "") {
					setMessage("Contact number is required for delivery method");
					setLoading(false);
					return;
				}
			}

			// Get file inputs from form
			const formElement = document.querySelector("form");
			const validIdInput = formElement?.querySelector('input[name="validId"]') as HTMLInputElement;
			const residentPhotoInput = formElement?.querySelector('input[name="residentPhoto"]') as HTMLInputElement;
			const additionalDocumentsInput = formElement?.querySelector('input[name="additionalDocuments"]') as HTMLInputElement;

			const files = {
				validId: validIdInput?.files || undefined,
				residentPhoto: residentPhotoInput?.files || undefined,
				additionalDocuments: additionalDocumentsInput?.files || undefined,
			};

			await onSubmit(data, files);
			setMessage("Request submitted successfully!");
			form.reset();
		} catch (error) {
			setMessage("Error submitting request");
		} finally {
			setLoading(false);
		}
	};

	const renderDocumentSpecificFields = () => {
		switch (selectedDocType) {
			case "Barangay Clearance":
				return (
					<>
						<div>
							<Label>Employer / School / Agency (if applicable)</Label>
							<Input {...register("employerOrSchool")} placeholder="Optional" />
						</div>
						<div>
							<Label>Cedula Number (if required)</Label>
							<Input {...register("cedulaNumber")} placeholder="Optional" />
						</div>
					</>
				);
			case "Barangay Indigency Certificate":
				return (
					<>
						<div>
							<Label>Reason for indigency request</Label>
							<Textarea {...register("reasonForIndigency")} placeholder="Required" />
						</div>
						<div>
							<Label>Household monthly income amount</Label>
							<Input type="number" {...register("monthlyIncome")} placeholder="Optional" />
						</div>
						<div>
							<Label>Number of dependents</Label>
							<Input type="number" {...register("numberOfDependents")} placeholder="Optional" />
						</div>
					</>
				);
			case "Barangay Business Clearance":
				return (
					<>
						<div>
							<Label>Business Name</Label>
							<Input {...register("businessName")} placeholder="Required" />
						</div>
						<div>
							<Label>Business Type</Label>
							<Input {...register("businessType")} placeholder="e.g. Sari-sari store, food stall" />
						</div>
						<div>
							<Label>Business Address</Label>
							<Input {...register("businessAddress")} placeholder="Required" />
						</div>
						<div>
							<Label>Nature of business</Label>
							<Input {...register("natureOfBusiness")} placeholder="e.g. food, retail, services" />
						</div>
						<div>
							<Label>Business Owner Name</Label>
							<Input {...register("businessOwnerName")} placeholder="Required" />
						</div>
						<div>
							<Label>Business Contact Number</Label>
							<Input {...register("businessContactNumber")} placeholder="Required" />
						</div>
					</>
				);
			case "Barangay Solo Parent Certification":
				return (
					<>
						<div>
							<Label>Number of children</Label>
							<Input type="number" {...register("numberOfChildren")} placeholder="Required" />
						</div>
						<div>
							<Label>Ages of children</Label>
							<Input {...register("childrenAges")} placeholder="e.g. 5, 8, 12" />
						</div>
					</>
				);
			case "Barangay Good Moral Certificate":
				return (
					<>
						<div>
							<Label>School or Company name</Label>
							<Input {...register("schoolOrCompany")} placeholder="Required" />
						</div>
					</>
				);
			case "Barangay Certification for Lost ID or Documents":
				return (
					<>
						<div>
							<Label>Type of lost document</Label>
							<Input {...register("lostDocumentType")} placeholder="e.g. ID, permit, license" />
						</div>
						<div>
							<Label>Approximate date lost</Label>
							<Input type="date" {...register("dateLost")} />
						</div>
						<div>
							<Label>Location where last seen</Label>
							<Input {...register("locationLastSeen")} placeholder="Optional" />
						</div>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<form onSubmit={handleSubmit(submitForm)} className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Personal Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-gray-600">
						Your personal information is loaded from your profile. You can edit it here for this request.
					</p>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Full Name</Label>
							<Input {...register("fullName")} placeholder="Enter full name" />
						</div>
						<div>
							<Label>Date of Birth</Label>
							<Input type="date" {...register("dateOfBirth")} />
						</div>
						<div>
							<Label>Sex</Label>
							<Select 
								value={watch("sex") || ""} 
								onValueChange={(value) => setValue("sex", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select sex" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Male">Male</SelectItem>
									<SelectItem value="Female">Female</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Civil Status</Label>
							<Select 
								value={watch("civilStatus") || ""} 
								onValueChange={(value) => setValue("civilStatus", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select civil status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Single">Single</SelectItem>
									<SelectItem value="Married">Married</SelectItem>
									<SelectItem value="Widowed">Widowed</SelectItem>
									<SelectItem value="Divorced">Divorced</SelectItem>
									<SelectItem value="Separated">Separated</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Contact Number</Label>
							<Input {...register("contactNumber")} placeholder="Enter contact number" />
						</div>
						<div>
							<Label>Address</Label>
							<Input {...register("address")} placeholder="Enter address" />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Document Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label>Document Type *</Label>
						<Select 
							value={watch("documentType") || ""}
							onValueChange={(value) => setValue("documentType", value as z.infer<typeof documentTypeSchema>)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select document type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Barangay Clearance">Barangay Clearance</SelectItem>
								<SelectItem value="Barangay Indigency Certificate">Barangay Indigency Certificate</SelectItem>
								<SelectItem value="Barangay Residency Certificate">Barangay Residency Certificate</SelectItem>
								<SelectItem value="Barangay Business Clearance">Barangay Business Clearance</SelectItem>
								<SelectItem value="Barangay Solo Parent Certification">Barangay Solo Parent Certification</SelectItem>
								<SelectItem value="Barangay Good Moral Certificate">Barangay Good Moral Certificate</SelectItem>
								<SelectItem value="Barangay Certificate of No Complaint">Barangay Certificate of No Complaint</SelectItem>
								<SelectItem value="Barangay Certification for Lost ID or Documents">Barangay Certification for Lost ID or Documents</SelectItem>
							</SelectContent>
						</Select>
						{errors.documentType && <p className="text-sm text-red-600">{errors.documentType.message as string}</p>}
					</div>

					<div>
						<Label>Purpose *</Label>
						<Textarea {...register("purpose")} placeholder="Purpose of request" />
						{errors.purpose && <p className="text-sm text-red-600">{errors.purpose.message as string}</p>}
					</div>

					{renderDocumentSpecificFields()}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Residency Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label>Years in barangay</Label>
						<Input type="number" {...register("yearsInBarangay")} placeholder="Optional" />
					</div>
					<div>
						<Label>Date started living in barangay</Label>
						<Input type="date" {...register("dateStartedLiving")} />
					</div>
					<div>
						<Label>Previous address before barangay</Label>
						<Input {...register("previousAddress")} placeholder="Optional" />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Delivery & Payment</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label>Delivery Method *</Label>
						<Select
							value={watch("deliveryMethod") || "pickup"}
							onValueChange={(value) => setValue("deliveryMethod", value as "pickup" | "delivery")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select delivery method" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pickup">Pick-up at Barangay Office</SelectItem>
								<SelectItem value="delivery">Door-to-Door Delivery</SelectItem>
							</SelectContent>
						</Select>
						{errors.deliveryMethod && <p className="text-sm text-red-600">{errors.deliveryMethod.message as string}</p>}
					</div>

					{deliveryMethod === "delivery" && (
						<>
							<div>
								<Label>Delivery Address *</Label>
								<Textarea
									{...register("deliveryAddress")}
									placeholder="Enter complete delivery address"
								/>
								{errors.deliveryAddress && <p className="text-sm text-red-600">{errors.deliveryAddress.message as string}</p>}
							</div>
							<div>
								<Label>Contact Number for Delivery *</Label>
								<Input
									{...register("deliveryContactNumber")}
									placeholder="Enter contact number for delivery"
								/>
								{errors.deliveryContactNumber && <p className="text-sm text-red-600">{errors.deliveryContactNumber.message as string}</p>}
							</div>
							<div>
								<Label>Delivery Fee</Label>
								<Input
									type="number"
									step="0.01"
									{...register("deliveryFee")}
									placeholder="50.00"
									defaultValue="50.00"
								/>
								<p className="text-sm text-gray-500 mt-1">Standard delivery fee: ₱50.00</p>
							</div>
						</>
					)}

					<div>
						<Label>Payment Method *</Label>
						<Select
							value={watch("paymentMethod") || "cash"}
							onValueChange={(value) => setValue("paymentMethod", value as "cash" | "gcash" | "maya" | "cod")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select payment method" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="cash">Cash (On Pick-up)</SelectItem>
								<SelectItem value="gcash">GCash</SelectItem>
								<SelectItem value="maya">Maya</SelectItem>
								{deliveryMethod === "delivery" && <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>}
							</SelectContent>
						</Select>
						{errors.paymentMethod && <p className="text-sm text-red-600">{errors.paymentMethod.message as string}</p>}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Attachments</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FileUpload label="Upload Valid ID" name="validId" accept="image/*,application/pdf" />
					<FileUpload label="Upload Resident Photo" name="residentPhoto" accept="image/*" />
					<FileUpload label="Additional Documents (if required)" name="additionalDocuments" accept="image/*,application/pdf" multiple />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Declarations</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-start space-x-2">
						<input type="checkbox" {...register("certifyInfo")} className="mt-1" />
						<Label className="text-sm">
							I certify that all information is true and correct *
						</Label>
					</div>
					{errors.certifyInfo && <p className="text-sm text-red-600">{errors.certifyInfo.message as string}</p>}

					<div className="flex items-start space-x-2">
						<input type="checkbox" {...register("authorizeVerification")} className="mt-1" />
						<Label className="text-sm">
							I authorize the barangay to verify this information *
						</Label>
					</div>
					{errors.authorizeVerification && <p className="text-sm text-red-600">{errors.authorizeVerification.message as string}</p>}

					<div className="flex items-start space-x-2">
						<input type="checkbox" {...register("agreePrivacy")} className="mt-1" />
						<Label className="text-sm">
							I agree to data privacy & processing policies *
						</Label>
					</div>
					{errors.agreePrivacy && <p className="text-sm text-red-600">{errors.agreePrivacy.message as string}</p>}
				</CardContent>
			</Card>

			{message && (
				<p className={`font-semibold ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</p>
			)}

			<Button type="submit" disabled={loading} className="w-full">
				{loading ? "Submitting..." : "Submit Request"}
			</Button>
		</form>
	);
}

