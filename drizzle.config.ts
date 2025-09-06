import type { Config } from 'drizzle-kit';

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg", // 'pg' for PostgreSQL or 'mysql2' for MySQL
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  // Optional: uncomment for debugging
  // verbose: true,
  // printSchema: true,
} satisfies Config;
