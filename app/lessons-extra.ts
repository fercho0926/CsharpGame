import type { AdvancedStep } from "./advanced-lessons";
import { stepsM01 } from "./lessons-extra-parts/m01";
import { stepsM11M12 } from "./lessons-extra-parts/m11-m12";
import { stepsM13M15 } from "./lessons-extra-parts/m13-m15";
import { stepsN01N02 } from "./lessons-extra-parts/n01-n02";
import { stepsN03N05 } from "./lessons-extra-parts/n03-n05";
import { stepsN06N08 } from "./lessons-extra-parts/n06-n08";
import { stepsN09N11 } from "./lessons-extra-parts/n09-n11";

export const extraSteps: AdvancedStep[] = [
  ...stepsM01,
  ...stepsM11M12,
  ...stepsM13M15,
  ...stepsN01N02,
  ...stepsN03N05,
  ...stepsN06N08,
  ...stepsN09N11,
];
