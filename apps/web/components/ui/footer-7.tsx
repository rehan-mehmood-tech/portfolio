import Link from "next/link";
import type { ReactElement } from "react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import type { SiteProfile } from "@/lib/types";
import { LogoMark } from "@/components/site-header";

type FooterLink = { name: string; href: string };
type FooterSection = { title: string; links: FooterLink[] };
type SocialLink = { icon: ReactElement; href: string; label: string };

type Footer7Props = {
  profile: SiteProfile;
  sections?: FooterSection[];
  description?: string;
};

const sections: FooterSection[] = [
  {
    title: "Quick Links",
    links: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Projects", href: "/projects" },
      { name: "Certifications", href: "/certifications" },
    ],
  },
  {
    title: "Legal / Contact",
    links: [
      { name: "Terms", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Contact / Hire Me", href: "/contact" },
      { name: "Direct Email", href: "mailto:mehmoodrehan708@gmail.com" },
    ],
  },
];

export function Footer7({
  profile,
  sections: navigation = sections,
  description = "AI agents, resilient automations, and full-stack systems engineered for practical business outcomes.",
}: Footer7Props) {
  const socialLinks: SocialLink[] = [
    { icon: <FaWhatsapp aria-hidden="true" />, href: "https://wa.me/923288514952", label: "WhatsApp" },
    { icon: <FaGithub aria-hidden="true" />, href: "https://github.com/rehan-mehmood-tech", label: "GitHub" },
    { icon: <FaLinkedin aria-hidden="true" />, href: profile.linkedin ?? "https://www.linkedin.com/in/rehan-mehmood", label: "LinkedIn" },
  ];

  return (
    <footer className="footer-7">
      <div className="footer-7-inner">
        <div className="footer-7-main">
          <div className="footer-7-brand-column">
            <Link href="/" className="footer-7-brand" aria-label="Rehan Mehmood home">
              <LogoMark />
              <strong>REHAN MEHMOOD</strong>
            </Link>
            <p>{description}</p>
            <ul className="footer-7-socials" aria-label="Social links">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer-7-navigation" aria-label="Footer navigation">
            {navigation.map((section) => (
              <div key={section.title}>
                <h2>{section.title}</h2>
                <ul>
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith("/") ? <Link href={link.href}>{link.name}</Link> : <a href={link.href}>{link.name}</a>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-7-bottom">
          <p>Ã‚Â© {new Date().getFullYear()} Rehan Mehmood. All rights reserved.</p>
          <Link href="/login" className="footer-admin-link">Admin</Link><span className="footer-7-location">{profile.location}</span>
        </div>
      </div>
    </footer>
  );
}