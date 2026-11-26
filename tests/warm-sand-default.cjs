const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..'),OUT='/tmp/zynora-warm-sand-qa';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const {source}=await import(require('url').pathToFileURL(path.join(ROOT,'supabase/functions/zynora-beta/sampler-source.mjs')).href);const assets=fs.readdirSync(path.join(ROOT,'assets/factory-loops')).filter(f=>f.endsWith('.mp3')).map(f=>({id:f.slice(0,-4),name:f,category:'Loops',url:'https://www.zynora-studio.com/assets/factory-loops/'+f}));const served='const FACTORY_LOOP_ASSETS='+JSON.stringify(assets)+';\n'+source+'\nwindow.__qa={engine,flush,getproject:()=>project,playing:()=>playing};';const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const errors=[],checks=[],contexts=[];
async function setup({width=390,reduced='reduce',malformed=false}={}){const c=await browser.newContext({viewport:{width,height:900},acceptDownloads:true,reducedMotion:reduced});contexts.push(c);await c.addInitScript(({malformed})=>{localStorage.setItem('zynora-language','de');localStorage.setItem('zynora-storage-notice-v1','accepted');if(malformed){localStorage.setItem('zynora-sampler-style-v1','custom');localStorage.setItem('zynora-custom-style-v1','{broken');}},{malformed});await c.route('https://www.zynora-studio.com/**',async r=>{const u=new URL(r.request().url()),file=path.resolve(ROOT,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(ROOT+path.sep))return r.fulfill({status:403});try{await r.fulfill({path:file,contentType:({'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.mp3':'audio/mpeg','.json':'application/json'})[path.extname(file)]||'application/octet-stream'});}catch{await r.fulfill({status:404});}});await c.route('https://itywthgzirkjtbzvjfqi.supabase.co/**',r=>r.fulfill({json:r.request().url().endsWith('/bundle')?{source:served,sampler:true,song_studio:false}:{sampler:true,song_studio:false}}));const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));return {p,c};}
async function openOwn(p){await p.goto('https://www.zynora-studio.com/');await p.locator('[data-open-style=custom]').click();await p.locator('#zs-settings[open]').waitFor();await p.locator('#zs-custom-editor').waitFor({state:'visible'});}
async function range(p,id,value){await p.locator('#zsc-'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},value);await p.waitForTimeout(40);}
async function color(p,id,value){const hex=p.locator('#zsc-color-'+id+' + input');await hex.fill(value);await hex.dispatchEvent('change');await p.waitForTimeout(40);}
async function group(p,text){const d=p.locator('.zsc-group').filter({has:p.locator('summary',{hasText:text})}).first();if(!await d.evaluate(e=>e.open))await d.locator('summary').click();return d;}
try{
for(const previous of ['new','3','custom']){
 const {p,c}=await setup();
 await c.addInitScript(previous=>{
  if(localStorage.getItem('warm-sand-test-seeded'))return;
  localStorage.setItem('warm-sand-test-seeded','1');localStorage.setItem('unrelated-project-sentinel','keep');
  if(previous!=='new')localStorage.setItem('zynora-sampler-style-v1',previous);
  if(previous==='custom')localStorage.setItem('zynora-custom-style-v1',JSON.stringify({version:1,config:{colors:{bg:'#010203',accent:'#abcdef'}}}));
 },previous);
 await p.goto('https://www.zynora-studio.com/');
 const state=()=>p.evaluate(()=>({id:ZynoraThemeState.selected,bg:ZynoraThemeState.config.colors.bg,accent:ZynoraThemeState.config.colors.accent,marker:localStorage.getItem('zynora-warm-sand-default-v1'),sentinel:localStorage.getItem('unrelated-project-sentinel')}));
 assert.deepEqual(await state(),{id:'custom',bg:'#f4eee5',accent:'#875b40',marker:'1',sentinel:'keep'});
 await p.locator('#site-appearance').click();await p.locator('#zs-settings[open]').waitFor();
 assert.equal(await p.locator('#zsc-color-bg').inputValue(),'#f4eee5');
 assert.equal(await p.locator('#studio-dialog').evaluate(e=>e.open),false);
 await p.locator('#zs-style-2').check();await p.locator('#zs-settings-close').click();await p.reload();
 assert.equal(await p.evaluate(()=>document.body.dataset.zsStyle),'2','Later preset choice persists after update: '+previous);
 await p.locator('#site-appearance').click();await p.locator('#zs-style-custom').check();await group(p,'Farben & Oberflächen');await color(p,'accent','#773355');await p.locator('#zs-settings-close').click();await p.reload();
 assert.equal((await state()).accent,'#773355','Later custom edits are not overwritten');
 await p.locator('#site-appearance').click();await p.locator('#zs-settings-close').click();await p.evaluate(()=>location.hash='open');await p.locator('#open-studio').click();await p.locator('#choose-sampler').waitFor({state:'visible'});
 assert.equal(await p.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--zs-accent').trim()),'#773355','Website and sampler agree');
 checks.push(previous+': gets Warm Sand once, retains future preset/custom choices, projects untouched');
 await c.close();
}
const blocked=await setup();await blocked.c.addInitScript(()=>{localStorage.setItem('zynora-sampler-style-v1','3');Storage.prototype.setItem=function(){throw new DOMException('blocked','QuotaExceededError');};});await blocked.p.goto('https://www.zynora-studio.com/');await blocked.p.locator('#site-appearance').click();await blocked.p.locator('#zs-settings[open]').waitFor();assert.equal(await blocked.p.evaluate(()=>document.body.dataset.zsStyle),'custom');assert.equal(await blocked.p.locator('#zsc-color-bg').inputValue(),'#f4eee5');checks.push('Blocked storage still shows Warm Sand consistently for the session');
assert.deepEqual(errors,[]);fs.writeFileSync(OUT+'/results.json',JSON.stringify({passed:true,checks,errors},null,2));console.log('WARM SAND DEFAULT TESTS PASSED',checks);
}finally{for(const c of contexts)await c.close();await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
