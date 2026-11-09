import {translate} from './i18n.js?v=20261108-no-language-prompt1';
export function createBetaAccess({getClient,getUser,onDenied}){
 let allowed=false,revision=0;
 const button=document.querySelector('#open-studio');
 const note=document.querySelector('#studio-unavailable');
 const badge=document.querySelector('#beta-version');
 const description=button.previousElementSibling;
 const render=()=>{
  const signedIn=!!getUser();
  button.disabled=false;
  button.textContent=translate('Open beta version ↗');
  note.textContent=translate('The sampler is available without an account. Song Studio remains locked.');
  badge.hidden=false;
  description.textContent=document.documentElement.lang==='de'?'16 Parts, 20 Patterns und bis zu 64 Schritte. Importiere eigene Samples, spiele mit Klang und FX und exportiere deinen Groove als WAV.':'16 parts, 20 patterns and up to 64 steps. Import your own samples, shape sound and FX, and export your groove as WAV.';
 };
 function reset(){revision++;allowed=false;render();onDenied();}
 async function request(part){
  const client=getClient();if(!client)throw Error('Studio connection is not ready');
  const {data,error}=await client.functions.invoke('zynora-beta/'+part,{body:{}});
  if(error)throw error;return data;
 }
 async function refresh(){
  const current=++revision,identity=getUser()?.id;
  if(!identity){allowed=true;render();return true;}
  let next=false;try{next=(await request('status'))?.sampler===true;}catch{}
  if(current!==revision||getUser()?.id!==identity)return false;
  const lost=allowed&&!next;allowed=next;render();if(lost)onDenied();return allowed;
 }
 async function bundle(){
  const identity=getUser()?.id,current=revision;
  try{
   const result=await request('bundle');
   if(getUser()?.id!==identity||current!==revision||typeof result.source!=='string')throw Error('Studio bundle unavailable');
   return result.source;
  }catch(error){reset();onDenied();throw error;}
 }
 window.addEventListener('zynora-language-change',render);
 window.addEventListener('focus',()=>refresh());
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 setInterval(()=>{if(!document.hidden)refresh();},60000);
 render();return {refresh,reset,bundle,isAllowed:()=>allowed};
}

