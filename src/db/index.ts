// Drizzle instance with schema
import * as schema from "@/db/schema";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Use DATABASE_URL from your environment. If not set, a default placeholder is used.
// It's recommended to set this in your .env file: DATABASE_URL="postgresql://user:password@host:port/database_name"
//
//
let sql;
let db: ReturnType<typeof drizzle> | ReturnType<typeof drizzleNeon>;
if (process.env.NODE_ENV !== "production") {
  sql = postgres(
    process.env.DATABASE_URL ||
      "postgresql://user:password@host:port/database_name",
  );
  db = drizzle(sql, { schema });
} else {
  sql = neon(process.env.DATABASE_URL!);
  db = drizzleNeon(sql, { schema });
}

export { db };
