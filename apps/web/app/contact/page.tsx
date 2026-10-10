import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ContactForm } from "@/components/contact-form";
import { getProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Rehan Mehmood about AI, backend, full-stack, automation work, or engineering opportunities.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <main className="contact-dedicated">
      <section className="contact-viewport">
        <div className="contact-layout">
          <div className="contact-details-column">
            <header className="contact-intro">
              <p className="contact-kicker font-pixel">LET&apos;S TALK</p>
              <h1>Start a <span className="font-pixel">conversation.</span></h1>
              <p>Share the project, role, or workflow you want to improve. I&apos;ll respond with a practical next step.</p>
            </header>

            <div className="contact-detail-cards">
              <a className="contact-detail-card" href="mailto:mehmoodrehan708@gmail.com">
                <Mail aria-hidden="true" />
                <span><small>Email Me</small><strong>mehmoodrehan708@gmail.com</strong></span>
                <i aria-hidden="true">â†—</i>
              </a>

              <a className="contact-detail-card" href="https://wa.me/923288514952" target="_blank" rel="noopener noreferrer">
                <MessageSquare aria-hidden="true" />
                <span><small>Direct Call / WhatsApp</small><strong>+92 328 8514952</strong></span>
                <i aria-hidden="true">â†—</i>
              </a>

              <div className="contact-detail-card contact-location-card">
                <MapPin aria-hidden="true" />
                <span><small>Location &amp; Status</small><strong>Lahore, Pakistan (PKT / UTC+5)</strong><em>Open for Global Remote Roles</em></span>
              </div>

              <div className="contact-detail-card contact-social-card">
                <FaGithub aria-hidden="true" />
                <span>
                  <small>Developer Profiles</small>
                  <span className="contact-profile-links">
                    <a href="https://github.com/rehan-mehmood-tech" target="_blank" rel="noopener noreferrer"><FaGithub aria-hidden="true" /> GitHub</a>
                    <a href={profile.linkedin ?? "https://www.linkedin.com/in/rehan-mehmood"} target="_blank" rel="noopener noreferrer"><FaLinkedin aria-hidden="true" /> LinkedIn</a>
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="contact-form-panel">
            <Suspense fallback={<p className="contact-form-loading">Loading formâ€¦</p>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
