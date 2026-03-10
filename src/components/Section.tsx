import { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  id: string;
  title: string;
  subtitle?: string;
}>;

export default function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="section fade-in">
      <div className="section-head">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="section-content">{children}</div>
    </section>
  );
}
