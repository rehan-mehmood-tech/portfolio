import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type Project = {
  slug: string;
  name: string;
  type: string;
  category: string;
  summary: string;
  stack: string[];
  priority: number;
  pinned: boolean;
  published: boolean;
  featured?: boolean;
  live?: boolean;
};

const projects: Project[] = Array.from({ length: 10 }, (_, index) => ({
  slug: `project-${index + 1}`,
  name: `[Project Title Placeholder ${String(index + 1).padStart(2, "0")}]`,
  type: "[Project Type]",
  category: ["AI agents", "Automation", "Full-stack", "Backend"][index % 4],
  summary: "[Dynamic project description: problem, architecture, implementation and measurable outcome supplied by the CMS.]",
  stack: ["[Stack]", "[Framework]", "[Database]", "[Tool]"],
  priority: index + 1,
  pinned: true,
  published: true,
  featured: true,
  live: false,
}));

const services = [
  {
    slug: "custom-software-backend",
    number: "01",
    icon: "server",
    title: "Custom Enterprise Software & Web Systems",
    description: "Production-focused software architecture, backend APIs and full-stack delivery for complex operational needs.",
    stack: ["FastAPI", "Node.js", "Next.js"],
    proof: "[Linked Proof Project]",
  },
  {
    slug: "ai-agent-development",
    number: "02",
    icon: "nodes",
    title: "AI Agents & Multi-Agent Orchestrations",
    description: "Agents that call APIs, search, calculate, coordinate and hand off to a human when it matters.",
    stack: ["LangGraph", "LangChain", "Groq"],
    proof: "[Linked Proof Project]",
  },
  {
    slug: "ai-chatbot-development",
    number: "03",
    icon: "message",
    title: "Autonomous Support Chatbots & QSR Agents",
    description: "Customer-facing assistants that answer from business data, use tools and capture qualified leads.",
    stack: ["LangGraph", "FastAPI", "Groq"],
    proof: "[Linked Proof Project]",
  },
  {
    slug: "ai-automation",
    number: "04",
    icon: "bolt",
    title: "Business Process AI Automations",
    description: "n8n workflows that connect tools through APIs and webhooks, with explicit error handling.",
    stack: ["n8n", "REST", "Webhooks"],
    proof: "[Linked Proof Project]",
  },
];

const stack = [
  ["AI", "LangGraph, LangChain, Groq, tool calling, multi-agent orchestration"],
  ["Backend", "Python/FastAPI, Node.js/Express, REST APIs, JWT auth"],
  ["Data", "Firebase/Firestore, Supabase/PostgreSQL, MongoDB"],
  ["Automation", "n8n, webhooks, API integrations, error workflows"],
  ["Frontend", "Next.js, React, TypeScript, Tailwind CSS"],
  ["Tooling", "Git/GitHub, Vercel, Render, Docker (learning)"],
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    external: <><path d="M15 4h5v5" /><path d="m10 14 10-10" /><path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6" /></>,
    nodes: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h3a3 3 0 0 1 3 3v6" /></>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /><path d="M8 9h8M8 13h5" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7z" />,
    server: <><rect x="3" y="4" width="18" height="6" rx="2" /><rect x="3" y="14" width="18" height="6" rx="2" /><path d="M7 7h.01M7 17h.01" /></>,
    github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 2a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4" /><path d="M8 19c-3 .9-3-1.5-4-2" /></>,
    linkedin: <><rect x="3" y="9" width="4" height="12" /><path d="M5 3v.01M11 21V9h4v2c1-2 6-3 6 3v7M11 14c0-3 4-4 4 0v7" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    terminal: <><path d="m7 8 4 4-4 4M13 16h4" /><rect x="3" y="3" width="18" height="18" rx="2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
    folder: <><path d="M3 5h7l2 2h9v12H3z" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2-6 6-6s6 2 6 6" /><path d="M16 5a3 3 0 0 1 0 6M18 14c2 1 3 3 3 6" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.arrow}</svg>;
}

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Link({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  const external = to.startsWith("http") || to.startsWith("mailto:") || to.startsWith("https://wa.me");
  return <a href={to} className={className} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} onClick={(event) => {
    if (!external && !to.startsWith("#")) {
      event.preventDefault();
      navigate(to);
    }
  }}>{children}</a>;
}

function ButtonLink({ to, children, variant = "primary", small = false }: { to: string; children: ReactNode; variant?: "primary" | "secondary"; small?: boolean }) {
  return <Link to={to} className={`button ${variant} ${small ? "small" : ""}`}>{children}</Link>;
}

function LogoMark() {
  return <span className="logo-blocks" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

function Header({ eyebrow, title, intro, action }: { eyebrow: string; title: string; intro?: string; action?: ReactNode }) {
  return <div className="section-header reveal">
    <div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{intro && <p>{intro}</p>}</div>
    {action}
  </div>;
}

function Navbar({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);
  const links = [["Projects", "/#work"], ["Services", "/#services"], ["Certifications", "/#credentials"], ["Education", "/about"], ["Mentorship", "/#recommendations"]];
  return <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
    <div className="nav-inner">
      <div className="nav-brand-block">
        <Link to="/" className="brand nav-brand-row"><LogoMark /><span className="nav-brand-name"><span>Rehan</span><span className="pixel">Mehmood</span></span></Link>
      </div>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([label, to]) => <Link key={to} to={to} className={path.startsWith(to) && to !== "/" ? "active" : ""}>{label}</Link>)}
        <Link to="[Dynamic LinkedIn URL]" className="icon-link"><Icon name="linkedin" /><span className="sr-only">LinkedIn</span></Link>
        <Link to="[Dynamic GitHub URL]" className="icon-link"><Icon name="github" /><span className="sr-only">GitHub</span></Link>
        <ButtonLink to="/contact" small>Hire me</ButtonLink>
      </nav>
      <div className="mobile-actions"><button className="nav-menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu"><Icon name={open ? "close" : "menu"} size={24} /></button></div>
    </div>
    {open && <nav className="mobile-menu">
      {links.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)}>{label}<Icon name="arrow" /></Link>)}
      <Link to="/contact" onClick={() => setOpen(false)}>Hire me<Icon name="arrow" /></Link>
      <div className="mobile-social"><Link to="https://github.com/rehan-mehmood-tech">GitHub</Link><Link to="mailto:mehmoodrehan708@gmail.com">Email</Link><span>Lahore, PK</span></div>
    </nav>}
  </header>;
}

