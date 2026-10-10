"use client";

import { type FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Service } from "@/lib/types";

type SubmissionState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const params = useSearchParams();
  const [state, setState] = useState<SubmissionState>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      source: "form",
      type: form.get("type"),
      name: form.get("name"),
      email: form.get("email"),
      service: form.get("service") || undefined,
      budget: form.get("budget") || undefined,
      timeline: form.get("timeline") || undefined,
      message: form.get("message"),
      consent: form.get("consent") === "on",
      website: form.get("website") || undefined,
      landingPage: location.href,
      referrer: document.referrer,
      utm: Object.fromEntries([...params.entries()].filter(([key]) => key.startsWith("utm_"))),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to send your message.");
      setState("sent");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to send your message.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="contact-success-state" role="status">
        <p className="contact-kicker font-pixel">MESSAGE RECEIVED</p>
        <h2>Thanks—your message is in the inbox.</h2>
        <p>I&apos;ll review the details and reply within 24 hours.</p>
      </div>
    );
  }

  return (
    <form className="compact-contact-form" onSubmit={submit}>
      <header className="compact-form-heading">
        <div>
          <p className="contact-kicker font-pixel">PROJECT / OPPORTUNITY BRIEF</p>
          <h2>Tell me what you need.</h2>
        </div>
        <span>Reply within 24 hours</span>
      </header>

      <fieldset className="contact-role-fieldset">
        <legend>I&apos;m reaching out as *</legend>
        <div className="contact-role-options">
          <label>
            <input type="radio" name="type" value="client" defaultChecked />
            <span>Client / Project</span>
          </label>
          <label>
            <input type="radio" name="type" value="recruiter" />
            <span>Recruiter / Hiring</span>
          </label>
        </div>
      </fieldset>

      <div className="contact-field-row">
        <label htmlFor="contact-name"><span>Name *</span><input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
        <label htmlFor="contact-email"><span>Email *</span><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={200} /></label>
      </div>

      <div className="contact-field-row">
        <label htmlFor="contact-service">
          <span>Service</span>
          <select id="contact-service" name="service" defaultValue={params.get("service") ?? ""}>
            <option value="">Select a service</option>
            <option value="full-stack-mvps-saas-products">Full-Stack MVPs, SaaS apps &amp; Products</option>
            <option value="custom-softwares">Custom Softwares</option>
            <option value="ai-agent-integration">AI Agent Integration</option>
            <option value="multi-agent-systems">Multi-Agent Systems</option>
            <option value="ai-automations">AI Automations</option>
            <option value="app-development">App Development</option>
            <option value="website-development">Website Development</option>
            <option value="other-custom-idea">Other / Custom Idea Discussion</option>
          </select>
        </label>
        <label htmlFor="contact-budget">
          <span>Budget range</span>
          <select id="contact-budget" name="budget" defaultValue="">
            <option value="">Not sure yet</option>
            <option>Under $250</option>
            <option>$250–$1,000</option>
            <option>$1,000–$3,000</option>
            <option>$3,000+</option>
          </select>
        </label>
      </div>

      <label htmlFor="contact-timeline">
        <span>Timeline</span>
        <input id="contact-timeline" name="timeline" maxLength={100} placeholder="When would you like to start?" />
      </label>

      <label htmlFor="contact-message">
        <span>Project or role details *</span>
        <textarea id="contact-message" name="message" rows={3} required minLength={20} maxLength={3000} placeholder="What are you building, what is blocked, and what outcome do you need?" />
      </label>

      <label className="contact-consent">
        <input type="checkbox" name="consent" required />
        <span>I agree that my details can be stored so Rehan can reply.</span>
      </label>

      <label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {error ? <p className="contact-form-error" role="alert">{error}</p> : null}
      <button className="contact-submit-button" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "SENDING…" : "SEND MESSAGE ↗"}
      </button>
    </form>
  );
}
