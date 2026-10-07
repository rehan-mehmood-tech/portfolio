"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./icons";

export function LogoMark(){return <span className="logo-blocks" aria-hidden="true"><i/><i/><i/><i/><i/><i/></span>}
export function SiteHeader(){
  const [open,setOpen]=useState(false); const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const update=()=>setScrolled(scrollY>24);update();addEventListener("scroll",update,{passive:true});return()=>removeEventListener("scroll",update)},[]);
  const links=[["Projects","/projects"],["Services","/services"],["Certifications","/#credentials"],["Education","/about#education"],["Mentorship","/#recommendations"]];
  return <header className={`navbar ${scrolled?"scrolled":""}`}><a className="skip-link" href="#main">Skip to content</a><div className="nav-inner"><Link href="/" className="brand nav-brand-row"><LogoMark/><span className="nav-brand-name"><span>Rehan</span><span className="pixel">Mehmood</span></span></Link><nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label,to])=><Link key={to} href={to}>{label}</Link>)}<a href="https://github.com/rehan-mehmood-tech" target="_blank" rel="noopener noreferrer">GitHub</a><Link href="/contact" className="button primary small">Hire me</Link></nav><div className="mobile-actions"><Link href="/contact" className="button primary small">Hire me</Link><button className="nav-menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} aria-controls="mobile-menu"><Icon name={open?"close":"menu"}/></button></div></div>{open&&<nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">{links.map(([label,to])=><Link key={to} href={to} onClick={()=>setOpen(false)}>{label}<Icon name="arrow"/></Link>)}</nav>}</header>
}

