import type { Metadata } from "next";
import Link from "next/link";
import { StatCardEffects } from "@/components/ui/stat-card";

export const metadata: Metadata = {
  title: "Services",
  description: "Production-ready full-stack software, AI agents, multi-agent systems and business automation built by Rehan Mehmood.",
  alternates: { canonical: "/services" },
};

const guarantees = [
  { title: "Production-Grade Source Code", description: "Clean, fully commented, and version-controlled." },
  { title: "Seamless Deployment", description: "Fully hosted and configured on cloud infrastructure (Vercel, Render, Supabase)." },
  { title: "Post-Launch Customer Support", description: "Dedicated handover support to ensure zero operational downtime." },
  { title: "Clear Documentation & Setup Guide", description: "Complete step-by-step guidelines so any developer can extend it." },
  { title: "Early Working Prototypes", description: "Interactive functional previews early in the development cycle." },
  { title: "Collaborative Decision-Making", description: "Full transparency—you approve every key architecture and trade-off choice." },
] as const;

const services = [
  { number: "01", title: "Full-Stack MVPs, SaaS apps & Products", description: "Launch-ready web applications built with Next.js, TypeScript, and robust backends.", deliverables: ["Next.js", "React.js", "TypeScript", "Node.js", "FastAPI", "Supabase", "PostgreSQL", "Firebase", "Vercel", "Render", "Docker"] },
  { number: "02", title: "Custom Softwares", description: "Scalable backend architectures and custom software solutions tailored to complex business logic.", deliverables: ["System Design", "Python", "FastAPI", "Node.js", "Express.js", "REST APIs", "PostgreSQL", "Firebase", "Docker", "Render"] },
  { number: "03", title: "AI Agent Integration", description: "Intelligent agents equipped with tool-calling, data retrieval, and API integration.", deliverables: ["LangChain", "LangGraph", "Groq API", "RAG Pipelines", "LLMs", "Tool Calling", "Vector Search", "Python", "FastAPI"] },
  { number: "04", title: "Multi-Agent Systems", description: "Autonomous multi-agent workflows designed to handle complex automated tasks.", deliverables: ["LangGraph", "LangChain", "Stateful Flows", "Agentic Orchestration", "Tool Calling", "Human-in-the-Loop", "Python", "Groq API"] },
  { number: "05", title: "AI Automations", description: "Zero-failure webhook pipelines connecting your tech stack with instant error tracking.", deliverables: ["n8n", "Webhooks", "REST APIs", "OAuth", "Retries & Queues", "Supabase", "Firebase", "Error Monitoring"] },
  { number: "06", title: "App Development", description: "High-performance, responsive applications built for speed, scale, and clean UX.", deliverables: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "REST APIs", "Firebase", "Accessibility", "Performance", "Vercel"] },
  { number: "07", title: "Website Development", description: "Modern, conversion-focused websites engineered for lightning-fast loading and responsiveness.", deliverables: ["Next.js", "React.js", "Tailwind CSS", "Responsive UI", "Technical SEO", "Core Web Vitals", "Analytics", "Vercel"] },
  { number: "08", title: "Got an idea of something else, let's discuss", description: "Have a bespoke engineering requirement? Let's engineer a custom solution tailored to your goals.", deliverables: ["Custom Scope", "Product Discovery", "System Design", "API Strategy", "AI Feasibility", "Deployment Plan", "Documentation"] },
] as const;

export default function ServicesPage() {
  return (
    <main className="services-dedicated">
      <section className="services-page-hero">
        <div className="services-page-container services-hero-grid">
          <div className="services-hero-copy">
            <p className="services-kicker font-pixel">ENGINEERING SERVICES</p>
            <h1>WHAT I <span className="font-pixel">BUILD</span> FOR YOU</h1>
            <p className="services-value-line">Tailored, production-ready software solutions built around your workflow—and engineered to scale long after launch.</p>
            <p className="services-hero-detail">From the first product decision to deployment and handover, you get one clear engineering partner across frontend, backend, automation, and AI.</p>
            <Link className="button primary" href="/contact">START A PROJECT</Link>
          </div>
          <aside className="services-hero-aside" aria-label="Delivery approach">
            <p className="font-pixel">THE OUTCOME</p>
            <strong>Useful software.<br />Clear ownership.<br />No fragile handoff.</strong>
            <span>Every engagement is scoped around the result your business or product actually needs.</span>
          </aside>
        </div>
      </section>

      <section className="services-guarantees-section">
        <div className="services-page-container">
          <header className="services-section-heading">
            <p className="services-kicker font-pixel">DELIVERY STANDARD</p>
            <h2>What You Get <span className="font-pixel">At The End</span></h2>
            <p>A finished system should be ready to use, straightforward to operate, and easy for the next developer to understand.</p>
          </header>
          <ul className="services-guarantee-grid">
            {guarantees.map((guarantee) => (
              <li key={guarantee.title}>
                <span className="services-check" aria-hidden="true">✓</span>
                <div><h3>{guarantee.title}</h3><p>{guarantee.description}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="services-catalog-section">
        <div className="services-page-container">
          <header className="services-section-heading services-catalog-heading">
            <p className="services-kicker font-pixel">CAPABILITIES</p>
            <h2>Choose the outcome. <span className="font-pixel">I&apos;ll engineer the path.</span></h2>
            <p>Each service can be delivered as a focused engagement or combined into a complete product build.</p>
          </header>
          <ol className="services-catalog">
            {services.map((service) => (
              <li className="services-catalog-card" key={service.number}>
                <StatCardEffects className="service-motion-effect" />
                <div className="services-card-topline"><span className="services-number font-pixel">{service.number}</span><span className="services-status">AVAILABLE</span></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="services-stack-block"><span className="services-stack-label font-pixel">TOOLS &amp; TECH STACK</span><ul className="services-deliverables" aria-label={service.title + " tools and technology stack"}>
                  {service.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                </ul></div>
                <Link className="button primary services-card-cta" href="/contact">WORK WITH ME <span aria-hidden="true">↗</span></Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="services-closing">
        <div className="services-page-container services-closing-inner">
          <p className="services-kicker font-pixel">HAVE A PROJECT IN MIND?</p>
          <h2>Let&apos;s turn the requirement into a <span className="font-pixel">working system.</span></h2>
          <p>Share the problem, your current workflow, and the result you want. I&apos;ll help define the clearest route to delivery.</p>
          <Link className="button primary" href="/contact">START A PROJECT</Link>
        </div>
      </section>
    </main>
  );
}
