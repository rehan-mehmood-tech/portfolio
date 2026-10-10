import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCertifications } from "@/lib/data";
import { cleanStringList, parsePageLimit, safeExternalUrl, safePublicImageUrl } from "@/lib/public-content";
import type { Certification } from "@/lib/types";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Verified credentials and technical training across AI engineering, automation, databases, and modern web systems.",
  alternates: { canonical: "/certifications" },
};

type CertificationsPageProps = { searchParams: Promise<{ limit?: string }> };

function inferredSkills(certification: Certification): string[] {
  const explicit = cleanStringList(certification.skills);
  if (explicit.length > 0) return explicit.slice(0, 6);
  const source = (certification.name + " " + certification.issuer).toLowerCase();
  if (source.includes("n8n103")) return ["AI Workflows", "Workflow Testing", "Error Handling", "Automation Best Practices"];
  if (source.includes("n8n102")) return ["API Integrations", "Connected Workflows", "Authentication", "Data Transformation"];
  if (source.includes("n8n")) return ["n8n Automation", "Workflow Design", "Nodes & Triggers", "Operational Pipelines"];
  if (source.includes("full stack")) return ["Full-Stack Development", "Frontend Engineering", "Backend APIs", "Application Delivery"];
  if (source.includes("artificial intelligence") || source.includes("ai")) return ["AI Engineering", "Agentic Workflows", "Full-Stack Systems", "Emerging Technologies"];
  return ["Technical Foundations", "Applied Engineering", "Professional Development"];
}

export default async function CertificationsPage({ searchParams }: CertificationsPageProps) {
  const params = await searchParams;
  const certifications = await getCertifications();
  const limit = parsePageLimit(params.limit);
  const visibleCertifications = certifications.slice(0, limit);
  const hasMore = visibleCertifications.length < certifications.length;

  return (
    <main className="certifications-dedicated">
      <section className="certifications-page-hero">
        <div className="portfolio-page-container">
          <p className="portfolio-page-kicker font-pixel">CONTINUOUS TECHNICAL DEVELOPMENT</p>
          <h1>VERIFIED CREDENTIALS &amp; <span className="font-pixel">TECHNICAL MASTERY</span></h1>
          <p>Focused training across AI engineering, automation pipelines, cloud databases, and modern web architectures—selected to strengthen the systems I design and the products I deliver.</p>
          <div className="certifications-hero-note">
            <span className="font-pixel">LEARNING WITH PURPOSE</span>
            <p>Credentials matter when the knowledge becomes working software. These programs support the practical projects, agent workflows, APIs, and full-stack systems shown throughout this portfolio.</p>
          </div>
        </div>
      </section>

      <section className="certifications-grid-section">
        <div className="portfolio-page-container">
          {visibleCertifications.length > 0 ? (
            <div className="certifications-page-grid">
              {visibleCertifications.map((certification, index) => {
                const imageUrl = safePublicImageUrl(certification.imageUrl);
                const credentialUrl = safeExternalUrl(certification.credentialUrl);
                const skills = inferredSkills(certification);
                return (
                  <article className="certification-showcase-card" key={certification.id}>
                    <div className="certification-preview">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={certification.name + " certificate"} fill sizes="(max-width: 700px) 92vw, 540px" />
                      ) : (
                        <div className="certification-issuer-mark" aria-label={certification.issuer + " credential"}>
                          <span className="font-pixel">{String(index + 1).padStart(2, "0")}</span>
                          <strong>{certification.issuer}</strong>
                          <i aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="certification-card-body">
                      <div className="certification-meta"><span>{certification.issuer}</span><time>{certification.date}</time></div>
                      <h2>{certification.name}</h2>
                      <p>{certification.summary || "Applied technical training issued by " + certification.issuer + ", focused on skills that transfer directly into production-minded engineering work."}</p>
                      <div className="certification-skills">
                        <span className="font-pixel">KEY SKILLS &amp; LEARNINGS</span>
                        <ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                      </div>
                      {credentialUrl ? <a className="button primary" href={credentialUrl} target="_blank" rel="noopener noreferrer">VERIFY CREDENTIAL ↗</a> : <span className="credential-pending">VERIFICATION LINK PENDING</span>}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="portfolio-empty-state"><span className="font-pixel">NO PUBLISHED CREDENTIALS</span><h2>Credential entries are being prepared.</h2><p>New published certifications from the CMS will appear here automatically.</p></div>
          )}

          {hasMore ? <div className="certifications-load-more"><Link className="button primary" href={"/certifications?limit=" + (limit + 6)}>LOAD MORE CREDENTIALS</Link></div> : null}
        </div>
      </section>
    </main>
  );
}
