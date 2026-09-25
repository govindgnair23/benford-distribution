import type { ComponentType } from "react";

import { BenfordApplet } from "../applets/benford/BenfordApplet";

export type AppletDefinition = {
  id: string;
  title: string;
  subtitle: string;
  conceptArea: string;
  component: ComponentType;
};

export const availableApplets: AppletDefinition[] = [
  {
    id: "benford",
    title: "Benford Emergence Lab",
    subtitle:
      "Explore when first-digit frequencies approach Benford's Law.",
    conceptArea: "Probability",
    component: BenfordApplet
  }
];
