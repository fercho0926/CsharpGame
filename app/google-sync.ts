export type ProgressState={version:number;xp:number;streak:number;completed:number;correct:number;topic:string;planIds:string[];planIndex:number;mastered:Record<string,string[]>;moduleDone:boolean;completedSteps:string[];updatedAt:string};
export type SyncEvent={type:string;module?:string;step?:string;topic?:string;question?:string;answer?:string;correct?:boolean;xp?:number;progress?:ProgressState};
export async function sendToGoogleSheets(endpoint:string,event:SyncEvent){
 if(!endpoint.trim()) return false;
 try{await fetch(endpoint.trim(),{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(event)});return true}catch{return false}
}
export async function loadProgressFromGoogleSheets(endpoint:string){
 if(!endpoint.trim()) return null;
 try{const url=new URL(endpoint.trim(),window.location.origin);url.searchParams.set("action","progress");const response=await fetch(url);if(!response.ok)return null;const data=await response.json();return data.progress||null}catch{return null}
}
