export type SyncEvent={type:string;module?:string;step?:string;topic?:string;question?:string;answer?:string;correct?:boolean;xp?:number};
export async function sendToGoogleSheets(endpoint:string,event:SyncEvent){
 if(!endpoint.trim()) return false;
 try{await fetch(endpoint.trim(),{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(event)});return true}catch{return false}
}
