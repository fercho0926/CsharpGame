"use client";

import { useState } from "react";

type Row = { Product: string; Category: string; Stock: number | null; Price: number; Color: string };
type ResultRow = Record<string, string | number | null>;
const sampleRows: Row[] = [
  { Product: "Bicicleta urbana", Category: "Bicicletas", Stock: 10, Price: 850, Color: "Rojo" },
  { Product: "Casco deportivo", Category: "Accesorios", Stock: 20, Price: 65, Color: "Negro" },
  { Product: "Guantes", Category: "Accesorios", Stock: 20, Price: 25, Color: "Azul" },
  { Product: "Bicicleta de montaña", Category: "Bicicletas", Stock: 30, Price: 1250, Color: "Verde" },
  { Product: "Botella", Category: "Accesorios", Stock: null, Price: 15, Color: "Rojo" },
  { Product: "Bicicleta infantil", Category: "Bicicletas", Stock: 10, Price: 420, Color: "Azul" },
  { Product: "Bomba de aire", Category: "Accesorios", Stock: 5, Price: 35, Color: "Negro" },
];
const examples = [
  "SELECT COUNT(*) AS TotalProducts FROM Products;",
  "SELECT Category, AVG(Price) AS AveragePrice FROM Products GROUP BY Category ORDER BY AveragePrice DESC;",
  "SELECT MAX(Price) AS MostExpensive, MIN(Price) AS Cheapest FROM Products;",
  "SELECT Product, Stock, Price FROM Products WHERE Price > 400 ORDER BY Price DESC;",
];

function splitCsv(value: string) { return value.split(",").map((part) => part.trim()).filter(Boolean); }
function valueOf(row: Row, field: string) { return row[field as keyof Row]; }
function compare(row: Row, condition: string) {
  const match = condition.trim().match(/^([A-Za-z]+)\s*(=|<>|>=|<=|>|<)\s*'?([^']*)'?$/);
  if (!match) return true;
  const actual = valueOf(row, match[1]); const expected = Number.isNaN(Number(match[3])) ? match[3].toLowerCase() : Number(match[3]);
  if (actual === null || actual === undefined) return false;
  if (match[2] === "=") return String(actual).toLowerCase() === String(expected).toLowerCase();
  if (match[2] === "<>") return String(actual).toLowerCase() !== String(expected).toLowerCase();
  return match[2] === ">" ? Number(actual) > Number(expected) : match[2] === "<" ? Number(actual) < Number(expected) : match[2] === ">=" ? Number(actual) >= Number(expected) : Number(actual) <= Number(expected);
}
function aggregate(rows: Row[], expression: string): number | null {
  const match = expression.match(/^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(DISTINCT\s+)?([A-Za-z*]+)\s*\)$/i); if (!match) return null;
  const fn = match[1].toUpperCase(); const distinct = Boolean(match[2]); const field = match[3];
  if (fn === "COUNT" && field === "*") return rows.length;
  let values = rows.map((row) => valueOf(row, field)).filter((value): value is number => typeof value === "number"); if (distinct) values = [...new Set(values)];
  if (fn === "COUNT") return values.length; if (!values.length) return null; if (fn === "SUM") return values.reduce((a, b) => a + b, 0); if (fn === "AVG") return values.reduce((a, b) => a + b, 0) / values.length; return fn === "MIN" ? Math.min(...values) : Math.max(...values);
}
function runQuery(query: string): { rows: ResultRow[]; message?: string } {
  const clean = query.replace(/;\s*$/, "").trim(); const selectMatch = clean.match(/^SELECT\s+(?:TOP\s+(\d+)\s+)?(.+?)\s+FROM\s+Products(?:\s+WHERE\s+(.+?))?(?:\s+GROUP\s+BY\s+([A-Za-z]+))?(?:\s+ORDER\s+BY\s+([A-Za-z]+)(?:\s+(ASC|DESC))?)?$/i);
  if (!selectMatch) return { rows: [], message: "Consulta no reconocida. Usa SELECT ... FROM Products y las cláusulas disponibles." };
  const [, top, selectText, whereText, groupField, orderField, orderDirection] = selectMatch; let rows = sampleRows.filter((row) => !whereText || whereText.split(/\s+AND\s+/i).every((condition) => compare(row, condition))); const fields = splitCsv(selectText);
  const isAggregate = fields.some((field) => /^(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(field)); let result: ResultRow[];
  if (groupField) { const groups = [...new Set(rows.map((row) => String(valueOf(row, groupField))))]; result = groups.map((group) => { const groupRows = rows.filter((row) => String(valueOf(row, groupField)) === group); const output: ResultRow = {}; fields.forEach((field) => { const alias = field.match(/\s+AS\s+([A-Za-z0-9_]+)/i)?.[1] || field; const expression = field.replace(/\s+AS\s+.*$/i, "").trim(); output[alias] = expression.toLowerCase() === groupField.toLowerCase() ? group : aggregate(groupRows, expression); }); return output; }); }
  else if (isAggregate) { const output: ResultRow = {}; fields.forEach((field) => { const alias = field.match(/\s+AS\s+([A-Za-z0-9_]+)/i)?.[1] || field; output[alias] = aggregate(rows, field.replace(/\s+AS\s+.*$/i, "").trim()); }); result = [output]; }
  else { result = rows.map((row) => { const output: ResultRow = {}; fields.forEach((field) => { const alias = field.match(/\s+AS\s+([A-Za-z0-9_]+)/i)?.[1] || field; const source = field.replace(/\s+AS\s+.*$/i, "").trim(); output[alias] = source === "*" ? "" : valueOf(row, source); if (source === "*") Object.assign(output, row); }); return output; }); }
  if (orderField) { result.sort((a, b) => { const av = a[orderField]; const bv = b[orderField]; return (av === bv ? 0 : String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true })) * (orderDirection?.toUpperCase() === "DESC" ? -1 : 1); }); } if (top) result = result.slice(0, Number(top)); return { rows: result };
}

