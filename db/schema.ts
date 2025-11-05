import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	clerkId: text("clerk_id").notNull().unique(),
	fullName: text("full_name"),
	email: text("email").notNull(),
	role: text("role").default("resident"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});


