'use strict';
(() => {
const data=window.ORDENAL;
if(!data || Object.keys(data.cases||{}).length!==8) return;
const $=id=>document.getElementById(id);
const own=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(id,value)=>{if($(id))$(id).textContent=value;};
const params=new URLSearchParams(location.search);
const chosen=own(data.cases,params.get('caso'))?params.get('caso'):null;
const cap=data.caps.find(x=>x.code===params.get('cap'));
const examples = {S08:['multi','S08 · Discrepancia de precio'], S01:['multi','S01 · Identidad de producto'], 'SOL-031':['operations','SOL-031 · Traspaso sin responsable']};
const exampleId = params.get('muestra');
const example = own(examples,exampleId) && examples[exampleId][0] === chosen ? examples[exampleId][1] : null;
const proof={admin:['Demostración sintética','32 solicitudes: qué falta antes de cerrar una tarea.','Reglas de un ejercicio fijo. No demuestra gestión real de un equipo.'],catalogo:['Demostración sintética','180 registros. Original, hallazgo y decisión.','Controles acotados de catálogo; no certifica conciliación financiera ni QA de cualquier dominio.'],documental:['Trabajo propio documentado','La misma información, distintos requisitos de destino.','Contraste de documentación pública. No acredita negociación de proveedores ni una migración ejecutada.'],plan:['Propuesta por evaluar','Qué habría que demostrar antes de invertir.','No hay un caso de marketing ejecutado y validado. Aquí puedes revisar preguntas y límites de planeación.']};
function contextLinks(id){
 document.querySelectorAll('[data-consult]').forEach(a=>{a.href='consulta.html'+(id?'?caso='+id:'');});
 if($('return-case'))$('return-case').href='index.html'+(id?'#caso='+id:'#mesa');
}
// Los fragmentos de sección permiten llegar al responsable sin perder la selección.
function deskParams(){
 const hash=new URLSearchParams(location.hash.slice(1));
 return hash.has('caso') ? hash : new URLSearchParams(location.search);
}
function routeState(){const h=deskParams();return {id:own(data.cases,h.get('caso'))?h.get('caso'):'multi',pin:own(data.cases,h.get('comparar'))?h.get('comparar'):null};}
function navigate(id,pin){
 const previous=deskParams();
 const sample=previous.get('caso')===id && own(examples,previous.get('muestra')) && examples[previous.get('muestra')][0]===id ? previous.get('muestra') : null;
 const next=new URLSearchParams({caso:id});
 if(pin)next.set('comparar',pin);
 if(sample)next.set('muestra',sample);
 if(previous.get('caso')===id && data.caps.some(item=>item.code===previous.get('cap'))){
  for(const key of ['cap','q','familia','todos','indice'])if(previous.has(key))next.set(key,previous.get(key));
 }
 const hash=next.toString();
 if(location.hash.slice(1)===hash){renderDesk();return;}
 location.hash=hash;
}
function renderCompare(id,pin){
 const box=$('comparison');if(!box)return;
 box.hidden=!pin;
 if(!pin)return;
 const ids=pin===id?[pin]:[pin,id];
 $('compare-body').innerHTML=ids.map(k=>{const c=data.cases[k];return '<article><small>'+esc(k===pin?'Situación fijada':'Situación actual')+'</small><h4>'+esc(c.short)+'</h4><b>Entregable</b><p>'+esc(c.output)+'</p><b>Evidencia</b><p>'+esc(proof[c.proof][2])+'</p><a href="consulta.html?caso='+k+'">Consultar esta situación</a></article>';}).join('');
 if(pin===id)$('compare-body').insertAdjacentHTML('beforeend','<p>Ahora elige otra situación arriba. La primera queda fijada.</p>');
}
function renderDesk(){
 if(!$('case-title'))return;
 const {id,pin}=routeState(),c=data.cases[id],d=data.domains[c.domain],p=proof[c.proof];
 document.querySelectorAll('[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case===id)));
 document.querySelectorAll('[data-domain]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.domain===c.domain)));
 text('domain-title',d.name);text('domain-lead',d.lead);
 text('hero-situation',c.short);text('hero-criterion',c.question);text('hero-output',({admin:'Responsables, bloqueos y cierre verificable.',operations:'Un procedimiento que otro pueda continuar.',multi:'Diferencias por producto y cambios por aprobar.',migration:'Qué se conserva, qué falta y qué no debe cargarse.',recon:'Partidas que coinciden y diferencias por explicar.',sourcing:'Opciones comparables y preguntas pendientes.',growth:'Hipótesis, prueba y criterio para detenerse.',qa:'Defectos reproducibles y criterio de aceptación.'})[id]);
 for(const k of ['title','pain','action','output','risk','question','honesty','relation'])text('case-'+k,c[k]);
 text('proof-tag',p[0]);text('proof-title',p[1]);text('proof-limit',p[2]);
 $('proof-link').href='evidencia.html?caso='+id;
 $('case-consult').href='consulta.html?caso='+id;
 $('case-caps').href='capacidades.html?caso='+id;
 if($('case-mobile'))$('case-mobile').value=id;
 text('pin-case',pin===id?'Situación fijada':'Fijar para comparar');
 text('selection-status','Situación seleccionada: '+c.short+'. Evidencia: '+p[0]+'.');
 text('route-status','');$('route-copy').hidden=true;
 contextLinks(location.hash.includes('caso=') ? id : null);renderCompare(id,pin);
}
function setupDesk(){
 if(!$('case-title'))return;
 data.deskParams=deskParams;
 const first={administracion:'admin',inteligencia:'sourcing',ecommerce:'multi',crecimiento:'growth',calidad:'recon'};
 ['domains','case-picks','pin-case','copy-route'].forEach(id=>$(id).hidden=false);
 document.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.case,routeState().pin)));
 document.querySelectorAll('[data-domain]').forEach(b=>b.addEventListener('click',()=>navigate(first[b.dataset.domain],routeState().pin)));
 const mobile=document.createElement('div');mobile.className='mobile-case-picker';
 mobile.innerHTML='<label for="case-mobile">Situación seleccionada</label><select id="case-mobile">'+Object.values(data.cases).map(c=>'<option value="'+c.id+'">'+esc(c.short)+'</option>').join('')+'</select>';
 document.querySelector('.case-panel').prepend(mobile);
 $('case-mobile').addEventListener('change',event=>navigate(event.target.value,routeState().pin));
 $('pin-case').addEventListener('click',()=>navigate(routeState().id,routeState().id));
 $('clear-compare').addEventListener('click',()=>{navigate(routeState().id,null);$('pin-case').focus({preventScroll:true});});
 $('copy-route').addEventListener('click',copyRoute);
 window.addEventListener('hashchange',renderDesk);renderDesk();
 document.querySelectorAll('a[href="#mesa"],a[href="#frentes"],a[href="index.html#mesa"],a[href="index.html#responsable"]').forEach(a=>a.addEventListener('click',event=>{event.preventDefault();const id=a.getAttribute('href').split('#')[1];$(id).scrollIntoView({block:'start'});const title=$(id).querySelector('h2');title.setAttribute('tabindex','-1');title.focus({preventScroll:true});}));
 if(location.hash.startsWith('#caso='))$('mesa').scrollIntoView({block:'start'});
}
async function copyRoute(){
 const {id,pin}=routeState();const hash=location.hash.startsWith('#caso=')?location.hash:'#caso='+id+(pin?'&comparar='+pin:'');const url=location.href.split('#')[0]+hash;
 try{await navigator.clipboard.writeText(url);text('route-status','Enlace copiado. Conserva la situación seleccionada.');}
 catch(error){$('route-copy').hidden=false;$('route-value').value=url;$('route-value').focus();$('route-value').select();text('route-status','Copia el enlace seleccionado.');}
}
function setupCapabilities(){
 if(!$('cap-list'))return;
 const cards=[...document.querySelectorAll('details[data-cap]')];
 const codes=new Set(cards.map(el=>el.id));
 const search=$('cap-search'),family=$('family');
 let related=chosen && params.get('todos')!=='1' ? data.cases[chosen].caps : null;
 search.value=params.get('q')||'';
 family.value=['D','E','R','O','Q'].includes(params.get('familia'))?params.get('familia'):'';
 const fold=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 function catalogNav(state){
   const suffix=state.size?'?'+state:'';
   document.querySelectorAll('[data-consult],.menu a[href^="consulta.html"]').forEach(a=>a.href='consulta.html'+suffix);
   document.querySelectorAll('header a[href*="index.html"][href$="#mesa"],header a[href*="index.html"][href$="#responsable"]').forEach(a=>{
     a.href='index.html'+suffix+a.hash;
   });
 }
 function resetCatalogNav(){
   const state=new URLSearchParams();
   if(chosen)state.set('caso',chosen);
   if(example)state.set('muestra',exampleId);
   if(own(data.cases,params.get('comparar')))state.set('comparar',params.get('comparar'));
   catalogNav(state);
 }
 function configure(card){
   const code=card.id;
   const state=new URLSearchParams();
   state.set('cap',code);
   if(chosen)state.set('caso',chosen);
   if(example)state.set('muestra',exampleId);
   if(own(data.cases,params.get('comparar')))state.set('comparar',params.get('comparar'));
   if(search.value.trim())state.set('q',search.value.trim());
   if(family.value)state.set('familia',family.value);
   if(chosen&&!related)state.set('todos','1');
   const permanent='capacidades.html?'+state+'#'+code;
   card.querySelector('[data-permanent]').href=permanent;
   card.querySelector('[data-cap-consult]').href='consulta.html?'+state;
   const proofLink=card.querySelector('[data-proof-for]');
   if(proofLink){
     const evidence=new URLSearchParams(state);
     evidence.set('fuente',proofLink.dataset.source);
     if(!chosen){evidence.set('caso',proofLink.dataset.source);evidence.set('indice','1');}
     proofLink.href='evidencia.html?'+evidence;
   }
   const exact=card.querySelector('[data-fuente-exacta]');
   if(exact){
     const url=new URL(exact.dataset.original);
     if(chosen)url.searchParams.set('caso',chosen);
     for(const [key,value] of state)url.searchParams.set(key,value);
     if(!chosen)url.searchParams.set('indice','1');
     exact.href=url.pathname.split('/').pop()+'?'+url.searchParams+url.hash;
   }
   if(card.open)catalogNav(state);
 }
 function filter(){
   const words=fold(search.value.trim()).split(/\s+/).filter(Boolean);
   let count=0;
   for(const card of cards){
     const visible=(!related || related.includes(card.id)) && (!family.value || card.id.startsWith(family.value)) && words.every(w=>fold(card.textContent).includes(w));
     card.hidden=!visible;
     if(visible)count++;else card.open=false;
     configure(card);
   }
   text('cap-count',count+' de 26 capacidades visibles.');
   $('cap-empty').hidden=count!==0;
   text('cap-context',related?'Relacionadas con: '+data.cases[chosen].short+'.':'Catálogo completo.');
 }
 function openCode(code){
   if(!codes.has(code))return;
   const card=$(code);
   if(card.hidden){related=null;family.value='';search.value='';filter();}
   card.open=true;configure(card);card.scrollIntoView({block:'start'});
 }
 for(const card of cards){
   const exact=card.querySelector('[data-fuente-exacta]');
   if(exact)exact.dataset.original=exact.href;
   const link=card.querySelector('[data-proof-for]');
   if(link)link.dataset.source=new URL(link.href).searchParams.get('fuente');
   card.addEventListener('toggle',()=>{
     if(!card.open){if(!cards.some(item=>item.open))resetCatalogNav();return;}
     cards.forEach(other=>{if(other!==card)other.open=false;});configure(card);
   });
   card.querySelector('.cap-sibling').addEventListener('click',event=>{
     if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
     const code=event.currentTarget.hash.slice(1);
     if(location.hash==='#'+code){event.preventDefault();openCode(code);}
   });
 }
 contextLinks(chosen);resetCatalogNav();$('cap-tools').hidden=false;
 search.addEventListener('input',filter);family.addEventListener('change',filter);
 $('cap-all').addEventListener('click',()=>{related=null;search.value='';family.value='';filter();});
 window.addEventListener('hashchange',()=>openCode(location.hash.slice(1)));
 filter();openCode(location.hash.slice(1)||params.get('cap'));
}
function invalidateForm(){
 if(!$('prepared'))return;
 const had=!$('prepared').hidden;$('prepared').hidden=true;$('prepared-text').value='';$('open-mail').removeAttribute('href');
 text('form-status',had?'Cambiaste el alcance. Prepara de nuevo la consulta.':'');
 $('form-status').classList.remove('error');
}
function setupForm(){
 const form=$('scope-form');if(!form)return;
 contextLinks(chosen);form.hidden=false;
 const area=$('area');const allowed=[...area.options].map(o=>o.value).filter(Boolean);
 const capArea={D:'datos',E:'catalogos',R:'investigacion',O:'operaciones',Q:'calidad'};
 if(chosen){area.value=data.domains[data.cases[chosen].domain].area;text('consult-case',data.cases[chosen].short);}
 else if(allowed.includes(params.get('area')))area.value=params.get('area');
 if(cap){if(!chosen)area.value=capArea[cap.code[0]];text('consult-case',(chosen?data.cases[chosen].short+' · ':'')+cap.code+' · '+cap.title);}
 if(example)text('consult-case',[data.cases[chosen].short,cap?.title,example].filter(Boolean).join(' · '));
 form.addEventListener('input',invalidateForm);form.addEventListener('change',invalidateForm);
 form.addEventListener('submit',event=>{event.preventDefault();prepareForm(form);});
 $('copy-message').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText($('prepared-text').value);text('form-status','Texto copiado. No enviado: pégalo en tu correo y revisa antes de enviar.');}
  catch(error){$('prepared-text').focus();$('prepared-text').select();text('form-status','Copia el texto seleccionado. Todavía no se ha enviado.');}
 });
}
function prepareForm(form){
 invalidateForm();const area=$('area'),goal=$('objetivo');
 [area,goal].forEach(el=>el.removeAttribute('aria-invalid'));
 const invalid=!area.value?area:goal.value.trim().length<15?goal:null;
 if(invalid){invalid.setAttribute('aria-invalid','true');$('form-status').classList.add('error');text('form-status',invalid===area?'Selecciona un área para preparar la consulta.':'Describe el resultado con al menos 15 caracteres.');invalid.focus();return;}
 if(!form.checkValidity()){form.reportValidity();return;}
 const values=new FormData(form),label=area.selectedOptions[0].textContent;
 const lines=['Hola Eduardo,','','Quisiera consultar el siguiente alcance.','Área: '+label];
 for(const [key,label]of [['propuesta_origen','Propuesta'],['enfoque_propuesta','Enfoque de origen'],['ficha_propuesta','Ficha de referencia']]){const v=String(values.get(key)||'').trim();if(v)lines.push(label+': '+v);}
 if(chosen)lines.push('Situación de referencia: '+data.cases[chosen].short);
 if(example)lines.push('Muestra de referencia: '+example);
 if(cap)lines.push('Capacidad por evaluar: '+cap.code+' — '+cap.title);
 const mode={revision:'Revisión focalizada',intervencion:'Intervención operativa',continuidad:'Mejora continua'}[String(values.get('modalidad')||'')];
 if(mode)lines.push('Modalidad de interés: '+mode);
 const explored={mantener:'Conservar',revisar:'Revisar alternativas',contexto:'Necesito más contexto'}[params.get('decision')];
 if(explored)lines.push('Decisión explorada: '+explored);
 if(String(values.get('nombre')||'').trim())lines.push('Contacto: '+String(values.get('nombre')).trim());
 if(String(values.get('email')||'').trim())lines.push('Correo de respuesta: '+String(values.get('email')).trim());
 lines.push('Objetivo: '+goal.value.trim());
 for(const [key,name] of [['formato','Formato'],['volumen','Volumen'],['fecha','Fecha objetivo'],['decision','Decisión'],['referencia','Fuente disponible'],['restriccion','Error que debemos evitar']]){
  const value=String(values.get(key)||'').trim();if(value)lines.push(name+': '+value);
 }
 lines.push('','Quisiera confirmar viabilidad, entregables, criterios de aceptación, precio, plazo y condiciones de pago antes de comenzar.','No autorizo cambios en producción por enviar esta consulta.');
 const body=lines.join('\n');$('prepared-text').value=body;
 $('open-mail').href='mailto:3duardoambrosio@gmail.com?subject='+encodeURIComponent('Consulta de alcance | '+[label,cap?.code,example?exampleId:null].filter(Boolean).join(' · '))+'&body='+encodeURIComponent(body);
 $('prepared').hidden=false;text('form-status','Consulta preparada. NO enviada. Revisa el texto; solo enviarás desde tu correo.');
 $('prepared').focus({preventScroll:true});
 $('prepared').scrollIntoView({block:'nearest',behavior:'auto'});
}
function evidenceRow(label,value){return '<div><span>'+esc(label)+'</span><p>'+esc(value)+'</p></div>';}
function showRecord(kind,index){
 const root=$('record-body');if(!root)return;
 const list=kind==='admin'?window.PRUEBAS.admin:window.PRUEBAS.catalogo;
 const r=list[index];if(!r){root.innerHTML='<p class="notice">Registro no disponible. Revisa los archivos originales de abajo.</p>';return;}
 const steps=kind==='admin'?[['Origen',r.id+' · '+r.asunto+'\nEstado informado: '+r.estado_origen],['Hallazgo',r.flags.length?r.flags.join(' · '):'Sin alertas en las reglas del ejercicio. No equivale a aprobación.'],['Criterio',r.decision_cliente],['Siguiente paso',r.proxima_accion+'\n'+r.estado_control]]:[['Origen',r.record_id+' · '+r.field+'\n'+JSON.stringify(r.before)],['Hallazgo',r.finding+' · '+r.id],['Criterio',r.note],['Salida',JSON.stringify(r.after)+'\n'+r.decision]];
 root.innerHTML='<div class="clarity">'+steps.map(([k,v])=>evidenceRow(k,v)).join('')+'</div>';
 document.querySelectorAll('[data-record]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.record)===index)));
}
function setupEvidence(){
 if(!$('evidence-view'))return;
 const id=chosen||'admin',sourceCase=own(data.cases,params.get('fuente'))?params.get('fuente'):id,c=data.cases[sourceCase],p=proof[c.proof];contextLinks(id);
 text('evidence-type',p[0]);text('evidence-title',p[1]);text('evidence-limit',p[2]);
 const capsLink=document.querySelector('#evidence-view ~ .actions a[href^="capacidades.html"]');
 if(capsLink)capsLink.href='capacidades.html?caso='+id;
 const target=$('evidence-view');
 if(['admin','catalogo'].includes(c.proof)){
  if(!window.PRUEBAS||!Array.isArray(window.PRUEBAS[c.proof])||!window.PRUEBAS[c.proof].length){target.innerHTML='<p class="notice" role="alert">No se cargaron los datos de la muestra. No hay un resultado comprobado en esta vista. Usa los enlaces a los archivos y casos conservados.</p>';return;}
  const admin=c.proof==='admin';
  const labels=admin?['Solicitud con excepciones','Solicitud sin alertas']:['Espacios en SKU','Identificador duplicado','Precio ausente'];
  target.innerHTML='<article class="proof-record"><p class="eyebrow">'+(admin?'OP001 · 32 solicitudes · corte fijo 18 nov 2026':'Muestra de catálogo · 180 registros · 57 hallazgos')+'</p><h2>Del dato de origen a la decisión.</h2><div class="proof-controls" role="group" aria-label="Registros de ejemplo">'+labels.map((label,i)=>'<button class="quiet" type="button" data-record="'+(admin?i:[0,1,3][i])+'" aria-pressed="false">'+label+'</button>').join('')+'</div><div id="record-body"></div><p class="meta">'+(admin?'Las referencias a soporte son ficticias. La regla de dependencia detecta una referencia declarada; no comprueba aceptación del trabajo anterior.':'Se conservan valores ambiguos o ausentes. No es un catálogo aprobado para importar.')+'</p><a class="text-link" href="'+(admin?'caso-administrativo.html':'sitio/muestra.html')+'?caso='+id+(admin?'':'#muestra')+'">Abrir la muestra completa y sus controles</a><div class="downloads">'+(admin?'<a download href="data/solicitudes_sinteticas.csv">Descargar fuente OP001</a><a href="data/reglas_y_limites.json">Abrir reglas OP001 · JSON</a><a href="data/salida_evaluada.json">Abrir salida OP001 · JSON</a>':['01_FUENTE_ORIGINAL.csv','02_REVISION_PROPUESTA.csv','03_BITACORA_INCIDENCIAS.csv','04_MANIFIESTO_VERIFICACION.json'].map((f,i)=>'<a '+(f.endsWith('.csv')?'download ':'')+'href="sitio/'+f+'">'+['Fuente CSV','Revisión propuesta CSV','Bitácora CSV','Manifiesto JSON'][i]+'</a>').join(''))+'</div></article>';
  document.querySelectorAll('[data-record]').forEach(b=>b.addEventListener('click',()=>showRecord(c.proof,Number(b.dataset.record))));showRecord(c.proof,0);
 }else{
  target.innerHTML='<article class="proof-record"><h2>'+esc(c.proof==='documental'?'Qué cambia según el destino de un archivo.':'Una hipótesis necesita criterio de salida.')+'</h2><div class="clarity">'+evidenceRow('Entrada',c.proof==='documental'?'Documentación pública de Shopify, WooCommerce y Merchant Center.':'Objetivo, audiencia y alternativa a evaluar. Ejemplo conceptual.')+evidenceRow('Criterio',c.question)+evidenceRow('Resultado disponible',c.proof==='documental'?'Contraste escrito de requisitos y límites. No una operación implementada.':'Preguntas y propuesta de evaluación. No existe un resultado comercial validado.')+'</div><a class="text-link" href="'+(c.proof==='documental'?'sitio/investigacion-documental.html':'notas.html')+'?caso='+id+(c.proof==='plan'?'#experimento':'')+'">'+(c.proof==='documental'?'Abrir análisis, fuentes y límites':'Revisar la nota de planeación')+'</a></article>';
 }
}
function setupGuide(){
 if(!$('guide-case'))return;
 $('guide-next').addEventListener('click',()=>{const c=data.cases[$('guide-case').value];text('guide-title',c.title);text('guide-output',c.output);$('guide-open').href='index.html#caso='+c.id;$('guide-choose').hidden=true;$('guide-result').hidden=false;$('guide-back').focus();});
 $('guide-back').addEventListener('click',()=>{$('guide-result').hidden=true;$('guide-choose').hidden=false;$('guide-case').focus();});
}
document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>{a.closest('details').open=false;}));
setupDesk();setupCapabilities();setupForm();setupEvidence();setupGuide();
if($('fallback'))$('fallback').hidden=true;
})();
