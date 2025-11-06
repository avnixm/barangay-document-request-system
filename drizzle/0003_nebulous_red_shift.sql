CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"is_published" boolean DEFAULT true
);
