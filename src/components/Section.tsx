import { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  id: string;
  title: string;
  subtitle?: string;
}>;

const sectionEyebrows: Record<string, string> = {
  about: "Profile",
  works: "Selected Work",
  journey: "Experience",
  skills: "Tooling",
  contact: "Connect",
};

export default function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="section-head">
        <p className="section-eyebrow">{sectionEyebrows[id] ?? "Section"}</p>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="section-content">{children}</div>
    </section>
  );
}
