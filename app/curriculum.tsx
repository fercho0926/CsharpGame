"use client";
import { useState } from "react";
import { curriculum } from "./curriculum-data";

export function Curriculum({onOpenModule}:{onOpenModule:(topic:string)=>void}){
 const [open,setOpen]=useState<string|null>(null);
 return <section className="curriculum"><div className="curriculum-title"><div><p className="eyebrow">PATH COMPLETO</p><h2>C# → <span>.NET profesional</span></h2><p>26 módulos · fundamentos, backend y entrevistas</p></div><span className="curriculum-badge">Ruta 2026</span></div><div className="track-label">C# FUNDAMENTALS <span>15 módulos</span></div>{curriculum.map((m,i)=><div className="curriculum-module" key={m.id}><button className="module-row" onClick={()=>setOpen(open===m.id?null:m.id)}><span className={`module-number ${m.kind===".NET"?"net-number":""}`}>{m.kind===".NET"?"N" : String(i+1).padStart(2,"0")}</span><span className="module-main"><b>{m.title}</b><small>{m.summary}</small></span><span className="module-time">{m.duration}</span><span className="module-chevron">{open===m.id?"⌃":"⌄"}</span></button>{open===m.id&&<div className="module-steps"><div className="module-steps-head"><span>{m.steps.length} pasos</span><span>{m.kind}</span></div>{m.steps.map((step,si)=><button className="step-row" key={step} onClick={()=>{if(si===m.steps.length-1&&m.kind==="C#")onOpenModule(i<2?"Todos":"POO")}}><span>{si+1}</span><span>{step}</span><small>{si===m.steps.length-1?"Reto":"Lección"}</small></button>)}</div>}</div>)}<div className="track-label net-label">.NET PROFESSIONAL <span>11 módulos</span></div></section>;
}
