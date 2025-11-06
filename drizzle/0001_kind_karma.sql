CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resident_id" text NOT NULL,
	"document_type" text NOT NULL,
	"purpose" text,
	"status" text DEFAULT 'pending',
	"approved_by" text,
	"file_url" text,
	"release_method" text,
	"released_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
