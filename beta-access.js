import {translate} from './i18n.js?v=20261108-no-language-prompt1';
import {config} from './config.js?v=20261107-music1';
export function createBetaAccess({getClient,getUser,onDenied}){
 let allowed=false,revision=0;
 const button=document.querySelector('#open-studio');
 const note=document.querySelector('#studio-unavailable');
 const badge=document.querySelector('#beta-version');
 const description=button.previousElementSibling;
 const render=()=>{
   button.disabled=false;
  button.textContent=translate('Open beta version ↗');
  note.textContent=translate('The sampler is available without an account. Song Studio remains locked.');
  badge.hidden=false;
  description.textContent=document.documentElement.lang==='de'?'16 Parts, 20 Patterns und bis zu 64 Schritte. Importiere eigene Samples, spiele mit Klang und FX und exportiere deinen Groove als WAV.':'16 parts, 20 patterns and up to 64 steps. Import your own samples, shape sound and FX, and export your groove as WAV.';
 };
 function reset(){revision++;allowed=false;render();onDenied();}
 // The sampler is public. Never send a user's access token, cookies, or credentials.
 // Supabase's publishable key identifies the web app but does not authenticate a person.
 async function request(part){
  const response=await fetch(`${config.url}/functions/v1/zynora-beta/${part}`,{
   method:'POST',mode:'cors',credentials:'omit',cache:'no-store',
   headers:{apikey:config.key,'Content-Type':'application/json'},body:'{}'
  });
  if(!response.ok)throw Error(`Sampler ${part} unavailable (${response.status})`);
  return response.json();
 }
 async function refresh(){
  const current=++revision;
  let next=false;try{next=(await request('status'))?.sampler===true;}catch{}
  if(current!==revision)return false;
  const lost=allowed&&!next;allowed=next;render();if(lost)onDenied();return allowed;
 }
 async function bundle(){
  const current=revision;
  try{
   const result=await request('bundle');
   if(current!==revision||result?.sampler!==true||result.song_studio!==false||typeof result.source!=='string')throw Error('Public sampler bundle unavailable');
   return result.source;
  }catch(error){reset();throw error;}
 }
 window.addEventListener('zynora-language-change',render);
 window.addEventListener('focus',()=>refresh());
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 setInterval(()=>{if(!document.hidden)refresh();},60000);
 render();return {refresh,reset,bundle,isAllowed:()=>allowed};
}

