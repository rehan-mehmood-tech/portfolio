"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin } from "@/lib/auth";
import { adminDb, isFirebaseConfigured } from "@/lib/firebase-admin";

const allowedCollections = new Set(["projects", "certifications"]);
const listFields = new Set(["stack", "decisions", "serviceSlugs", "features", "galleryImages", "galleryLabels", "skills"]);
const booleanFields: Record<string, string[]> = {
  projects: ["published", "featured"],
  certifications: ["published"],
};

function strings(form: FormData, name: string) {
  return String(form.get(name) ?? "").split("\n").map((value) => value.trim()).filter(Boolean).slice(0, 50);
}

export async function saveContent(form: FormData) {
  await requireAdmin();
  if (!isFirebaseConfigured) throw new Error("Firebase Admin credentials are required.");

  const collection = String(form.get("collection"));
  if (!allowedCollections.has(collection)) throw new Error("Unsupported collection.");

  const id = String(form.get("id") || form.get("slug") || crypto.randomUUID()).trim();
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error("ID must use lowercase letters, numbers, and hyphens.");

  const data: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (["collection", "id"].includes(key)) continue;
    if (listFields.has(key)) data[key] = strings(form, key);
    else if (booleanFields[collection]?.includes(key)) data[key] = value === "on";
    else if (key === "sortOrder") data[key] = Number(value) || 999;
    else data[key] = String(value).trim().slice(0, 10_000);
  }
  for (const key of booleanFields[collection] ?? []) {
    if (!form.has(key)) data[key] = false;
  }

  data.updatedAt = FieldValue.serverTimestamp();
  await adminDb.collection(collection).doc(id).set(data, { merge: true });
  revalidateTag(collection, "max");
  revalidatePath("/", "layout");
  revalidatePath("/" + collection);
  revalidatePath("/admin/" + collection);
}

export async function deleteContent(form: FormData) {
  await requireAdmin();
  if (!isFirebaseConfigured) throw new Error("Firebase Admin credentials are required.");

  const collection = String(form.get("collection"));
  const id = String(form.get("id"));
  if (!allowedCollections.has(collection) || !/^[a-z0-9-]+$/.test(id)) throw new Error("Invalid delete request.");

  await adminDb.collection(collection).doc(id).delete();
  revalidateTag(collection, "max");
  revalidatePath("/", "layout");
  revalidatePath("/" + collection);
  revalidatePath("/admin/" + collection);
}

export async function updateLeadStatus(form: FormData) {
  await requireAdmin();
  if (!isFirebaseConfigured) throw new Error("Firebase Admin credentials are required.");

  const id = String(form.get("id"));
  const status = String(form.get("status"));
  if (!id || !["new", "contacted", "won", "lost"].includes(status)) throw new Error("Invalid lead update.");

  await adminDb.collection("leads").doc(id).update({ status, updatedAt: FieldValue.serverTimestamp() });
  revalidatePath("/admin/leads");
}
