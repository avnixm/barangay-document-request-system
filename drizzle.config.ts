import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load DATABASE_URL from .env.local when running the CLI
dotenv.config({ path: ".env.local" });

export default defineConfig({
	schema: "./db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
	},
});


