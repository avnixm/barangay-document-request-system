import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashboardNav from "@/app/dashboard/_components/DashboardNav";
import UserArea from "@/app/dashboard/_components/UserArea";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const { userId } = await auth();
	let user: any = null;
	if (userId) {
		try {
			const data = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
			user = data[0];
		} catch (_) {}
	}

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex w-64 flex-col border-r bg-white">
				<div className="p-6 border-b">
					<h1 className="text-xl font-semibold tracking-tight">Barangay DocSys</h1>
				</div>
				<nav className="flex-1 p-4 space-y-2">
					<DashboardNav user={user} />
				</nav>
				<div className="p-4 border-t">
					<UserArea />
				</div>
			</aside>

			{/* Mobile Header */}
			<header className="md:hidden w-full border-b bg-white p-4 flex justify-between items-center sticky top-0 z-50">
				<h1 className="text-lg font-semibold">Barangay DocSys</h1>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline">Menu</Button>
					</SheetTrigger>
					<SheetContent side="left" className="p-6">
						<nav className="space-y-3">
							<DashboardNav user={user} />
						</nav>
						<div className="mt-6">
							<UserArea />
						</div>
					</SheetContent>
				</Sheet>
			</header>

			<main className="flex-1 p-6">{children}</main>
		</div>
	);
}


