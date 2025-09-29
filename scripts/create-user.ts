import "dotenv/config";
import { createInterface } from "readline";
import { auth } from "../src/lib/auth";

async function createUser() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string): Promise<string> =>
    new Promise((resolve) => rl.question(query, resolve));

  try {
    const name = await question("Enter name: ");
    const email = await question("Enter email: ");
    const password = await question("Enter password: ");

    rl.close();

    console.log("Creating user...");

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    console.log("User created successfully:", result);
    process.exit(0);
  } catch (error) {
    console.error("Failed to create user:", error);
    process.exit(1);
  }
}

createUser();
