const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..'),OUT='/tmp/zynora-unified-style-qa';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const {source}=await import(require('url').pathToFileURL(path.join(ROOT,'supabase/functions/zynora-beta/sampler-source.mjs')).href);const assets=fs.readdirSync(path.join(ROOT,'assets/factory-loops')).filter(f=>f.endsWith('.mp3')).map(f=>({id:f.slice(0,-4),name:f,category:'Loops',url:'https://www.zynora-studio.com/assets/factory-loops/'+f}));const served='const FACTORY_LOOP_ASSETS='+JSON.stringify(assets)+';\n'+source+'\nwindow.__qa={engine,flush,getproject:()=>project,playing:()=>playing};';const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const errors=[],checks=[],contexts=[];
async function setup({width=390,reduced='reduce',malformed=false,mobile=false}={}){const c=await browser.newContext({viewport:{width,height:900},acceptDownloads:true,reducedMotion:reduced,hasTouch:mobile,isMobile:mobile});contexts.push(c);await c.addInitScript(({malformed})=>{localStorage.setItem('zynora-language','de');localStorage.setItem('zynora-storage-notice-v1','accepted');if(malformed){localStorage.setItem('zynora-sampler-style-v1','custom');localStorage.setItem('zynora-custom-style-v1','{broken');}},{malformed});await c.route('https://www.zynora-studio.com/**',async r=>{const u=new URL(r.request().url()),file=path.resolve(ROOT,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(ROOT+path.sep))return r.fulfill({status:403});try{await r.fulfill({path:file,contentType:({'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.mp3':'audio/mpeg','.json':'application/json'})[path.extname(file)]||'application/octet-stream'});}catch{await r.fulfill({status:404});}});await c.route('https://itywthgzirkjtbzvjfqi.supabase.co/**',r=>r.fulfill({json:r.request().url().endsWith('/bundle')?{source:served,sampler:true,song_studio:false}:{sampler:true,song_studio:false}}));const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));return {p,c};}
async function openOwn(p){await p.goto('https://www.zynora-studio.com/');await p.locator('[data-open-style=custom]').click();await p.locator('#zs-settings[open]').waitFor();await p.locator('#zs-custom-editor').waitFor({state:'visible'});}
async function range(p,id,value){await p.locator('#zsc-'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},value);await p.waitForTimeout(40);}
async function color(p,id,value){const hex=p.locator('#zsc-color-'+id+' + input');await hex.fill(value);await hex.dispatchEvent('change');await p.waitForTimeout(40);}
async function group(p,text){const d=p.locator('.zsc-group').filter({has:p.locator('summary',{hasText:text})}).first();if(!await d.evaluate(e=>e.open))await d.locator('summary').click();return d;}
try{
const {p,c}=await setup({reduced:'no-preference',mobile:true});
await p.goto('https://www.zynora-studio.com/');
assert.equal(await p.evaluate(()=>document.documentElement.dataset.zsStyle),'custom');assert.equal(await p.locator('.hero h1 span').evaluate(e=>getComputedStyle(e).backgroundClip),'text');await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.hero h1 span').evaluate(e=>getComputedStyle(e).backgroundClip),'text','Reduced motion must not paint a background box behind the headline');await p.emulateMedia({reducedMotion:'no-preference'});
assert.equal(await p.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(244, 238, 229)');
const original=await p.locator('body > main').allTextContents();
assert.match(await p.locator('.release-gradient').evaluate(e=>getComputedStyle(e).animationName),/release-colors/);
const pos=await p.locator('.release-gradient').evaluate(e=>getComputedStyle(e).backgroundPosition);
await p.waitForTimeout(250);assert.notEqual(await p.locator('.release-gradient').evaluate(e=>getComputedStyle(e).backgroundPosition),pos);
for(const width of [320,390,768,1024,1366,1920]){
 await p.setViewportSize({width,height:900});await p.evaluate(()=>scrollTo(0,0));
 const boxes=await p.evaluate(()=>['.brand','.navigation','.language-picker','#site-appearance'].map(s=>{const b=document.querySelector('.header '+s).getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom}}));
 for(let i=0;i<boxes.length;i++){assert(boxes[i].left>=0&&boxes[i].right<=width,'Header control stays in viewport '+width);for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert(a.right<=b.left+1||b.right<=a.left+1||a.bottom<=b.top||b.bottom<=a.top,'No overlapping header controls '+width+' '+i+' '+j);}}
 assert.equal(await p.locator('#site-appearance').evaluate(e=>e.offsetWidth>=44&&e.offsetHeight>=44),true);
 await p.screenshot({path:OUT+'/home-'+width+'.png'});
}
checks.push('Warm Sand default before opening sampler; title text and moving animation; header controls do not overlap across six widths');
await p.setViewportSize({width:390,height:900});await p.locator('#site-appearance').click();await p.locator('#zs-settings[open]').waitFor();assert.equal(await p.locator('#studio-dialog').evaluate(e=>e.open),false);
assert.equal(await p.evaluate(()=>!!__qa.engine?.graph),false,'Appearance must not initialize audio');
for(const id of ['1','2','3']){
 await p.locator('#zs-style-'+id).check();await p.locator('#zs-settings-close').click();await p.waitForFunction(()=>document.activeElement===document.querySelector('#site-appearance'));assert.equal(await p.evaluate(()=>document.documentElement.dataset.zsStyle===document.body.dataset.zsStyle),true);
 for(const route of ['home','open','music','support','applications','impressum','profile']){
  await p.evaluate(route=>location.hash=route,route);await p.waitForTimeout(420);
  const v=await p.evaluate(()=>{const root=getComputedStyle(document.documentElement),body=getComputedStyle(document.body),header=getComputedStyle(document.querySelector('.header'));return {bg:body.backgroundColor,header:header.backgroundColor,style:document.body.dataset.zsStyle,root:root.getPropertyValue('--zs-bg').trim()}});
  assert.equal(v.style,id);assert.equal(v.bg,v.header,'Same page and header palette '+route);
  if(id==='2')await p.screenshot({path:OUT+'/'+route+'-390.png'});
 }
 await p.locator('#site-appearance').click();
}
await p.locator('#zs-style-custom').check();await group(p,'Farben & Oberflächen');await color(p,'accent','#aad4bb');assert.equal(await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--zs-accent').trim()),'#aad4bb');await p.locator('#zs-settings-close').click();await p.waitForTimeout(250);await p.reload();assert.equal(await p.evaluate(()=>document.body.dataset.zsStyle),'custom');assert.equal(await p.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--zs-accent').trim()),'#aad4bb');
await p.locator('#site-appearance').click();await p.locator('#zs-style-2').check();await p.locator('#zs-settings-close').click();
await p.evaluate(()=>location.hash='open');await p.locator('#open-studio').click();await p.locator('#choose-sampler').waitFor({state:'visible'});
const colours=await p.locator('#choose-sampler .choice-action').evaluate(e=>({fg:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor,text:e.textContent}));assert.equal(colours.fg,'rgb(255, 255, 255)');assert.equal(colours.bg,'rgb(34, 108, 99)');assert(colours.text.trim());await p.screenshot({path:OUT+'/workflow-390.png'});
await p.locator('#zs-settings-opener').click();await p.locator('#zs-style-3').check();await p.locator('#zs-settings-close').click();await p.locator('#studio-dialog > .studio-header .dialog-close').click();assert.equal(await p.evaluate(()=>document.body.dataset.zsStyle),'3');await p.evaluate(()=>location.hash='home');assert.deepEqual(await p.locator('body > main').allTextContents(),original,'All existing website wording unchanged');
checks.push('One shared appearance editor without opening studio/audio; all seven pages and sampler synchronized; custom edits/reload; visible workflow action; existing wording unchanged');
assert.deepEqual(errors,[]);fs.writeFileSync(OUT+'/results.json',JSON.stringify({passed:true,checks,errors},null,2));console.log('UNIFIED SITE TESTS PASSED',checks);
}finally{for(const c of contexts)await c.close();await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
