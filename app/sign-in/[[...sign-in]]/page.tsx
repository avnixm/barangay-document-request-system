import { SignIn } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
			<Card className="shadow-lg border">
				<CardContent className="p-6">
					<SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
				</CardContent>
			</Card>
		</div>
	);
}


