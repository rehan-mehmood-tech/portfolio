import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/services-01-utils/section";
import { StatCardEffects } from "@/components/ui/stat-card";

const header = {
  eyebrow: "Services",
  title: (
    <>
      WHAT I CAN <em className="font-pixel">BUILD</em> FOR YOU
    </>
  ),
  description: "Focused engineering services with clear scopes, production-ready delivery, and reliable handoff.",
};

const services = [
  { title: "Full-Stack MVPs", description: "Launch-ready web applications built with Next.js, TypeScript, and robust backends.", deliverables: ["Next.js", "TypeScript", "Supabase", "Vercel"], href: "/contact" },
  { title: "Custom Softwares", description: "Scalable backend architectures and custom software solutions tailored to complex business logic.", deliverables: ["System Design", "FastAPI", "Node.js", "PostgreSQL"], href: "/contact" },
  { title: "AI Agent Integration", description: "Intelligent agents equipped with tool-calling, data retrieval, and API integration.", deliverables: ["LangChain", "Groq API", "RAG Pipelines", "LLMs"], href: "/contact" },
  { title: "Multi-Agent Systems", description: "Autonomous multi-agent workflows designed to handle complex automated tasks.", deliverables: ["LangGraph", "Stateful Flows", "Agentic Orchestration"], href: "/contact" },
  { title: "AI Automations", description: "Zero-failure webhook pipelines connecting your tech stack with instant error tracking.", deliverables: ["n8n", "Webhooks", "API Workflows", "Automation"], href: "/contact" },
  { title: "App Development", description: "High-performance, responsive applications built for speed, scale, and clean UX.", deliverables: ["React.js", "Tailwind CSS", "Performance", "UI/UX"], href: "/contact" },
  { title: "Website Development", description: "Modern, conversion-focused websites engineered for lightning-fast loading and responsiveness.", deliverables: ["Responsive", "SEO Optimized", "Modern UI"], href: "/contact" },
  { title: "Got an idea of something else, let's discuss", description: "Have a unique project or bespoke engineering requirement? Let's talk about your custom scope.", deliverables: ["Custom Scope", "Strategy", "Direct Consultation"], href: "/contact" },
] as const;

export default function Services01({ id = "services" }: { id?: string }) {
  return (
    <Section id={id} className="landing-section-divider">
      <SectionHeader {...header} align="left" />
      <ol className="services-01-list">
        {services.map((service, index) => (
          <li key={service.title}>
            <Link href={service.href} className="services-01-row">
              <StatCardEffects className="service-motion-effect" />
              <span className="services-01-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.title}</h3>
              <div className="services-01-copy">
                <p>{service.description}</p>
                <ul aria-label="Deliverables">
                  {service.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                </ul>
              </div>
              <span className="services-01-arrow" aria-hidden="true"><ArrowUpRight /></span>
            </Link>
          </li>
        ))}
      </ol>
    </Section>
  );
}