"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Barangay DocSys</h1>

          <SignedOut>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
        </div>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6">
        <Card className="max-w-xl w-full shadow-lg border bg-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Request Barangay Documents Online</h2>
            <p className="text-gray-600 mb-6">
              Fast, easy, transparent — no long lines or paperwork hassle.
            </p>

            <SignedOut>
              <Button size="lg" className="w-full" asChild>
                <Link href="/sign-in">Get Started</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <Button size="lg" className="w-full" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </SignedIn>
          </CardContent>
        </Card>
      </section>

      <footer className="p-4 text-center text-gray-500 text-sm">
        © Barangay DocSys 2025. All Rights Reserved.
      </footer>
      </main>
  );
}
