import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { ProjectVisual } from "./cards";
import type { Certification, Project, SiteProfile } from "@/lib/types";
import { CertificationsSection, ProjectsSection } from "@/components/landing-showcases";
import Services01 from "@/components/ui/services-01";
import TopologyField from "@/components/ui/topology-field";
import CanvasText from "@/components/ui/canvas-text";
import { LandingMotion } from "@/components/landing-motion";
import TypewriterExample from "@/components/ui/motion-typewriter";

function SectionHeader({index,label,before,pixel,after="",intro}:{index:string;label:string;before:string;pixel:string;after?:string;intro?:string}){return <div className="immersive-header reveal"><span className="pixel">{index} // {label}</span><h2>{before} <em className="pixel">{pixel}</em>{after}</h2>{intro&&<p>{intro}</p>}</div>}

const marqueeSkills = [
  "Agentic AI & Multi-Agent Systems",
  "LangGraph",
  "LangChain",
  "Retrieval-Augmented Generation (RAG)",
  "Large Language Models (LLM)",
  "n8n Automation",
  "Python",
  "FastAPI",
  "Next.js",
  "React.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express.js",
  "REST APIs",
  "Custom SaaS Development",
  "Full-Stack Systems Architecture",
  "Supabase",
  "PostgreSQL",
  "Firebase",
  "Groq API",
  "TailWind CSS",
  "Docker",
  "Vercel",
  "Render Hosting",
  "Git & GitHub",
  "Streamlit",
  "Data Structures & Algorithms",
  "Object-Oriented Programming (OOP)",
  "Systems Design",
] as const;
export function FigmaHome({profile,projects,certifications}:{profile:SiteProfile;projects:Project[];certifications:Certification[]}){
  const work=projects.filter(project=>project.featured).sort((a,b)=>a.sortOrder-b.sortOrder).slice(0,10);
  return <main className="immersive-home">
    <LandingMotion />
    <section className="hero-editorial" id="home">
      <div className="hero-topology-background" aria-hidden="true">
        <TopologyField mode="dark" brightness={0.72} saturation={0.5} />
      </div>
      <div className="hero-canvas-text" aria-hidden="true">
        <CanvasText text="AI SYSTEMS" color="#ef233c" fontSize={68} density={3} particleSize={1.25} scatter={54} loadDuration={0.8} morphDuration={1.6} magnetic={0.22} magneticRadius={120} drift={0.2} />
      </div>
      <div className="hero-overlay hero-overlay-bottom" />
      <div className="hero-overlay hero-overlay-top" />
      <div className="hero-inner">
        <div className="hero-main-grid">
          <div className="hero-copy-column">
            <h1 className="hero-headline hero-typewriter-headline">
              <TypewriterExample
                parts={[{ text: "I BUILD WEBSITES THAT " }, { text: "SCALE.", className: "font-pixel" }]}
                speed={42}
              />
              <TypewriterExample
                parts={[{ text: "AGENTS THAT " }, { text: "EXECUTE.", className: "font-pixel" }]}
                speed={42}
                startDelay={1150}
              />
              <TypewriterExample
                parts={[{ text: "AUTOMATIONS THAT " }, { text: "DELIVER.", className: "font-pixel" }]}
                speed={42}
                startDelay={2050}
                persistCaret
              />
            </h1>
            <h2 className="hero-positioning">End-to-End Full-Stack &amp; AI Engineering for High-Growth Businesses.</h2>
            <p className="hero-value">Whether you need a custom software built from scratch, deploying autonomous AI agents to handle operational work, or connecting your tools with resilient backend pipelines—I deliver end-to-end digital solutions engineered for reliability, growth, and real-world results.</p>
            <div className="hero-primary-actions">
              <Link className="glass-cta" href="/contact"><Icon name="terminal" size={14} /><span>&gt;_ START A PROJECT</span></Link>
              <Link className="hero-secondary-cta" href="/contact">SCHEDULE A CALL</Link>
            </div>
          </div>

          <div className="hero-profile-column">
            <div className="hero-profile-card">
              <div className="hero-profile-media"><Image src={profile.photoUrl} alt="Rehan Mehmood in a formal suit" fill priority sizes="(max-width: 767px) 260px, 304px" /></div>
              <div className="profile-live-status"><i />{profile.availability}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="signal-ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((sequence) => <div className="ticker-sequence" key={sequence}>
            {marqueeSkills.map((skill) => <span className="ticker-token" key={`${sequence}-${skill}`}><span>{skill}</span><i>◆</i></span>)}
          </div>)}
        </div>
      </div>
    </section>    <section className="about-section landing-section-divider" id="about">
      <article className="about-card">
        <h2>Turning Complex Ideas Into Production-Ready Software</h2>
        <p>Need someone who can handle your entire engineering stack—from frontend UI to backend APIs and AI integrations? I design and deploy custom software solutions that eliminate technical debt and automate manual business processes.</p>

        <div className="about-content-group">
          <h3>Core Solutions I Deliver:</h3>
          <ul>
            <li><strong>AI Agents &amp; LLM Workflows:</strong> Custom agents that interact with your APIs, handle data retrieval, and execute automated tasks securely.</li>
            <li><strong>Automated Pipelines:</strong> n8n integrations connecting your software ecosystem with built-in error tracking.</li>
            <li><strong>Full-Stack SaaS MVPs:</strong> High-performance Next.js applications powered by scalable FastAPI/Node backends and cloud databases.</li>
          </ul>
        </div>

        <div className="about-content-group">
          <h3>Working Philosophy:</h3>
          <p>Clear scopes, early working iterations, proper documentation and systems that stays reliable. Available for scoped freelance client projects as well as selective full-stack and AI engineering roles.</p>
        </div>
      </article>
    </section>
    <ProjectsSection projects={projects} githubUrl={profile.github}/>
    <Services01 />
    <CertificationsSection certifications={certifications}/>
    <section className="immersive-final landing-section-divider" id="contact"><div className="wide-container"><span className="pixel final-label">07 // Let's build</span><h2>Let's build<br/><em className="pixel">something</em><br/>great.</h2><div className="final-actions"><Link href="/contact" className="button primary">Start a project <Icon name="arrow"/></Link><a href={profile.github} target="_blank" rel="noopener noreferrer" className="button secondary">View GitHub</a></div><p className="pixel">{profile.email} Â· Reply within 24 hours</p></div></section>
  </main>
}

