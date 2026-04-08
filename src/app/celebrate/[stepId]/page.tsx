import { redirect } from "next/navigation";
import type { CSSProperties } from "react";

import { HuntShell } from "@/components/hunt-shell";
import { ProgressTracker } from "@/components/progress-tracker";
import { UnicornBuddy } from "@/components/unicorn-buddy";
import {
  getCelebrationBuddyVariant,
  getNextDestination,
  getStepByPublicSlug,
} from "@/lib/hunt";
import {
  getCompletionItems,
  isStarted,
  isStepCompleted,
  readProgressCookie,
} from "@/lib/progress";

type CelebratePageProps = {
  params: Promise<{
    stepId: string;
  }>;
};

const CELEBRATION_MESSAGES = [
  "A clever find, right on cue.",
  "That little rhyme led true.",
  "You found the spot. Hooray for you.",
  "Another verse is fluttering through.",
  "Your unicorn buddy approves of you.",
];

const CONFETTI_PIECES = Array.from({ length: 20 }, (_, index) => ({
  id: `confetti-${index + 1}`,
  offset: index,
  left: [
    8, 18, 29, 40, 51, 63, 74, 85, 12, 23, 35, 46, 58, 69, 81, 15, 27, 49, 66,
    78,
  ][index],
  top: [
    9, 6, 11, 7, 13, 8, 12, 10, 20, 17, 22, 18, 24, 19, 21, 30, 27, 29, 26, 31,
  ][index],
}));

function getRandomMessage() {
  return CELEBRATION_MESSAGES[
    Math.floor(Math.random() * CELEBRATION_MESSAGES.length)
  ];
}

function ConfettiBurst() {
  return (
    <div aria-hidden="true" className="confetti-burst">
      {CONFETTI_PIECES.map((piece) => (
        <span
          className="confetti-piece"
          key={piece.id}
          style={
            {
              "--confetti-index": piece.offset,
              "--confetti-left": `${piece.left}%`,
              "--confetti-top": `${piece.top}%`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default async function CelebratePage({ params }: CelebratePageProps) {
  const { stepId } = await params;
  const step = getStepByPublicSlug(stepId);
  const progress = await readProgressCookie();

  if (!step || !isStarted(progress) || !isStepCompleted(progress, stepId)) {
    redirect("/hunt");
  }

  const nextDestination = getNextDestination(stepId);
  const nextLabel =
    nextDestination === "/done" ? "See The Final Reveal" : "Continue";

  return (
    <HuntShell>
      <section className="hero-card hero-card-sparkle mini-hero-card celebration-hero">
        <ConfettiBurst />
        <p className="eyebrow">Checkpoint Complete</p>
        <h1>{getRandomMessage()}</h1>
        <p className="subtitle subtitle-large">
          Another sparkling stop is complete, and the next verse is ready when
          you are.
        </p>
        <UnicornBuddy
          className="celebration-buddy"
          imageClassName="celebration-buddy-image"
          variant={getCelebrationBuddyVariant()}
        />
        <ProgressTracker items={getCompletionItems(progress)} />
        <div className="button-group">
          <a className="button button-primary" href={nextDestination}>
            {nextLabel}
          </a>
        </div>
      </section>
    </HuntShell>
  );
}
