import huntFile from "@/content/hunt.json";

type HuntTheme = {
  accent: string;
  accentSoft: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
};

type HuntIntro = {
  eyebrow: string;
  headline: string;
  body: string[];
  startLabel: string;
};

type HuntFinish = {
  eyebrow: string;
  headline: string;
  body: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type HuntStep = {
  id: string;
  order: number;
  title: string;
  body: string;
  solution: string;
  hint?: string;
};

export type HuntConfig = {
  slug: string;
  title: string;
  subtitle: string;
  intro: HuntIntro;
  finish: HuntFinish;
  theme: HuntTheme;
  steps: HuntStep[];
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Hunt configuration error: ${message}`);
  }
}

function normaliseHuntConfig(rawConfig: HuntConfig): HuntConfig {
  assert(rawConfig.slug, "slug is required");
  assert(rawConfig.title, "title is required");
  assert(
    Array.isArray(rawConfig.steps) && rawConfig.steps.length > 0,
    "at least one step is required",
  );

  const steps = [...rawConfig.steps].sort(
    (left, right) => left.order - right.order,
  );
  const seenIds = new Set<string>();

  steps.forEach((step, index) => {
    assert(step.id, `step ${index + 1} is missing an id`);
    assert(!seenIds.has(step.id), `duplicate step id "${step.id}"`);
    seenIds.add(step.id);

    assert(step.order > 0, `step "${step.id}" needs a positive order`);
    assert(step.title, `step "${step.id}" needs a title`);
    assert(step.body, `step "${step.id}" needs body copy`);
    assert(step.solution, `step "${step.id}" needs a solution`);
  });

  return {
    ...rawConfig,
    steps,
  };
}

const huntConfig = normaliseHuntConfig(huntFile as HuntConfig);

export function getHunt(): HuntConfig {
  return huntConfig;
}

export function getFirstStep(): HuntStep {
  return huntConfig.steps[0];
}

export function getStepById(stepId: string): HuntStep | undefined {
  return huntConfig.steps.find((step) => step.id === stepId);
}

export function getPublicStepSlug(stepId: string): string {
  const stepIndex = getStepIndex(stepId);
  return stepIndex === -1 ? stepId : `question-${stepIndex + 1}`;
}

export function getStepByPublicSlug(stepSlug: string): HuntStep | undefined {
  const matchedById = getStepById(stepSlug);
  if (matchedById) {
    return matchedById;
  }

  const match = /^question-(\d+)$/.exec(stepSlug);
  if (!match) {
    return undefined;
  }

  const stepIndex = Number.parseInt(match[1], 10) - 1;
  return huntConfig.steps[stepIndex];
}

export function getStepIndex(stepId: string): number {
  return huntConfig.steps.findIndex((step) => step.id === stepId);
}

export function getNextDestination(stepId: string): string {
  const currentIndex = getStepIndex(stepId);
  const nextStep = huntConfig.steps[currentIndex + 1];

  if (!nextStep) {
    return "/done";
  }

  return `/hunt/${getPublicStepSlug(nextStep.id)}`;
}

export function getHuntDestination(stepId: string): string {
  return `/hunt/${getPublicStepSlug(stepId)}`;
}

export function getCelebrateDestination(stepId: string): string {
  return `/celebrate/${getPublicStepSlug(stepId)}`;
}

export function getScanDestination(stepId: string): string {
  return `/scan/${getPublicStepSlug(stepId)}`;
}
