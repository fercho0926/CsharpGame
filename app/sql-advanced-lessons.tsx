"use client";

import { useState } from "react";

type Lesson = {
  number: string;
  title: string;
  summary: string;
  ideas: [string, string][];
  example: string;
  challenge: string;
  options: string[];
  answer: number;
  feedback: string;
};

const lessons: Record<string, Lesson> = {
  subqueries: {
    number: "10", title: "Subconsultas y EXISTS", summary: "Aprende a usar una consulta dentro de otra para comparar, filtrar y responder preguntas de negocio.",
    ideas: [["Subconsulta escalar", "Devuelve un valor, por ejemplo el precio promedio."], ["IN", "Compara una columna contra los resultados de otra consulta."], ["EXISTS", "Comprueba si existe al menos una fila relacionada."], ["Correlacionada", "Se evalúa tomando datos de la fila externa."]],
    example: "SELECT Product, Price\nFROM Products\nWHERE Price > (SELECT AVG(Price) FROM Products);",
    challenge: "¿Qué operador suele ser más expresivo para comprobar si hay filas relacionadas?", options: ["EXISTS", "ORDER BY", "TOP", "DISTINCT"], answer: 0, feedback: "EXISTS devuelve verdadero cuando la subconsulta encuentra al menos una fila; no necesitas traer sus columnas."
  },
  "set-ops": {
    number: "11", title: "UNION y conjuntos", summary: "Combina resultados compatibles y entiende la diferencia entre eliminar o conservar duplicados.",
    ideas: [["UNION", "Une resultados y elimina duplicados."], ["UNION ALL", "Une resultados conservando duplicados; suele ser más directo."], ["Compatibilidad", "Las consultas deben tener la misma cantidad de columnas y tipos compatibles."], ["Orden", "ORDER BY se coloca al final del conjunto completo."]],
    example: "SELECT City FROM Customers\nUNION\nSELECT City FROM Suppliers\nORDER BY City;",
    challenge: "Si necesitas conservar todas las filas, incluso repetidas, ¿qué eliges?", options: ["UNION", "UNION ALL", "FULL JOIN", "CROSS JOIN"], answer: 1, feedback: "UNION ALL conserva duplicados. UNION aplica una eliminación de duplicados al resultado."
  },
  expressions: {
    number: "12", title: "CASE, NULL y conversiones", summary: "Transforma valores, clasifica resultados y trata los datos faltantes sin confundir NULL con cero.",
    ideas: [["CASE", "Devuelve un resultado distinto según una condición."], ["COALESCE", "Usa el primer valor no nulo de una lista."], ["ISNULL", "Reemplaza NULL en SQL Server."], ["CAST", "Convierte una expresión a otro tipo de datos."]],
    example: "SELECT Product,\n  CASE WHEN Price >= 500 THEN 'Premium' ELSE 'Estándar' END AS Segmento,\n  COALESCE(Color, 'Sin color') AS ColorVisible\nFROM Products;",
    challenge: "¿Qué expresión permite reemplazar un NULL por un texto alternativo?", options: ["COALESCE", "GROUP BY", "HAVING", "UNION"], answer: 0, feedback: "COALESCE devuelve el primer argumento que no sea NULL; es útil para presentar datos completos."
  },
  constraints: {
    number: "13", title: "Tablas y restricciones", summary: "Diseña estructuras confiables con claves y reglas que protegen la integridad de los datos.",
    ideas: [["PRIMARY KEY", "Identifica cada fila de forma única y no admite NULL."], ["FOREIGN KEY", "Conecta una tabla con la clave de otra."], ["UNIQUE", "Evita valores repetidos en una columna o combinación."], ["CHECK / DEFAULT", "Validan valores o asignan un valor inicial."]],
    example: "CREATE TABLE Orders (\n  OrderId int PRIMARY KEY,\n  CustomerId int NOT NULL,\n  Total decimal(10,2) CHECK (Total >= 0),\n  FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId)\n);",
    challenge: "¿Qué restricción evita que exista un pedido para un cliente inexistente?", options: ["CHECK", "FOREIGN KEY", "DEFAULT", "INDEX"], answer: 1, feedback: "La FOREIGN KEY exige que el CustomerId exista en la tabla relacionada."
  },
  "views-indexes": {
    number: "14", title: "Vistas, índices y seguridad", summary: "Prepara consultas reutilizables y entiende cómo acelerar lecturas sin sacrificar el diseño.",
    ideas: [["VIEW", "Guarda una consulta reutilizable; normalmente no duplica los datos."], ["Índice", "Acelera búsquedas y ordenamientos, pero ocupa espacio y encarece escrituras."], ["Principio mínimo", "Concede solo los permisos necesarios."], ["Parámetros", "Evitan concatenar entrada del usuario y ayudan contra inyección SQL."]],
    example: "CREATE VIEW SalesSummary AS\nSELECT Category, COUNT(*) AS TotalProducts\nFROM Products\nGROUP BY Category;\n\nSELECT * FROM SalesSummary;",
    challenge: "¿Qué objeto encapsula una consulta para reutilizarla como fuente de datos?", options: ["VIEW", "CHECK", "TRIGGER", "PRIMARY KEY"], answer: 0, feedback: "Una VIEW presenta el resultado de una consulta con un nombre reutilizable."
  },
  capstone: {
    number: "15", title: "Proyecto final: informe de ventas", summary: "Integra filtros, JOIN, agregaciones, CASE y ordenamiento para resolver una pregunta real.",
    ideas: [["Pregunta", "¿Qué categorías venden más y superan el ticket promedio?"], ["Fuente", "Relaciona Customers, Orders y OrderLines."], ["Cálculo", "Agrupa, cuenta pedidos y suma ingresos."], ["Calidad", "Verifica NULL, duplicados y el orden del resultado."]],
    example: "SELECT p.Category, COUNT(DISTINCT o.OrderId) AS Orders,\n       SUM(ol.Quantity * ol.UnitPrice) AS Revenue\nFROM Orders AS o\nJOIN OrderLines AS ol ON ol.OrderId = o.OrderId\nJOIN Products AS p ON p.ProductId = ol.ProductId\nGROUP BY p.Category\nHAVING SUM(ol.Quantity * ol.UnitPrice) > 1000\nORDER BY Revenue DESC;",
    challenge: "¿Qué cláusula usarías para conservar solo categorías cuya facturación supera 1000?", options: ["WHERE", "HAVING", "FROM", "SELECT"], answer: 1, feedback: "HAVING filtra grupos después de calcular la suma de cada categoría."
  }
};

