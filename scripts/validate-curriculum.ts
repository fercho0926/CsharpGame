// Valida el contenido del path completo de C# Quest: conteo de preguntas,
// límites de índices, integridad referencial entre curriculum-data / lesson-map
// / los pasos reales, y patrones sospechosos de preguntas (ver reglas del
// CLAUDE.md: "exactamente 10 preguntas exclusivas" y sin trampas de UX).
//
// Uso: npm run validate:curriculum
import { curriculum } from "../app/curriculum-data";
import { lessonMap } from "../app/lesson-map";
import { allSteps } from "../app/lessons-all";

type Q = { prompt: string; options: string[]; answer: number; why: string; code?: string };
type Step = { id: string; title: string; summary: string; code: string; questions: Q[] };

type Finding = { level: "error" | "warn"; scope: string; message: string };
const findings: Finding[] = [];
const err = (scope: string, message: string) => findings.push({ level: "error", scope, message });
const warn = (scope: string, message: string) => findings.push({ level: "warn", scope, message });

const steps = allSteps as Step[];

// 1. Duplicate step ids across the combined step pool.
const idCounts = new Map<string, number>();
for (const s of steps) idCounts.set(s.id, (idCounts.get(s.id) ?? 0) + 1);
for (const [id, count] of idCounts) if (count > 1) err("duplicate-step-id", `El id de paso "${id}" aparece ${count} veces en allSteps.`);

// 2. Per-step structural checks.
for (const step of steps) {
  const scope = `step:${step.id}`;
  if (!step.title?.trim()) err(scope, "El paso no tiene título.");
  if (!step.summary?.trim()) err(scope, "El paso no tiene resumen (regla CLAUDE.md: cada paso debe tener resumen).");
  if (!step.code?.trim()) warn(scope, "El paso no tiene código de ejemplo por defecto.");
  if (step.questions.length !== 10) err(scope, `Tiene ${step.questions.length} preguntas; la regla exige exactamente 10.`);

  const seenPrompts = new Set<string>();
  const answerHistogram = [0, 0, 0, 0];
  for (let qi = 0; qi < step.questions.length; qi++) {
    const q = step.questions[qi];
    const qScope = `${scope} · pregunta ${qi + 1}`;
    if (!q.prompt?.trim()) err(qScope, "Sin texto de pregunta (prompt).");
    if (seenPrompts.has(q.prompt)) err(qScope, `Pregunta duplicada dentro del mismo paso: "${q.prompt}" (regla: 10 preguntas EXCLUSIVAS).`);
    seenPrompts.add(q.prompt);
    if (!Array.isArray(q.options) || q.options.length < 2) err(qScope, `options tiene ${q.options?.length ?? 0} elementos; se necesitan al menos 2.`);
    const uniqueOptions = new Set(q.options);
    if (uniqueOptions.size !== q.options.length) err(qScope, "Hay opciones de respuesta duplicadas (texto repetido).");
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      err(qScope, `answer=${q.answer} está fuera de rango para ${q.options.length} opciones (índice inválido o corrupto).`);
    } else if (q.options.length === 4) {
      answerHistogram[q.answer]++;
    }
    if (!q.why?.trim()) err(qScope, "Sin explicación (why) para la respuesta correcta.");
    const needsCode = /imprime|compila|código|resultado de este|qué hace este|salida/i.test(q.prompt) && !q.code && !step.code;
    if (needsCode) warn(qScope, "El prompt sugiere lectura de código pero no hay código visible (ni en la pregunta ni en el paso).");
  }
  // Detect the "always pick position N" antipattern: if a single position
  // accounts for 7+ of the 10 four-option questions, the question bank is
  // guessable without reading the question (this is the exact m04 bug found
  // in the original preciseM04 data, where answer was always index 0).
  const totalFourOption = answerHistogram.reduce((a, b) => a + b, 0);
  if (totalFourOption >= 8) {
    const maxShare = Math.max(...answerHistogram);
    if (maxShare / totalFourOption >= 0.7) {
      err(scope, `Distribución de respuestas correctas muy sesgada (histograma A/B/C/D = ${answerHistogram.join("/")}). Un estudiante podría "ganar" adivinando siempre la misma letra.`);
    }
  }
}

