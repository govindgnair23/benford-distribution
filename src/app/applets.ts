import type { ComponentType } from "react";

import { BenfordApplet } from "../applets/benford/BenfordApplet";

export type AppletDefinition = {
  id: string;
  title: string;
  subtitle: string;
  conceptArea: string;
  component: ComponentType;
};

export type UpcomingApplet = {
  id: string;
  title: string;
  subtitle: string;
  conceptArea: string;
};

export const availableApplets: AppletDefinition[] = [
  {
    id: "benford",
    title: "Benford Emergence Lab",
    subtitle:
      "Explore why first digits follow a logarithmic pattern when values span orders of magnitude.",
    conceptArea: "Probability",
    component: BenfordApplet
  }
];

export const upcomingApplets: UpcomingApplet[] = [
  {
    id: "clt",
    title: "Central Limit Theorem",
    subtitle:
      "Watch sample means converge to a Normal regardless of the underlying distribution.",
    conceptArea: "Inference"
  },
  {
    id: "bayesian-updating",
    title: "Bayesian Updating",
    subtitle:
      "Move a prior through likelihoods to see how posteriors take shape.",
    conceptArea: "Bayesian"
  },
  {
    id: "linear-regression",
    title: "Linear Regression",
    subtitle:
      "Fit a line, watch residuals, and see how leverage points pull the slope.",
    conceptArea: "Modeling"
  }
];
