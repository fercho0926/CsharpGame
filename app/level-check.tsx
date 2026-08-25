"use client";

import { useEffect, useMemo, useState } from "react";

type Confidence = "strong" | "medium" | "unknown";
type LevelQuestion = { id: string; topic: string; area: string; prompt: string; hint: string };

const levelQuestions: LevelQuestion[] = [
  { id: "types", topic: "Tipos y nullability", area: "C#", prompt: "¿Puedes explicar con seguridad value types, reference types, boxing y nullable reference types?", hint: "Repasa int vs class, object, boxing/unboxing, string? y NRT." },
  { id: "memory", topic: "Memoria y GC", area: ".NET", prompt: "¿Puedes explicar cómo funciona el GC y detectar una fuga lógica de memoria en .NET?", hint: "Repasa generaciones, roots, IDisposable, eventos y objetos retenidos." },
  { id: "poo", topic: "POO y diseño", area: "Diseño", prompt: "¿Puedes diferenciar encapsulamiento, abstracción, herencia y polimorfismo con un ejemplo?", hint: "Usa los mapas de POO y practica explicar qué problema resuelve cada pilar." },
  { id: "interfaces", topic: "Interfaces y abstractas", area: "Diseño", prompt: "¿Puedes decidir cuándo usar una interfaz, una clase abstracta o composición?", hint: "Compara contrato, estado compartido, herencia y relación es-un/tiene-un." },
  { id: "solid", topic: "SOLID y patrones", area: "Arquitectura", prompt: "¿Puedes detectar una violación de SOLID y proponer una mejora sin sobre-diseñar?", hint: "Repasa SRP, OCP, LSP, ISP, DIP y patrones simples como Strategy/Decorator." },
  { id: "collections", topic: "Colecciones", area: "C#", prompt: "¿Puedes elegir entre List, Dictionary, HashSet, Queue y ConcurrentDictionary justificando complejidad y concurrencia?", hint: "Repasa acceso, unicidad, orden, hashing y colecciones thread-safe." },
  { id: "linq", topic: "LINQ", area: ".NET", prompt: "¿Puedes explicar ejecución diferida, IEnumerable vs IQueryable y los costos de una consulta LINQ?", hint: "Repasa Where/Select, materialización, composición y traducción a SQL." },
  { id: "async", topic: "Async y concurrencia", area: ".NET", prompt: "¿Puedes explicar Task, cancellation, ConfigureAwait, deadlocks y cuándo usar paralelismo?", hint: "Repasa asincronía cooperativa, ValueTask, SemaphoreSlim y no bloquear con Result." },
  { id: "exceptions", topic: "Errores y resiliencia", area: ".NET", prompt: "¿Puedes diseñar manejo de excepciones, retries, timeouts y circuit breakers sin ocultar fallos?", hint: "Repasa excepciones esperables, logging, Polly/Resilience, backoff y límites." },
  { id: "aspnet", topic: "ASP.NET Core", area: "Backend", prompt: "¿Puedes explicar middleware, DI lifetimes, filtros, autenticación y autorización en una API?", hint: "Repasa pipeline, scoped/transient/singleton, JWT, policies y ProblemDetails." },
  { id: "ef", topic: "EF Core y datos", area: "Backend", prompt: "¿Puedes detectar N+1, tracking innecesario, problemas de transacción y consultas costosas?", hint: "Repasa Include, AsNoTracking, proyecciones, índices, concurrencia y migraciones." },
  { id: "testing", topic: "Testing", area: "Calidad", prompt: "¿Puedes diseñar una estrategia con unit, integration y contract tests que sea mantenible?", hint: "Repasa seams, mocks con moderación, testcontainers, pirámide y datos deterministas." },
  { id: "performance", topic: "Rendimiento", area: ".NET", prompt: "¿Puedes investigar una API lenta con mediciones antes de optimizar?", hint: "Repasa profiling, métricas, tracing, allocations, caching y benchmarking." },
  { id: "security", topic: "Seguridad", area: "Backend", prompt: "¿Puedes identificar riesgos de secretos, autorización, validación, SSRF, SQL injection y datos sensibles?", hint: "Repasa threat modeling, mínimo privilegio, validación y gestión segura de secretos." },
  { id: "architecture", topic: "Arquitectura y operación", area: "Senior", prompt: "¿Puedes defender una decisión entre monolito modular, microservicios, colas y consistencia eventual?", hint: "Repasa límites de contexto, observabilidad, contratos, idempotencia y costo operativo." },
];

const labels: Record<Confidence, string> = { strong: "Lo domino", medium: "Medio", unknown: "No sé" };
const descriptions: Record<Confidence, string> = {
  strong: "Puedes explicarlo, reconocer trampas y aplicarlo en una entrevista.",
  medium: "Tienes una base, pero conviene repasar y practicar antes de defenderlo.",
  unknown: "Es una prioridad: estudia el concepto desde cero y luego practica.",
};

