import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./app.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Terminal } from "@/components/terminal";
import { getProfile } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:"Rehan Mehmood — AI + Full-Stack Engineer",template:"%s | Rehan Mehmood"},description:"AI agents, workflow automations and backend APIs built with LangGraph, FastAPI, Node.js and Next.js.",alternates:{canonical:"/"},openGraph:{type:"website",title:"Rehan Mehmood — AI + Full-Stack Engineer",description:"AI agents, workflow automations and backend APIs.",url:"/"},twitter:{card:"summary_large_image"}};
export default async function RootLayout({children}:{children:React.ReactNode}){const profile=await getProfile();return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&amp;family=Silkscreen&amp;display=swap" rel="stylesheet"/></head><body><SiteHeader profile={profile}/><div id="main">{children}</div><SiteFooter profile={profile}/><Terminal/><Analytics/></body></html>}
