import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
export const metadata:Metadata={title:"Admin sign in",robots:{index:false,follow:false}};
export default function Login(){return <main className="auth-page"><div className="auth-card"><div className="eyebrow">Private workspace</div><h1>Admin sign in</h1><p>Manage public content and leads from one place.</p><LoginForm/><Link href="/" className="back-link">← Back to portfolio</Link></div></main>}
