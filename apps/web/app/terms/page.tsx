import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <main className="legal container">
      <div className="eyebrow">Legal</div>
      <h1>Terms</h1>
      <p>Portfolio content is provided for professional evaluation and project discussion. Project scope, timelines, deliverables, and commercial terms are confirmed in writing before work begins.</p>
      <p>Do not submit confidential information through the AI assistant. Contact Rehan directly for private project discussions.</p>
    </main>
  );
}