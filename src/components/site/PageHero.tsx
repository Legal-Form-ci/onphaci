import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-surface-alt border-b border-border">
      <div className="absolute inset-0 -z-0 opacity-30" aria-hidden style={{
        backgroundImage:
          "radial-gradient(circle at 10% 10%, oklch(0.85 0.12 145 / 0.4) 0, transparent 35%), radial-gradient(circle at 90% 50%, oklch(0.85 0.15 55 / 0.3) 0, transparent 40%)",
      }} />
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        {eyebrow && <span className="text-xs font-semibold uppercase tracking-widest text-accent-orange">{eyebrow}</span>}
        <h1 className="mt-3 text-balance text-4xl font-bold text-ink sm:text-5xl">{title}</h1>
        {lead && <p className="mt-5 max-w-3xl text-lg text-ink-soft">{lead}</p>}
        {children}
      </div>
    </section>
  );
}