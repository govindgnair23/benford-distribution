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
      "Explore why first digits follow Benford's Law when values span orders of magnitude.",
    conceptArea: "Probability",
    component: BenfordApplet
  }
];
