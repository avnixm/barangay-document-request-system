CREATE TABLE "request_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"file_url" text NOT NULL,
	"file_name" text NOT NULL,
	"file_type" text,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "document_data" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "date_of_birth" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sex" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "civil_status" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "contact_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "valid_id_type" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "valid_id_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "place_of_birth" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "resident_photo_url" text;--> statement-breakpoint
ALTER TABLE "request_attachments" ADD CONSTRAINT "request_attachments_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;