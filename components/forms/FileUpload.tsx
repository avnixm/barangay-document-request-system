"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface FileUploadProps {
	label?: string;
	name: string;
	accept?: string;
	multiple?: boolean;
	onFileChange?: (files: FileList | null) => void;
}

export default function FileUpload({ label, name, accept, multiple, onFileChange }: FileUploadProps) {
	const [fileName, setFileName] = useState<string>("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setFileName(files[0].name);
		} else {
			setFileName("");
		}
		if (onFileChange) {
			onFileChange(files);
		}
	};

	return (
		<div className="space-y-2">
			{label && <Label htmlFor={name}>{label}</Label>}
			<Input type="file" id={name} name={name} accept={accept} multiple={multiple} onChange={handleChange} className="cursor-pointer" />
			{fileName && <p className="text-sm text-gray-600">Selected: {fileName}</p>}
		</div>
	);
}

