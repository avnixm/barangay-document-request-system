"use client";

import { useEffect } from "react";

export default function InitUser() {
	useEffect(() => {
		fetch("/api/auth").catch(() => {});
	}, []);

	return null;
}