function Footer() {
  return <footer>
    <div className="container footer-grid">
      <div><Link to="/" className="brand"><LogoMark /><span>Rehan Mehmood</span></Link><p>AI agents, automations and the backend APIs behind them.</p><span className="muted">Lahore, Pakistan</span></div>
      <div><strong>Pages</strong><Link to="/">Home</Link><Link to="/projects">Projects</Link><Link to="/services">Services</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></div>
      <div><strong>Connect</strong><Link to="https://github.com/rehan-mehmood-tech">GitHub</Link><Link to="[ADD custom LinkedIn URL]">LinkedIn [ADD]</Link><Link to="mailto:mehmoodrehan708@gmail.com">Email</Link><Link to="https://wa.me/923288514952">WhatsApp</Link></div>
      <div><strong>Built with</strong><p className="mono">React · FastAPI · LangGraph · Firebase</p></div>
    </div>
    <div className="container footer-bottom"><span>© 2026 Rehan Mehmood</span><Link to="/privacy">Privacy</Link></div>
  </footer>;
}

function ProjectVisual({ project }: { project: Project }) {
  return <div className={`project-visual visual-${project.slug}`}>
    <div className="visual-top"><span>{project.category}</span><span>0{projects.indexOf(project) + 1}</span></div>
    <div className="visual-window">
      <div className="visual-chrome"><i /><i /><i /></div>
      <div className="visual-content">
        <span className="visual-kicker">SYSTEM / {project.type.toUpperCase()}</span>
        <strong>{project.name.split("—")[0]}</strong>
        <div className="visual-lines"><i /><i /><i /></div>
      </div>
    </div>
  </div>;
}

function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  return <article className={`project-card ${large ? "large" : ""}`}>
    <Link to={`/projects/${project.slug}`} className="card-main">
      <ProjectVisual project={project} />
      <div className="project-body">
        <div className="badges"><span className="badge type">{project.type}</span>{project.live && <span className="badge live"><i />Live</span>}</div>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <div className="badges">{project.stack.slice(0, 4).map(item => <span className="badge" key={item}>{item}</span>)}</div>
        <span className="text-link">Read case study <Icon name="arrow" size={16} /></span>
      </div>
    </Link>
  </article>;
}

function ServiceCard({ service }: { service: typeof services[number] }) {
  return <article className="service-card">
    <div className="card-top"><span className="service-icon"><Icon name={service.icon} /></span><span className="mono muted">{service.number}</span></div>
    <h3>{service.title}</h3><p>{service.description}</p>
    <div className="badges">{service.stack.map(item => <span className="badge" key={item}>{item}</span>)}</div>
    <div className="proof"><span>Proof</span><strong>{service.proof}</strong></div>
    <Link to={`/services/${service.slug}`} className="text-link">Learn more <Icon name="arrow" size={16} /></Link>
  </article>;
}

function ImmersiveSectionHeader({ index, label, before, pixel, after = "", intro }: { index: string; label: string; before: string; pixel: string; after?: string; intro?: string }) {
  return <div className="immersive-header">
    <span className="pixel">{index} // {label}</span>
    <h2>{before} <em className="pixel">{pixel}</em>{after}</h2>
    {intro && <p>{intro}</p>}
  </div>;
}

