"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InitUser() {
	const router = useRouter();

	useEffect(() => {
		(async () => {
			try {
				await fetch("/api/auth", { cache: "no-store" });
			} finally {
				router.refresh();
			}
		})();
	}, [router]);

	return null;
}


