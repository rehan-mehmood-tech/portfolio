import type { SiteProfile } from "@/lib/types";
import { Footer7 } from "@/components/ui/footer-7";

export function SiteFooter({ profile }: { profile: SiteProfile }) {
  return <Footer7 profile={profile} />;
}