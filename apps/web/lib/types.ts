export type SeoFields = { seoTitle?: string; metaDescription?: string; ogImage?: string };
export type Project = SeoFields & {
  id: string; slug: string; title: string; projectType: string; category: string;
  summary: string; audience: string; problem: string; built: string; architecture: string;
  decisions: string[]; outcome: string; lessons: string; limitations: string; improvements: string;
  stack: string[]; demoUrl?: string; repositoryUrl?: string; coverImage?: string; coverAlt?: string;
  published: boolean; featured: boolean; sortOrder: number; status: string; serviceSlugs: string[];
  publishedAt?: string; updatedAt?: string;
};
export type Service = SeoFields & {
  id: string; slug: string; title: string; description: string; audience: string;
  deliverables: string[]; stack: string[]; limitations: string; proofProjectSlugs: string[];
  enabled: boolean; sortOrder: number;
};
export type Certification = { id: string; name: string; issuer: string; date: string; credentialUrl?: string; published: boolean; sortOrder: number };
export type Experience = { id: string; role: string; organization: string; location: string; startDate: string; endDate: string; summary: string; type: string; published: boolean; sortOrder: number };
export type Recommendation = { id: string; name: string; role: string; relationship: string; quote: string; linkedinUrl?: string; permissionConfirmed: boolean; published: boolean };
export type SiteProfile = {
  name: string; title: string; location: string; email: string; whatsapp: string; github: string;
  linkedin?: string; availability: string; bio: string; positioning: string; education: string;
  cvUrl?: string; bookingUrl?: string; photoUrl: string; stack: Record<string, string>;
};
export type Lead = { id?: string; source: "form" | "chat"; type: "client" | "recruiter"; name: string; email: string; service?: string; budget?: string; timeline?: string; message: string; landingPage?: string; referrer?: string; utm?: Record<string, string>; status: "new" | "contacted" | "won" | "lost"; createdAt?: string };
