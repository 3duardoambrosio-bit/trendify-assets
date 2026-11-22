'use strict';
(() => {
  const query=new URLSearchParams(location.search);
  const cases=new Set(['admin','multi','migration','recon','sourcing','operations','growth','qa']);
  const samples={S08:'multi',S01:'multi','SOL-031':'operations'};
  const caps=/^(D0[1-7]|E0[1-6]|R0[1-5]|O0[1-4]|Q0[1-4])$/;
  const id=query.get('caso'),code=query.get('cap'),pin=query.get('comparar');
  const caseOK=cases.has(id),capOK=caps.test(code||'');
  if(!caseOK && !capOK)return;
  const ctx=new URLSearchParams();
  if(caseOK)ctx.set('caso',id);
  if(capOK)ctx.set('cap',code);
  if(Object.hasOwn(samples,query.get('muestra')) && samples[query.get('muestra')]===id)ctx.set('muestra',query.get('muestra'));
  if(cases.has(pin))ctx.set('comparar',pin);
  for(const key of ['q','familia','todos','indice'])if(capOK&&query.has(key))ctx.set(key,query.get(key));
  const filename=location.pathname.split('/').pop();
  const nested=location.pathname.includes('/sitio/');
  const prefix=nested?'../':'';
  const fromProof=['caso-administrativo.html','dossier-multifuente.html','muestra.html','investigacion-documental.html','notas.html'].includes(filename);
  const returnLink=document.getElementById('return-case')||document.getElementById('context-return');
  for(const link of document.querySelectorAll('a[href]')){
    const raw=link.getAttribute('href');
    if(!raw || /^(?:[a-z]+:|\/|#)/i.test(raw))continue;
    const url=new URL(link.href),page=url.pathname.split('/').pop();
    if(page==='index.html' && ['#mesa','#responsable'].includes(url.hash) && link.closest('header')){
      if(filename!=='capacidades.html')link.href=raw.split(/[?#]/)[0]+'?'+ctx+url.hash;
      continue;
    }
    if(!['consulta.html','capacidades.html','evidencia.html','muestra.html','caso-administrativo.html','investigacion-documental.html','dossier-multifuente.html','notas.html'].includes(page))continue;
    if(link.hasAttribute('data-fuente-exacta')||link.hasAttribute('data-permanent')||link.hasAttribute('data-proof-for')||link.hasAttribute('data-cap-consult'))continue;
    if(url.searchParams.has('caso')&&url.searchParams.get('caso')!==id)continue;
    if(filename==='capacidades.html'&&page==='consulta.html'&&link.closest('header'))continue;
    for(const [k,v] of ctx)if(!url.searchParams.has(k))url.searchParams.set(k,v);
    if(cases.has(query.get('fuente'))&&fromProof===false&&['muestra.html','caso-administrativo.html','notas.html','investigacion-documental.html'].includes(page))url.searchParams.set('fuente',query.get('fuente'));
    link.href=raw.split(/[?#]/)[0]+'?'+url.searchParams+url.hash;
  }
  if(fromProof && capOK && returnLink){
    const quote=document.createElement('a');
    quote.href=prefix+'consulta.html?'+ctx;
    quote.textContent='Consultar la capacidad '+code;
    quote.style.cssText='display:inline-flex;align-items:center;min-height:44px;margin-inline-start:1rem;color:inherit;text-decoration:underline';
    returnLink.after(quote);
    quote.style.color=getComputedStyle(returnLink).color;
  }
  if(!returnLink)return;
  // El lado elegido define la consulta; el regreso reconstruye la comparación que la originó.
  if(filename==='consulta.html' && caseOK && cases.has(pin) && query.has('volverMesa')){
    const origin=new URLSearchParams(query.get('volverMesa'));
    const active=origin.get('caso'),pinned=origin.get('comparar');
    if((active===id && pinned===pin) || (active===pin && pinned===id)){
      const back=new URLSearchParams({caso:active,comparar:pinned});
      if(Object.hasOwn(samples,origin.get('muestra')) && samples[origin.get('muestra')]===active)back.set('muestra',origin.get('muestra'));
      if(caps.test(origin.get('cap')||'')){
        for(const key of ['cap','q','familia','todos','indice'])if(origin.has(key))back.set(key,origin.get(key));
      }
      returnLink.href=prefix+'index.html#'+back;
      returnLink.textContent='Volver a la comparación';
      return;
    }
  }
  if(capOK && filename!=='capacidades.html'){
    const previous=new URLSearchParams(ctx);
    if(previous.get('indice')==='1'){previous.delete('caso');previous.delete('indice');}
    returnLink.href=prefix+'capacidades.html?'+previous+'#'+code;
    returnLink.textContent='Volver a la ficha '+code;
  }else if(caseOK){
    const state=new URLSearchParams({caso:id});
    if(ctx.has('muestra'))state.set('muestra',ctx.get('muestra'));
    if(cases.has(pin))state.set('comparar',pin);
    returnLink.href=prefix+'index.html#'+state;
  }
})();
