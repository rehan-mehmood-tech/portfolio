import { FigmaHome } from "@/components/figma-home";
import { getCertifications, getExperiences, getProfile, getProjects, getRecommendations, getServices } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export default async function Home(){
  const [profile,projects,services,certifications,experiences,recommendations]=await Promise.all([getProfile(),getProjects(),getServices(),getCertifications(),getExperiences(),getRecommendations()]);
  const schema={"@context":"https://schema.org","@type":"WebSite",name:`${profile.name} Portfolio`,url:absoluteUrl("/"),author:{"@id":`${absoluteUrl("/")}#person`}};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><FigmaHome profile={profile} projects={projects} services={services} certifications={certifications} experiences={experiences} recommendations={recommendations}/></>;
}
