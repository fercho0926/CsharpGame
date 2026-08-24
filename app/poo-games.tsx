"use client";

import { useEffect, useMemo, useState } from "react";

type PillarId = "encapsulamiento" | "abstraccion" | "herencia" | "polimorfismo";
type Challenge = {
  prompt: string;
  code: string;
  options: string[];
  answer: string;
  explanation: string;
};
type Pillar = {
  id: PillarId;
  name: string;
  short: string;
  icon: string;
  color: string;
  mission: string;
  unlock: string;
  challenges: Challenge[];
};

const pillars: Pillar[] = [
  {
    id: "encapsulamiento",
    name: "Encapsulamiento",
    short: "Protege el estado",
    icon: "◈",
    color: "game-violet",
    mission: "Diseña objetos que protejan sus datos y expongan solo operaciones seguras.",
    unlock: "Empieza aquí",
    challenges: [
      { prompt: "Un saldo no debe poder cambiarse desde fuera de la cuenta. ¿Cuál diseño es correcto?", code: "class Account {\n  ___ decimal balance;\n  public void Deposit(decimal amount) { ... }\n}", options: ["public", "private", "static", "internal"], answer: "private", explanation: "private oculta el estado. La clase controla los cambios a través de métodos como Deposit." },
      { prompt: "Quieres permitir leer Name, pero solo el objeto puede modificarlo. ¿Qué propiedad eliges?", code: "public string Name { get; ___ set; }", options: ["public", "private", "static", "virtual"], answer: "private", explanation: "Un setter privado permite lectura pública y escritura controlada desde la propia clase." },
      { prompt: "¿Qué principio estás aplicando al validar amount antes de cambiar balance?", code: "public void Deposit(decimal amount) {\n  if (amount > 0) balance += amount;\n}", options: ["Proteger invariantes", "Duplicar estados", "Herencia múltiple", "Acoplar detalles"], answer: "Proteger invariantes", explanation: "Una invariante es una regla que siempre debe cumplirse. El objeto evita que el saldo reciba valores inválidos." },
    ],
  },
  {
    id: "abstraccion",
    name: "Abstracción",
    short: "Modela lo esencial",
    icon: "✦",
    color: "game-peach",
    mission: "Quédate con el contrato importante y oculta la complejidad que no necesita el consumidor.",
    unlock: "Completa Encapsulamiento",
    challenges: [
      { prompt: "El cliente solo necesita pedir un pago. ¿Qué debería conocer?", code: "public interface IPayment {\n  ___ Pay(decimal amount);\n}", options: ["El contrato", "La conexión SQL", "Los reintentos internos", "Todos los campos"], answer: "El contrato", explanation: "La abstracción expone qué se puede hacer, no cómo se implementa internamente." },
      { prompt: "¿Qué miembro expresa mejor una capacidad esencial de un reporte?", code: "public abstract class Report {\n  public abstract ___ Render();\n}", options: ["string", "private", "database", "constructor"], answer: "string", explanation: "Render representa el resultado esencial. Cada tipo concreto decide cómo construir ese string." },
      { prompt: "Una clase Facade simplifica cinco servicios detrás de un único método. ¿Qué está haciendo?", code: "checkout.___(order);", options: ["Ocultando complejidad", "Copiando herencia", "Exponiendo campos", "Rompiendo el contrato"], answer: "Ocultando complejidad", explanation: "Una fachada ofrece una entrada simple y mantiene los detalles de coordinación detrás de la abstracción." },
    ],
  },
  {
    id: "herencia",
    name: "Herencia",
    short: "Reutiliza una base",
    icon: "⌘",
    color: "game-blue",
    mission: "Comparte comportamiento común con una relación genuina de tipo base y tipo derivado.",
    unlock: "Completa Abstracción",
    challenges: [
      { prompt: "Dog es un Animal y necesita el comportamiento común de Animal. ¿Qué sintaxis usas?", code: "public class Dog ___ Animal { }", options: [":", "=>", "implements", "extends"], answer: ":", explanation: "En C#, dos puntos indican la clase base y las interfaces que implementa el tipo." },
      { prompt: "La clase hija cambia una implementación virtual heredada. ¿Qué palabra clave necesita?", code: "public ___ void Speak() { ... }", options: ["override", "overload", "replace", "inherit"], answer: "override", explanation: "override reemplaza el comportamiento virtual de la clase base manteniendo el contrato polimórfico." },
      { prompt: "¿Cuándo es una mala señal usar herencia?", code: "class Report : DatabaseConnection { }", options: ["Cuando solo quieres reutilizar código", "Cuando existe un verdadero es-un", "Cuando la base define un contrato", "Cuando hay polimorfismo"], answer: "Cuando solo quieres reutilizar código", explanation: "Si la relación no es un verdadero es-un, composición suele comunicar mejor el diseño y reduce el acoplamiento." },
    ],
  },
  {
    id: "polimorfismo",
    name: "Polimorfismo",
    short: "Una interfaz, muchas formas",
    icon: "∞",
    color: "game-mint",
    mission: "Escribe código que dependa de contratos y permita que cada tipo responda a su manera.",
    unlock: "Completa Herencia",
    challenges: [
      { prompt: "Quieres procesar EmailNotification y SmsNotification sin preguntar el tipo concreto. ¿Qué recibes?", code: "void Send( ___ notification) {\n  notification.Deliver();\n}", options: ["INotification", "EmailNotification", "object בלבד", "dynamic בלבד"], answer: "INotification", explanation: "El consumidor depende de la interfaz. Cada implementación resuelve Deliver con su propia forma." },
      { prompt: "¿Qué salida demuestra despacho dinámico?", code: "Animal pet = new Dog();\npet.Speak();", options: ["La versión de Dog", "Siempre la versión de Animal", "No compila", "Ambas a la vez"], answer: "La versión de Dog", explanation: "Con un método virtual, la implementación concreta se elige en tiempo de ejecución." },
      { prompt: "¿Qué beneficio obtienes al agregar CardPayment sin modificar Checkout?", code: "checkout.Pay(new CardPayment());", options: ["Extensión sin cambiar el consumidor", "Más if por tipo", "Acoplamiento a Card", "Eliminar la interfaz"], answer: "Extensión sin cambiar el consumidor", explanation: "El polimorfismo permite agregar formas nuevas que cumplen el contrato sin reescribir el código que las usa." },
    ],
  },
];

