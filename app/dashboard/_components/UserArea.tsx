"use client";

import { UserButton } from "@clerk/nextjs";

export default function UserArea() {
	return <UserButton afterSignOutUrl="/" />;
}