export function SqlAdvancedLesson({ id }: { id: string }) {
  const lesson = lessons[id] || lessons.capstone;
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return <article className="sql-lesson">
    <div className="sql-lesson-meta"><span>LECCIÓN {lesson.number}</span><span>25 MIN · PROGRESIVO</span></div>
    <h3>{lesson.title}</h3><p className="sql-lead">{lesson.summary}</p>
    <div className="sql-use-cards">{lesson.ideas.map(([title, copy]) => <div key={title}><span>{title}</span><strong>{title}</strong><p>{copy}</p></div>)}</div>
    <h4>Ejemplo guiado</h4><pre className="sql-code-block"><code>{lesson.example}</code></pre>
    <div className="sql-callout sql-callout-soft"><span className="sql-callout-icon">→</span><div><strong>Cómo razonarlo</strong><p>Primero identifica la fuente, después decide si filtras filas o grupos y al final define las columnas y el orden que necesita la persona usuaria.</p></div></div>
    <div className="sql-quiz"><p className="eyebrow">PRUEBA DEL TEMA</p><h4>{lesson.challenge}</h4><div className="sql-quiz-options">{lesson.options.map((option, index) => <button type="button" key={option} className={`${selected === index ? "selected" : ""} ${checked && index === lesson.answer ? "correct" : ""} ${checked && selected === index && index !== lesson.answer ? "wrong" : ""}`} onClick={() => !checked && setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{checked && <p className={`sql-quiz-feedback ${selected === lesson.answer ? "ok" : "retry"}`}>{selected === lesson.answer ? `¡Correcto! ${lesson.feedback}` : `Repasemos: ${lesson.feedback}`}</p>}<button type="button" className="primary-cta" disabled={selected === null} onClick={() => setChecked(true)}>{checked ? "Respuesta revisada" : "Comprobar respuesta"}<span>→</span></button></div>
  </article>;
}
