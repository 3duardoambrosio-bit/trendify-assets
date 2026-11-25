(function(){
 const q=(s)=>Array.from(document.querySelectorAll(s));
 const signature=document.querySelector('.evolution-signature');
 function syncPhase(){const active=document.querySelector('[data-evolution][aria-pressed="true"]');if(signature&&active)signature.dataset.phase=active.dataset.evolution;}
 q('[data-evolution]').forEach(b=>b.addEventListener('click',syncPhase));syncPhase();
 const heroLinks=q('.hero-index [data-jump-scene]'),sceneButtons=q('[data-scene]');
 function syncScene(){const active=document.querySelector('[data-scene][aria-pressed="true"]');heroLinks.forEach(a=>{if(active&&a.dataset.jumpScene===active.dataset.scene)a.dataset.selected='true';else delete a.dataset.selected;});}
 sceneButtons.forEach(b=>b.addEventListener('click',syncScene));syncScene();
})();