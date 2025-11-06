CREATE TABLE "request_status_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"old_status" text,
	"new_status" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT 'submitted';--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "delivery_method" text;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "delivery_address" text;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "contact_number" text;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "delivery_fee" numeric;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "rejected_reason" text;--> statement-breakpoint
ALTER TABLE "request_status_logs" ADD CONSTRAINT "request_status_logs_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;