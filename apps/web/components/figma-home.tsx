import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { ProjectVisual } from "./cards";
import type { Certification, Experience, Project, Recommendation, Service, SiteProfile } from "@/lib/types";

function SectionHeader({index,label,before,pixel,after="",intro}:{index:string;label:string;before:string;pixel:string;after?:string;intro?:string}){return <div className="immersive-header reveal"><span className="pixel">{index} // {label}</span><h2>{before} <em className="pixel">{pixel}</em>{after}</h2>{intro&&<p>{intro}</p>}</div>}

export function FigmaHome({profile,projects,services,certifications,experiences,recommendations}:{profile:SiteProfile;projects:Project[];services:Service[];certifications:Certification[];experiences:Experience[];recommendations:Recommendation[]}){
  const work=projects.filter(project=>project.featured).sort((a,b)=>a.sortOrder-b.sortOrder).slice(0,10);
  const trajectory=[
    ["01 Â· What I do",["AI agents & multi-agent workflows â€” LangGraph, LangChain, Groq","Backend APIs â€” FastAPI, Node.js/Express","Workflow automation â€” n8n with webhooks and error paths","Full-stack delivery â€” Next.js, React, TypeScript"]],
    ["02 Â· What I've built",work.slice(0,4).map(project=>project.title)],
    ["03 Â· What I'm doing now",[profile.education,"Building and evaluating agent systems",profile.availability]],
    ["04 Â· What's next",["Ship a production RAG service with evaluation","Launch a focused SaaS product","Grow into larger multi-agent systems work"]],
  ] as const;
  return <main className="immersive-home">
    <section className="hero-editorial" id="top">
      <div className="hero-overlay hero-overlay-bottom" />
      <div className="hero-overlay hero-overlay-top" />
      <div className="hero-inner">
        <div className="hero-meta-grid">
          <div className="hero-meta name-meta">
            <span className="meta-name">Rehan</span>
            <span className="pixel meta-name-pixel">Mehmood</span>
            <span className="meta-asterisk">*</span>
            <p className="pixel meta-blurb">AI &amp; Full-Stack Engineer | Agentic AI, Backend Systems &amp; Automations | CS @ UMT ’28</p>
          </div>
          <div className="hero-meta title-meta" aria-hidden="true" />
          <div className="hero-meta statement-meta">
            <span className="pixel meta-label">What I do</span>
            <p>I build AI agents, workflow automations and the backend APIs behind them — built to fail loudly and recover.</p>
          </div>
          <div className="hero-meta services-meta">
            <span className="pixel meta-label">Stack</span>
            <p>LangGraph · LangChain · Groq · Python · FastAPI · Node.js · Next.js · React · TypeScript · Firebase · n8n</p>
          </div>
        </div>

        <div className="hero-main-grid">
          <div className="hero-copy-column">
            <h1 className="hero-headline">
              <span>I build AI</span>
              <span><em className="pixel">Agents</em><b> that</b></span>
              <span>Act — not</span>
              <span className="pixel">Just chat</span>
            </h1>
            <p className="hero-subtitle">Production-minded agent systems, resilient backend APIs, and automations built around real operational work.</p>
            <div className="hero-primary-actions">
              <Link className="glass-cta" href="/contact"><Icon name="terminal" size={14} /><span>&gt;_ Start a project</span></Link>
              <Link className="hero-schedule-link" href="/contact">Schedule a call <span aria-hidden="true">↗</span></Link>
            </div>
          </div>

          <div className="hero-profile-column">
            <div className="hero-profile-card">
              <div className="hero-profile-media"><Image src={profile.photoUrl} alt="Rehan Mehmood in a formal suit" fill priority sizes="(max-width: 767px) 240px, 360px" /></div>
              <div className="profile-live-status"><i />{profile.availability}</div>
            </div>
          </div>
        </div>

        <div className="hero-utility-row">
          <p className="hero-availability">{profile.availability}</p>
          <div className="hero-utility-right">
            <div className="credential-chips">
              <Link href="#credentials"><strong>UMT Inter AI Club</strong><span>{certifications.length} verified items</span></Link>
              <Link href="/about"><strong>UMT</strong><span>CS ’28</span></Link>
            </div>
            <p className="hero-counts">{projects.length} projects <span>•</span> {certifications.length} certifications <span>•</span> {experiences.length} milestones</p>
          </div>
        </div>
      </div>
    </section>    <div className="signal-ticker" aria-hidden="true"><div className="ticker-track"><span>5-AGENT LANGGRAPH CAPSTONE</span><i>â—†</i><span>N8N AUTOMATION</span><i>â—†</i><span>FASTAPI + NODE.JS BACKENDS</span><i>â—†</i><span>FIRESTORE</span><i>â—†</i><span>OPEN TO INTERNSHIPS &amp; FREELANCE</span><i>â—†</i><span>5-AGENT LANGGRAPH CAPSTONE</span></div></div>
    <section className="immersive-section" id="about"><div className="wide-container"><SectionHeader index="01" label="About" before="Engineer first," pixel="student" after=" honestly" intro="I build agents that call real tools and the backend systems those agents depend on. The trajectory is honest: what is done, what is active, and what comes next."/><div className="trajectory"><div className="trajectory-rail"/>{trajectory.map(([title,items],index)=><article className={`trajectory-card ${index===2?"doing":index===3?"next":"done"}`} key={title}><span className="trajectory-node"/><span className="pixel trajectory-label">{index===3?"Goals":index===2?"Doing":"Done"}</span><h3>{title}</h3><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div></div></section>
    <section className="immersive-section work-section" id="work"><div className="wide-container"><SectionHeader index="02" label="Selected work" before="Priority" pixel="work" intro="Published projects ordered by the portfolio CMS."/><div className="work-deck">{work.map((project,index)=><article className="work-panel reveal" key={project.id}><div className="work-panel-copy"><div className="work-index pixel">{String(index+1).padStart(2,"0")} / {String(work.length).padStart(2,"0")} Â· Priority {project.sortOrder}</div><div className="badges"><span className="badge type">{project.projectType}</span><span className="badge live"><i/>{project.status}</span></div><h3>{project.title}</h3><p>{project.summary}</p><span className="pixel architecture-label">Architecture</span><div className="mini-flow"><span>Interface</span><i/><span>API</span><i/><span>System</span></div><div className="badges">{project.stack.slice(0,5).map(item=><span className="badge" key={item}>{item}</span>)}</div><div className="work-actions">{project.demoUrl&&<a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="button primary small">Live demo</a>}{project.repositoryUrl&&<a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="button secondary small">GitHub repository</a>}<Link href={`/projects/${project.slug}`} className="text-link">Case study <Icon name="arrow" size={16}/></Link></div></div><ProjectVisual project={project}/></article>)}</div><div className="archive-banner"><div><span className="pixel">Project archive</span><h3>Explore the complete set of builds and case studies.</h3></div><Link href="/projects" className="button secondary">View all projects</Link></div></div></section>
    <section className="immersive-section" id="services"><div className="wide-container"><SectionHeader index="03" label="Services" before="What I can" pixel="build" after=" for you" intro="Scoped systems with working proof, visible failure states and a documented handoff."/><div className="service-rows">{services.map(service=><Link href={`/services/${service.slug}`} className="service-row reveal" key={service.id}><span className="pixel">{String(service.sortOrder).padStart(2,"0")}</span><div><h3>{service.title}</h3><small>Proof: {service.proofProjectSlugs.length} published project{service.proofProjectSlugs.length===1?"":"s"}</small></div><p>{service.description}</p><div className="badges">{service.stack.slice(0,3).map(item=><span className="badge" key={item}>{item}</span>)}</div><Icon name="arrow"/></Link>)}<Link href="/contact?service=other" className="service-row"><span className="pixel">05</span><div><h3>Have a custom scope?</h3><small>Start with the bottleneck</small></div><p>Tell me what is slowing your team down. I will tell you honestly whether I can build it.</p><div/><Icon name="arrow"/></Link></div><div className="immersive-process">{["Scope call","Working version early","Iterate","Documented handoff"].map((item,index)=><div key={item}><span className="pixel">0{index+1}</span><strong>{item}</strong></div>)}</div></div></section>
    <section className="immersive-section raised" id="experience"><div className="wide-container"><SectionHeader index="04" label="Experience" before="Where I've" pixel="worked"/><div className="experience-timeline">{experiences.map((item,index)=><details className="experience-row" key={item.id} open={index===0}><summary><span className="pixel">{item.startDate} â€” {item.endDate}</span><div><h3>{item.role}</h3><p>{item.organization} Â· {item.location}</p></div><span className="badge type">{item.type}</span><i>+</i></summary><div className="experience-detail"><p>{item.summary}</p></div></details>)}</div></div></section>
    <section className="immersive-section" id="credentials"><div className="wide-container"><SectionHeader index="05" label="Credentials" before="Proof," pixel="verified"/><div className="credential-grid">{certifications.map((item,index)=><article className="credential-card reveal" key={item.id}><span className="pixel">Priority {index+1} Â· {item.issuer}</span><h3>{item.name}</h3><small className="pixel">{item.date}</small>{item.credentialUrl&&<a className="text-link" href={item.credentialUrl} target="_blank" rel="noopener noreferrer">Verify credential â†—</a>}</article>)}</div></div></section>
    {recommendations.length>0&&<section className="immersive-section words-section" id="recommendations"><div className="wide-container"><SectionHeader index="06" label="Mentorship" before="Verified" pixel="vouches"/>{recommendations.map(item=><div key={item.id}><blockquote>â€œ{item.quote}â€</blockquote><div className="quote-byline"><strong>{item.name}</strong><span>{item.role} Â· {item.relationship}</span></div></div>)}</div></section>}
    <section className="immersive-final"><div className="wide-container"><span className="pixel final-label">07 // Let's build</span><h2>Let's build<br/><em className="pixel">something</em><br/>great.</h2><div className="final-actions"><Link href="/contact" className="button primary">Start a project <Icon name="arrow"/></Link><a href={profile.github} target="_blank" rel="noopener noreferrer" className="button secondary">View GitHub</a></div><p className="pixel">{profile.email} Â· Reply within 24 hours</p></div></section>
  </main>
}

