import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AboutReveal } from "@/components/about-reveal";
import { getProfile } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Rehan Mehmood, an AI and Full-Stack Systems Engineer building resilient agents, automations, APIs and web products.",
  alternates: { canonical: "/about" },
};

const principles = [
  { marker: "R", title: "Resilience & Fault-Tolerance:", copy: "Building systems designed with robust error handling and self-recovery mechanisms to ensure continuous uptime." },
  { marker: "T", title: "Type-Safety & Clean Code:", copy: "Prioritizing clean abstractions, strict typing, and modular design for maintainable, extensible codebases." },
  { marker: "C", title: "Clarity Over Complexity:", copy: "Translating intricate technical trade-offs into plain, actionable language for stakeholders." },
];

const process = [
  { marker: "01", title: "Clear Scopes First:", copy: "Establishing exact requirements, deliverables, and milestones before writing code." },
  { marker: "02", title: "Early Working Versions:", copy: "Delivering functional, testable prototypes early for tight feedback loops." },
  { marker: "03", title: "Meticulous Documentation:", copy: "Thorough documentation of architectures, APIs, and workflows for smooth handovers." },
];

export default async function AboutPage() {
  const profile = await getProfile();
  const schema = {
    "@context": "https://schema.org", "@type": "Person", "@id": `${absoluteUrl("/")}#person`,
    name: profile.name, jobTitle: profile.title, description: profile.positioning, url: absoluteUrl("/about"),
    image: absoluteUrl(profile.photoUrl), address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
    affiliation: { "@type": "CollegeOrUniversity", name: "University of Management and Technology" },
    knowsAbout: Object.values(profile.stack).flatMap((value) => value.split(", ")),
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
  };

  return (
    <main className="about-dedicated">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="about-page-hero">
        <div className="about-page-container about-profile-grid">
          <AboutReveal className="about-portrait-wrap">
            <div className="about-portrait-card">
              <div className="about-portrait-media"><Image src={profile.photoUrl} alt="Rehan Mehmood in a formal suit" fill priority sizes="(max-width: 767px) 88vw, 430px" /></div>
              <div className="about-profile-status"><i />{profile.availability}</div>
            </div>
          </AboutReveal>
          <AboutReveal className="about-intro" delay={0.08}>
            <p className="about-kicker font-pixel">AI + FULL-STACK SYSTEMS ENGINEER</p>
            <h1>Bridging the Gap Between Complex AI &amp; <span className="font-pixel">Production-Grade Software</span></h1>
            <div className="about-intro-copy">
              <p>I am Rehan Mehmood, an AI and Full-Stack Systems Engineer currently pursuing my Computer Science degree at the University of Management and Technology, Lahore (Class of 2028).</p>
              <p>My focus is engineering intelligent, resilient, and scalable software products that solve real operational bottlenecks—from autonomous multi-agent workflows to high-performance full-stack web applications.</p>
              <p>I help founders turn ambitious product ideas into dependable software, while bringing the engineering discipline teams expect from someone who can contribute, communicate, and keep learning fast.</p>
            </div>
            <ul className="about-signal-list" aria-label="Professional focus"><li>End-to-end product delivery</li><li>AI systems built around real workflows</li><li>Available for select projects and engineering roles</li></ul>
            <div className="about-intro-actions"><Link className="button primary" href="/contact">START A PROJECT</Link><Link className="about-text-link" href="/projects">EXPLORE THE WORK <span aria-hidden="true">↗</span></Link></div>
          </AboutReveal>
        </div>
      </section>

      <section className="about-page-section"><div className="about-page-container">
        <AboutReveal className="about-section-heading"><p className="about-kicker font-pixel">BUILT FOR THE REAL WORLD</p><h2>Engineering Philosophy: <span className="font-pixel">How I Think</span></h2><p>Strong software is not just impressive in a demo. It stays understandable, recoverable, and useful when real users and edge cases arrive.</p></AboutReveal>
        <div className="about-principle-grid">{principles.map((item, index) => <AboutReveal className="about-principle-card" delay={index * 0.06} key={item.title}><span className="about-card-marker font-pixel">{item.marker}</span><h3>{item.title}</h3><p>{item.copy}</p></AboutReveal>)}</div>
      </div></section>

      <section className="about-page-section about-process-section"><div className="about-page-container about-process-layout">
        <AboutReveal className="about-section-heading about-section-heading-sticky"><p className="about-kicker font-pixel">FROM SCOPE TO SHIP</p><h2>How I Work: <span className="font-pixel">The Execution Process</span></h2><p>A visible, feedback-led process keeps momentum high and surprises low. Every phase should move the product closer to something people can actually use.</p></AboutReveal>
        <div className="about-process-list">{process.map((item, index) => <AboutReveal className="about-process-item" delay={index * 0.05} key={item.title}><span className="font-pixel">{item.marker}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></AboutReveal>)}</div>
      </div></section>

      <section className="about-page-section"><div className="about-page-container about-value-grid">
        <AboutReveal className="about-value-copy"><p className="about-kicker font-pixel">ONE ENGINEER, FULL CONTEXT</p><h2>Built to create value from <span className="font-pixel">day one.</span></h2><p>For a startup or client, that means fewer handoff gaps between interface, backend, data, deployment, and AI integration.</p><p>For an engineering team, it means a curious builder who asks useful questions, documents decisions, and treats maintainability as part of delivery.</p></AboutReveal>
        <AboutReveal className="about-outcomes" delay={0.08}><p className="font-pixel">WHAT YOU CAN EXPECT</p><ul><li><span>01</span>Clear communication without unnecessary technical fog.</li><li><span>02</span>Modular systems that can grow beyond the first release.</li><li><span>03</span>Practical decisions shaped by product goals, not hype.</li><li><span>04</span>Ownership across implementation, testing, and handover.</li></ul></AboutReveal>
      </div></section>

      <section className="about-page-section"><div className="about-page-container"><AboutReveal className="about-curiosity-card"><div><p className="about-kicker font-pixel">CURRENT DIRECTION</p><h2>Building Deeper in <span className="font-pixel">AI &amp; Full-Stack Systems</span></h2></div><div><p>I am continuously strengthening my work across agentic AI, LangGraph workflows, reliable backend APIs, and production-ready Next.js applications.</p><p>My direction is clear: build AI systems that do useful work, connect cleanly with real business tools, and remain dependable after deployment—not just impressive in a demo.</p><p>Every project is an opportunity to improve system design, sharpen execution, and create software that delivers measurable value for clients, startups, and engineering teams.</p></div></AboutReveal></div></section>

      <section className="about-closing-cta"><AboutReveal className="about-page-container about-closing-inner"><p className="about-kicker font-pixel">READY WHEN YOU ARE</p><h2>LET&apos;S BUILD <span className="font-pixel">SOMETHING GREAT</span></h2><p>Bring the problem, the product idea, or the role. We can turn it into a clear next step.</p><div className="about-closing-actions"><Link href="/contact" className="button primary">START A PROJECT</Link><a href="https://github.com/rehan-mehmood-tech" target="_blank" rel="noopener noreferrer" className="button primary">VIEW GITHUB ↗</a></div></AboutReveal></section>
    </main>
  );
}
