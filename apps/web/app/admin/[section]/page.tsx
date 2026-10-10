import Link from "next/link";
import { notFound } from "next/navigation";
import { adminDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import { deleteContent, saveContent, updateLeadStatus } from "../actions";

type AdminDocument = Record<string, unknown> & { id: string };

async function getDocuments(collection: "projects" | "certifications") {
  if (!isFirebaseConfigured) return [] as AdminDocument[];
  const snapshot = await adminDb.collection(collection).orderBy("sortOrder", "asc").get();
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() } as AdminDocument));
}

function value(item: AdminDocument | undefined, key: string) {
  const current = item?.[key];
  return typeof current === "string" || typeof current === "number" ? String(current) : "";
}

function lines(item: AdminDocument | undefined, key: string) {
  const current = item?.[key];
  return Array.isArray(current) ? current.map(String).join("\n") : "";
}

function checked(item: AdminDocument | undefined, key: string) {
  return item?.[key] === true;
}

function dateLabel(timestamp: unknown) {
  if (timestamp && typeof timestamp === "object" && "toDate" in timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" });
  }
  if (typeof timestamp === "string" || typeof timestamp === "number") {
    const date = new Date(timestamp);
    if (!Number.isNaN(date.valueOf())) return date.toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" });
  }
  return "Date unavailable";
}