function Home({ openAssistant }: { openAssistant: () => void }) {
  const trajectory = [
    ["01 · What I do", ["AI agents & multi-agent workflows — LangGraph, LangChain, Groq", "Backend APIs — FastAPI, Node.js/Express, JWT auth", "Workflow automation — n8n with webhooks & error workflows", "Full-stack delivery — Next.js, React, TypeScript"]],
    ["02 · What I've built", ["[Dynamic Featured Project]", "[Dynamic Full-Stack Project]", "[Dynamic Agent Project]", "[Dynamic Automation Project]", "All projects →"]],
    ["03 · What I'm doing now", ["[Current Education Feed Item]", "[Current Training Feed Item]", "[Current Research / Build Focus]", "[Current Availability Status]"]],
    ["04 · What's next", ["Ship a production RAG service with evaluation", "Launch a small SaaS product of my own", "Grow into larger multi-agent systems work"]],
  ];
  const work = projects.filter(project => project.pinned && project.published).sort((a, b) => a.priority - b.priority).slice(0, 10);
  const experience = [
    ["[Date Range]", "[Work History Role Placeholder]", "[Organization · Location]", "[TYPE]", "[Dynamic responsibilities and verified outcomes supplied by the CMS.]"],
    ["[Date Range]", "[Work History Role Placeholder]", "[Organization · Location]", "[TYPE]", "[Dynamic responsibilities and verified outcomes supplied by the CMS.]"],
    ["[Date Range]", "[Work History Role Placeholder]", "[Organization · Location]", "[TYPE]", "[Dynamic responsibilities and verified outcomes supplied by the CMS.]"],
  ];
  const credentials = [
    ...Array.from({ length: 6 }, (_, index) => [`[Issuing Authority ${index + 1}]`, `[Certificate Title Placeholder ${index + 1}]`, "[Issue Date]"]),
  ];
  return <main className="immersive-home">
    <section className="hero-editorial" id="top">
      <div className="hero-profile-anchor"><img src="/images/rehan-mehmood-portrait.png" alt="Rehan Mehmood in a formal suit" width="1254" height="1254" fetchPriority="high" /><div className="profile-live-status"><i />[Dynamic Availability Status]</div></div>
      <div className="hero-overlay hero-overlay-bottom" /><div className="hero-overlay hero-overlay-top" />
      <div className="hero-inner">
        <div className="hero-meta-grid">
          <div className="hero-meta name-meta"><span className="meta-name">Rehan</span><span className="pixel meta-name-pixel">Mehmood</span><span className="meta-asterisk">*</span><p className="pixel meta-blurb">AI &amp; Full-Stack Engineer | Agentic AI, Backend Systems &amp; AI Automations | Python · Lang-Graph · Fast-API · Node.js · Next.js · n8n | CS @ UMT ’28 | Constantly Exploring Emerging Technologies &amp; Tools</p></div>
          <div className="hero-meta title-meta"></div>
          <div className="hero-meta statement-meta"><span className="pixel meta-label">What I do</span><p>I build AI agents, workflow automations and the backend APIs behind them — built to fail loudly and recover.</p></div>
          <div className="hero-meta services-meta"><span className="pixel meta-label">Stack</span><p>LangGraph · LangChain · Groq · Python · FastAPI · Node.js · Express · Next.js · React · TypeScript · Firebase · Supabase · n8n · Docker (learning)</p></div>
        </div>
        <div className="hero-editorial-spacer" />
        <div className="hero-bottom">
          <div className="hero-headline"><span>I build AI</span><span><em className="pixel">Agents</em><b> that</b></span><span>Act — not</span><span className="pixel">Just chat</span></div>
          <div className="hero-actions">
            <button className="glass-cta" onClick={openAssistant}><Icon name="terminal" size={14} /><span>&gt;_ Talk to my AI agent</span></button>
            <div className="credential-chips"><Link to="#credentials"><strong>[Issuer]</strong><span>[Count]</span></Link><Link to="#credentials"><strong>[Credential]</strong><span>[Type]</span></Link><Link to="#credentials"><strong>[Program]</strong><span>[Status]</span></Link></div>
          </div>
        </div>
        <div className="hero-footer-strip"><p>[Dynamic availability status] <Link to="/contact">Schedule a call</Link></p><p>[Project Count] projects <span>•</span> [Certificate Count] certifications <span>•</span> [Experience Count] roles</p></div>
      </div>
    </section>

    <div className="signal-ticker"><div className="ticker-track"><span>5-AGENT LANGGRAPH CAPSTONE</span><i>◆</i><span>DEFENDED TO AN INDUSTRY PANEL</span><i>◆</i><span>N8N ACADEMY ×4</span><i>◆</i><span>LOOP-LEARN HACKATHON '26</span><i>◆</i><span>FASTAPI + NODE.JS BACKENDS</span><i>◆</i><span>FIRESTORE · SUPABASE</span><i>◆</i><span>OPEN TO INTERNSHIPS & FREELANCE</span><i>◆</i><span>5-AGENT LANGGRAPH CAPSTONE</span><i>◆</i></div></div>

    <section className="immersive-section" id="about"><div className="wide-container"><ImmersiveSectionHeader index="01" label="About" before="Engineer first," pixel="student" after=" honestly" intro="I build agents that call real tools and the backend systems those agents depend on. The trajectory is honest: what is done, what is active, and what comes next." />
      <div className="trajectory"><div className="trajectory-rail" />{trajectory.map(([title, items], index) => <article className={`trajectory-card ${index === 2 ? "doing" : index === 3 ? "next" : "done"}`} key={title as string}><span className="trajectory-node" /><span className="pixel trajectory-label">{index === 3 ? "Goals" : index === 2 ? "Doing" : "Done"}</span><h3>{title as string}</h3><ul>{(items as string[]).map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
    </div></section>

    <section className="immersive-section work-section" id="work"><div className="wide-container"><ImmersiveSectionHeader index="Pinned_projects [Top 10]" label="CMS feed" before="Priority" pixel="work" intro="[The ten highest-priority published projects are ordered dynamically by the Admin Panel.]" />
      <div className="work-progress"><span className="pixel">Scroll to inspect</span><i /></div>
      <div className="work-deck">{work.map((project, index) => <article className="work-panel" key={project.slug}>
        <div className="work-panel-copy"><div className="work-index pixel">{String(index + 1).padStart(2, "0")} / 10 · Priority {project.priority}</div><div className="badges"><span className="badge type">{project.type}</span>{project.live && <span className="badge live"><i />Live</span>}</div><h3>{project.name}</h3><p>{project.summary}</p><span className="pixel architecture-label">Architecture</span><div className="mini-flow"><span>[Interface]</span><i /><span>[API]</span><i /><span>[System]</span></div><div className="badges">{project.stack.map(item => <span className="badge" key={item}>{item}</span>)}</div><div className="work-actions"><Link to="[Dynamic Live Demo URL]" className="button primary small">Live demo</Link><Link to="https://github.com/[dynamic-repository]" className="button secondary small">GitHub repository</Link><Link to={`/projects/${project.slug}`} className="text-link">Case study <Icon name="arrow" size={16} /></Link></div></div>
        <ProjectVisual project={project} />
      </article>)}</div>
      <div className="compact-project-list"><div><span>[Dynamic Feed Project]</span><small>[Type · Stack · Links]</small></div><div><span>[Dynamic Feed Project]</span><small>[Type · Stack · Links]</small></div><div><span>[Dynamic Feed Project]</span><small>[Type · Stack · Links]</small></div><Link to="/projects">View all projects <Icon name="arrow" size={16} /></Link></div>
      <div className="archive-banner"><div><span className="pixel">Project archive</span><h3>Want to explore more experimental builds &amp; archives?</h3></div><Link to="https://github.com/[dynamic-profile]" className="button secondary">See all my work on GitHub <Icon name="arrow" size={16} /></Link></div>
    </div></section>

    <section className="immersive-section" id="services"><div className="wide-container"><ImmersiveSectionHeader index="03" label="Services" before="What I can" pixel="build" after=" for you" intro="Scoped systems with working proof, visible failure states and a documented handoff." />
      <div className="service-rows">{services.map(service => <Link to={`/services/${service.slug}`} className="service-row" key={service.slug}><span className="pixel">{service.number}</span><div><h3>{service.title}</h3><small>Proof: {service.proof}</small></div><p>{service.description}</p><div className="badges">{service.stack.slice(0, 3).map(item => <span className="badge" key={item}>{item}</span>)}</div><Icon name="arrow" /></Link>)}<Link to="/contact?service=other" className="service-row"><span className="pixel">05</span><div><h3>Have a custom scope?</h3><small>Start with the bottleneck</small></div><p>Tell me what's slowing your team down. I'll tell you honestly whether I can build it.</p><div /><Icon name="arrow" /></Link></div>
      <div className="immersive-process">{["Scope call", "Working version early", "Iterate", "Documented handoff"].map((item, index) => <div key={item}><span className="pixel">0{index + 1}</span><strong>{item}</strong></div>)}</div>
    </div></section>

    <section className="immersive-section raised" id="experience"><div className="wide-container"><ImmersiveSectionHeader index="04" label="Experience" before="Where I've" pixel="worked" />
      <div className="experience-timeline">{experience.map(([date, role, org, type, detail], index) => <details className="experience-row" key={role} open={index === 0}><summary><span className="pixel">{date}</span><div><h3>{role}</h3><p>{org}</p></div><span className="badge type">{type}</span><i>+</i></summary><div className="experience-detail"><p>{detail}</p></div></details>)}</div>
    </div></section>

    <section className="immersive-section" id="credentials"><div className="wide-container"><ImmersiveSectionHeader index="05" label="Credentials" before="Proof," pixel="verified" />
      <div className="credentials-immersive"><div><div className="credential-grid">{credentials.map(([issuer, name, date], index) => <article className="credential-card" key={name}><div className="certificate-thumbnail-slot"><span className="pixel">[Certificate Thumbnail Slot]</span></div><span className="pixel">Priority {index + 1} · {issuer}</span><h3>{name}</h3><small className="pixel">{date}</small><button className="text-link">Verify credential ↗</button></article>)}</div><Link to="[Dynamic Credentials Archive URL]" className="credentials-archive-link">View all verified credentials on LinkedIn / GitHub <Icon name="arrow" size={16} /></Link></div>
        <aside className="education-stack"><span className="pixel">Education</span><div><i /><h3>[Degree / Program Placeholder]</h3><p>[University Name Placeholder]</p><small>[Date Range]</small></div><div className="active"><i /><h3>[Training Program Placeholder]</h3><p>[Incubator / Institute Name Placeholder]</p><small>[Date Range · Status]</small></div></aside>
      </div>
    </div></section>

    <section className="immersive-section words-section" id="recommendations"><div className="wide-container"><ImmersiveSectionHeader index="06" label="Mentorship" before="Verified" pixel="vouches" /><blockquote>“[Verified recommendation content supplied dynamically by the CMS.]”</blockquote><div className="quote-byline"><strong>[Mentor / Peer Name]</strong><span>[Designation · Relationship]</span><span>LinkedIn vouch ↗</span></div></div></section>

    <section className="immersive-final"><div className="wide-container"><span className="pixel final-label">07 // Let's build</span><h2>Let's build<br /><em className="pixel">something</em><br />great.</h2><div className="final-actions"><ButtonLink to="/contact">Start a project <Icon name="arrow" /></ButtonLink><button className="glass-cta" onClick={openAssistant}><Icon name="terminal" size={14} />&gt;_ Ask my agent</button></div><p className="pixel">[Dynamic Contact Email] · [Response Time]</p></div></section>
  </main>;
}

function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <section className="page-hero container"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{intro}</p></section>;
}

function ProjectsPage() {
  const params = new URLSearchParams(window.location.search);
  const [filter, setFilter] = useState(params.get("type") || "All");
  const filters = ["All", "AI agents", "Automation", "Full-stack", "Backend"];
  const visible = filter === "All" ? projects : projects.filter(project => project.category === filter || (filter === "Backend" && project.stack.some(item => ["FastAPI", "Node.js"].includes(item))));
  return <main><PageHero eyebrow="CMS feed" title="Projects" intro="[Dynamic portfolio introduction and published project feed supplied by the Admin Panel.]" />
    <section className="container page-content"><div className="filters">{filters.map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="project-grid">{visible.map(project => <ProjectCard key={project.slug} project={project} />)}</div>
    </section>
  </main>;
}

function ProjectDetail({ project }: { project: Project }) {
  return <main>
    <section className="case-hero container"><div className="breadcrumb"><Link to="/projects">Projects</Link><span>/</span><span>{project.name}</span></div>
      <div className="badges"><span className="badge type">{project.type}</span>{project.live && <span className="badge live"><i />Live</span>}</div>
      <h1>{project.name}</h1><p>{project.summary}</p><ProjectVisual project={project} />
    </section>
    <section className="container case-layout">
      <article className="case-body">
        <CaseSection number="01" title="The problem"><p>[Dynamic problem statement from the project CMS.]</p></CaseSection>
        <CaseSection number="02" title="What I built"><p>[Dynamic implementation summary from the project CMS.]</p><div className="feature-list"><span>[Capability]</span><span>[Capability]</span><span>[Capability]</span><span>[Capability]</span></div></CaseSection>
        <CaseSection number="03" title="Architecture"><div className="architecture"><div>[Client]</div><Icon name="arrow" /><div>[API]</div><Icon name="arrow" /><div>[Core System]</div><div className="agent-row"><span>[Service]</span><span>[Tool]</span><span>[Data]</span></div></div><p className="caption">[Dynamic architecture description.]</p></CaseSection>
        <CaseSection number="04" title="Key engineering decisions"><ul><li>[Engineering decision and rationale.]</li><li>[Engineering decision and rationale.]</li><li>[Engineering decision and rationale.]</li></ul></CaseSection>
        <CaseSection number="05" title="Outcome"><p>[Verified project outcome or demonstration statement.]</p></CaseSection>
        <CaseSection number="06" title="Limitations & next steps"><p>[Honest limitations and planned improvements.]</p></CaseSection>
      </article>
      <aside className="case-aside"><Eyebrow>At a glance</Eyebrow><div><span>Built for</span><strong>[Project Context]</strong></div><div><span>Role</span><strong>[Dynamic Role]</strong></div><div><span>Stack</span><div className="badges">{project.stack.map(item => <span className="badge" key={item}>{item}</span>)}</div></div><ButtonLink to="/contact?service=ai-agent-development">Build something similar</ButtonLink><ButtonLink to="[Dynamic Repository URL]" variant="secondary">View code <Icon name="external" size={16} /></ButtonLink></aside>
    </section>
    <section className="next-project container"><Eyebrow>Next project</Eyebrow><Link to={`/projects/${projects[(projects.indexOf(project) + 1) % projects.length].slug}`}><h2>{projects[(projects.indexOf(project) + 1) % projects.length].name}</h2><Icon name="arrow" /></Link></section>
  </main>;
}

function CaseSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <section className="case-section"><span className="case-number">{number}</span><h2>{title}</h2>{children}</section>;
}

function ServicesPage() {
  return <main><PageHero eyebrow="Services" title="Systems that do real work" intro="I design and build scoped AI, automation and backend systems for small teams. Every service is tied to working proof, a clear process and an honest handoff." />
    <section className="container page-content"><div className="services-grid">{services.map(service => <ServiceCard key={service.slug} service={service} />)}<article className="service-card custom"><span className="service-icon">+</span><h3>Have a custom scope?</h3><p>Tell me what is slowing your team down. I'll tell you honestly whether I can build it.</p><ButtonLink to="/contact?service=other" variant="secondary">Let's talk</ButtonLink></article></div></section>
    <CTA />
  </main>;
}

function ServiceDetail({ service }: { service: typeof services[number] }) {
  const proof = projects.find(project => project.name.includes(service.proof.split(" ")[0])) || projects[0];
  return <main>
    <section className="service-detail-hero container"><div><div className="breadcrumb"><Link to="/services">Services</Link><span>/</span><span>{service.title}</span></div><Eyebrow>Service {service.number}</Eyebrow><h1>{service.title}</h1><p>{service.description} Built for teams that need a working version, clear boundaries and a documented handoff.</p><ButtonLink to={`/contact?service=${service.slug}`}>Start a project <Icon name="arrow" /></ButtonLink></div><div className="service-schematic"><Icon name={service.icon} size={32} /><span>INPUT</span><i /><span>{service.title.toUpperCase()}</span><i /><span>WORKING OUTPUT</span></div></section>
    <section className="container service-detail-grid">
      <div><Header eyebrow="Problems this solves" title="Where this creates leverage" /><div className="problem-list">{["Repetitive work is taking time away from higher-value decisions.", "Important information lives across disconnected tools and manual handoffs.", "A prototype exists, but it needs a reliable API and a usable interface."].map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div></div>
      <div><Header eyebrow="Deliverables" title="What you get" /><ul className="deliverables"><li>Written scope and system boundaries</li><li>Working application or automation</li><li>Error and fallback handling</li><li>Source code and setup notes</li><li>Recorded handoff walkthrough</li></ul></div>
    </section>
    <section className="section process-section"><div className="container"><Header eyebrow="Process" title="From problem to working handoff" /><div className="process-grid">{["Scope the workflow", "Build the smallest version", "Test against real use", "Document and hand off"].map((item, index) => <div className="process-step" key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{["Define users, inputs and success.", "Make the core path work first.", "Refine around feedback and failures.", "Leave the system maintainable."][index]}</p></div>)}</div></div></section>
    <section className="section container"><Header eyebrow="Proof" title="See the system behind the claim" /><div className="proof-single"><ProjectCard project={proof} large /></div></section>
    <section className="section container faq-layout"><Header eyebrow="Questions" title="Before we start" /><div className="faq-list"><details open><summary>How long does a scoped build take?</summary><p>Most small systems start with a working version in days, then move through a focused iteration period. The written scope confirms timing before work begins.</p></details><details><summary>What do you need from my team?</summary><p>One decision-maker, access to the relevant tools or test data, and timely feedback on the working build.</p></details><details><summary>What is not included?</summary><p>Unlimited revisions, undocumented third-party access, or claims about scale before the system has been tested at that scale.</p></details></div></section>
    <CTA />
  </main>;
}

function CTA() {
  return <section className="final-cta"><div className="container"><Eyebrow>Start with the problem</Eyebrow><h2>Tell me what your team does manually today.</h2><div className="button-row"><ButtonLink to="/contact">Start a project <Icon name="arrow" /></ButtonLink><ButtonLink to="/projects" variant="secondary">View proof</ButtonLink></div></div></section>;
}

function AboutPage() {
  return <main><PageHero eyebrow="About" title="About Rehan Mehmood" intro="Rehan Mehmood is an AI + Full-Stack Engineer in Lahore, Pakistan. He builds AI agents, workflow automations and the backend APIs behind them using LangGraph, FastAPI, Node.js and Next.js." />
    <section className="container about-page-grid"><div className="profile-placeholder large"><span className="mono">PROFILE / 4:5</span><div className="profile-monogram">[PHOTO]</div><p>[Professional Profile Media Slot]</p></div><div><h2>[Engineering Philosophy Headline]</h2><p>[Dynamic professional biography focused on production systems, architecture, and measurable outcomes.]</p><p>[Dynamic working principles, delivery approach, and current availability supplied by the CMS.]</p><div className="button-row"><ButtonLink to="/contact">Work with me</ButtonLink><ButtonLink to="[Dynamic CV URL]" variant="secondary">Download CV</ButtonLink></div></div></section>
    <section className="section container"><Header eyebrow="Technical range" title="The stack behind the work" /><div className="stack-table large">{stack.map(([label, value]) => <div key={label}><span>{label}</span><p>{value}</p></div>)}</div></section>
    <section className="section credentials-band"><div className="container"><Header eyebrow="Timeline" title="Experience & education" /><div className="experience-list">{[
      ["[DATE RANGE]", "[Education / Training Placeholder]", "[Institution Placeholder]", "[Dynamic program note]"],
      ["[DATE RANGE]", "[Work History Role Placeholder]", "[Organization Placeholder]", "[Dynamic verified outcome]"],
      ["[DATE RANGE]", "[Degree Placeholder]", "[University Name Placeholder]", "[Dynamic education note]"],
    ].map(([date, role, place, note]) => <article key={role}><span className="mono">{date}</span><div><h3>{role}</h3><strong>{place}</strong><p>{note}</p></div></article>)}</div></div></section>
    <section className="section container faq-layout"><Header eyebrow="Quick answers" title="A few useful facts" /><div className="faq-list"><details open><summary>Where is Rehan based?</summary><p>Lahore, Punjab, Pakistan. Open to remote roles and scoped freelance work.</p></details><details><summary>What does he build?</summary><p>AI agents, workflow automations, backend APIs and full-stack applications.</p></details><details><summary>Is Rehan available?</summary><p>Yes — for AI, backend and full-stack internships, junior roles and scoped freelance projects.</p></details></div></section><CTA /></main>;
}

function ContactPage() {
  const [type, setType] = useState("Client / founder");
  const [submitted, setSubmitted] = useState("");
  const [details, setDetails] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted(String(data.get("name") || "there"));
  };
  return <main><section className="contact-page container">
    <div className="contact-copy"><Eyebrow>Contact</Eyebrow><h1>Start a project</h1><p>Tell me what you are building, where the current process gets stuck and what a useful outcome would look like. I reply within 24 hours.</p>
      <div className="direct-links"><Link to="mailto:mehmoodrehan708@gmail.com"><Icon name="mail" /><span><small>Email</small>mehmoodrehan708@gmail.com</span></Link><Link to="https://wa.me/923288514952"><Icon name="message" /><span><small>WhatsApp</small>+92 328 8514952</span></Link><span className="disabled-link"><Icon name="arrow" /><span><small>Book a call</small>[ADD Cal.com link]</span></span></div>
      <div className="contact-faq"><h3>What happens next?</h3>{["I review the context you send.", "I reply with questions or a short call link.", "You get a written scope before work starts."].map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div>
    </div>
    <div className="form-card">
      {submitted ? <div className="success-state"><span className="success-icon"><Icon name="check" size={32} /></span><Eyebrow>Message received</Eyebrow><h2>Thanks, {submitted}.</h2><p>I've got your message and reply within 24 hours.</p><div className="button-row"><ButtonLink to="/projects">Back to projects</ButtonLink><ButtonLink to="[ADD Cal.com link]" variant="secondary">Book a call [ADD]</ButtonLink></div></div> :
      <form onSubmit={submit}>
        <div className="form-heading"><div><h2>Tell me about the work</h2><p>Required fields are marked with an asterisk.</p></div><span className="mono">01 / 01</span></div>
        <div className="field-row"><label><span>Name *</span><input name="name" required minLength={2} placeholder="Your name" /></label><label><span>Email *</span><input name="email" type="email" required placeholder="you@company.com" /></label></div>
        <fieldset><legend>I'm a… *</legend><div className="segments">{["Client / founder", "Recruiter / hiring"].map(item => <button type="button" key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{item}</button>)}</div></fieldset>
        {type === "Client / founder" && <div className="field-row"><label><span>Service *</span><select required defaultValue=""><option value="" disabled>Select a service</option>{services.map(service => <option key={service.slug}>{service.title}</option>)}<option>Other</option></select></label><label><span>Budget range</span><select defaultValue=""><option value="">Not sure yet</option><option>Under $250</option><option>$250–$1,000</option><option>$1,000–$3,000</option><option>$3,000+</option></select></label></div>}
        <label><span>{type === "Client / founder" ? "Project details" : "Role details"} *</span><textarea required minLength={20} maxLength={3000} value={details} onChange={event => setDetails(event.target.value)} placeholder="What are you trying to solve, and what exists today?" /><small>{details.length} / 3,000</small></label>
        <label className="consent"><input type="checkbox" required /><span>I agree that my details can be stored so Rehan can reply.</span></label>
        <button className="button primary submit" type="submit">Send project details <Icon name="arrow" /></button>
      </form>}
    </div>
  </section></main>;
}

type TerminalLine = { kind: "system" | "user" | "agent"; text: string };

function Terminal({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const [maximized, setMaximized] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([
    { kind: "system", text: "Rehan AI Agent [Version 1.0.0]" },
    { kind: "system", text: "(c) 2026 Rehan Mehmood. AI assistant — answers can be imperfect." },
    { kind: "system", text: "Type 'help' for commands. Conversations are saved for follow-up." },
  ]);
  const [value, setValue] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  useEffect(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight }), [lines]);
  const run = (command: string) => {
    const input = command.trim();
    if (!input) return;
    if (input.toLowerCase() === "exit") { setOpen(false); return; }
    if (input.toLowerCase() === "clear") { setLines([]); setValue(""); return; }
    const responses: Record<string, string> = {
      help: "Commands: services · projects · hire · contact · clear · exit",
      services: "I build AI agents, support chatbots, n8n automations and custom backend systems. Open /services for proof and scope.",
      projects: "Featured work is loaded dynamically from the project CMS. Open /projects to explore the current published feed.",
      hire: "Great. Tell me what your team does manually today, what tools are involved, and your ideal timeline. Or use /contact for the full brief.",
      contact: "Email: mehmoodrehan708@gmail.com · WhatsApp: +92 328 8514952 · Form: /contact",
    };
    const response = responses[input.toLowerCase()] || "Thanks — I can help qualify the problem. What are you trying to automate or build, who uses it, and what happens today?";
    setLines(current => [...current, { kind: "user", text: input }, { kind: "agent", text: response }]);
    setValue("");
  };
  if (!open) return <button className="terminal-launcher" onClick={() => setOpen(true)}><span>&gt;_ ask rehan's agent</span><i>▍</i></button>;
  return <div className={`terminal-window ${maximized ? "maximized" : ""}`} role="dialog" aria-label="Rehan's AI assistant">
    <div className="terminal-title"><span><Icon name="terminal" size={15} /> Command Prompt — Rehan AI Agent v1.0</span><div><button onClick={() => setOpen(false)} aria-label="Minimize">—</button><button onClick={() => setMaximized(!maximized)} aria-label="Maximize">□</button><button onClick={() => setOpen(false)} aria-label="Close"><Icon name="close" size={14} /></button></div></div>
    <div className="terminal-output" ref={outputRef} aria-live="polite">{lines.map((line, index) => <p key={`${line.text}-${index}`} className={line.kind}>{line.kind === "user" && <strong>C:\Users\guest&gt; </strong>}{line.kind === "agent" && <strong>rehan-ai&gt; </strong>}{line.text}</p>)}</div>
    <div className="command-chips">{["help", "services", "projects", "hire", "contact"].map(command => <button key={command} onClick={() => run(command)}>{command}</button>)}</div>
    <form className="terminal-input" onSubmit={event => { event.preventDefault(); run(value); }}><label htmlFor="terminal-command">C:\Users\guest&gt;</label><input id="terminal-command" autoFocus value={value} onChange={event => setValue(event.target.value)} maxLength={1000} autoComplete="off" /><span>▍</span></form>
  </div>;
}

function LoginPage() {
  const [error, setError] = useState(false);
  return <main className="auth-page"><div className="auth-card"><Link to="/" className="brand"><span className="brand-mark">R</span><span>Rehan Mehmood</span></Link><div><Eyebrow>Private workspace</Eyebrow><h1>Admin sign in</h1><p>Manage projects, credentials and leads from one place.</p></div><button className="button secondary full" onClick={() => setError(true)}>Continue with Google</button><div className="or"><span />or<span /></div><label><span>Email</span><input type="email" placeholder="admin@example.com" /></label><label><span>Password</span><input type="password" placeholder="••••••••" /></label>{error && <div className="error-banner">Not authorized. This workspace is limited to the site owner.</div>}<button className="button primary full" onClick={() => navigate("/admin")}>Sign in</button><Link to="/" className="back-link">← Back to portfolio</Link></div></main>;
}

const adminNav = [["chart", "Dashboard", "/admin"], ["users", "Leads inbox", "/admin/leads"], ["folder", "Projects CRUD", "/admin/projects"], ["check", "Certifications CRUD", "/admin/certifications"], ["users", "Settings", "/admin/profile"]];

function AdminShell({ path, children, title, action }: { path: string; children: ReactNode; title: string; action?: string }) {
  const pinnedCount = projects.filter(project => project.pinned && project.published).length;
  return <main className="admin-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark">R</span><span>RM / Admin</span></Link><nav>{adminNav.map(([icon, label, to]) => <Link key={to} to={to} className={path === to ? "active" : ""}><Icon name={icon} />{label}</Link>)}</nav><div className="admin-user"><span>RM</span><div><strong>Rehan Mehmood</strong><small>Administrator</small></div></div><button className="admin-logout">Log out</button></aside><div className="admin-main"><header><div><Eyebrow>Portfolio CMS</Eyebrow><h1>{title}</h1></div><div className="admin-header-actions"><span className="pinned-count pixel">{pinnedCount} / 10 pinned</span><Link to="/" className="button secondary small">Quick view portfolio</Link>{action && <button className="button primary">{action}</button>}</div></header>{children}</div></main>;
}

const leads = [
  ["[Date / Time]", "[Lead Name]", "[Contact Info]", "[Lead Type]", "[Channel Source]", "[Selected Service]", "New"],
  ["[Date / Time]", "[Lead Name]", "[Contact Info]", "[Lead Type]", "[Channel Source]", "[Selected Service]", "Contacted"],
  ["[Date / Time]", "[Lead Name]", "[Contact Info]", "[Lead Type]", "[Channel Source]", "[Selected Service]", "Converted"],
];

function AdminPage({ path }: { path: string }) {
  if (path === "/admin/leads") return <AdminShell path={path} title="Leads inbox"><div className="admin-toolbar"><input placeholder="Search name or email…" /><select><option>All statuses</option><option>New</option><option>Contacted</option><option>Converted</option></select><select><option>All sources</option><option>Form</option><option>AI assistant</option></select></div><div className="leads-layout"><div className="admin-table"><table><thead><tr><th>Date / time</th><th>Lead</th><th>Type</th><th>Source</th><th>Service</th><th>Status</th></tr></thead><tbody>{leads.map((row, index) => <tr key={index}><td>{row[0]}</td><td><strong>{row[1]}</strong><small>{row[2]}</small></td><td>{row[3]}</td><td>{row[4]}</td><td>{row[5]}</td><td><span className={`status status-${row[6].toLowerCase()}`}>{row[6]}</span></td></tr>)}</tbody></table></div><aside className="lead-drawer"><Eyebrow>Lead details</Eyebrow><h3>[Selected Lead Name]</h3><p>[Complete project brief or chatbot transcript appears here dynamically.]</p><div className="badges"><span className="badge">[Source]</span><span className="badge">[Service]</span></div><ButtonLink to="mailto:[dynamic-lead-email]">Reply by email</ButtonLink><button className="button secondary">Mark as read</button></aside></div></AdminShell>;
  if (path === "/admin/projects") return <AdminShell path={path} title="Projects" action="+ Add new project"><div className="editor-layout"><div className="admin-list">{projects.map(project => <div className="admin-list-row" key={project.slug}><span className="drag">⠿</span><div className="list-thumb">{String(project.priority).padStart(2, "0")}</div><div><strong>{project.name}</strong><small>{project.type} · [Dynamic update date]</small></div><span className="status status-contacted">Rank {project.priority}</span><span className="status status-won">{project.published ? "Published" : "Draft"}</span><label className="toggle" title="Pinned to featured"><input type="checkbox" defaultChecked={project.pinned} /><i /></label><button className="icon-button">•••</button></div>)}</div><div className="editor-card"><h3>Project editor</h3><label><span>Project title</span><input placeholder="[Project Title Placeholder]" /></label><label><span>Tech stack</span><input placeholder="Add stack tags…" /></label><label><span>Priority level</span><select defaultValue="archive"><option value="archive">Archive</option>{Array.from({ length: 10 }, (_, index) => <option value={index + 1} key={index + 1}>Rank {index + 1}</option>)}</select></label><label><span>Thumbnail / cover</span><div className="upload-zone"><p>[Project Media Upload Slot]</p><button className="button secondary small">Upload media</button></div></label><label><span>Detailed description · Markdown</span><textarea placeholder="[Dynamic project description]" /></label><div className="field-row"><label><span>Live demo URL</span><input placeholder="https://…" /></label><label><span>Repository URL</span><input placeholder="https://…" /></label></div><label className="consent"><input type="checkbox" /><span>Pinned to featured Top 10</span></label><label className="consent"><input type="checkbox" /><span>Publish on portfolio</span></label><button className="button primary">Save project</button></div></div></AdminShell>;
  if (path === "/admin/certifications") return <AdminShell path={path} title="Certifications" action="+ Add new certificate"><div className="editor-layout"><div className="admin-card-grid">{Array.from({ length: 4 }, (_, index) => <article className="admin-content-card" key={index}><div className="cert-visual"><span>0{index + 1}</span><Icon name="check" /></div><span className="status status-contacted">Priority {index + 1}</span><h3>[Certificate Title Placeholder]</h3><p>[Issuing Organization]</p><div><span className="status status-won">Published</span><button className="text-link">Edit</button></div></article>)}</div><div className="editor-card"><h3>Certificate editor</h3><label><span>Certificate title</span><input placeholder="[Certificate Title Placeholder]" /></label><label><span>Issuing organization</span><input placeholder="[Issuing Authority]" /></label><label><span>Priority rank</span><select defaultValue="archive"><option value="archive">Archive</option>{Array.from({ length: 10 }, (_, index) => <option value={index + 1} key={index + 1}>Rank {index + 1}</option>)}</select></label><label><span>Image / PDF</span><div className="upload-zone"><p>[Certificate Thumbnail Slot]</p><button className="button secondary small">Upload file</button></div></label><label><span>Verification URL</span><input placeholder="https://…" /></label><label className="consent"><input type="checkbox" /><span>Pinned credential</span></label><button className="button primary">Save certificate</button></div></div></AdminShell>;
  if (path === "/admin/services") return <AdminShell path={path} title="Services" action="Add service"><div className="admin-list">{services.map(service => <div className="admin-list-row" key={service.slug}><span className="service-icon"><Icon name={service.icon} /></span><div><strong>{service.title}</strong><small>{service.proof}</small></div><span className="status status-won">Page enabled</span><label className="toggle"><input type="checkbox" defaultChecked /><i /></label><button className="icon-button">•••</button></div>)}</div></AdminShell>;
  if (path === "/admin/profile") return <AdminShell path={path} title="Profile"><div className="editor-layout"><div className="editor-card"><h3>Public identity</h3><div className="field-row"><label><span>Name</span><input defaultValue="Rehan Mehmood" /></label><label><span>Title</span><input defaultValue="AI + Full-Stack Engineer" /></label></div><label><span>Location</span><input defaultValue="Lahore, Punjab, Pakistan" /></label><label><span>Availability</span><textarea defaultValue="Open to AI, backend and full-stack internships and junior roles, and scoped freelance projects." /></label><button className="button primary">Save changes</button></div><div className="editor-card"><h3>Profile photo</h3><div className="upload-zone"><div className="profile-monogram">RM</div><p>[ADD high-resolution professional photo]</p><button className="button secondary small">Upload image</button></div></div></div></AdminShell>;
  return <AdminShell path={path} title="Dashboard"><div className="metric-grid"><article><span>New leads · 7 days</span><strong>[—]</strong><small>Dynamic form + assistant total</small></article><article><span>Pinned projects</span><strong>{projects.filter(project => project.pinned && project.published).length}</strong><small>Top 10 priority feed</small></article><article><span>Lead sources</span><strong>[—]</strong><small>Form and AI assistant</small></article></div><div className="dashboard-grid"><div className="admin-panel"><div className="panel-heading"><h3>Latest leads</h3><Link to="/admin/leads">View all</Link></div>{leads.slice(0, 3).map((row, index) => <div className="lead-row" key={index}><span>LD</span><div><strong>{row[1]}</strong><small>{row[5]} · {row[4]}</small></div><span className={`status status-${row[6].toLowerCase()}`}>{row[6]}</span></div>)}</div><div className="admin-panel"><div className="panel-heading"><h3>Content health</h3><span className="status status-contacted">Dynamic audit</span></div>{[["Profile media", "[CMS status]"], ["CV document", "[CMS status]"], ["Social URLs", "[CMS status]"], ["Pinned projects", `${projects.filter(project => project.pinned && project.published).length} / 10`]].map(([label, status]) => <div className="health-row" key={label}><span>{label}</span><strong>{status}</strong></div>)}</div></div></AdminShell>;
}

function PrivacyPage() {
  return <main><PageHero eyebrow="Legal" title="Privacy" intro="A plain-language summary of what this portfolio stores and why." /><article className="legal container"><h2>Contact form data</h2><p>When you submit the contact form, your name, email and project details are stored so Rehan can reply. The data is not sold or used for advertising.</p><h2>AI assistant conversations</h2><p>Assistant conversations may be saved with a session identifier for follow-up and service improvement. Do not send passwords, financial details or other sensitive information.</p><h2>Deletion requests</h2><p>To request a copy or deletion of your data, email <Link to="mailto:mehmoodrehan708@gmail.com">mehmoodrehan708@gmail.com</Link>.</p></article></main>;
}

function NotFound() {
  return <main className="not-found container"><span className="mono">404 / PATH ERROR</span><h1>Page not found</h1><div className="not-found-terminal"><p><strong>C:\Users\guest&gt;</strong> cd /missing-page</p><p>The system cannot find the path specified.</p></div><div className="button-row"><ButtonLink to="/projects">View projects</ButtonLink><ButtonLink to="/contact" variant="secondary">Contact Rehan</ButtonLink></div></main>;
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [assistantOpen, setAssistantOpen] = useState(false);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const content = useMemo(() => {
    if (path === "/") return <Home openAssistant={() => setAssistantOpen(true)} />;
    if (path === "/projects") return <ProjectsPage />;
    if (path.startsWith("/projects/")) {
      const project = projects.find(item => item.slug === path.split("/")[2]);
      return project ? <ProjectDetail project={project} /> : <NotFound />;
    }
    if (path === "/services") return <ServicesPage />;
    if (path.startsWith("/services/")) {
      const service = services.find(item => item.slug === path.split("/")[2]);
      return service ? <ServiceDetail service={service} /> : <NotFound />;
    }
    if (path === "/about") return <AboutPage />;
    if (path === "/contact") return <ContactPage />;
    if (path === "/privacy") return <PrivacyPage />;
    if (path === "/login") return <LoginPage />;
    if (path.startsWith("/admin")) return <AdminPage path={path} />;
    return <NotFound />;
  }, [path]);
  const publicPage = path !== "/login" && !path.startsWith("/admin");
  return <>{publicPage && <Navbar path={path} />}{content}{publicPage && <Footer />}{publicPage && <Terminal open={assistantOpen} setOpen={setAssistantOpen} />}</>;
}
