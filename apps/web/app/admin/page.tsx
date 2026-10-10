import Link from "next/link";
import { adminDb, isFirebaseConfigured } from "@/lib/firebase-admin";

async function count(collection: string) {
  if (!isFirebaseConfigured) return 0;
  try {
    const snapshot = await adminDb.collection(collection).count().get();
    return snapshot.data().count;
  } catch {
    return 0;
  }
}

export default async function Dashboard() {
  const [projects, certifications, leads] = await Promise.all([count("projects"), count("certifications"), count("leads")]);
  return <>
    <header><div><div className="eyebrow">Portfolio CMS</div><h1>Dashboard Overview</h1></div></header>
    {!isFirebaseConfigured && <p className="cms-note" role="status">Firebase Admin is not configured. Add the three server-only Firebase variables listed in <code>.env.example</code> to enable authentication and Firestore CRUD.</p>}
    <div className="metric-grid">
      <article><span>Projects</span><strong>{projects}</strong><small>All Firestore records, including drafts</small></article>
      <article><span>Certifications</span><strong>{certifications}</strong><small>All Firestore credential records</small></article>
      <article><span>Incoming leads</span><strong>{leads}</strong><small>Contact form and AI agent leads</small></article>
    </div>
    <section className="admin-panel admin-overview-panel">
      <h2>Content management</h2>
      <p>Create, edit, publish, and remove portfolio content. Public pages are revalidated after every successful change.</p>
      <div className="admin-overview-links">
        <Link className="button primary" href="/admin/projects">Manage projects</Link>
        <Link className="button primary" href="/admin/certifications">Manage certifications</Link>
        <Link className="button primary" href="/admin/leads">Review leads</Link>
      </div>
    </section>
  </>;
}
