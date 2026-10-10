import { FigmaHome } from "@/components/figma-home";
import { getCertifications, getProfile, getProjects } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export default async function Home() {
  const [profile, projects, certifications] = await Promise.all([
    getProfile(),
    getProjects(),
    getCertifications(),
  ]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name + " Portfolio",
    url: absoluteUrl("/"),
    author: { "@id": absoluteUrl("/") + "#person" },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <FigmaHome profile={profile} projects={projects} certifications={certifications} />
  </>;
}