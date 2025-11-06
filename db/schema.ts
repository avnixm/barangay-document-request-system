import { pgTable, text, timestamp, uuid, jsonb, boolean, numeric } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	clerkId: text("clerk_id").notNull().unique(),
	fullName: text("full_name"),
	email: text("email").notNull(),
	role: text("role").default("resident"),
	// Universal resident information
	dateOfBirth: text("date_of_birth"),
	sex: text("sex"),
	civilStatus: text("civil_status"),
	contactNumber: text("contact_number"),
	address: text("address"),
	validIdType: text("valid_id_type"),
	validIdNumber: text("valid_id_number"),
	placeOfBirth: text("place_of_birth"),
	residentPhotoUrl: text("resident_photo_url"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const requests = pgTable("requests", {
	id: uuid("id").defaultRandom().primaryKey(),
	residentId: text("resident_id").notNull(),
	documentType: text("document_type").notNull(),
	purpose: text("purpose"),
	// Expanded status flow: submitted, pending_review, verified, processing, ready_pickup, out_for_delivery, delivered, rejected
	status: text("status").default("submitted"),
	approvedBy: text("approved_by"),
	fileUrl: text("file_url"),
	releaseMethod: text("release_method"),
	releasedAt: timestamp("released_at"),
	documentData: jsonb("document_data"), // Document-specific fields as JSON
	// Delivery & payment related (Phase B/D scaffolding used by Phase A UI)
	deliveryMethod: text("delivery_method"), // pickup | delivery
	deliveryAddress: text("delivery_address"),
	contactNumber: text("contact_number"),
	deliveryFee: numeric("delivery_fee"),
	paymentMethod: text("payment_method"), // cash | gcash | maya | cod
	rejectedReason: text("rejected_reason"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const requestAttachments = pgTable("request_attachments", {
	id: uuid("id").defaultRandom().primaryKey(),
	requestId: uuid("request_id").notNull().references(() => requests.id),
	fileUrl: text("file_url").notNull(),
	fileName: text("file_name").notNull(),
	fileType: text("file_type"),
	uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const requestStatusLogs = pgTable("request_status_logs", {
	id: uuid("id").defaultRandom().primaryKey(),
	requestId: uuid("request_id").notNull().references(() => requests.id),
	oldStatus: text("old_status"),
	newStatus: text("new_status").notNull(),
	note: text("note"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const deliveries = pgTable("deliveries", {
	id: uuid("id").defaultRandom().primaryKey(),
	requestId: uuid("request_id").notNull().references(() => requests.id),
	assignedTo: text("assigned_to"), // staff clerkId
	routeNote: text("route_note"),
	startedAt: timestamp("started_at"),
	deliveredAt: timestamp("delivered_at"),
	proofPhotoUrl: text("proof_photo_url"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	message: text("message").notNull(),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at").defaultNow(),
	expiresAt: timestamp("expires_at"),
	isPublished: boolean("is_published").default(true),
});


