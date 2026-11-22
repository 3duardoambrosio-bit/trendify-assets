'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const cases = window.ORDENAL.cases;
  const folios = {precio:['multi','S08'],identidad:['multi','S01'],traspaso:['operations','SOL-031']};
  const area = {admin:'operations',operations:'operations',multi:'multi',migration:'multi',sourcing:'sourcing',growth:'growth',recon:'recon',qa:'recon'};
  const notes = {
    admin:['Seguimiento de una solicitud','Muestra sintética','OP001 contiene 32 solicitudes con responsables, estados y controles.'],
    migration:['Una variante cambia de destino','Investigación documental','Contraste de documentación de Shopify, WooCommerce y Merchant Center.'],
    recon:['Dos reportes con cortes distintos','Método por evaluar','Se pedirían las dos versiones, los identificadores y sus fechas de corte. El ejemplo de catálogo solo ilustra comparación de campos.'],
    sourcing:['Antes de comparar proveedores','Investigación documental','El expediente disponible contrasta documentación de plataformas. Las condiciones de cada proveedor requieren fuentes propias.'],
    growth:['Antes de aprobar una prueba','Planeación propuesta','Objetivo, audiencia, señal de interés y condición para detener la prueba. El expediente es conceptual.'],
    qa:['Antes de aceptar una entrega','Muestra relacionada','El catálogo sintético permite contrastar valores de origen, incidencias y decisiones. Otros dominios requieren pruebas propias.']
  };
  const pilots={
  "admin": [
    "Una solicitud cerrada y otra que siga bloqueada, con el último estado registrado de cada una.",
    "Reconstruir ambas desde la entrada hasta el responsable actual y explicar qué evidencia permite cerrar la primera."
  ],
  "operations": [
    "La instrucción original, el traspaso y la confirmación del equipo receptor.",
    "La persona que recibe puede nombrar lo pendiente y aceptar su siguiente acción. Una referencia al acta deja esa aceptación abierta."
  ],
  "multi": [
    "Un producto que coincide y otro en el que tienda y proveedor discrepen, con variante, moneda y corte de cada dato.",
    "El dueño puede seguir cada diferencia hasta ambas fuentes y distinguir qué cambio autorizó y cuál sigue pendiente."
  ],
  "migration": [
    "Un export anterior, la plantilla de destino y dos variantes con una relación padre–hijo conocida.",
    "Cada variante del piloto queda emparejada o apartada con motivo. El responsable decide si permite una carga posterior."
  ],
  "recon": [
    "Un periodo común de los dos reportes, con detalle de partidas y definición de sus totales.",
    "La diferencia del periodo se puede explicar por filas, partidas excluidas o un importe pendiente identificado."
  ],
  "sourcing": [
    "Dos opciones de compra y los mínimos, plazos y especificaciones que realmente cambiarían la elección.",
    "Cada condición decisiva conduce a una fuente fechada o a una pregunta pendiente para el proveedor."
  ],
  "growth": [
    "La hipótesis, el público previsto y una señal observable que justificaría continuar o detener una prueba.",
    "Antes de invertir, quedan acordados el indicador, la fuente, el límite de gasto autorizado y la decisión que habilitaría el resultado."
  ],
  "qa": [
    "Una entrega representativa, sus criterios escritos y un defecto que deba impedir su aceptación.",
    "Otra persona reproduce la observación y distingue los defectos bloqueantes de los que se aceptan con reserva."
  ]
};
  const links = [...document.querySelectorAll('[data-front]')];
  const buttons = [...document.querySelectorAll('[data-folio]')];
  function current() {
    const params = window.ORDENAL.deskParams();
    const id = Object.hasOwn(cases,params.get('caso')) ? params.get('caso') : 'multi';
    const pair = Object.entries(folios).find(([,v]) => v[0]===id && v[1]===params.get('muestra'));
    return {params,id,key:pair?.[0] || ({multi:'precio',operations:'traspaso'})[id]};
  }
  function change(id,key) {
    const {params,id:previous,key:previousKey} = current();
    if(id!==previous || (key && key!==previousKey)){
      for(const name of ['cap','q','familia','todos','indice'])params.delete(name);
    }
    params.set('caso',id);
    if(key) params.set('muestra',folios[key][1]); else params.delete('muestra');
    const next='#'+params.toString();
    if(location.hash!==next)location.hash=next; else render();
  }
  function render() {
    const {params,id,key} = current();
    const note=notes[id];
    $('case-input').textContent=pilots[id][0];
    $('case-test').textContent=pilots[id][1];
    const sample=key ? folios[key][1] : '';
    links.forEach(link=>link.setAttribute('aria-current',String(link.dataset.front===area[id])));
    buttons.forEach(button=>{
      const active=button.dataset.folio===key;
      button.setAttribute('aria-pressed',String(active));
      $('ticket-'+button.dataset.folio).hidden=!active;
      $('story-'+button.dataset.folio).hidden=!active;
    });
    $('folio-controls').hidden=!key;
    $('other-proof').hidden=!!key;
    document.querySelector('.specimen').textContent=key?'Muestra sintética':note[1];
    if(note && !key){
      $('other-title').textContent=note[0];$('other-source').textContent=note[2];
      $('other-question').textContent=cases[id].question;
      $('other-link').href='evidencia.html?caso='+id;
    }
    const context=new URLSearchParams({caso:id});
    if(sample)context.set('muestra',sample);
    if(Object.hasOwn(cases,params.get('comparar')))context.set('comparar',params.get('comparar'));
    const explicitCase=Object.hasOwn(cases,params.get('caso'));
    const hasCard=window.ORDENAL.caps.some(cap=>cap.code===params.get('cap'));
    if(hasCard){
      for(const name of ['cap','q','familia','todos','indice'])if(params.has(name))context.set(name,params.get(name));
    }
    const navContext=new URLSearchParams(context);
    if(!explicitCase)navContext.delete('caso');
    if(!explicitCase || (hasCard && !params.has('muestra')))navContext.delete('muestra');
    const navSuffix=navContext.size?'?'+navContext:'';
    for(const [selector,page] of [['#case-consult,#cover-consult,[data-consult]','consulta'],['#case-caps','capacidades'],['#proof-link','evidencia']]){
      document.querySelectorAll(selector).forEach(el=>el.href=page+'.html?'+context);
    }
    if(context.has('comparar')){
      for(const link of document.querySelectorAll('#compare-body a')){
        const selected=new URL(link.href).searchParams.get('caso');
        const request=selected===id ? new URLSearchParams(navContext) : new URLSearchParams({caso:selected,comparar:id});
        request.set('volverMesa',context.toString());
        link.href='consulta.html?'+request;
      }
    }
    if(key){
      const link=$('ticket-'+key).querySelector('.source-link');
      const url=new URL(link.href);
      for(const name of ['cap','q','familia','todos','indice'])url.searchParams.delete(name);
      for(const [k,v] of context)url.searchParams.set(k,v);
      if(!context.has('comparar'))url.searchParams.delete('comparar');
      link.href=url.pathname.split('/').pop()+'?'+url.searchParams+url.hash;
    }
    document.querySelectorAll('.header [data-consult],.menu a[href^="consulta.html"],#responsable [data-consult]').forEach(a=>a.href='consulta.html'+navSuffix);
    document.querySelectorAll('.header nav a[href^="capacidades.html"]').forEach(a=>a.href='capacidades.html'+navSuffix);
    $('front-announcement').textContent=cases[id].short+' · '+(sample||note[1]);
  }
  links.forEach(link=>link.addEventListener('click',event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey) return;
    event.preventDefault();change(link.dataset.front);
  }));
  buttons.forEach(button=>button.addEventListener('click',()=>change(folios[button.dataset.folio][0],button.dataset.folio)));
  window.addEventListener('hashchange',render);render();
})();