export default async function AdminSection({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { section } = await params;
  const { edit } = await searchParams;
  if (section === "leads") return <Leads />;
  if (section !== "projects" && section !== "certifications") notFound();

  const items = await getDocuments(section);
  const selected = edit ? items.find((item) => item.id === edit) : undefined;

  return <>
    <header><div><div className="eyebrow">Portfolio CMS</div><h1>{section === "projects" ? "Projects Management" : "Certifications Management"}</h1></div></header>
    {!isFirebaseConfigured && <p className="cms-note" role="status">Firebase Admin credentials are not configured. Add them to <code>.env.local</code> before creating or editing records.</p>}
    <div className="editor-layout">
      <section className="admin-list" aria-label={"Existing " + section}>
        <div className="admin-list-heading"><h2>Existing records</h2><span>{items.length}</span></div>
        {items.map((item) => <article className="admin-list-row" key={item.id}>
          <div className="list-thumb">{String(item.sortOrder ?? 999).padStart(2, "0")}</div>
          <div><strong>{String(item.title ?? item.name ?? "Untitled")}</strong><small>{item.id} · {item.published ? "Published" : "Draft"}</small></div>
          <div className="admin-row-actions">
            <Link className="text-link" href={"/admin/" + section + "?edit=" + encodeURIComponent(item.id)}>Edit</Link>
            <form action={deleteContent}>
              <input type="hidden" name="collection" value={section} />
              <input type="hidden" name="id" value={item.id} />
              <button className="text-link danger" type="submit">Delete</button>
            </form>
          </div>
        </article>)}
        {items.length === 0 && <p className="cms-note">No Firestore records found.</p>}
      </section>
      {section === "projects" ? <ProjectEditor item={selected} /> : <CertificationEditor item={selected} />}
    </div>
  </>;
}

function ProjectEditor({ item }: { item?: AdminDocument }) {
  return <form action={saveContent} className="editor-card admin-form-grid">
    <input type="hidden" name="collection" value="projects" />
    <div className="full admin-editor-heading"><div><span className="eyebrow">{item ? "Editing record" : "New record"}</span><h2>{item ? String(item.title) : "Add project"}</h2></div>{item && <Link className="text-link" href="/admin/projects">Cancel</Link>}</div>
    <Field name="id" label="Document ID" defaultValue={item?.id} required readOnly={Boolean(item)} />
    <Field name="slug" label="Slug" defaultValue={value(item, "slug")} required />
    <Field name="title" label="Title" defaultValue={value(item, "title")} required />
    <Field name="hook" label="Hook line" defaultValue={value(item, "hook")} />
    <Area name="problem" label="Problem statement" defaultValue={value(item, "problem")} required />
    <Area name="built" label="Solution statement" defaultValue={value(item, "built")} required />
    <Area name="features" label="Features (one per line)" defaultValue={lines(item, "features")} />
    <Area name="stack" label="Tech stack badges (one per line)" defaultValue={lines(item, "stack")} />
    <Field name="demoUrl" label="Live URL" type="url" defaultValue={value(item, "demoUrl")} />
    <Field name="repositoryUrl" label="GitHub repository URL" type="url" defaultValue={value(item, "repositoryUrl")} />
    <Area name="galleryImages" label="Image / diagram URLs (one per line)" defaultValue={lines(item, "galleryImages")} />
    <Area name="galleryLabels" label="Image / diagram labels (one per line)" defaultValue={lines(item, "galleryLabels")} />
    <Field name="coverImage" label="Cover image URL" type="url" defaultValue={value(item, "coverImage")} />
    <Field name="coverAlt" label="Cover image alt text" defaultValue={value(item, "coverAlt")} />
    <Area name="summary" label="Short summary" defaultValue={value(item, "summary")} />
    <Field name="projectType" label="Project type" defaultValue={value(item, "projectType")} />
    <Field name="category" label="Category" defaultValue={value(item, "category")} />
    <Field name="status" label="Status" defaultValue={value(item, "status")} />
    <Field name="audience" label="Audience" defaultValue={value(item, "audience")} />
    <Area name="architecture" label="Architecture" defaultValue={value(item, "architecture")} />
    <Area name="decisions" label="Engineering decisions (one per line)" defaultValue={lines(item, "decisions")} />
    <Area name="serviceSlugs" label="Related service slugs (one per line)" defaultValue={lines(item, "serviceSlugs")} />
    <Area name="outcome" label="Outcome" defaultValue={value(item, "outcome")} />
    <Area name="lessons" label="Lessons learned" defaultValue={value(item, "lessons")} />
    <Area name="limitations" label="Limitations" defaultValue={value(item, "limitations")} />
    <Area name="improvements" label="Next improvements" defaultValue={value(item, "improvements")} />
    <Field name="sortOrder" label="Sort order" type="number" defaultValue={value(item, "sortOrder") || "999"} />
    <Checks items={[["published", checked(item, "published")], ["featured", checked(item, "featured")]]} />
    <button className="button primary full" type="submit">{item ? "Save project changes" : "Create project"}</button>
  </form>;
}

function CertificationEditor({ item }: { item?: AdminDocument }) {
  return <form action={saveContent} className="editor-card admin-form-grid">
    <input type="hidden" name="collection" value="certifications" />
    <div className="full admin-editor-heading"><div><span className="eyebrow">{item ? "Editing record" : "New record"}</span><h2>{item ? String(item.name) : "Add certification"}</h2></div>{item && <Link className="text-link" href="/admin/certifications">Cancel</Link>}</div>
    <Field name="id" label="Document ID" defaultValue={item?.id} required readOnly={Boolean(item)} />
    <Field name="name" label="Credential title" defaultValue={value(item, "name")} required />
    <Field name="issuer" label="Issuing authority" defaultValue={value(item, "issuer")} required />
    <Field name="date" label="Issue date" defaultValue={value(item, "date")} />
    <Area name="skills" label="Skills (one per line)" defaultValue={lines(item, "skills")} />
    <Area name="summary" label="Credential summary" defaultValue={value(item, "summary")} />
    <Field name="imageUrl" label="Certificate image URL" type="url" defaultValue={value(item, "imageUrl")} />
    <Field name="credentialUrl" label="Verification link" type="url" defaultValue={value(item, "credentialUrl")} />
    <Field name="sortOrder" label="Sort order" type="number" defaultValue={value(item, "sortOrder") || "999"} />
    <Checks items={[["published", checked(item, "published")]]} />
    <button className="button primary full" type="submit">{item ? "Save certification changes" : "Create certification"}</button>
  </form>;
}

async function Leads() {
  let leads: AdminDocument[] = [];
  if (isFirebaseConfigured) {
    const snapshot = await adminDb.collection("leads").orderBy("createdAt", "desc").limit(100).get();
    leads = snapshot.docs.map((document) => ({ id: document.id, ...document.data() } as AdminDocument));
  }

  return <>
    <header><div><div className="eyebrow">Portfolio CMS</div><h1>Incoming Leads</h1></div></header>
    {!isFirebaseConfigured && <p className="cms-note" role="status">Firebase Admin credentials are not configured, so leads cannot be loaded.</p>}
    <div className="admin-table admin-leads-table">
      <table>
        <thead><tr><th>Date</th><th>Contact</th><th>Role / source</th><th>Project details</th><th>Message brief</th><th>Status</th></tr></thead>
        <tbody>{leads.map((lead) => <tr key={lead.id}>
          <td>{dateLabel(lead.createdAt)}</td>
          <td><strong>{String(lead.name ?? "Unknown")}</strong><a href={"mailto:" + String(lead.email ?? "")}>{String(lead.email ?? "No email")}</a><small>{String(lead.phone ?? lead.whatsapp ?? "No phone supplied")}</small></td>
          <td><strong>{String(lead.type ?? "client")}</strong><small>{String(lead.source ?? "form")}</small></td>
          <td><strong>{String(lead.service ?? "Not selected")}</strong><small>Budget: {String(lead.budget ?? "Not supplied")}</small><small>Timeline: {String(lead.timeline ?? "Not supplied")}</small></td>
          <td className="lead-message">{String(lead.message ?? "")}</td>
          <td><form action={updateLeadStatus} className="lead-status-form"><input type="hidden" name="id" value={lead.id} /><label className="sr-only" htmlFor={"status-" + lead.id}>Lead status</label><select id={"status-" + lead.id} name="status" defaultValue={String(lead.status ?? "new")}>{["new", "contacted", "won", "lost"].map((status) => <option key={status}>{status}</option>)}</select><button className="button primary small" type="submit">Update</button></form></td>
        </tr>)}</tbody>
      </table>
      {leads.length === 0 && <p className="cms-note">No contact-form or AI-agent leads found.</p>}
    </div>
  </>;
}

function Field({ name, label, required = false, type = "text", defaultValue = "", readOnly = false }: { name: string; label: string; required?: boolean; type?: string; defaultValue?: string; readOnly?: boolean }) {
  return <label><span>{label}</span><input name={name} required={required} type={type} defaultValue={defaultValue} readOnly={readOnly} /></label>;
}

function Area({ name, label, defaultValue = "", required = false }: { name: string; label: string; defaultValue?: string; required?: boolean }) {
  return <label className="full"><span>{label}</span><textarea name={name} defaultValue={defaultValue} required={required} rows={4} /></label>;
}

function Checks({ items }: { items: [string, boolean][] }) {
  return <div className="full admin-checks">{items.map(([name, isChecked]) => <label className="consent" key={name}><input type="checkbox" name={name} defaultChecked={isChecked} /><span>{name}</span></label>)}</div>;
}
