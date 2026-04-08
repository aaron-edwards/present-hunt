import Image from "next/image";

const UNICORN_ASSETS = {
  cheer: {
    alt: "Bubbles celebrating with a party popper.",
    src: "/media/unicorns/unicorn-party-new.png",
  },
  cloudLeap: {
    alt: "Bubbles surfing on a rainbow board.",
    src: "/media/unicorns/unicorn-surf.png",
  },
  cloudSeat: {
    alt: "Bubbles decorating a cake.",
    src: "/media/unicorns/unicorn-bake.png",
  },
  happy: {
    alt: "Bubbles sitting down and waving hello.",
    src: "/media/unicorns/unicorn-wave.png",
  },
  sparklers: {
    alt: "Bubbles dressed as a wizard with a star wand.",
    src: "/media/unicorns/unicorn-wizard.png",
  },
  bubbles: {
    alt: "Bubbles blowing shimmering bubbles.",
    src: "/media/unicorns/unicorn-bubbles-new.png",
  },
  triceratops: {
    alt: "Bubbles walking a tiny triceratops friend.",
    src: "/media/unicorns/unicorn-triceratops.png",
  },
  racecar: {
    alt: "Bubbles driving a bright racecar.",
    src: "/media/unicorns/unicorn-racecar.png",
  },
  painting: {
    alt: "Bubbles painting a rainbow at an easel.",
    src: "/media/unicorns/unicorn-painting.png",
  },
  flowers: {
    alt: "Bubbles carrying flowers in a spring garden.",
    src: "/media/unicorns/unicorn-flowers.png",
  },
  donut: {
    alt: "Bubbles eating a pink frosted donut.",
    src: "/media/unicorns/unicorn-donut.png",
  },
} as const;

export type UnicornVariant = keyof typeof UNICORN_ASSETS;

type UnicornBuddyProps = {
  variant: UnicornVariant;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function UnicornBuddy({
  variant,
  className,
  imageClassName,
  priority = false,
}: UnicornBuddyProps) {
  const asset = UNICORN_ASSETS[variant];

  return (
    <div className={className}>
      <Image
        alt={asset.alt}
        className={imageClassName}
        height={512}
        priority={priority}
        src={asset.src}
        width={512}
      />
    </div>
  );
}
