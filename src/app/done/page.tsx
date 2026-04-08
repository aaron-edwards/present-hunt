import { redirect } from "next/navigation";

import { HuntShell } from "@/components/hunt-shell";
import { ProgressTracker } from "@/components/progress-tracker";
import { UnicornBuddy } from "@/components/unicorn-buddy";
import { getCelebrationBuddyVariant, getHunt } from "@/lib/hunt";
import {
  getCompletionItems,
  isComplete,
  isStarted,
  readProgressCookie,
} from "@/lib/progress";

export default async function DonePage() {
  const hunt = getHunt();
  const progress = await readProgressCookie();

  if (!isStarted(progress)) {
    redirect("/start");
  }

  if (!isComplete(progress)) {
    redirect("/hunt");
  }

  return (
    <HuntShell>
      <section className="hero-card hero-card-sparkle mini-hero-card">
        <p className="eyebrow">{hunt.finish.eyebrow}</p>
        <h1>{hunt.finish.headline}</h1>
        <p className="subtitle subtitle-large">
          The trail is complete, the sparkles agree, and the unicorn is very
          pleased with you.
        </p>
      </section>

      <section className="finish-card celebration-card">
        <UnicornBuddy
          className="finish-buddy"
          imageClassName="finish-buddy-image"
          variant={getCelebrationBuddyVariant()}
        />
        <ProgressTracker items={getCompletionItems(progress)} />
        {hunt.finish.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div className="button-group">
          <a
            className="button button-primary"
            href={hunt.finish.ctaHref ?? "/start"}
          >
            {hunt.finish.ctaLabel ?? "Back To Start"}
          </a>
          <a className="button button-secondary" href="/dev/qrs">
            View QR Sheet
          </a>
        </div>
        <p className="footer-note">
          Swap this copy for the real reveal once your final verses are ready.
        </p>
      </section>
    </HuntShell>
  );
}
