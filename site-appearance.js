// The website opens the same appearance editor as the sampler.
(() => {
 const button=document.querySelector('#site-appearance');
 window.ZynoraSiteAppearance={open(target='settings'){
  window.__zynoraStyleRequest={target,fromSite:true};
  window.__zynoraSiteAppearancePending=true;
  window.dispatchEvent(new Event('zynora-open-site-appearance'));
 }};
 button.addEventListener('click',()=>window.ZynoraSiteAppearance.open());
 function language(){const label=document.documentElement.lang.startsWith('de')?'Einstellungen · Darstellung':'Settings · Appearance';button.setAttribute('aria-label',label);button.title=label;}
 window.addEventListener('zynora-language-change',language);language();
})();
