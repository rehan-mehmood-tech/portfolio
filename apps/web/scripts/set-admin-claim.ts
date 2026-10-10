import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

config({ path: ".env.local" });

const email = process.argv[2];
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
if (!email) throw new Error("Usage: npm run set-admin -- admin@example.com");

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
if (!projectId || !clientEmail || !privateKey) throw new Error("Firebase Admin environment variables are required.");

const app = getApps()[0] ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const auth = getAuth(app);

async function main() {
  let user;
  try {
    user = await auth.getUserByEmail(email);
    if (password) user = await auth.updateUser(user.uid, { password, emailVerified: true, disabled: false });
  } catch (error: unknown) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code !== "auth/user-not-found") throw error;
    if (!password) throw new Error("User does not exist. Set ADMIN_BOOTSTRAP_PASSWORD once to create it.");
    user = await auth.createUser({ email, password, emailVerified: true, disabled: false });
  }
  await auth.setCustomUserClaims(user.uid, { ...(user.customClaims ?? {}), admin: true });
  await auth.revokeRefreshTokens(user.uid);
  console.log(`Admin access enabled for ${email}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
