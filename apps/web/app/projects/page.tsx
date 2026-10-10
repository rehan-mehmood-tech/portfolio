import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/data";
import { cleanStringList, parsePageLimit, safeExternalUrl, safePublicImageUrl } from "@/lib/public-content";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects",
  description: "Full-stack products, autonomous AI agents, Micro-SaaS backends, and automated workflow systems engineered by Rehan Mehmood.",
  alternates: { canonical: "/projects" },
};

type ProjectsPageProps = { searchParams: Promise<{ category?: string; limit?: string }> };

function projectFeatures(project: Project): string[] {
  const explicit = cleanStringList(project.features);
  if (explicit.length > 0) return explicit.slice(0, 4);
  return [project.built, ...cleanStringList(project.decisions).slice(0, 3)].filter(Boolean).slice(0, 4);
}

function ProjectGallery({ project }: { project: Project }) {
  const sourceImages = [project.coverImage, ...cleanStringList(project.galleryImages)];
  const images = [...new Set(sourceImages.map(safePublicImageUrl).filter((item): item is string => Boolean(item)))];
  const labels = cleanStringList(project.galleryLabels);

  return (
    <div className="project-showcase-gallery" role="region" aria-label={project.title + " visual and architecture gallery"} tabIndex={0}>
      {images.map((image, index) => (
        <figure className="project-gallery-slide project-gallery-image" key={image}>
          <Image src={image} alt={index === 0 ? (project.coverAlt || project.title + " interface") : (labels[index] || project.title + " gallery image " + (index + 1))} fill sizes="(max-width: 700px) 82vw, 620px" />
          <figcaption>{labels[index] || (index === 0 ? "PRODUCT INTERFACE" : "PROJECT VIEW " + String(index + 1).padStart(2, "0"))}</figcaption>
        </figure>
      ))}
      <figure className="project-gallery-slide project-architecture-slide">
        <figcaption className="font-pixel">SYSTEM ARCHITECTURE</figcaption>
        <div className="architecture-flow" aria-label={project.architecture}>
          {project.architecture.split("→").map((step, index, steps) => (
            <div className="architecture-step" key={step + "-" + index}>
              <span>{step.trim()}</span>
              {index < steps.length - 1 ? <i aria-hidden="true">→</i> : null}
            </div>
          ))}
        </div>
      </figure>
      <figure className="project-gallery-slide project-delivery-slide">
        <figcaption className="font-pixel">ENGINEERING OUTCOME</figcaption>
        <strong>{project.outcome}</strong>
        <p>{project.improvements}</p>
      </figure>
    </div>
  );
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const allProjects = await getProjects();
  const categories = [...new Set(allProjects.map((project) => project.category).filter(Boolean))];
  const selectedCategory = params.category && categories.includes(params.category) ? params.category : "All";
  const filteredProjects = selectedCategory === "All" ? allProjects : allProjects.filter((project) => project.category === selectedCategory);
  const limit = parsePageLimit(params.limit);
  const visibleProjects = filteredProjects.slice(0, limit);
  const hasMore = visibleProjects.length < filteredProjects.length;
  const moreParams = new URLSearchParams({ limit: String(limit + 6) });
  if (selectedCategory !== "All") moreParams.set("category", selectedCategory);

  return (
    <main className="projects-dedicated">
      <section className="projects-page-hero">
        <div className="portfolio-page-container">
          <p className="portfolio-page-kicker font-pixel">SELECTED ENGINEERING WORK</p>
          <h1>ENGINEERED SOFTWARE &amp; <span className="font-pixel">AGENTIC SYSTEMS</span></h1>
          <p className="projects-hero-lead">I turn operational problems into software that can ship, scale, and keep working—from full-stack web architectures and custom Micro-SaaS backends to autonomous AI agents and automated workflow pipelines.</p>
          <p className="projects-hero-support">Each case below shows the problem, the system built to solve it, the engineering decisions behind it, and the honest stage of the work.</p>
        </div>
      </section>

      <section className="projects-feed-section">
        <div className="portfolio-page-container">
          {categories.length > 1 ? (
            <nav className="projects-category-filter" aria-label="Filter projects by category">
              <Link className={selectedCategory === "All" ? "active" : ""} href="/projects">All work</Link>
              {categories.map((category) => <Link className={selectedCategory === category ? "active" : ""} href={"/projects?category=" + encodeURIComponent(category)} key={category}>{category}</Link>)}
            </nav>
          ) : null}

          {visibleProjects.length > 0 ? (
            <div className="projects-post-feed">
              {visibleProjects.map((project, index) => {
                const demoUrl = safeExternalUrl(project.demoUrl);
                const repositoryUrl = safeExternalUrl(project.repositoryUrl);
                return (
                  <article className="project-post-card" key={project.id}>
                    <header className="project-post-header">
                      <div className="project-post-index font-pixel">{String(index + 1).padStart(2, "0")}</div>
                      <div><span>{project.projectType} · {project.status}</span><h2>{project.title}</h2><p>{project.hook || project.summary}</p></div>
                    </header>
                    <div className="project-story-grid">
                      <section><span className="project-story-label font-pixel">THE PROBLEM</span><p>{project.problem}</p></section>
                      <section><span className="project-story-label font-pixel">THE SOLUTION</span><p>{project.built}</p></section>
                    </div>
                    <section className="project-features"><span className="project-story-label font-pixel">FEATURES &amp; DELIVERABLES</span><ul>{projectFeatures(project).map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
                    <ProjectGallery project={project} />
                    <footer className="project-post-footer">
                      <ul className="project-stack" aria-label={project.title + " technology stack"}>{cleanStringList(project.stack).map((technology) => <li key={technology}>{technology}</li>)}</ul>
                      {(demoUrl || repositoryUrl) ? <div className="project-live-actions">{demoUrl ? <a className="button primary" href={demoUrl} target="_blank" rel="noopener noreferrer">LIVE DEMO ↗</a> : null}{repositoryUrl ? <a className="button primary" href={repositoryUrl} target="_blank" rel="noopener noreferrer">GITHUB REPOSITORY ↗</a> : null}</div> : null}
                    </footer>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="portfolio-empty-state"><span className="font-pixel">NO PUBLISHED WORK</span><h2>Project entries are being prepared.</h2><p>New published projects from the CMS will appear here automatically.</p></div>
          )}

          <div className="projects-feed-actions">
            <a className="button primary" href="https://github.com/rehan-mehmood-tech" target="_blank" rel="noopener noreferrer">VIEW ALL WORK ON GITHUB ↗</a>
            {hasMore ? <Link className="button primary" href={"/projects?" + moreParams.toString()}>LOAD MORE PROJECTS</Link> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
