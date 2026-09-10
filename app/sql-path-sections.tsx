"use client";

import { useState } from "react";
import { SqlOrderGame } from "./sql-order-game";
import { SqlPlayground } from "./sql-playground";
import { SqlVisualLab } from "./sql-visual-lab";

const topics = [
  ["01", "RDBMS", "Tablas, filas, columnas, relaciones e integridad."],
  ["02", "SQL Server", "SSMS, Azure Data Studio y sqlcmd."],
  ["03", "T-SQL y DML", "SELECT, INSERT, UPDATE, DELETE y JOIN."],
  ["04", "DDL y tipos", "Esquemas, tablas, columnas y tipos de datos."],
  ["05", "Terminología SQL", "Sentencias, cláusulas y orden lógico."],
  ["06", "Agregaciones", "COUNT, SUM, AVG, MIN, MAX y NULL."],
  ["07", "Filtrar grupos", "WHERE, GROUP BY y HAVING."],
  ["08", "Entidad–Relación", "Entidades, claves, atributos y cardinalidad."],
  ["09", "JOIN", "Combinar información de varias tablas."],
  ["10", "Subconsultas", "IN, EXISTS y consultas correlacionadas."],
  ["11", "UNION", "Combinar conjuntos y controlar duplicados."],
  ["12", "CASE y NULL", "Clasificar, convertir y tratar valores faltantes."],
  ["13", "Restricciones", "Claves, CHECK, DEFAULT y datos confiables."],
  ["14", "Vistas e índices", "Reutilización, rendimiento y seguridad."],
  ["15", "Proyecto final", "Un informe de ventas de principio a fin."],
];

export function SqlTopicsView() {
  return <section className="sql-path-view"><div className="sql-path-heading"><p className="eyebrow">PATH SQL · TEMAS</p><h2>Aprende SQL por módulos</h2><p>Selecciona un tema para estudiar el concepto, practicarlo y después comprobarlo con preguntas.</p></div><div className="sql-topic-grid">{topics.map(([number, title, description]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><b>→</b></article>)}</div></section>;
}

export function SqlGamesView() {
  return <section className="sql-path-view"><div className="sql-path-heading"><p className="eyebrow">PATH SQL · JUEGOS</p><h2>Practica jugando</h2><p>Entrena el orden lógico, reconoce cláusulas y ejecuta consultas en el laboratorio seguro.</p></div><SqlOrderGame /><SqlVisualLab /><SqlPlayground /></section>;
}

export function SqlLevelView() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const checks = ["Reconozco la diferencia entre WHERE y HAVING.", "Puedo explicar una relación 1:N.", "Sé cuándo usar INNER JOIN o LEFT JOIN.", "Puedo usar COUNT, AVG, MIN y MAX.", "Recuerdo el orden lógico de una consulta."];
  return <section className="sql-path-view"><div className="sql-path-heading"><p className="eyebrow">PATH SQL · MIDE TU NIVEL</p><h2>¿Qué tan listo estás?</h2><p>Marca tu confianza en cada habilidad. Este diagnóstico no cambia tu progreso.</p></div><div className="sql-level-list">{checks.map((check, index) => <div key={check}><span>{index + 1}</span><p>{check}</p><div>{["Necesito practicar", "Voy avanzando", "Lo domino"].map((label, value) => <button type="button" key={label} className={answers[index] === value ? "selected" : ""} onClick={() => setAnswers(current => ({ ...current, [index]: value }))}>{label}</button>)}</div></div>)}</div><div className="sql-level-result">{Object.keys(answers).length === checks.length ? <><strong>{Object.values(answers).filter(value => value === 2).length}/5</strong><span>habilidades dominadas según tu autoevaluación.</span></> : <span>Responde las {checks.length} habilidades para ver tu resultado.</span>}</div></section>;
}

export function SqlReviewView() {
  const cards = [["FROM", "¿De dónde vienen los datos?"], ["WHERE", "Filtra filas antes de agrupar."], ["GROUP BY", "Forma grupos para resumir."], ["HAVING", "Filtra grupos ya creados."], ["SELECT", "Decide qué columnas mostrar."], ["ORDER BY", "Ordena el resultado final."]];
  return <section className="sql-path-view"><div className="sql-path-heading"><p className="eyebrow">PATH SQL · REPASO</p><h2>Repaso rápido antes de continuar</h2><p>Usa estas tarjetas como recordatorio de los conceptos principales.</p></div><div className="sql-review-grid">{cards.map(([term, meaning]) => <article key={term}><strong>{term}</strong><p>{meaning}</p></article>)}</div><div className="sql-review-code"><span>Consulta completa</span><pre><code>{"SELECT Category, COUNT(*) AS Total\nFROM Products\nWHERE Price > 100\nGROUP BY Category\nHAVING COUNT(*) > 1\nORDER BY Total DESC;"}</code></pre></div></section>;
}
