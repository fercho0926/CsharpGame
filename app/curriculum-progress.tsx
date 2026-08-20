"use client";
import { useState } from "react";
import { curriculum } from "./curriculum";

const lessonMap:Record<string,string[]>={
 m01:["m02-variables"],
 m02:["m02-variables","m02-builtins","m02-strings","m02-operators","m02-datetime","m02-conversions","m02-var","m02-challenge"],
 m03:["m03-bool","m03-if","m03-switch","m03-while","m03-dowhile","m03-for","m03-foreach","m03-scope"],
 m04:["m04-declare","m04-return","m04-overload","m04-scope","m04-optional","m04-expression","m04-main","m04-challenge"],
 m05:["m05-create","m05-interpolation","m05-escape","m05-compare","m05-methods","m05-parse","m05-builder","m05-challenge"],
 m06:["m06-class","m06-members","m06-constructors","m06-new","m06-instances","m06-instance-methods","m06-challenge"],
 m07:["m07-value-ref","m07-pass-value","m07-ref-out-in","m07-string-ref","m07-enums","m07-structs","m07-nullable","m07-challenge"],
 m08:["m08-namespace","m08-static","m08-null","m08-gc","m08-library","m08-records","m08-compare","m08-challenge"],
 m09:["m09-array","m09-multi","m09-list","m09-dictionary","m09-hashset","m09-enumerable","m09-choice","m09-challenge"],
 m10:["m10-oop","m10-encapsulation","m10-access","m10-inheritance","m10-derived","m10-isa","m10-composition","m10-challenge"]
};
export function CurriculumProgress({completedSteps,onOpenModule,onOpenLesson}:{completedSteps:string[];onOpenModule:(topic:string)=>void;onOpenLesson:(id:string)=>void}){
 const [open,setOpen]=useState<string|null>(null);
 return <section className="curriculum"><div className="curriculum-title"><div><p className="eyebrow">PATH COMPLETO</p><h2>C# → <span>.NET profesional</span></h2><p>27 módulos · conceptos, prácticas y retos</p></div><span className="curriculum-badge">Ruta 2026</span></div><div className="track-label">C# FUNDAMENTALS <span>15 módulos</span></div>{curriculum.map((m,i)=>{const lessonIds=lessonMap[m.id]||[];const done=lessonIds.filter(id=>completedSteps.includes(id)).length;const status=lessonIds.length===0?"No iniciado":done===lessonIds.length?"Completado":done>0?"En progreso":"No iniciado";return <div className="curriculum-module" key={m.id}><button className="module-row" onClick={()=>setOpen(open===m.id?null:m.id)}><span className={`module-number ${m.kind===".NET"?"net-number":""}`}>{m.kind===".NET"?"N":String(i+1).padStart(2,"0")}</span><span className="module-main"><b>{m.title}</b><small>{m.summary}</small></span><span className={`module-progress ${status.toLowerCase().replace(" ","-")}`}>{status}{lessonIds.length>0&&` · ${done}/${lessonIds.length}`}</span><span className="module-chevron">{open===m.id?"⌃":"⌄"}</span></button>{open===m.id&&<div className="module-steps"><div className="module-steps-head"><span>{m.steps.length} pasos</span><span>{m.kind}</span></div>{m.steps.map((step,si)=>{const lessonId=lessonIds[si];const isDone=lessonId&&completedSteps.includes(lessonId);const label=lessonId?(isDone?"Completado":"No iniciado"):"Contenido pendiente";return <button className="step-row" key={step} onClick={()=>lessonId?onOpenLesson(lessonId):(si===m.steps.length-1&&m.kind==="C#"&&onOpenModule(i<2?"Todos":"POO"))}><span className={isDone?"step-check":""}>{isDone?"✓":si+1}</span><span>{step}</span><small className={isDone?"step-done":""}>{label}</small></button>})}</div>}</div>})}<div className="track-label net-label">.NET PROFESSIONAL <span>12 módulos</span></div></section>;
}
