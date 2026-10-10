"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteProfile } from "@/lib/types";
import { Icon } from "./icons";

type SiteHeaderProps = {
  profile: Pick<SiteProfile, "github" | "linkedin">;
};

type NavigationItem =
  | { label: string; href: string; external?: false }
  | { label: string; href: string; external: true };

const sectionLinks: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Certifications", href: "/certifications" },
];

export function LogoMark() {
  return <span className="logo-blocks" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>;
}

export function SiteHeader({ profile }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const socialLinks: NavigationItem[] = [
    { label: "GitHub", href: profile.github, external: true },
    { label: "LinkedIn", href: profile.linkedin ?? "https://www.linkedin.com/in/rehan-mehmood", external: true },
  ];
  const navigation = [...sectionLinks, ...socialLinks];

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="nav-inner">
      <Link href="/" className="brand nav-brand-row" aria-label="Rehan Mehmood — Home" onClick={closeMenu}>
        <LogoMark />
        <span className="nav-brand-name">Rehan Mehmood</span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => item.external
          ? <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="nav-external">{item.label}</a>
          : <Link key={item.label} href={item.href}>{item.label}</Link>)}
        <Link href="/contact" className="button primary small nav-hire">Hire me</Link>
      </nav>

      <div className="mobile-actions">
        <Link href="/contact" className="button primary small">Hire me</Link>
        <button className="nav-menu-button" onClick={() => setOpen((current) => !current)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-menu">
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </div>

    {open && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
      {navigation.map((item) => item.external
        ? <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>{item.label}</a>
        : <Link key={item.label} href={item.href} onClick={closeMenu}>{item.label}<Icon name="arrow" /></Link>)}
      <Link href="/contact" className="mobile-hire-link" onClick={closeMenu}>Hire me <Icon name="arrow" /></Link>
    </nav>}
  </header>;
}

