"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
	href: string;
	children: React.ReactNode;
}

function SidebarLink({ href, children }: SidebarLinkProps) {
	const pathname = usePathname();
	const isActive = pathname === href || pathname?.startsWith(href + "/");

	return (
		<Link
			href={href}
			className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
				isActive ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-700 hover:bg-gray-100"
			}`}
		>
			{children}
		</Link>
	);
}

export default function DashboardNav({ user }: { user: any }) {
	if (!user) {
		return (
			<>
				<SidebarLink href="/dashboard">Dashboard</SidebarLink>
			</>
		);
	}

	if (user.role === "admin") {
		return (
			<>
				<SidebarLink href="/dashboard">Dashboard</SidebarLink>
				<SidebarLink href="/admin/users">Manage Users</SidebarLink>
				<SidebarLink href="/dashboard/roles/official-approvals">Approvals</SidebarLink>
				<SidebarLink href="/dashboard/roles/release">Release</SidebarLink>
				<SidebarLink href="/dashboard/roles/deliveries">Deliveries</SidebarLink>
				<SidebarLink href="/dashboard/profile">Profile</SidebarLink>
			</>
		);
	}

	if (user.role === "staff") {
		return (
			<>
				<SidebarLink href="/dashboard">Dashboard</SidebarLink>
				<SidebarLink href="/dashboard/roles/staff-requests">Pending Requests</SidebarLink>
				<SidebarLink href="/dashboard/roles/official-approvals">Approvals</SidebarLink>
				<SidebarLink href="/dashboard/roles/release">Release</SidebarLink>
				<SidebarLink href="/dashboard/roles/deliveries">Deliveries</SidebarLink>
				<SidebarLink href="/dashboard/profile">Profile</SidebarLink>
			</>
		);
	}

	// Resident navigation
	return (
		<>
			<SidebarLink href="/dashboard">Dashboard</SidebarLink>
			<SidebarLink href="/dashboard/request">New Request</SidebarLink>
			<SidebarLink href="/dashboard/records">My Requests</SidebarLink>
			<SidebarLink href="/dashboard/profile">Profile</SidebarLink>
		</>
	);
}

