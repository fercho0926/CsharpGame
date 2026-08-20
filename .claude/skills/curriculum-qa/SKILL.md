---
name: curriculum-qa
description: Audita el path completo de C# Quest (26 módulos, pasos, preguntas) — integridad estructural, exactitud técnica y actualización contra Microsoft Learn. Usar cuando el usuario pida revisar, auditar o garantizar que la ruta/curriculum/preguntas estén correctas, completas o "100% funcionales", o al agregar/editar contenido de un módulo.
---

# Curriculum QA — C# Quest

Audita y mantiene sano el path de aprendizaje de C# Quest: que la ruta esté completa, que cada paso tenga exactamente 10 preguntas exclusivas y correctas, que no haya contenido roto o desactualizado, y que los hechos técnicos sobre C#/.NET sean precisos.

## 0. Mapa del contenido

Todo el contenido "puro" (sin JSX/React) vive en estos módulos, para que se puedan importar desde un script Node sin arrastrar Next.js/React:

- `app/curriculum-data.ts` — los 26 módulos (`curriculum: CourseModule[]`), cada uno con `steps: string[]` (solo títulos, sin contenido).
- `app/lesson-map.ts` — `lessonMap: Record<string, string[]>`: módulo → ids de paso reales, en el mismo orden que `curriculum-data.ts`. Es el puente entre "módulo declarado" y "contenido real".
- `app/lessons-core.ts` — pasos de m02/m03, escritos a mano.
- `app/advanced-lessons.ts` — pasos de m04–m10 (`preciseM04` escrito a mano; m05–m10 generado con `makeQuestions`).
- `app/lessons-extra.ts` + `app/lessons-extra-parts/*.ts` — pasos de m01 y m11–n11 (el resto del path).
- `app/lessons-all.ts` — `allSteps`: concatenación de TODO lo anterior. Es la única fuente que debe usarse tanto en `app/lesson-viewer.tsx` (UI) como en el validador, para que nunca diverjan.
- `app/curriculum.tsx`, `app/curriculum-progress.tsx`, `app/curriculum-interactive.tsx` — componentes de UI (JSX) que renderizan lo anterior. `curriculum-progress.tsx` es el que realmente usa `app/page.tsx`; los otros dos son variantes no usadas actualmente por la app (no borrar sin confirmar con el usuario).

Tipo de pregunta compartido (`AdvancedQuestion`/`Q`, estructuralmente idéntico en ambos módulos):
```ts
type Question = { prompt: string; options: string[]; answer: number; why: string; code?: string };
type Step = { id: string; title: string; summary: string; code: string; questions: Question[] };
```
`answer` es un **índice** dentro de `options` (no el texto de la respuesta). Ojo: `app/page.tsx` tiene un CUARTO tipo de pregunta, ajeno al path (`Question` con `answer: string`), para la pestaña "Practicar" — es un sistema de contenido totalmente separado, no lo mezcles con lo anterior.

## 1. Validación estructural automática

Ejecuta primero, siempre:
```bash
npm run validate:curriculum
```
(`scripts/validate-curriculum.ts`, corrido con `node --experimental-strip-types` más un loader propio en `scripts/ts-esm-loader.mjs` que resuelve imports de TS sin extensión — necesario porque Node ESM puro no lo hace, a diferencia del bundler de Next/Vite).

Qué valida, y por qué cada regla existe:
- **Exactamente 10 preguntas por paso** (regla del CLAUDE.md) y que ninguna esté duplicada dentro del mismo paso ("exclusivas").
- **`answer` dentro de rango** de `options` — un índice corrupto rompe el resaltado de "correcta" en `LessonViewer` sin lanzar error (bug silencioso).
- **Distribución de la posición de la respuesta correcta**: si ≥70% de las preguntas de 4 opciones de un paso tienen la correcta en la misma posición (A/B/C/D), lo reporta como ERROR. Esto no es cosmético: se encontró que el contenido original de `preciseM04` (m04) y varios pasos de m02/m03 tenían la respuesta correcta SIEMPRE en el índice 0 — un estudiante podía completar el módulo sin leer nada, solo pulsando la primera opción. Ver `shuffleQuestionOptions`/`sqr` en `app/advanced-lessons.ts` y `app/lessons-extra-parts/m01.ts` para el patrón de arreglo.
- **Integridad referencial** `curriculum-data.ts` ↔ `lesson-map.ts` ↔ `lessons-all.ts`: cada id en `lessonMap` debe existir de verdad en `allSteps` (si no, `LessonViewer` hace *fallback* silencioso a `steps[0]` y abre la lección equivocada); cada módulo debe tener tantos ids mapeados como `steps.length` declara; se avisa de contenido huérfano (pasos que existen pero ningún módulo referencia).
- **Módulos sin contenido** ("Contenido pendiente" en la UI): se reportan como aviso si `lessonMap[id]` está vacío.

