"use client";

import { useState } from "react";

const logicalOrder = ["FROM", "WHERE", "GROUP BY", "HAVING", "SELECT", "ORDER BY"];
const shuffled = ["SELECT", "HAVING", "ORDER BY", "FROM", "GROUP BY", "WHERE"];

export function SqlOrderGame() {
  const [next, setNext] = useState(0); const [wrong, setWrong] = useState<string | null>(null); const [wins, setWins] = useState(0);
  const choose = (clause: string) => { if (clause === logicalOrder[next]) { setWrong(null); if (next === logicalOrder.length - 1) { setWins((value) => value + 1); setNext(0); } else setNext((value) => value + 1); } else setWrong(`Todavía no: primero se procesa ${logicalOrder[next]}.`); };
  const reset = () => { setNext(0); setWrong(null); };
  return <section className="sql-order-game"><div className="sql-game-heading"><div><p className="eyebrow">JUEGO DE MEMORIA · SQL</p><h3>El robot que ordena consultas</h3><p>Ayuda al robot a ejecutar las cláusulas en el orden lógico correcto.</p></div><span className="sql-game-score">★ {wins}</span></div><div className="sql-memory-hook"><b>Frase para recordar:</b><span>“<strong>F</strong>ui a <strong>W</strong>here, <strong>G</strong>uardé <strong>H</strong>amburguesas, <strong>S</strong>erví <strong>O</strong>rden.”</span><small>FROM · WHERE · GROUP BY · HAVING · SELECT · ORDER BY</small></div><div className="sql-game-progress">{logicalOrder.map((clause, index) => <span key={clause} className={index < next ? "done" : index === next ? "current" : ""}>{index < next ? "✓" : index + 1}</span>)}</div><p className="sql-game-instruction">Elige el paso {next + 1} de {logicalOrder.length}: <b>{logicalOrder[next]}</b></p><div className="sql-game-options">{shuffled.map((clause) => <button type="button" key={clause} onClick={() => choose(clause)} disabled={next === 0 && false}>{clause}</button>)}</div>{wrong && <p className="sql-game-feedback wrong">{wrong}</p>}{next === 0 && wins > 0 && <p className="sql-game-feedback good">¡Ronda completada! Puedes repetirla para fijar el orden.</p>}<button type="button" className="sql-game-reset" onClick={reset}>Reiniciar ronda</button></section>;
}
