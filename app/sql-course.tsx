"use client";

import { useState } from "react";

const modules = [
  { id: "rdbms", number: "01", title: "¿Qué es un RDBMS?", duration: "12 min", active: true },
  { id: "sql-server", number: "02", title: "SQL Server y sus herramientas", duration: "15 min", active: true },
  { id: "tables", number: "03", title: "Tablas, filas y columnas", duration: "Próximamente", active: false },
  { id: "relationships", number: "04", title: "Relaciones e integridad de datos", duration: "Próximamente", active: false },
];

const quizOptions = ["Un sistema que administra datos en una o varias tablas relacionadas", "Un lenguaje exclusivo para crear páginas web", "Un archivo de texto sin estructura", "Un programa que solo sirve para hacer reportes"];

export function SqlCourse() {
  const [selectedModule, setSelectedModule] = useState("rdbms");
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
          <div className="sql-modules-heading"><span>CURSO · FUNDAMENTOS</span><b>{selectedModule === "rdbms" ? "1" : "2"} de 4</b></div>
          {modules.map((module) => (
            <button key={module.id} type="button" className={`sql-module ${module.id === selectedModule ? "current" : ""} ${module.active ? "" : "locked"}`} disabled={!module.active} onClick={() => { if (module.active) { setSelectedModule(module.id); setSelected(null); setChecked(false); } }}>
              <span className="sql-module-number">{module.number}</span>
              <span className="sql-module-copy"><b>{module.title}</b><small>{module.duration}</small></span>
              <span className="sql-module-mark">{module.active ? "→" : "·"}</span>
            </button>
          ))}
          <div className="sql-note"><strong>Tu objetivo</strong><p>Entender por qué las bases relacionales son la base de tantos sistemas reales.</p></div>
        </aside>

        {selectedModule === "rdbms" ? <article className="sql-lesson">
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
        </article> : <SqlToolsLesson />}
      </div>
    </section>
  );
}

function SqlToolsLesson() {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const options = ["SSMS", "Azure Data Studio", "sqlcmd", "Excel"];
  return <article className="sql-lesson">
    <div className="sql-lesson-meta"><span>LECCIÓN 02</span><span>15 MIN · PRINCIPIANTE</span></div>
    <h3>Herramientas cliente de SQL Server</h3>
    <p className="sql-lead">Hay muchas formas de conectarse a SQL Server. En esta lección nos enfocaremos en SSMS, Azure Data Studio y <code>sqlcmd</code>: tres herramientas gratuitas mantenidas por Microsoft.</p>
    <div className="sql-callout"><span className="sql-callout-icon">⌘</span><div><strong>¿Qué tienen en común?</strong><p>Las tres se pueden instalar manualmente o con un administrador de paquetes y sirven para trabajar con SQL Server.</p></div></div>
    <h4>La diferencia principal</h4>
    <div className="sql-tools-table"><div className="sql-tools-row sql-tools-head"><b>Herramienta</b><b>Tipo</b><b>Sistema</b><b>Ideal para</b></div><div className="sql-tools-row"><strong>SSMS</strong><span>Gráfica</span><span>Solo Windows</span><span>Administradores</span></div><div className="sql-tools-row"><strong>Azure Data Studio</strong><span>Gráfica</span><span>Windows, Linux y macOS</span><span>Desarrolladores</span></div><div className="sql-tools-row"><strong><code>sqlcmd</code></strong><span>Línea de comandos</span><span>Windows, Linux y macOS</span><span>Automatización y scripts</span></div></div>
    <h4>¿Qué herramienta elegir?</h4>
    <p>En muchos casos puedes usar las tres. <b>SSMS</b> ofrece funciones avanzadas para administración, replicación y alta disponibilidad. <b>Azure Data Studio</b> incluye cuadernos y extensiones, útiles para explorar y desarrollar. <b>sqlcmd</b> es perfecto para automatizar tareas desde un script o una terminal.</p>
    <div className="sql-facts sql-tools-facts"><div><b>SSMS</b><span>Administración profunda y configuración del servidor.</span></div><div><b>ADS</b><span>Desarrollo, consultas exploratorias, notebooks y extensiones.</span></div><div><b>SQLCMD</b><span>Procesos repetibles, automatización y DevOps.</span></div></div>
    <div className="sql-callout sql-callout-soft"><span className="sql-callout-icon">↗</span><div><strong>¿Y los usuarios finales?</strong><p>No deberían tener que escribir consultas. Acceden a los datos a través de aplicaciones como Excel, un ERP o un CRM.</p></div></div>
    <div className="sql-quiz"><p className="eyebrow">COMPRUEBA LO QUE ENTENDISTE</p><h4>¿Qué herramienta es especialmente adecuada para automatización y scripts?</h4><div className="sql-quiz-options">{options.map((option, index) => <button type="button" key={option} className={`${selected === index ? "selected" : ""} ${checked && index === 2 ? "correct" : ""} ${checked && selected === index && index !== 2 ? "wrong" : ""}`} onClick={() => !checked && setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{checked && <p className={`sql-quiz-feedback ${selected === 2 ? "ok" : "retry"}`}>{selected === 2 ? "¡Correcto! sqlcmd funciona desde la línea de comandos y encaja muy bien en automatizaciones." : "Recuerda: sqlcmd es la herramienta de línea de comandos pensada para automatización y scripts."}</p>}<button type="button" className="primary-cta" disabled={selected === null} onClick={() => setChecked(true)}>{checked ? "Respuesta revisada" : "Comprobar respuesta"}<span>→</span></button></div>
  </article>;
}
