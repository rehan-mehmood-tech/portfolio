import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, ServiceCard } from "@/components/cards";
import { getServices } from "@/lib/data";
export const metadata:Metadata={title:"Services",description:"AI agents, customer-support assistants, n8n automation and custom backend systems.",alternates:{canonical:"/services"}};
export default async function ServicesPage(){const services=await getServices();return <main><PageHero eyebrow="Services" title="Systems that do real work" intro="Scoped AI, automation and backend systems backed by working proof, clear boundaries and a documented handoff."/><section className="container page-content"><div className="services-grid">{services.map(s=><ServiceCard key={s.id} service={s}/>)}</div></section><section className="final-cta"><div className="container"><div className="eyebrow">Custom scope</div><h2>Tell me what your team does manually today.</h2><Link className="button primary" href="/contact?service=other">Start a project</Link></div></section></main>}