export function LevelCheck() {
  const [answers, setAnswers] = useState<Record<string, Confidence>>({});
  const [showReport, setShowReport] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("csharp-quest-level-check-v1");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.answers && typeof data.answers === "object") setAnswers(data.answers);
        if (data.showReport === true) setShowReport(true);
      }
    } catch { /* el diagnóstico local es opcional */ }
  }, []);

  const answered = levelQuestions.filter(question => answers[question.id]).length;
  const counts = useMemo(() => ({
    strong: levelQuestions.filter(question => answers[question.id] === "strong"),
    medium: levelQuestions.filter(question => answers[question.id] === "medium"),
    unknown: levelQuestions.filter(question => answers[question.id] === "unknown"),
  }), [answers]);

  const choose = (id: string, value: Confidence) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    setShowReport(false);
    setSaved(false);
    try { localStorage.setItem("csharp-quest-level-check-v1", JSON.stringify({ answers: next, showReport: false, updatedAt: new Date().toISOString() })); } catch { /* localStorage puede estar bloqueado */ }
  };

  const finish = () => {
    setShowReport(true);
    try { localStorage.setItem("csharp-quest-level-check-v1", JSON.stringify({ answers, showReport: true, updatedAt: new Date().toISOString() })); } catch { /* localStorage puede estar bloqueado */ }
  };

  const reset = () => {
    setAnswers({});
    setShowReport(false);
    setSaved(false);
    try { localStorage.removeItem("csharp-quest-level-check-v1"); } catch { /* localStorage puede estar bloqueado */ }
  };

  const savePlan = () => {
    const plan = { generatedAt: new Date().toISOString(), strong: counts.strong.map(q => q.topic), review: counts.medium.map(q => q.topic), study: counts.unknown.map(q => q.topic) };
    try {
      const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `plan-estudio-dotnet-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
      setSaved(true);
    } catch { setSaved(false); }
  };

  return <section className="level-check">
    <div className="level-check-hero"><div><p className="eyebrow">DIAGNÓSTICO DE ENTREVISTA</p><h2>Mide tu nivel <span>sin engañarte.</span></h2><p>Como senior .NET, no necesitas memorizar todo: necesitas saber qué puedes defender y qué conviene recuperar. Responde por confianza real, no por intuición.</p></div><div className="level-check-score"><strong>{answered}/{levelQuestions.length}</strong><span>temas evaluados</span></div></div>
    {!showReport ? <><div className="confidence-legend"><span><b>Lo domino</b> Puedo explicarlo y aplicarlo</span><span><b>Medio</b> Lo reconozco, pero debo repasarlo</span><span><b>No sé</b> Necesito estudiarlo</span></div><div className="level-questions">{levelQuestions.map((question, index) => <article className="level-question" key={question.id}><div className="level-question-top"><span>{String(index + 1).padStart(2, "0")}</span><div><small>{question.area}</small><h3>{question.topic}</h3></div></div><p>{question.prompt}</p><div className="confidence-actions">{(["strong", "medium", "unknown"] as Confidence[]).map(value => <button key={value} className={`confidence-button ${value} ${answers[question.id] === value ? "selected" : ""}`} onClick={() => choose(question.id, value)}>{labels[value]}</button>)}</div>{answers[question.id] && <small className="level-hint">{descriptions[answers[question.id]]} {question.hint}</small>}</article>)}</div><button className="primary-cta level-finish" onClick={finish} disabled={answered < levelQuestions.length}>{answered < levelQuestions.length ? `Evalúa los ${levelQuestions.length - answered} temas restantes` : "Ver mi reporte y plan →"}</button></> : <div className="level-report"><div className="report-head"><div><p className="eyebrow">TU MAPA ACTUAL</p><h2>Ya sabes dónde enfocar tu energía.</h2><p>Este reporte mide autoconfianza. Para confirmar dominio, después valida cada bloque con preguntas y código.</p></div><button className="game-reset" onClick={reset}>Nueva prueba</button></div><div className="report-summary"><div className="report-total"><strong>{Math.round((counts.strong.length / levelQuestions.length) * 100)}%</strong><span>dominio declarado</span></div><div><b>{counts.strong.length} dominados</b><p>Conviértelos en respuestas de entrevista con ejemplos concretos.</p></div><div><b>{counts.medium.length} para repasar</b><p>Haz una sesión corta y vuelve a explicarlos sin mirar apuntes.</p></div><div><b>{counts.unknown.length} por estudiar</b><p>Empieza por estos temas: son tu mayor oportunidad de mejora.</p></div></div><div className="report-columns"><ReportColumn kind="strong" title="Dominas" items={counts.strong}/><ReportColumn kind="medium" title="Debes repasar" items={counts.medium}/><ReportColumn kind="unknown" title="Debes estudiar" items={counts.unknown}/></div><div className="study-plan"><p className="eyebrow">PLAN SUGERIDO</p><h3>Orden de preparación</h3><ol><li><b>Primero:</b> estudia {counts.unknown.length ? counts.unknown.slice(0, 3).map(q => q.topic).join(", ") : "los temas marcados como desconocidos"}.</li><li><b>Después:</b> repasa {counts.medium.length ? counts.medium.slice(0, 3).map(q => q.topic).join(", ") : "los temas medios"} con una pregunta de entrevista.</li><li><b>Finalmente:</b> practica explicar un tema dominado en 90 segundos, con trade-offs y un ejemplo.</li></ol><button className="primary-cta" onClick={savePlan}>↓ Descargar mi plan de estudio</button>{saved && <span className="plan-saved">Plan guardado.</span>}</div></div>}
  </section>;
}

function ReportColumn({ kind, title, items }: { kind: Confidence; title: string; items: LevelQuestion[] }) {
  return <div className={`report-column ${kind}`}><h3>{title} <span>{items.length}</span></h3>{items.length ? <ul>{items.map(item => <li key={item.id}><b>{item.topic}</b><small>{item.area}</small></li>)}</ul> : <p>Aún no hay temas en este grupo.</p>}</div>;
}