const masteryKey = "csharp-quest-poo-mastery-v1";

export function PooGames() {
  const [mastered, setMastered] = useState<PillarId[]>([]);
  const [activeId, setActiveId] = useState<PillarId>("encapsulamiento");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(masteryKey) || "[]");
      if (Array.isArray(stored)) setMastered(stored.filter((id): id is PillarId => pillars.some(pillar => pillar.id === id)));
    } catch { /* local progress is optional */ }
  }, []);

  const active = useMemo(() => pillars.find(pillar => pillar.id === activeId) || pillars[0], [activeId]);
  const challenge = active.challenges[index];
  const activePosition = pillars.findIndex(pillar => pillar.id === active.id);
  const unlocked = (pillar: Pillar) => pillar.id === "encapsulamiento" || mastered.includes(pillars[Math.max(0, pillars.findIndex(item => item.id === pillar.id) - 1)].id);

  const choosePillar = (pillar: Pillar) => {
    if (!unlocked(pillar)) return;
    setActiveId(pillar.id);
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setNotice("");
  };

  const answer = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === challenge.answer) setCorrect(value => value + 1);
  };

  const next = () => {
    const result = selected === challenge.answer ? correct + 1 : correct;
    if (index < active.challenges.length - 1) {
      setIndex(value => value + 1);
      setSelected(null);
      setCorrect(result);
      return;
    }
    if (result === active.challenges.length) {
      const nextMastery = Array.from(new Set([...mastered, active.id]));
      setMastered(nextMastery);
      localStorage.setItem(masteryKey, JSON.stringify(nextMastery));
      setNotice(`¡${active.name} dominado! El siguiente juego ya está disponible.`);
    } else {
      setNotice("Aún falta una respuesta correcta. Reinicia este juego y vuelve a intentarlo para dominarlo.");
    }
  };

  const reset = () => {
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setNotice("");
  };

  return <section className="games-section">
    <div className="games-heading">
      <div><p className="eyebrow">LABORATORIO DE POO</p><h2>Aprende jugando, <span>sin saltos.</span></h2><p>Domina los cuatro pilares con misiones cortas. Para avanzar necesitas acertar todos los retos del pilar.</p></div>
      <div className="games-score"><strong>{mastered.length}/4</strong><span>pilares dominados</span></div>
    </div>
    <div className="pillar-track" aria-label="Progreso de los cuatro pilares">
      {pillars.map((pillar, pillarIndex) => <button key={pillar.id} className={`pillar-chip ${active.id === pillar.id ? "active" : ""} ${mastered.includes(pillar.id) ? "done" : ""} ${unlocked(pillar) ? "" : "locked"}`} onClick={() => choosePillar(pillar)} disabled={!unlocked(pillar)}><span className={`pillar-chip-icon ${pillar.color}`}>{mastered.includes(pillar.id) ? "✓" : pillar.icon}</span><span><b>{pillarIndex + 1}. {pillar.name}</b><small>{mastered.includes(pillar.id) ? "Dominado" : unlocked(pillar) ? pillar.short : pillar.unlock}</small></span></button>)}
    </div>
    <div className="game-panel">
      <div className="game-panel-head"><div><p className="eyebrow">MISIÓN {activePosition + 1} · RETO {index + 1} DE {active.challenges.length}</p><h3>{active.name}</h3><p>{active.mission}</p></div><button className="game-reset" onClick={reset}>Reiniciar</button></div>
      <div className="game-progress"><div style={{ width: `${((index + (selected ? 1 : 0)) / active.challenges.length) * 100}%` }} /></div>
      <div className="game-challenge"><p className="game-prompt">{challenge.prompt}</p><pre>{challenge.code}</pre><div className="game-options">{challenge.options.map((option, optionIndex) => <button key={option} className={`game-option ${selected && option === challenge.answer ? "right" : ""} ${selected === option && option !== challenge.answer ? "wrong" : ""}`} onClick={() => answer(option)} disabled={Boolean(selected)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>{selected && <div className={`game-feedback ${selected === challenge.answer ? "good" : "bad"}`}><strong>{selected === challenge.answer ? "¡Correcto!" : "Buen intento, revisemos."}</strong><p>{challenge.explanation}</p></div>}</div>
      {selected && (index < active.challenges.length - 1 || notice) && <button className="primary-cta game-next" onClick={next}>{index < active.challenges.length - 1 ? "Siguiente reto" : "Terminar misión"}<span>→</span></button>}
      {notice && <div className={`game-notice ${mastered.includes(active.id) ? "mastered" : "retry"}`}><strong>{notice}</strong>{mastered.includes(active.id) && activePosition < pillars.length - 1 && <button onClick={() => choosePillar(pillars[activePosition + 1])}>Jugar siguiente pilar →</button>}</div>}
    </div>
    <div className="games-rule"><span>✓</span><p><b>Regla de dominio:</b> una misión solo se marca como completada con 3/3 respuestas correctas. Si fallas, puedes reiniciarla y repetirla hasta que el concepto quede claro.</p></div>
  </section>;
}
