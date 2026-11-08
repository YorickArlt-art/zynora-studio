import {translate} from './i18n.js?v=20261108-studio-access1';
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
  note.textContent=translate(signedIn?(allowed?'You are signed in. The sampler is available; Song Studio remains locked.':'You are signed in. Sampler access is being checked. Song Studio remains locked.'):'Sign in with email or Discord to open the sampler beta. Song Studio remains locked.');
  badge.hidden=false;
  description.textContent=document.documentElement.lang==='de'?'16 Parts, 20 Patterns und bis zu 64 Schritte. Importiere eigene Samples, spiele mit Klang und FX und exportiere deinen Groove als WAV.':'16 parts, 20 patterns and up to 64 steps. Import your own samples, shape sound and FX, and export your groove as WAV.';
 };
 function reset(){revision++;allowed=false;render();onDenied();}
 async function request(part){
  const client=getClient();if(!client||!getUser())throw Error('Sign in required');
  const {data,error}=await client.functions.invoke('zynora-beta/'+part,{body:{}});
  if(error)throw error;return data;
 }
 async function refresh(){
  const current=++revision,identity=getUser()?.id;
  if(!identity){allowed=false;render();return false;}
  let next=false;try{next=(await request('status'))?.sampler===true;}catch{}
  if(current!==revision||getUser()?.id!==identity)return false;
  const lost=allowed&&!next;allowed=next;render();if(lost)onDenied();return allowed;
 }
 async function bundle(){
  const identity=getUser()?.id,current=revision;
  try{
   const result=await request('bundle');
   if(getUser()?.id!==identity||current!==revision||result?.sampler!==true||typeof result.source!=='string')throw Error('Beta access required');
   return result.source;
  }catch(error){reset();onDenied();throw error;}
 }
 window.addEventListener('zynora-language-change',render);
 window.addEventListener('focus',()=>refresh());
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 setInterval(()=>{if(!document.hidden)refresh();},60000);
 render();return {refresh,reset,bundle,isAllowed:()=>allowed};
}
