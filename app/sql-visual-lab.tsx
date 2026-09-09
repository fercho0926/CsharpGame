"use client";

import { useState } from "react";

const order = [
  ["FROM", "Trae las filas"],
  ["WHERE", "Filtra filas"],
  ["GROUP BY", "Forma grupos"],
  ["HAVING", "Filtra grupos"],
  ["SELECT", "Elige columnas"],
  ["ORDER BY", "Ordena el resultado"],
];

const challenges = [
  { prompt: "Quiero quitar clientes cuyo país no sea México.", answer: "WHERE", hint: "Todavía estás trabajando con filas individuales." },
  { prompt: "Quiero quedarme con categorías cuyo AVG(Price) sea mayor que 100.", answer: "HAVING", hint: "La condición usa una agregación y se aplica a grupos." },
  { prompt: "Quiero juntar las ventas que tienen la misma fecha.", answer: "GROUP BY", hint: "Esta cláusula crea un grupo por cada valor repetido." },
  { prompt: "Quiero mostrar solo Name y Price en la respuesta.", answer: "SELECT", hint: "Esta cláusula decide qué aparece en la salida." },
  { prompt: "Quiero ver primero los precios más altos.", answer: "ORDER BY", hint: "Esta cláusula organiza las filas finales." },
  { prompt: "Quiero leer los registros de la tabla Products.", answer: "FROM", hint: "Esta cláusula indica la fuente de los datos." },
];

export function SqlVisualLab() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const challenge = challenges[index];
  const answer = (value: string) => {
    if (selected) return;
    setSelected(value);
    if (value === challenge.answer) setScore((current) => current + 1);
  };
  const next = () => { setIndex((current) => (current + 1) % challenges.length); setSelected(null); };

  return <section className="sql-visual-lab">
    <div className="sql-visual-head"><div><p className="eyebrow">MAPA VISUAL · MEMORIA SQL</p><h3>El recorrido de una consulta</h3><p>Piensa en una línea de producción: primero llegan los datos, después se limpian, agrupan, filtran y finalmente se presentan.</p></div><span className="sql-visual-score">{score}/{challenges.length}</span></div>
    <div className="sql-order-poster" aria-label="Orden lógico de ejecución de una consulta SQL">
      <div className="sql-poster-column">{order.map(([clause, description], position) => <div className={`sql-poster-step step-${position + 1}`} key={clause}><b>{clause}</b><span>{description}</span></div>)}</div>
      <div className="sql-poster-arrow" aria-hidden="true"><i></i><span>se procesa<br />primero ↓ último</span></div>
      <div className="sql-poster-note"><strong>Frase relámpago</strong><p><b>F</b>ui a <b>W</b>endy, <b>G</b>uardé <b>H</b>amburguesas, <b>S</b>erví y <b>O</b>rdené.</p><small>FROM · WHERE · GROUP BY · HAVING · SELECT · ORDER BY</small></div>
    </div>
    <div className="sql-clause-challenge"><div><p className="eyebrow">MINIJUEGO · DETECTIVE DE CLÁUSULAS</p><h4>{challenge.prompt}</h4></div><span className="sql-challenge-count">Reto {index + 1}</span><div className="sql-clause-options">{order.map(([clause]) => <button type="button" key={clause} disabled={Boolean(selected)} className={selected ? clause === challenge.answer ? "correct" : clause === selected ? "wrong" : "" : ""} onClick={() => answer(clause)}>{clause}</button>)}</div>{selected && <div className={`sql-challenge-feedback ${selected === challenge.answer ? "good" : "bad"}`}><b>{selected === challenge.answer ? "¡Correcto!" : `Casi. La respuesta es ${challenge.answer}.`}</b><span>{challenge.hint}</span><button type="button" onClick={next}>Siguiente reto →</button></div>}</div>
  </section>;
}
