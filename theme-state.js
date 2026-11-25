// Shared appearance data for every page and the sampler. No project or audio state.
(() => {
 if(window.ZynoraThemeState)return;
class ThemeConfig {
 static get key(){return 'zynora-custom-style-v1';}
 static defaults(){return {name:'Mein Style',background:'linear',stops:2,angle:135,centerX:70,centerY:20,midpoint:50,pattern:'none',patternOpacity:10,patternSize:24,panelOpacity:96,radius:10,shadow:0,glow:0,motion:false,speed:30,transitions:true,colors:{bg:'#090e0c',bg2:'#15452f',bg3:'#284d3d',panel:'#15231c',raised:'#23382b',ink:'#f0f6f0',muted:'#b6c9bd',line:'#40644d',accent:'#76da9c',onAccent:'#102018',selected:'#2e513b',selectedInk:'#e8f6ea',positive:'#9fdbb4',danger:'#ffb5b5',pattern:'#b6e6c7'}};}
 static normalize(raw,strict=false){
  const base=this.defaults();if(!raw||typeof raw!=='object'||Array.isArray(raw)){if(strict)throw Error('Invalid style');return base;}
  const result={...base,colors:{...base.colors}},ranges={stops:[2,3],angle:[0,360],centerX:[0,100],centerY:[0,100],midpoint:[15,85],patternOpacity:[0,25],patternSize:[12,48],panelOpacity:[65,100],radius:[0,20],shadow:[0,24],glow:[0,24],speed:[12,60]};
  if(typeof raw.name==='string')result.name=raw.name.trim().slice(0,40)||base.name;
  for(const [key,range] of Object.entries(ranges)){if(raw[key]===undefined)continue;if(typeof raw[key]!=='number'||!Number.isFinite(raw[key])){if(strict)throw Error('Invalid number');continue;}result[key]=Math.max(range[0],Math.min(range[1],Math.round(raw[key])));}
  for(const [key,options] of Object.entries({background:['solid','linear','radial'],pattern:['none','dots','grid']})){if(raw[key]===undefined)continue;if(options.includes(raw[key]))result[key]=raw[key];else if(strict)throw Error('Invalid option');}
  for(const key of ['motion','transitions'])if(raw[key]!==undefined){if(typeof raw[key]==='boolean')result[key]=raw[key];else if(strict)throw Error('Invalid flag');}
  if(raw.colors!==undefined){if(!raw.colors||typeof raw.colors!=='object'||Array.isArray(raw.colors)){if(strict)throw Error('Invalid colors');}else for(const key of Object.keys(base.colors)){if(raw.colors[key]===undefined)continue;if(typeof raw.colors[key]==='string'&&/^#[a-f\d]{6}$/i.test(raw.colors[key]))result.colors[key]=raw.colors[key].toLowerCase();else if(strict)throw Error('Invalid color');}}
  return result;
 }
 static rgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
 static rgba(hex,alpha){return 'rgba('+this.rgb(hex).join(',')+','+alpha+')';}
 static luminance(hex){const c=this.rgb(hex).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return .2126*c[0]+.7152*c[1]+.0722*c[2];}
 static contrast(a,b){const x=this.luminance(a),y=this.luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
 static backdrop(c){const a=c.colors;if(c.background==='solid')return a.bg;const stops=c.stops===3?a.bg+' 0%,'+a.bg2+' '+c.midpoint+'%,'+a.bg3+' 100%':a.bg+' 0%,'+a.bg2+' 100%';return c.background==='radial'?'radial-gradient(ellipse at '+c.centerX+'% '+c.centerY+'%,'+stops+')':'linear-gradient('+c.angle+'deg,'+stops+')';}
 static pattern(c){const color=c.colors.pattern;return c.pattern==='dots'?'radial-gradient('+color+' 1px,transparent 1px)':c.pattern==='grid'?'linear-gradient('+color+' 1px,transparent 1px),linear-gradient(90deg,'+color+' 1px,transparent 1px)':'none';}
}

function customVariables(config){const c=ThemeConfig.normalize(config),a=c.colors;return {bg:a.bg,panel:ThemeConfig.rgba(a.panel,c.panelOpacity/100),raised:a.raised,ink:a.ink,muted:a.muted,line:a.line,accent:a.accent,'on-accent':a.onAccent,selected:a.selected,'selected-ink':a.selectedInk,positive:a.positive,danger:a.danger,'wave-shade':ThemeConfig.rgba(a.ink,.1),scheme:ThemeConfig.luminance(a.panel)<.4?'dark':'light',backdrop:ThemeConfig.backdrop(c),'background-image':c.background==='solid'?'none':ThemeConfig.backdrop(c),pattern:ThemeConfig.pattern(c),'pattern-size':c.patternSize+'px '+c.patternSize+'px','pattern-opacity':c.patternOpacity/100,radius:c.radius+'px',shadow:'0 4px 18px rgba(0,0,0,'+c.shadow/100+')',glow:'0 0 '+c.glow+'px '+ThemeConfig.rgba(a.accent,c.glow ? .32 : 0),transition:c.transitions?'140ms':'0ms',speed:c.speed+'s'};}

 const key='zynora-sampler-style-v1',customKey=ThemeConfig.key;
 const presets={
 '1':{bg:'#f3f1ec',panel:'#fcfbf8',raised:'#ebe7e1',ink:'#29272b',muted:'#69636b',line:'#d5d0c9',accent:'#725268','on-accent':'#ffffff',selected:'#e4d8e0','selected-ink':'#553b4d',positive:'#356451',danger:'#9a303c',scheme:'light'},
 '2':{bg:'#ffffff',panel:'#f6faf8',raised:'#e7eeeb',ink:'#183f32',muted:'#4d665b',line:'#cad7d2',accent:'#226c63','on-accent':'#ffffff',selected:'#dcece5','selected-ink':'#1c544c',positive:'#356451',danger:'#9a303c',scheme:'light'},
 '3':{bg:'#303941',panel:'#39434c',raised:'#424c55',ink:'#f0f2f0',muted:'#c0c9ce',line:'#56636d',accent:'#c4b4e3','on-accent':'#252130',selected:'#5b506f','selected-ink':'#f0eaf8',positive:'#b2d7bf',danger:'#ffb2b5',scheme:'dark'}
 };
 const common={'background-image':'none',pattern:'none','pattern-opacity':0,'pattern-size':'24px 24px',radius:'12px',shadow:'none',glow:'none',transition:'140ms',speed:'30s','wave-shade':'rgba(35,70,60,.12)'};
 let selected='2',config=ThemeConfig.defaults();
 function read(){try{const id=localStorage.getItem(key);selected=presets[id]||id==='custom'?id:'2';const saved=JSON.parse(localStorage.getItem(customKey)||'null');config=saved?.version===1?ThemeConfig.normalize(saved.config):ThemeConfig.defaults();}catch{}}
 function apply(id,raw){selected=presets[id]||id==='custom'?id:'2';if(raw)config=ThemeConfig.normalize(raw);const vars=selected==='custom'?customVariables(config):{...common,...presets[selected]};for(const el of [document.documentElement,document.body].filter(Boolean)){el.dataset.zsStyle=selected;el.dataset.zsMotion=selected==='custom'&&config.motion&&config.background!=='solid'?'on':'off';for(const [name,value] of Object.entries(vars))el.style.setProperty('--zs-'+name,String(value));}const meta=document.querySelector('meta[name=theme-color]');if(meta)meta.content=vars.bg;}
 window.ZynoraThemeState={Config:ThemeConfig,customVariables,apply,key,customKey,get selected(){return selected;},get config(){return ThemeConfig.normalize(config);}};
 read();apply(selected);
 document.addEventListener('DOMContentLoaded',()=>apply(selected),{once:true});
 window.addEventListener('zynora-style-change',e=>apply(e.detail.style,e.detail.config));
 window.addEventListener('storage',e=>{if(e.key===key||e.key===customKey||e.key===null){read();apply(selected);}});
})();
