import { ArrowUpRight } from "lucide-react";
import { Card22 } from "@/components/ui/card-22";
import { Button } from "@/components/ui/button";
import type { Certification, Project } from "@/lib/types";

type ProjectsSectionProps = {
  projects: Project[];
  githubUrl: string;
};

export function ProjectsSection({ projects, githubUrl }: ProjectsSectionProps) {
  const published = projects
    .filter((project) => project.published)
    .sort((left, right) => left.sortOrder - right.sortOrder);
  const featured = published.filter((project) => project.featured);
  const remaining = published.filter((project) => !project.featured);
  const pinnedProjects = [...featured, ...remaining].slice(0, 6);

  return (
    <section className="showcase-section landing-section-divider" id="projects">
      <div className="showcase-container">
        <header className="showcase-heading">
          <span>Selected work</span>
          <h2>FEATURED <em className="font-pixel">PROJECTS</em></h2>
          <p>Six priority builds selected from the live portfolio CMS.</p>
        </header>

        <div className="showcase-grid">
          {pinnedProjects.map((project) => (
            <Card22
              key={project.id}
              title={project.title}
              description={project.summary}
              eyebrow={project.category}
              meta={project.status}
              image={project.coverImage}
              imageAlt={project.coverAlt}
              visualLabel={project.stack.slice(0, 2).join(" + ") || project.projectType}
              actionLabel="View Project"
              actionHref={"/projects/" + project.slug}
            />
          ))}
        </div>

        <div className="showcase-actions">
          <Button asChild variant="default" size="lg">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              View All on GitHub
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

type CertificationsSectionProps = {
  certifications: Certification[];
};

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const visibleCredentials = certifications
    .filter((certification) => certification.published)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .slice(0, 6);

  return (
    <section className="showcase-section credentials-showcase landing-section-divider" id="certifications">
      <div className="showcase-container">
        <header className="showcase-heading">
          <span>Verified learning</span>
          <h2>CERTIFICATIONS &amp; <em className="font-pixel">CREDENTIALS</em></h2>
          <p>Licenses and completed programs managed through the portfolio CMS.</p>
        </header>

        <div className="showcase-grid">
          {visibleCredentials.map((certification) => (
            <Card22
              key={certification.id}
              title={certification.name}
              description={certification.issuer + " · " + certification.date}
              eyebrow="Credential"
              meta={certification.date}
              visualLabel={certification.issuer}
              actionLabel="Verify Certificate"
              actionHref={certification.credentialUrl}
              external={Boolean(certification.credentialUrl)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
