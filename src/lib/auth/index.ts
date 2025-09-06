import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // Import your Drizzle instance
import * as schema from "@/db/schema"; // Import your Drizzle schema

// Ensure your Drizzle schema has tables like users, accounts, sessions, verificationTokens
// and they are correctly mapped if your table names differ from default expectations.
// For example, if your users table is named 'app_users', you'd map it like:
// schema: { ...schema, users: schema.app_users }

export const auth = betterAuth({
  // Use the drizzle adapter with your Drizzle instance and schema
  database: drizzleAdapter(db, {
    provider: "pg", // Specify your database provider ('pg', 'mysql', 'sqlite')
    schema: { // Map your schema tables if names differ from Better Auth defaults
      ...schema,
      // Example if your users table is named 'app_users':
      // users: schema.app_users,
      // accounts: schema.app_accounts,
      // sessions: schema.app_sessions,
      // verificationTokens: schema.app_verificationTokens,
    },
  }),
  // Enable email and password authentication
  emailAndPassword: {
    enabled: true,
  },
  // Optionally, configure session management.
  // For Astro, session and user context might be managed via middleware or server actions.
  // The auth instance itself handles session tokens.
});