export function SqlPlayground() {
  const [query, setQuery] = useState(examples[0]); const [result, setResult] = useState<ResultRow[]>([]); const [message, setMessage] = useState("Pulsa Ejecutar para consultar la tabla Products.");
  const execute = () => { const response = runQuery(query); setResult(response.rows); setMessage(response.message || `${response.rows.length} fila${response.rows.length === 1 ? "" : "s"} devuelta${response.rows.length === 1 ? "" : "s"}.`); };
  return <section className="sql-playground"><div className="sql-playground-head"><div><p className="eyebrow">LABORATORIO SQL · PRÁCTICA SEGURA</p><h3>Escribe y ejecuta consultas</h3><p>Explora una tabla de productos de ejemplo. No necesitas instalar SQL Server.</p></div><span className="sql-lab-badge">LOCAL · SIN RIESGO</span></div><div className="sql-playground-grid"><aside className="sql-example-list"><strong>Consultas de ejemplo</strong>{examples.map((example, index) => <button type="button" key={example} onClick={() => setQuery(example)}><span>0{index + 1}</span>{example}</button>)}<div className="sql-schema-mini"><b>Products</b><span>Product · Category · Stock · Price · Color</span></div></aside><div className="sql-editor-area"><label htmlFor="sql-editor">Tu consulta</label><textarea id="sql-editor" value={query} onChange={(event) => setQuery(event.target.value)} spellCheck={false} aria-label="Editor de consultas SQL"/><div className="sql-editor-actions"><button type="button" className="primary-cta" onClick={execute}>▶ Ejecutar <span>F5</span></button><button type="button" onClick={() => { setQuery(""); setResult([]); setMessage("Editor limpio."); }}>Limpiar</button></div><p className="sql-run-message">{message}</p>{result.length > 0 && <div className="sql-result-table"><table><thead><tr>{Object.keys(result[0]).map((key) => <th key={key}>{key}</th>)}</tr></thead><tbody>{result.map((row, index) => <tr key={index}>{Object.keys(result[0]).map((key) => <td key={key}>{row[key] === null ? "NULL" : String(row[key])}</td>)}</tr>)}</tbody></table></div>}</div></div><div className="sql-lab-help"><b>Funciones disponibles:</b> COUNT · SUM · AVG · MIN · MAX · DISTINCT · WHERE · GROUP BY · ORDER BY · TOP · AND</div></section>;
}
