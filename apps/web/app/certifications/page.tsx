import type { Metadata } from "next";
import { CertificationsSection } from "@/components/landing-showcases";
import { getCertifications } from "@/lib/data";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Verified certifications, licenses, and completed programs earned by Rehan Mehmood.",
  alternates: { canonical: "/certifications" },
};

export default async function CertificationsPage() {
  const certifications = await getCertifications();
  return (
    <main className="standalone-showcase-page">
      <CertificationsSection certifications={certifications} />
    </main>
  );
}