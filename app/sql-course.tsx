"use client";

import { useState } from "react";

const modules = [
  { id: "rdbms", number: "01", title: "¿Qué es un RDBMS?", duration: "12 min", active: true },
  { id: "sql-server", number: "02", title: "SQL Server y sus herramientas", duration: "Próximamente", active: false },
  { id: "tables", number: "03", title: "Tablas, filas y columnas", duration: "Próximamente", active: false },
  { id: "relationships", number: "04", title: "Relaciones e integridad de datos", duration: "Próximamente", active: false },
];

const quizOptions = ["Un sistema que administra datos en una o varias tablas relacionadas", "Un lenguaje exclusivo para crear páginas web", "Un archivo de texto sin estructura", "Un programa que solo sirve para hacer reportes"];

export function SqlCourse() {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <section className="sql-course">
      <div className="sql-course-hero">
        <div>
          <p className="eyebrow sql-eyebrow">NUEVA RUTA · SQL</p>
          <h2>Datos que <span>tienen sentido.</span></h2>
          <p>Aprende a modelar, consultar y cuidar información con bases de datos relacionales.</p>
        </div>
        <div className="sql-emblem" aria-hidden="true"><span>SQL</span><small>DATA</small></div>
      </div>

      <div className="sql-layout">
        <aside className="sql-modules" aria-label="Módulos del curso SQL">
          <div className="sql-modules-heading"><span>CURSO · FUNDAMENTOS</span><b>1 de 4</b></div>
          {modules.map((module) => (
            <button key={module.id} type="button" className={`sql-module ${module.active ? "current" : "locked"}`} disabled={!module.active}>
              <span className="sql-module-number">{module.number}</span>
              <span className="sql-module-copy"><b>{module.title}</b><small>{module.duration}</small></span>
              <span className="sql-module-mark">{module.active ? "→" : "·"}</span>
            </button>
          ))}
          <div className="sql-note"><strong>Tu objetivo</strong><p>Entender por qué las bases relacionales son la base de tantos sistemas reales.</p></div>
        </aside>

        <article className="sql-lesson">
          <div className="sql-lesson-meta"><span>LECCIÓN 01</span><span>12 MIN · PRINCIPIANTE</span></div>
          <h3>¿Qué es un RDBMS?</h3>
          <p className="sql-lead">Un RDBMS —sistema de gestión de bases de datos relacionales— administra información organizada en una o varias tablas conectadas mediante relaciones.</p>

          <div className="sql-callout"><span className="sql-callout-icon">◎</span><div><strong>En una frase</strong><p>Un RDBMS guarda datos estructurados y mantiene las conexiones entre ellos para que la información siga siendo confiable.</p></div></div>

          <h4>La anatomía de una tabla</h4>
          <p>Una tabla tiene dos piezas principales: las <b>filas</b>, que son los registros, y las <b>columnas</b>, que describen sus atributos o campos.</p>
          <div className="sql-table-wrap">
            <div className="sql-table-label">clientes</div>
            <table><thead><tr><th>id <i>clave</i></th><th>nombre</th><th>ciudad</th></tr></thead><tbody><tr><td>101</td><td>Lucía Torres</td><td>Mérida</td></tr><tr><td>102</td><td>Diego Ruiz</td><td>Oaxaca</td></tr><tr><td>103</td><td>Amaya Chen</td><td>Puebla</td></tr></tbody></table>
            <div className="sql-table-caption"><span>3 filas · 3 columnas</span><span>cada fila = un registro</span></div>
          </div>

          <h4>¿Por qué “relacional”?</h4>
          <p>Las tablas pueden depender unas de otras. Por ejemplo, un pedido debe apuntar a un cliente que ya exista. Una restricción evita pedidos “huérfanos” y protege la <b>integridad</b> de los datos.</p>
          <div className="sql-relationship"><div><span>clientes</span><b>id</b></div><div className="sql-connector"><span>1</span><i>→</i><span>muchos</span></div><div><span>pedidos</span><b>cliente_id</b></div></div>

          <div className="sql-facts"><div><b>CRUD</b><span>Los datos se pueden insertar, consultar, actualizar y eliminar.</span></div><div><b>Índices</b><span>Ayudan a encontrar información rápidamente, como un índice telefónico.</span></div><div><b>Usos</b><span>ERP, CRM, finanzas, aerolíneas, comercio electrónico y salud.</span></div></div>

          <h4>Dos grandes formas de usarlo</h4>
          <div className="sql-use-cards"><div><span>OLTP</span><strong>Transaccional</strong><p>Operaciones del día a día: ventas, pedidos, nómina o inventario.</p></div><div><span>OLAP</span><strong>Analítico</strong><p>Reportes, inteligencia de negocio y análisis de grandes volúmenes.</p></div></div>

          <div className="sql-quiz"><p className="eyebrow">COMPRUEBA LO QUE ENTENDISTE</p><h4>¿Qué define mejor a un RDBMS?</h4><div className="sql-quiz-options">{quizOptions.map((option, index) => <button type="button" key={option} className={`${selected === index ? "selected" : ""} ${checked && index === 0 ? "correct" : ""} ${checked && selected === index && index !== 0 ? "wrong" : ""}`} onClick={() => !checked && setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{checked && <p className={`sql-quiz-feedback ${selected === 0 ? "ok" : "retry"}`}>{selected === 0 ? "¡Correcto! Las relaciones y la estructura son la esencia de un RDBMS." : "Casi. Recuerda: administra datos estructurados en tablas conectadas por relaciones."}</p>}<button type="button" className="primary-cta" disabled={selected === null} onClick={() => setChecked(true)}>{checked ? "Respuesta revisada" : "Comprobar respuesta"}<span>→</span></button></div>
        </article>
      </div>
    </section>
  );
}