// 3. curriculum-data.ts <-> lesson-map.ts <-> allSteps referential integrity.
const stepIds = new Set(steps.map((s) => s.id));
const curriculumIds = new Set(curriculum.map((m) => m.id));

for (const moduleId of Object.keys(lessonMap)) {
  if (!curriculumIds.has(moduleId)) err("lesson-map", `lessonMap tiene el módulo "${moduleId}" que no existe en curriculum-data.ts.`);
}

for (const m of curriculum) {
  const ids = lessonMap[m.id] ?? [];
  const scope = `module:${m.id}`;
  if (ids.length === 0) {
    warn(scope, `Módulo "${m.title}" (${m.steps.length} pasos declarados) no tiene ningún paso mapeado en lessonMap: se mostrará como "Contenido pendiente" en toda su ruta.`);
    continue;
  }
  if (ids.length !== m.steps.length) {
    err(scope, `curriculum-data.ts declara ${m.steps.length} pasos ("${m.steps.join('", "')}") pero lessonMap solo mapea ${ids.length} ids.`);
  }
  for (const id of ids) {
    if (!stepIds.has(id)) err(scope, `lessonMap referencia el id "${id}", que no existe en ningún paso real (allSteps). LessonViewer haría fallback silencioso a steps[0].`);
  }
  const dupWithinModule = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupWithinModule.length) err(scope, `lessonMap repite ids dentro del mismo módulo: ${[...new Set(dupWithinModule)].join(", ")}.`);
}

// Steps that exist but are not reachable from any module (orphaned content).
const referencedIds = new Set(Object.values(lessonMap).flat());
for (const step of steps) {
  if (!referencedIds.has(step.id)) warn(`step:${step.id}`, "Este paso existe en el contenido pero ningún módulo de lessonMap lo referencia (contenido huérfano, inalcanzable desde el path).");
}

// 4. Report.
const errors = findings.filter((f) => f.level === "error");
const warnings = findings.filter((f) => f.level === "warn");

const totalModules = curriculum.length;
const modulesWithContent = curriculum.filter((m) => (lessonMap[m.id] ?? []).length > 0).length;
const totalDeclaredSteps = curriculum.reduce((sum, m) => sum + m.steps.length, 0);
const totalMappedSteps = Object.values(lessonMap).reduce((sum, ids) => sum + ids.length, 0);

console.log("== C# Quest · validación de curriculum ==");
console.log(`Módulos: ${totalModules} (con contenido mapeado: ${modulesWithContent}, sin contenido: ${totalModules - modulesWithContent})`);
console.log(`Pasos declarados en curriculum-data.ts: ${totalDeclaredSteps} · pasos mapeados en lessonMap: ${totalMappedSteps} · pasos reales con preguntas: ${steps.length}`);
console.log("");

if (errors.length) {
  console.log(`ERRORES (${errors.length}):`);
  for (const f of errors) console.log(`  [ERROR] ${f.scope}: ${f.message}`);
}
if (warnings.length) {
  console.log(`\nAVISOS (${warnings.length}):`);
  for (const f of warnings) console.log(`  [WARN]  ${f.scope}: ${f.message}`);
}
if (!errors.length && !warnings.length) console.log("Sin hallazgos. El path está estructuralmente completo y consistente.");

if (errors.length) {
  console.log(`\nFAIL: ${errors.length} error(es) deben corregirse antes de publicar.`);
  process.exit(1);
} else {
  console.log("\nOK: sin errores estructurales." + (warnings.length ? ` (${warnings.length} avisos a revisar)` : ""));
}
