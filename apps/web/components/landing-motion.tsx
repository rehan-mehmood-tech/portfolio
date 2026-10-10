"use client";

import { useEffect } from "react";

const revealSelectors = [
  "#about .about-card",
  "#projects .showcase-heading",
  "#projects .showcase-grid",
  "#projects .showcase-actions",
  "#services .services-01-header",
  "#certifications .showcase-heading",
  "#certifications .showcase-grid",
  "#contact .wide-container",
  ".footer-7-main",
] as const;

const typewriterSelectors = [
  "#projects .showcase-heading h2",
  "#projects .ui-card-title",
] as const;

export function LandingMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors.join(",")));
    const typewriterElements = Array.from(document.querySelectorAll<HTMLElement>(typewriterSelectors.join(",")));

    revealElements.forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 35}ms`);
    });
    typewriterElements.forEach((element, index) => {
      element.classList.add("typewriter-target");
      element.style.setProperty("--typing-delay", `${Math.min(index % 6, 5) * 90}ms`);
    });

    if (reduceMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      typewriterElements.forEach((element) => element.classList.add("is-typing"));
      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -3% 0px" },
    );

    const typewriterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-typing");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
    typewriterElements.forEach((element) => typewriterObserver.observe(element));

    return () => {
      revealObserver.disconnect();
      typewriterObserver.disconnect();
      revealElements.forEach((element) => {
        element.classList.remove("scroll-reveal", "is-visible");
        element.style.removeProperty("--reveal-delay");
      });
      typewriterElements.forEach((element) => {
        element.classList.remove("typewriter-target", "is-typing");
        element.style.removeProperty("--typing-delay");
      });
    };
  }, []);

  return null;
}