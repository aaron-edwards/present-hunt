import Image from "next/image";

import { InlineQrScannerShell } from "@/components/inline-qr-scanner-shell";
import { UnicornBuddy } from "@/components/unicorn-buddy";
import type { HuntStep } from "@/lib/hunt";

type HuntStepCardProps = {
  step: HuntStep;
  stepNumber: number;
  totalSteps: number;
};

export function HuntStepCard({
  step,
  stepNumber,
  totalSteps,
}: HuntStepCardProps) {
  const companionVariant =
    stepNumber === 1
      ? "triceratops"
      : stepNumber % 4 === 2
        ? "flowers"
        : stepNumber % 4 === 3
          ? "painting"
          : "donut";

  return (
    <>
      <article className="card">
        <p className="eyebrow">
          Step {stepNumber} of {totalSteps}
        </p>
        <h2>{step.title}</h2>
        <p className="lede clue-lede">{step.body}</p>

        {step.type === "image" && step.mediaUrl ? (
          <figure className="media-frame">
            <Image
              className="clue-image"
              src={step.mediaUrl}
              alt={step.caption ?? step.title}
              width={1200}
              height={900}
            />
            {step.caption ? <figcaption>{step.caption}</figcaption> : null}
          </figure>
        ) : null}

        {step.type === "video" && step.embedUrl ? (
          <div className="video-stack">
            <div className="video-frame">
              <iframe
                title={step.title}
                src={step.embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {step.caption ? <p className="caption">{step.caption}</p> : null}
          </div>
        ) : null}

        <InlineQrScannerShell />
      </article>

      <section className="buddy-note">
        <div className="buddy-note-copy">
          <p className="eyebrow">Bubbles Says</p>
          <p className="buddy-note-text">
            Follow the rhyme, trust your hunch, and I will be here cheering for
            the next good find.
          </p>
        </div>
        <UnicornBuddy
          className="buddy-note-art"
          imageClassName="buddy-note-image"
          variant={companionVariant}
        />
      </section>
    </>
  );
}
