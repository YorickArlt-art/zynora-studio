export async function prepareMp3(file,onProgress=()=>{},signal){
 if(file.size>60*1024*1024)throw Error('Die Audiodatei darf höchstens 60 MB groß sein.');
 if(signal?.aborted)throw new DOMException('Abgebrochen','AbortError');
 if(/\.mp3$/i.test(file.name||'')){
  if(file.size>25*1024*1024)throw Error('MP3 darf höchstens 25 MB groß sein.');
  const duration=await new Promise((resolve,reject)=>{const element=new Audio(),url=URL.createObjectURL(file);const done=(error,value)=>{URL.revokeObjectURL(url);element.removeAttribute('src');element.load();error?reject(error):resolve(value);};element.preload='metadata';element.onloadedmetadata=()=>Number.isFinite(element.duration)&&element.duration>=.1&&element.duration<=600?done(null,element.duration):done(Error('MP3 darf höchstens 10 Minuten lang sein.'));element.onerror=()=>done(Error('Die MP3 konnte nicht gelesen werden.'));element.src=url;});
  return {blob:new Blob([file],{type:'audio/mpeg'}),duration};
 }
 const ctx=new AudioContext({sampleRate:44100});let audio;
 try{audio=await ctx.decodeAudioData(await file.arrayBuffer());}finally{await ctx.close();}
 if(audio.duration>242||audio.duration<.1)throw Error('Für die Konvertierung sind maximal 4 Minuten möglich. Längere Titel kannst du als fertige MP3 hochladen.');
 if(signal?.aborted)throw new DOMException('Abgebrochen','AbortError');
 const duration=audio.duration,sampleRate=audio.sampleRate,left=audio.getChannelData(0).slice(),right=audio.numberOfChannels>1?audio.getChannelData(1).slice():null;audio=null;
 const blob=await new Promise((resolve,reject)=>{const worker=new Worker(new URL('./mp3-worker.js?v=20261107-music1',import.meta.url));const abort=()=>{clearTimeout(timer);worker.terminate();reject(new DOMException('Abgebrochen','AbortError'));};const timer=setTimeout(()=>{worker.terminate();signal?.removeEventListener('abort',abort);reject(Error('Die MP3-Konvertierung hat zu lange gedauert.'));},180000);signal?.addEventListener('abort',abort,{once:true});worker.onmessage=e=>{if(e.data.progress!==undefined)onProgress(e.data.progress);else{clearTimeout(timer);worker.terminate();signal?.removeEventListener('abort',abort);e.data.error?reject(Error(e.data.error)):resolve(e.data.blob);}};worker.onerror=e=>{clearTimeout(timer);worker.terminate();signal?.removeEventListener('abort',abort);reject(Error(e.message||'MP3-Konvertierung fehlgeschlagen.'));};worker.postMessage({left,right,sampleRate},right?[left.buffer,right.buffer]:[left.buffer]);});
 if(blob.size>25*1024*1024)throw Error('Die fertige MP3 ist größer als 25 MB.');return {blob,duration};
}
