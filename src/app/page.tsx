import { HuntShell } from "@/components/hunt-shell";
import { getHunt } from "@/lib/hunt";

export default function HomePage() {
  const hunt = getHunt();

  return (
    <HuntShell>
      <section className="hero-card">
        <p className="eyebrow">{hunt.intro.eyebrow}</p>
        <h1>{hunt.intro.headline}</h1>
        <p className="subtitle">{hunt.subtitle}</p>

        <div className="hero-copy">
          {hunt.intro.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="button-group">
          <a className="button button-primary" href="/hunt">
            {hunt.intro.startLabel}
          </a>
        </div>
      </section>

      <section className="meta-row">
        <article className="meta-chip">
          <span className="meta-label">Format</span>
          <span className="meta-value">QR-led adventure</span>
        </article>
        <article className="meta-chip">
          <span className="meta-label">Steps</span>
          <span className="meta-value">{hunt.steps.length}</span>
        </article>
        <article className="meta-chip">
          <span className="meta-label">Mode</span>
          <span className="meta-value">Direct QR links</span>
        </article>
      </section>

      <section className="card">
        <p className="eyebrow">How It Works</p>
        <h2>One phone, one trail, one very earned gift</h2>
        <p className="meta-copy">
          Start here, follow the clue on screen, and scan the QR hidden at the
          correct location. Each printed QR opens the next clue directly, so the
          QR sheet itself defines the hunt. If you want to jump back to the
          reveal while testing, you can still{" "}
          <a href="/done">open the finish page</a>.
        </p>
      </section>
    </HuntShell>
  );
}
