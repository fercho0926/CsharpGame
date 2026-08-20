import type { Q, Step } from "./lessons-core";
import { coreSteps } from "./lessons-core";
import { advancedSteps } from "./advanced-lessons";
import { extraSteps } from "./lessons-extra";

// Red de seguridad final: cada archivo de contenido (m02/m03, m04-m10,
// m01/m11-n11) ya intenta distribuir la posición de la respuesta correcta
// entre A/B/C/D, pero se ha demostrado que ese paso manual falla en la
// práctica (varios pasos terminaron con la correcta SIEMPRE en el mismo
// índice, incluso en contenido escrito por agentes que conocían la regla).
// Por eso esta normalización se aplica una única vez aquí, sobre el arreglo
// YA combinado, como garantía estructural independiente de cómo se autoró
// cada pregunta. Rotar una pregunta que ya estaba bien distribuida no la
// rompe (sigue siendo una permutación válida); rotar una que estaba sesgada
// la corrige.
function shuffleQuestionOptions(question: Q, shift: number): Q {
  const n = question.options.length;
  const options = question.options.map((_, k) => question.options[(k + shift) % n]);
  const answer = (question.answer - shift + n) % n;
  return { ...question, options, answer };
}
const hashKey = (key: string) => key.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

function normalize(steps: Step[]): Step[] {
  return steps.map((step) => {
    const offset = hashKey(step.id);
    return {
      ...step,
      questions: step.questions.map((question, qi) => shuffleQuestionOptions(question, (qi + offset) % question.options.length)),
    };
  });
}

// Fuente única de verdad para el conjunto combinado de pasos del path.
// LessonViewer (UI) y el validador de contenido (scripts/validate-curriculum.ts)
// importan este mismo arreglo para no poder divergir entre sí.
export const allSteps: Step[] = normalize([...coreSteps, ...advancedSteps, ...extraSteps]);
