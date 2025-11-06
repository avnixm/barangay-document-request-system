"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface AttachmentPreviewProps {
	fileUrl: string;
	fileName: string;
	fileType?: string;
}

export function AttachmentPreview({ fileUrl, fileName, fileType }: AttachmentPreviewProps) {
	const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
	const isPDF = fileUrl.match(/\.pdf$/i);

	return (
		<Dialog>
			<DialogTrigger className="text-blue-600 underline hover:opacity-70 text-sm">
				{fileName} ({fileType || "file"})
			</DialogTrigger>

			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Attachment Preview</DialogTitle>
				</DialogHeader>

				{isImage && (
					<img
						src={fileUrl}
						alt={fileName}
						className="mx-auto max-h-[80vh] object-contain rounded-md border"
					/>
				)}

				{isPDF && (
					<iframe
						src={fileUrl}
						className="w-full h-[80vh] border rounded-md"
						title={fileName}
					/>
				)}

				{!isImage && !isPDF && (
					<div className="text-center py-8">
						<p className="text-gray-600 text-sm mb-4">
							Preview not supported for this file type.
						</p>
						<a
							href={fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 underline hover:opacity-70"
						>
							Open in new tab
						</a>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

