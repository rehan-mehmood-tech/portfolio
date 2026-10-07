import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, isFirebaseConfigured } from "./firebase-admin";

export const sessionCookieName = process.env.SESSION_COOKIE_NAME ?? "portfolio_session";
export async function getAdmin() {
  if (!isFirebaseConfigured) return null;
  const value = (await cookies()).get(sessionCookieName)?.value;
  if (!value) return null;
  try { const decoded = await adminAuth.verifySessionCookie(value, true); return decoded.admin === true ? decoded : null; } catch { return null; }
}
export async function requireAdmin() { const admin = await getAdmin(); if (!admin) redirect("/login"); return admin; }
