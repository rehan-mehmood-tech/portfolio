import "server-only";
import { unstable_cache } from "next/cache";
import { certifications, experiences, profile, projects, recommendations, services } from "./content";
import { adminDb, isFirebaseConfigured } from "./firebase-admin";
import type { Certification, Experience, Project, Recommendation, Service, SiteProfile } from "./types";

type CollectionMap = { projects: Project; services: Service; certifications: Certification; experiences: Experience; recommendations: Recommendation };

async function collectionOrFallback<K extends keyof CollectionMap>(name: K, fallback: CollectionMap[K][]) {
  if (!isFirebaseConfigured) return fallback;
  try {
    const snapshot = await adminDb.collection(name).get();
    if (snapshot.empty) return fallback;
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as CollectionMap[K][];
  } catch (error) {
    console.error(`Firestore ${name} read failed`, error);
    return fallback;
  }
}

export const getProfile = unstable_cache(async (): Promise<SiteProfile> => {
  if (!isFirebaseConfigured) return profile;
  try { const doc = await adminDb.doc("site/profile").get(); return doc.exists ? ({ ...profile, ...doc.data() } as SiteProfile) : profile; }
  catch (error) { console.error("Firestore profile read failed", error); return profile; }
}, ["profile"], { tags: ["profile"], revalidate: 300 });

export const getProjects = unstable_cache(async () => (await collectionOrFallback("projects", projects)).filter((item) => item.published).sort((a,b) => a.sortOrder-b.sortOrder), ["projects"], { tags:["projects"], revalidate:300 });
export const getServices = unstable_cache(async () => (await collectionOrFallback("services", services)).filter((item) => item.enabled).sort((a,b) => a.sortOrder-b.sortOrder), ["services"], { tags:["services"], revalidate:300 });
export const getCertifications = unstable_cache(async () => (await collectionOrFallback("certifications", certifications)).filter((item) => item.published).sort((a,b) => a.sortOrder-b.sortOrder), ["certifications"], { tags:["certifications"], revalidate:300 });
export const getExperiences = unstable_cache(async () => (await collectionOrFallback("experiences", experiences)).filter((item) => item.published).sort((a,b) => a.sortOrder-b.sortOrder), ["experiences"], { tags:["experiences"], revalidate:300 });
export const getRecommendations = unstable_cache(async () => (await collectionOrFallback("recommendations", recommendations)).filter((item) => item.published && item.permissionConfirmed), ["recommendations"], { tags:["recommendations"], revalidate:300 });
export async function getProject(slug: string) { return (await getProjects()).find((item) => item.slug === slug); }
export async function getService(slug: string) { return (await getServices()).find((item) => item.slug === slug); }
