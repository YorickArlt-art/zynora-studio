const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const assert=require('node:assert/strict');const os=require('os');
const ROOT=path.resolve(__dirname,'..'),TMP=process.env.ZYNORA_QA_DIR||path.join(os.tmpdir(),'zynora-v12-qa');fs.mkdirSync(TMP,{recursive:true});
(async()=>{
 const {source:builtSource}=await import(require('url').pathToFileURL(path.join(ROOT,'supabase/functions/zynora-beta/sampler-source.mjs')).href);
 const source=process.env.ZYNORA_QA_ORIGINAL_UI==='1'?builtSource.split('// Phone-only presentation layer.')[0]:builtSource;
 const loopAssets=fs.readdirSync(path.join(ROOT,'assets/factory-loops')).filter(f=>f.endsWith('.mp3')).map(f=>({id:f.replace('.mp3',''),name:f,category:'Loops',url:'https://www.zynora-studio.com/assets/factory-loops/'+f}));
 const http=require('http');const types={'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.mp3':'audio/mpeg','.json':'application/json'};
 const server=http.createServer((req,res)=>{const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(ROOT,'.'+(rel==='/'?'/index.html':rel));if(!file.startsWith(ROOT+path.sep)){res.writeHead(403);return res.end();}try{const bytes=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(bytes);}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const ORIGIN='http://127.0.0.1:'+server.address().port;
 const fixture=process.env.ZYNORA_TEST_MP3||path.join(TMP,'test-song.mp3');if(!fs.existsSync(fixture)){require('child_process').execFileSync('ffmpeg',['-v','error','-y','-f','lavfi','-i','sine=frequency=110:duration=75','-ar','8000','-ac','1','-b:a','64k',fixture]);}
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,acceptDownloads:true,isMobile:true,hasTouch:true});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await context.route('https://www.zynora-studio.com/**',async r=>{const u=new URL(r.request().url());const resp=await r.fetch({url:ORIGIN+u.pathname+u.search});await r.fulfill({response:resp});});
 const testSource='const FACTORY_LOOP_ASSETS='+JSON.stringify(loopAssets)+';\n'+source+'\nwindow.__qa={engine,getproject:()=>project,playing:()=>playing,validateProject,importSong,flush};';
 await context.route('https://itywthgzirkjtbzvjfqi.supabase.co/**',async r=>{const u=r.request().url();if(u.endsWith('/bundle'))return r.fulfill({json:{source:testSource,sampler:true,song_studio:false}});if(u.endsWith('/status'))return r.fulfill({json:{sampler:true,song_studio:false}});return r.fulfill({json:[]});});
 await page.goto(ORIGIN);await page.evaluate(()=>localStorage.setItem('zynora-language','de'));await page.reload();
 await page.waitForSelector('.release-gradient');
 console.log('HERO',await page.locator('.release-announcement').innerText());
 console.log('ANIMATION',await page.locator('.release-gradient').evaluate(e=>getComputedStyle(e).animationName));const beforeColor=await page.locator('.release-gradient').evaluate(e=>getComputedStyle(e).backgroundPosition);await page.waitForTimeout(700);assert.notEqual(await page.locator('.release-gradient').evaluate(e=>getComputedStyle(e).backgroundPosition),beforeColor,'Gradient must actually move');
 await page.screenshot({path:path.join(TMP,'home.png'),fullPage:false});
 await page.goto(ORIGIN+'/#open');await page.locator('#open-studio').click();
 if(await page.locator('#storage-dialog').isVisible())await page.locator('#storage-accept').click();
 await page.locator('#choose-sampler').waitFor({state:'visible',timeout:20000});await page.waitForFunction(()=>!document.querySelector('#choose-sampler').disabled);await page.locator('#choose-sampler').click();
 await page.locator('#ht-song-add').waitFor({state:'visible'});
 assert.equal(await page.locator('#ht-controls-toggle').getAttribute('aria-expanded'),'false','Mobile toolbar starts collapsed');
 assert.equal(await page.locator('#ht-name').isVisible(),false,'Project details are tucked away');
 for(const id of ['ht-play','ht-stop','ht-audio-rec','ht-bpm','ht-song-add'])assert(await page.locator('#'+id).isVisible(),'Essential control visible: '+id);
 await page.screenshot({path:path.join(TMP,'phone-compact.png')});
 await page.locator('#ht-controls-toggle').click();await page.waitForTimeout(300);
 assert.equal(await page.locator('#ht-controls-toggle').getAttribute('aria-expanded'),'true','Disclosure opens');
 assert.equal(await page.locator('#ht-name').isVisible(),true,'Original project controls available');
 await page.screenshot({path:path.join(TMP,'phone-expanded.png')});
 console.log('BARS',await page.locator('.ht-projectbar').isVisible(),await page.locator('#ht-stop').isVisible(),await page.locator('#ht-master').isVisible());
 await page.locator('#ht-song-file').setInputFiles(process.env.ZYNORA_TEST_MP3||path.join(TMP,'test-song.mp3'));await page.waitForFunction(()=>window.__qa.getproject()?.song);
 await page.waitForFunction(()=>document.querySelector('#ht-song-add').disabled===false);
 assert.equal(await page.evaluate(()=>__qa.engine.buffers.get(__qa.getproject().song.sound).duration>60),true,'A whole song must import, beyond the old 60-second sample limit');
 console.log('IMPORTED',await page.evaluate(()=>({duration:__qa.engine.buffers.get(__qa.getproject().song.sound).duration,kind:Object.values(__qa.getproject().samples)[0].kind})));
 await page.locator('#ht-play').click();await page.waitForTimeout(700);
 assert.equal(await page.evaluate(()=>__qa.playing()&&!!__qa.engine.graph.songVoice&&__qa.engine.ctx.state==='running'),true,'Backing song must be scheduled in the real audio context');
 await page.locator('#ht-controls-toggle').click();await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>__qa.playing()&&!!__qa.engine.graph.songVoice),true,'Collapsing controls must not interrupt audio');
 // Measure the actual shared live output, rather than only observing the Play label.
 const originalMix=await page.evaluate(()=>{const p=__qa.getproject();return {parts:structuredClone(p.parts),rows:structuredClone(p.patterns[p.activePattern].rows),loops:p.loops.map(x=>x.enabled)};});
 await page.locator('#ht-stop').click();
 await page.evaluate(()=>{const p=__qa.getproject(),e=__qa.engine,b=e.ctx.createBuffer(1,Math.round(e.ctx.sampleRate*.45),e.ctx.sampleRate),pcm=b.getChannelData(0);for(let i=0;i<pcm.length;i++)pcm[i]=Math.sin(i*2*Math.PI*880/e.ctx.sampleRate)*.5;e.buffers.set('qa-mix-tone',b);p.parts.forEach(x=>x.mute=true);p.loops.forEach(x=>x.enabled=false);Object.assign(p.parts[0],{sound:'qa-mix-tone',mute:false,solo:false,volume:.6,drive:0,pitch:0,cutoff:18000,trimStart:0,trimEnd:1,decay:1});p.patterns[p.activePattern].rows[0]=Array.from({length:64},(_,i)=>i%4===0?{v:1,n:0,roll:1,prob:1}:null);});
 await page.locator('#ht-play').click();
 const clock=await page.evaluate(()=>{const e=__qa.engine;window.__backingBeforePad=e.graph.songVoice;return {song:e.graph.songVoice.time,pattern:Math.min(...[...e.graph.voices].map(v=>v.time))};});assert(Math.abs(clock.song-clock.pattern)<1/48000,'Song and first pattern hit must use the exact same audio-clock time');
 await page.waitForTimeout(200);
 const spectrum=await page.evaluate(async()=>{const e=__qa.engine,a=e.ctx.createAnalyser();a.fftSize=8192;a.smoothingTimeConstant=0;e.graph.limiter.connect(a);await new Promise(r=>setTimeout(r,100));const bins=new Float32Array(a.frequencyBinCount);a.getFloatFrequencyData(bins);const band=f=>{const i=Math.round(f*a.fftSize/e.ctx.sampleRate);return Math.max(...bins.slice(i-2,i+3));};const result={backing110Hz:band(110),samples880Hz:band(880)};e.graph.limiter.disconnect(a);return result;});console.log('LIVE_MIX_SPECTRUM',spectrum);assert(spectrum.backing110Hz>-45,'Imported song must be audible at the live master');assert(spectrum.samples880Hz>-45,'Pattern samples must be audible at the same live master');
 await page.locator('#ht-pads button').first().dispatchEvent('pointerdown',{pointerId:1,button:0});await page.waitForTimeout(30);assert.equal(await page.evaluate(()=>__qa.engine.graph.songVoice===window.__backingBeforePad&&!window.__backingBeforePad.stopped),true,'Playing a pad must leave the backing song running');
 await page.waitForTimeout(1800);assert.equal(await page.evaluate(()=>__qa.engine.songPosition(__qa.getproject())>1.5),true,'Song continues across repeating pattern boundaries');
 await page.locator('#ht-stop').click();
 await page.evaluate(mix=>{const p=__qa.getproject();p.parts=mix.parts;p.patterns[p.activePattern].rows=mix.rows;p.loops.forEach((x,i)=>x.enabled=mix.loops[i]);__qa.engine.buffers.delete(p.song.sound);},originalMix);
 await page.locator('#ht-play').click();await page.waitForFunction(()=>!!window.__qa.engine.graph.songVoice);assert.equal(await page.evaluate(()=>!!__qa.engine.graph.songVoice),true,'Play re-decodes a saved backing file if its audio buffer was lost');
 // A phone file picker may hide the document, which invokes the app's background stop.
 const chooserEvent=page.waitForEvent('filechooser');await page.locator('#ht-song-add').click();const chooser=await chooserEvent;
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});});
 await chooser.setFiles(process.env.ZYNORA_TEST_MP3||path.join(TMP,'test-song.mp3'));await page.waitForFunction(()=>!document.querySelector('#ht-song-add').disabled);
 assert.equal(await page.evaluate(()=>__qa.playing()&&!!__qa.engine.graph.songVoice),true,'After adding a song to a playing session, song and pattern resume together even when the file picker caused a background stop');
 console.log('PLAYBACK',await page.evaluate(()=>({playing:__qa.playing(),song:!!__qa.engine.graph.songVoice,position:__qa.engine.songPosition(__qa.getproject()),state:__qa.engine.ctx.state})));
 await page.locator('#ht-song-toggle').click();await page.locator('#ht-song-start').fill('2');await page.locator('#ht-song-start').dispatchEvent('change');await page.locator('#ht-song-end').fill('6');await page.locator('#ht-song-end').dispatchEvent('change');await page.locator('#ht-song-loop').click();
 await page.locator('#ht-song-volume').fill('40');await page.locator('#ht-song-volume').dispatchEvent('input');
 await page.waitForTimeout(300);
 console.log('EDIT',await page.evaluate(()=>({song:__qa.getproject().song,nodeLoop:__qa.engine.graph.songVoice.src.loop,nodeStart:__qa.engine.graph.songVoice.src.loopStart,nodeEnd:__qa.engine.graph.songVoice.src.loopEnd,gain:__qa.engine.graph.songVoice.gain.gain.value})));
 await page.screenshot({path:path.join(TMP,'phone.png'),fullPage:false});
 // A backing-only offline export must contain actual audio, not just metadata.
 const offline=await page.evaluate(async()=>{const p=structuredClone(__qa.getproject());p.parts.forEach(x=>x.mute=true);p.loops.forEach(x=>x.enabled=false);p.song.position=2;const b=await __qa.engine.render(p,[0]);let energy=0;for(const f of b.getChannelData(0))energy+=f*f;return {frames:b.length,energy};});assert(offline.energy>1,'Backing track must be audible in WAV rendering even when all pads/loops are muted');console.log('OFFLINE',offline);
 // Pause preserves position; stop resets to the selected loop start.
 await page.locator('#ht-play').click();const paused=await page.evaluate(()=>__qa.getproject().song.position);await page.waitForTimeout(250);console.log('PAUSE',paused,await page.evaluate(()=>__qa.engine.songPosition(__qa.getproject())));
 await page.locator('#ht-stop').click();console.log('RESET',await page.evaluate(()=>__qa.getproject().song.position));
 await page.evaluate(()=>__qa.flush());await page.reload();await page.locator('#open-studio').click();await page.waitForFunction(()=>document.querySelector('#choose-sampler')&&!document.querySelector('#choose-sampler').disabled);await page.locator('#choose-sampler').click();
 assert.equal(await page.evaluate(()=>!!__qa.engine.buffers.get(__qa.getproject().song.sound)),true,'Reload must restore decoded backing audio');
 console.log('RESTORED',await page.evaluate(()=>({song:__qa.getproject().song,buffer:!!__qa.engine.buffers.get(__qa.getproject().song.sound)})));
 await page.locator('#ht-controls-toggle').click();await page.waitForTimeout(300);const backup=page.waitForEvent('download');await page.locator('#ht-backup').scrollIntoViewIfNeeded();await page.locator('#ht-backup').click();const d=await backup;await d.saveAs(path.join(TMP,'backup.json'));console.log('BACKUP',fs.statSync(path.join(TMP,'backup.json')).size);
 await page.locator('#ht-restore').scrollIntoViewIfNeeded();await page.locator('#ht-project-file').setInputFiles(path.join(TMP,'backup.json'));await page.waitForTimeout(500);console.log('BACKUP_RESTORE',await page.evaluate(()=>!!__qa.engine.buffers.get(__qa.getproject().song.sound)));
 console.log('OVERFLOW',await page.evaluate(()=>({screen:innerWidth,page:document.documentElement.scrollWidth,workspace:document.querySelector('#sampler-workspace').scrollWidth,body:document.querySelector('.ht-body').getBoundingClientRect().width})));
 // Existing sequencing and pads still create real voices and editable steps.
 await page.locator('[data-ht-view=steps]').click();await page.locator('.ht-step').first().click();
 assert.equal(await page.evaluate(()=>__qa.getproject().patterns[__qa.getproject().activePattern].rows[0][0]===null),true,'Step toggle must still edit the active pattern');
 await page.locator('[data-ht-view=perform]').click();await page.locator('#ht-pads button').first().dispatchEvent('pointerdown',{pointerId:1});
 assert.equal(await page.evaluate(()=>__qa.engine.voices.size>0),true,'Pads must still trigger real voices');
 if(await page.locator('#ht-controls-toggle').getAttribute('aria-expanded')==='false'){await page.locator('#ht-controls-toggle').click();await page.waitForTimeout(300);}const wavDownload=page.waitForEvent('download');await page.locator('#ht-export').scrollIntoViewIfNeeded();await page.locator('#ht-export').click();const wav=await wavDownload;await wav.saveAs(path.join(TMP,'mix.wav'));assert.equal(fs.readFileSync(path.join(TMP,'mix.wav')).subarray(0,4).toString(),'RIFF');
 for(const width of [320,360,390,430,768,1024]){await page.setViewportSize({width,height:844});const dimensions=await page.evaluate(()=>({view:innerWidth,page:document.documentElement.scrollWidth,workspace:document.querySelector('#sampler-workspace').scrollWidth}));assert(dimensions.page<=width&&dimensions.workspace<=width,'No page overflow at '+width);assert(await page.locator('#ht-song-add').isVisible(),'Add song visible at '+width);}
 await page.setViewportSize({width:390,height:844});
 const previousSong=await page.evaluate(()=>__qa.getproject().song.sound);await page.locator('#ht-song-file').setInputFiles({name:'too-large.mp3',mimeType:'audio/mpeg',buffer:Buffer.alloc(25*1024*1024)});await page.waitForFunction(()=>document.querySelector('#ht-song-add').disabled===false);assert.equal(await page.evaluate(()=>__qa.getproject().song.sound),previousSong,'Rejected oversized file must preserve the original song');
 await page.setViewportSize({width:1440,height:1000});assert.equal(await page.locator('.ht-transport #ht-export').count(),1,'Desktop transport keeps its original controls');assert.equal(await page.locator('#ht-controls-toggle').isVisible(),false,'Desktop needs no disclosure');await page.screenshot({path:path.join(TMP,'desktop.png')});
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.release-gradient').evaluate(e=>getComputedStyle(e).animationName),'none','Reduced motion must stop the gradient animation');
 console.log('ERRORS',errors);await browser.close();server.close();
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
