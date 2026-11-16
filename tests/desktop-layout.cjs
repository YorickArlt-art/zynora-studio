const {chromium}=require('playwright');const fs=require('node:fs');const path=require('node:path');const http=require('node:http');const assert=require('node:assert/strict');const os=require('node:os');
(async()=>{
 const root=path.resolve(__dirname,'..'),out=path.join(os.tmpdir(),'zynora-desktop-qa');fs.mkdirSync(out,{recursive:true});
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
 const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});let errors=[];
 for(const lang of ['de','en'])for(const [width,height] of [[320,740],[390,844],[768,1024],[900,700],[1024,768],[1093,614],[1280,720],[1366,768],[1536,864],[1920,1080]]){
  const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(l=>{localStorage.setItem('zynora-language',l);localStorage.setItem('zynora-storage-notice-v1','accepted');},lang);
  await p.route('https://itywthgzirkjtbzvjfqi.supabase.co/**',r=>r.fulfill({json:r.request().url().endsWith('/status')?{sampler:true,song_studio:false}:[]}));
  await p.goto(origin);await p.waitForTimeout(150);if(await p.locator('#cookie-dismiss').isVisible())await p.locator('#cookie-dismiss').click();
  const dimensions=await p.evaluate(()=>{const r=s=>{const b=document.querySelector(s).getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height,bottom:b.bottom,right:b.right};};return{screen:innerWidth,overflow:document.documentElement.scrollWidth,header:r('.header'),hero:r('.hero'),cta:r('.hero .actions'),card:r('.home-session'),nav:[...document.querySelectorAll('#main-nav a')].map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width};})};});
  assert(dimensions.overflow<=width,'No horizontal page overflow: '+width+' '+lang);
  if(width>=1024){
   assert.equal(await p.locator('#menu-toggle').isVisible(),false,'Desktop must display its navigation, not a phone menu');assert.equal(await p.locator('#main-nav').isVisible(),true,'Desktop links stay visible');
   for(const item of dimensions.nav){assert(item.width>0&&item.x>=0&&item.right<=width&&item.bottom<=dimensions.header.bottom+1,'Navigation fits header: '+width);}
   assert(dimensions.card.height<640,'Decorative pad card fits a desktop hero');assert(dimensions.cta.bottom<height-8,'Open Studio is above the fold at '+width+'x'+height+' '+lang);
  }else{
   assert.equal(await p.locator('#menu-toggle').isVisible(),true,'Compact menu remains available');await p.locator('#menu-toggle').click();assert(await p.locator('#main-nav').isVisible());await p.keyboard.press('Escape');assert.equal(await p.locator('#main-nav').isVisible(),false,'Escape closes the compact menu');await p.locator('#menu-toggle').click();await p.mouse.click(4,400);assert.equal(await p.locator('#main-nav').isVisible(),false,'Outside click closes the compact menu');
  }
  if([390,1093,1280,1366,1920].includes(width))await p.screenshot({path:path.join(out,`${lang}-${width}.png`)});
  console.log('PASS',lang,width,height,'header',Math.round(dimensions.header.height),'hero',Math.round(dimensions.hero.height),'CTA',Math.round(dimensions.cta.bottom));
  // Header mode can change without a reload, including Opera/Windows display scaling.
  if(width===390){await p.setViewportSize({width:1366,height:768});assert(await p.locator('#main-nav').isVisible());assert.equal(await p.locator('#menu-toggle').isVisible(),false);await p.setViewportSize({width:390,height:844});assert.equal(await p.locator('#main-nav').isVisible(),false);}
  await c.close();
 }
 assert.deepEqual(errors,[],'No browser errors');await browser.close();server.close();console.log('All desktop/mobile navigation and hero checks passed.');
})().catch(e=>{console.error(e);process.exit(1)});
