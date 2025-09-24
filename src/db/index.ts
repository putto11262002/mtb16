// Drizzle instance with schema
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";
import * as schema from "@/db/schema";

// Use DATABASE_URL from your environment. If not set, a default placeholder is used.
// It's recommended to set this in your .env file: DATABASE_URL="postgresql://user:password@host:port/database_name"
const queryClient = postgres(
  process.env.DATABASE_URL ||
    "postgresql://user:password@host:port/database_name",
);
export const db = drizzle(queryClient, { schema });
