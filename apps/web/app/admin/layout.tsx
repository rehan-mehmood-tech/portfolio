import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/auth";
export const metadata:Metadata={robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireAdmin();return <main className="admin-shell"><AdminNav/><div className="admin-main">{children}</div></main>}
