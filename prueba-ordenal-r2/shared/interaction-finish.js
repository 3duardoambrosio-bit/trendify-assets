(function(){
 const q=(s)=>Array.from(document.querySelectorAll(s));
 const signature=document.querySelector('.evolution-signature');
 function syncPhase(){const active=document.querySelector('[data-evolution][aria-pressed="true"]');if(signature&&active)signature.dataset.phase=active.dataset.evolution;}
 q('[data-evolution]').forEach(b=>b.addEventListener('click',syncPhase));syncPhase();
 const heroLinks=q('.hero-index [data-jump-scene]'),sceneButtons=q('[data-scene]');
 function syncScene(){const active=document.querySelector('[data-scene][aria-pressed="true"]');heroLinks.forEach(a=>{if(active&&a.dataset.jumpScene===active.dataset.scene)a.dataset.selected='true';else delete a.dataset.selected;});}
 sceneButtons.forEach(b=>b.addEventListener('click',syncScene));syncScene();
 const nav=q('.navlinks a[href^="#"],.mobile-menu a[href^="#"],.mobile-dock a[href^="#"]');
 const sections=q('main section[id]').filter(s=>nav.some(a=>a.hash==='#'+s.id));
 function syncNav(){const y=Math.min(window.innerHeight*.35,230);let current=null;for(const s of sections){const r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>y)current=s.id;}nav.forEach(a=>{if(current&&a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
 let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;syncNav();});}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});syncNav();
})();