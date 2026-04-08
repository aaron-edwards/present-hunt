import { HuntShell } from "@/components/hunt-shell";
import { getHunt } from "@/lib/hunt";

const HOW_TO_STEPS = [
  "Read the clue on your phone, then follow the rhyme to the place it suggests.",
  "Find the hidden QR waiting there with excellent secret-keeping skills.",
  "Scan it with the in-page camera or your normal camera app to reveal the next verse.",
  "Keep going until the final reveal arrives and your unicorn buddy can celebrate.",
];

export default function HowToPage() {
  const hunt = getHunt();

  return (
    <HuntShell>
      <section className="hero-card mini-hero-card">
        <p className="eyebrow">How To Play</p>
        <h1>Read the rhyme. Find the sign.</h1>
        <p className="subtitle subtitle-large">
          Everything you need lives on the phone. The rest is a mix of curious
          wandering and unicorn-approved instinct.
        </p>
      </section>

      <section className="card instruction-card">
        <div className="instruction-grid">
          {HOW_TO_STEPS.map((step, index) => (
            <article className="instruction-step" key={step}>
              <span className="instruction-number">0{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Helpful Notes</p>
        <h2>A few things to remember</h2>
        <div className="hero-copy">
          {hunt.intro.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="button-group">
          <a className="button button-primary" href="/start">
            Begin The Pursuit
          </a>
          <a className="button button-secondary" href="/">
            Back Home
          </a>
        </div>
      </section>
    </HuntShell>
  );
}
