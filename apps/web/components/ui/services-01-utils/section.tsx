import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
};

export function Section({ children, className = "", ...props }: SectionProps) {
  return (
    <section className={`services-01-section ${className}`.trim()} {...props}>
      <div className="showcase-container">{children}</div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <header className={`services-01-header services-01-header-${align}`}>
      <span className="font-pixel">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}