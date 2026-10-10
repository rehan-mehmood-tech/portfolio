"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Dashboard Overview", "/admin"],
  ["Projects Management", "/admin/projects"],
  ["Certifications Management", "/admin/certifications"],
  ["Incoming Leads", "/admin/leads"],
] as const;

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="brand" aria-label="Admin dashboard"><span className="brand-mark" aria-hidden="true">R</span><span>RM / Admin</span></Link>
      <nav aria-label="Admin navigation">
        {links.map(([label, href]) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>{label}</Link>;
        })}
      </nav>
      <form action="/api/auth/logout" method="post"><button className="admin-logout" type="submit">Log out</button></form>
    </aside>
  );
}
