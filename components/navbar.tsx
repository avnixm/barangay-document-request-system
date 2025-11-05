import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
	return (
		<nav className="w-full bg-white shadow-sm border-b">
			<div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
				<h1 className="text-xl font-bold">Barangay DocSys</h1>

				<div className="hidden md:block">
					<UserButton />
				</div>

				<div className="md:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline">Menu</Button>
						</SheetTrigger>
						<SheetContent side="right">
							<div className="flex flex-col gap-3 mt-6">
								<Link href="/">Home</Link>
								<Link href="/dashboard">Dashboard</Link>
								<UserButton />
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
}