El script termina con exit code 1 si hay errores — úsalo también como gate antes de dar por terminada cualquier tanda de contenido nuevo.

## 2. Lo que el validador NO puede comprobar: exactitud técnica

El validador solo revisa forma (conteos, índices, referencias), no si un hecho sobre C#/.NET es correcto. Para eso:

1. Lee la pregunta y el `why` con ojo crítico. Si describe comportamiento de una API concreta (ASP.NET Core, EF Core, JWT, Docker, BenchmarkDotNet, Span<T>, ConfigureAwait, etc.) y no estás seguro al 100%, **no lo des por bueno de memoria**.
2. **No hay un MCP de Microsoft Learn instalado en este entorno.** El sustituto real disponible es `WebSearch`/`WebFetch` apuntando a `learn.microsoft.com` (y, si el usuario confirma tener un MCP de documentación configurado, úsalo en su lugar — pregunta antes de asumir que existe).
3. Verifica en particular: comportamiento de excepciones (`finally`, `AggregateException`), semántica de `async`/`await`/`ConfigureAwait`/`CancellationToken` (cooperativa, no fuerza nada), diferencias value vs reference type, ejecución diferida de LINQ, ciclos de vida de DI (`Transient`/`Scoped`/`Singleton`), códigos de estado HTTP, autenticación vs autorización, y cualquier dato "de versión" (nombres de TFM, flags de `dotnet`, APIs marcadas como preview/obsoletas).
4. Si encuentras un hecho incorrecto o desactualizado, corrígelo en el archivo fuente correspondiente (ver mapa arriba) preservando el resto de la pregunta, y vuelve a correr `npm run validate:curriculum`.

## 3. Otras comprobaciones manuales (no automatizadas todavía)

- **Copys de conteo hardcodeados**: `curriculum.tsx`, `curriculum-progress.tsx` y `curriculum-interactive.tsx` muestran "N módulos" como texto literal (no derivado de `curriculum.length`). Si cambia el número de módulos, grep por `módulos</span>` y `módulos ·` para actualizarlos a mano — ya se encontró y corrigió un desfase real (decían "27" y "12 .NET" cuando eran 26 y 11).
- **`app/page.tsx`**: contiene su propio banco de preguntas (`seedQuestions`/`extraQuestions`) para la pestaña "Practicar", desacoplado del path. Revísalo por separado si el usuario pide auditar "todo el contenido", no solo el path.
- **`csharp-quest-progress-v1`**: no se toca el esquema de este localStorage key sin migración compatible (regla 5 del CLAUDE.md). El validador no lo comprueba; es responsabilidad del revisor humano/agente al tocar `app/page.tsx`.

## 4. Flujo recomendado para una auditoría completa

1. `npm run validate:curriculum` → lista de errores/avisos estructurales.
2. Arreglar errores estructurales primero (son mecánicos y de bajo riesgo).
3. Para cada módulo con contenido real, leer una muestra de preguntas y verificar hechos dudosos contra `learn.microsoft.com` vía WebSearch/WebFetch.
4. `npm run lint` y `npm test` (regla 8 del CLAUDE.md) antes de dar por cerrada la auditoría.
5. Si se generó contenido nuevo para módulos vacíos, confirmar que `lesson-map.ts` fue actualizado con los ids reales y que el conteo de pasos coincide con `curriculum-data.ts`.
