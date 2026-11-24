'use strict';
const ORDENAL_EXPLORER=(()=>{
const cases={
growth:['Explorar una oportunidad comercial','Investigar compradores, oferta y alternativas antes de invertir.','Comparación documentada y diseño de una prueba comercial acotada.','Alternativas verificadas y criterio para invertir.','Oferta, demanda, disponibilidad y coste.','crecimiento',['publicas','archivo','varias']],
multi:['Preparar productos e información comercial','Revisar una muestra de fichas o archivos y sus fuentes.','Archivo revisado, cambios propuestos y excepciones.','Registros comprobados y correcciones aceptadas.','Catálogo, compras, disponibilidad y experiencia de compra.','catalogos',['publicas','archivo','varias']],
operations:['Mejorar un proceso de trabajo','Reconstruir un flujo con casos representativos y su responsable.','Procedimiento inicial y control de pendientes.','Tiempo y bloqueos antes y después de una prueba acordada.','Personas, tareas, tiempos y capacidad de atención.','operaciones',['archivo','varias']],
admin:['Organizar pedidos o solicitudes','Examinar una muestra autorizada sin información personal innecesaria.','Seguimiento por estado, responsable y excepción.','Pendientes identificables y cierres con evidencia.','Pedidos, atención, cumplimiento y retrabajo.','operaciones',['archivo','varias']],
migration:['Preparar y comprobar una migración','Revisar formatos de origen y destino con una muestra.','Archivo de preparación según formato, comparación y diferencias por resolver.','Identidades, variantes y campos conservados en la muestra.','Catálogo, precios, variantes y continuidad de venta.','catalogos',['archivo','varias']],
recon:['Explicar diferencias entre reportes','Acordar periodo, unidades, identificadores y fuentes comparables.','Conciliación acotada con diferencias explicadas y pendientes.','Partidas conciliadas sin ajustes no autorizados.','Datos, decisiones, costes y controles.','datos',['varias']],
sourcing:['Investigar proveedores y opciones','Comparar candidatos por requisitos, condiciones y fuentes.','Matriz de alternativas y preguntas por confirmar.','Candidatos comparables y requisitos pendientes.','Compras, disponibilidad, coste total y riesgo.','investigacion',['publicas','archivo','varias']],
qa:['Comprobar una entrega','Acordar qué significa una entrega correcta y contrastar una muestra.','Registro de comprobaciones, incidencias y criterio de aceptación.','Controles superados, fallos y pendientes.','Calidad, retrabajo, plazos y confianza.','calidad',['archivo','varias']],
otro:['Encontrar por dónde empezar','Entender la situación y comprobar qué información existe.','Propuesta de siguiente paso, si existe un trabajo viable.','Objetivo y alcance claros; todavía no un diagnóstico.','Objetivos, recursos, restricciones y oportunidades.','otro',[]]};
const sources=['publicas','archivo','varias','sin'],sizes=['pequeno','acotado','complejo','desconocido'];
function recommend(goal,source,size){
 if(!Object.hasOwn(cases,goal)||!sources.includes(source)||!sizes.includes(size))return null;
 const item=cases[goal];let budget='consulta',reason='Primero necesitamos entender la necesidad y las fuentes. La consulta no incluye ejecución.';
 if(goal!=='otro'&&size==='complejo'){budget='personalizado';reason='El alcance completo exige evaluar accesos, riesgos y tiempo. No aplica una tarifa pequeña.';}
 else if(item[6].includes(source)&&size==='pequeno'){budget='inicial';reason='Una muestra y un resultado podrían encajar en un máximo orientativo de dos horas.';}
 else if(item[6].includes(source)&&size==='acotado'){budget='acotado';reason='Un trabajo definido podría encajar en un máximo orientativo de cuatro horas.';}
 const prices={consulta:'Consulta inicial sin cargo',inicial:'Desde $390 MXN',acotado:'Desde $790 MXN',personalizado:'Cotización individual'};
 const p={area:item[5],asistente:'1',fuentes:source,tamano:size,presupuesto:budget,modalidad:budget==='consulta'?'revision':'intervencion'};
 if(goal!=='otro')p.caso=goal;
 return {item,budget,price:prices[budget],reason,url:'consulta.html?'+Object.entries(p).map(([k,v])=>encodeURIComponent(k)+'='+encodeURIComponent(v)).join('&')};
}
function compare(origin,target){
 const group=rows=>{const m=new Map();for(const row of rows){if(typeof row.id!=='string'||!row.id.trim())throw Error('Identificador ausente');const list=m.get(row.id)||[];list.push(row);m.set(row.id,list);}return m;};
 const a=group(origin),b=group(target),out=[];
 for(const id of new Set([...a.keys(),...b.keys()])){
 const x=a.get(id)||[],y=b.get(id)||[];let status,detail;
 if(x.length>1||y.length>1){status='Duplicado';detail='Identidad ambigua; no aprobar.';}
 else if(!y.length){status='Falta';detail='No aparece en destino.';}
 else if(!x.length){status='Adicional';detail='No aparece en origen.';}
 else if(x[0].variant!==y[0].variant||x[0].price!==y[0].price){status='Diferencia';detail='Variante o precio no coincidente.';}
 else{status='Coincide';detail='Solo los dos campos comprobados coinciden.';}
 out.push({id,status,detail});
 }return out;
}
return {cases,sources,sizes,recommend,compare};
})();
if(typeof document!=='undefined')(()=>{
 const root=document.getElementById('ordenal-explorer');if(!root)return;
 const q=id=>root.querySelector('#explorer-'+id),form=root.querySelector('form'),steps=[...form.querySelectorAll('fieldset')],keys=['goal','source','size'];let step=0;
 const selected=key=>form.elements.namedItem(key).value;
 function draw(focus=false){
 steps.forEach((field,i)=>field.hidden=i!==step);q('result').hidden=step!==3;q('next').hidden=step===3;q('back').hidden=step===0;q('reset').hidden=step===0;
 q('next').disabled=step<3&&!selected(keys[step]);q('next').textContent=step===2?'Ver propuesta orientativa':'Continuar';q('progress').textContent=step===3?'Tu punto de partida':'Paso '+(step+1)+' de 3';
 if(step===3){const v=ORDENAL_EXPLORER.recommend(...keys.map(selected));if(!v){step=0;draw();return;}
 ['title','need','delivery','metric','connections'].forEach((id,i)=>q(id).textContent=v.item[i]);q('price').textContent=v.price;q('reason').textContent=v.reason;q('contact').href=v.url;if(focus)q('result').focus();}
 else if(focus)steps[step].querySelector('legend').focus();
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('change',()=>draw());
 q('next').addEventListener('click',()=>{if(step<3&&selected(keys[step])){step++;draw(true);}});
 q('back').addEventListener('click',()=>{if(step>0){step--;draw(true);}});
 q('reset').addEventListener('click',()=>{form.reset();step=0;draw(true);});
 form.hidden=false;q('fallback').hidden=true;draw();
 const demo=document.getElementById('migration-demo');if(!demo)return;
 const original=[{id:'A-01',variant:'Negro',price:390},{id:'A-02',variant:'Verde',price:490},{id:'A-03',variant:'Azul',price:590},{id:'A-04',variant:'Blanco',price:690}];
 const imported=[{id:'A-01',variant:'Negro',price:390},{id:'A-02',variant:'Verde',price:49},{id:'A-04',variant:'Blanco',price:690},{id:'A-04',variant:'Blanco',price:690}];
 demo.querySelector('button').addEventListener('click',()=>{const rows=ORDENAL_EXPLORER.compare(original,imported);demo.querySelector('#migration-results tbody').replaceChildren(...rows.map(row=>{const tr=document.createElement('tr');for(const key of ['id','status','detail']){const td=document.createElement('td');td.textContent=row[key];tr.append(td);}return tr;}));demo.querySelector('#migration-outcome').textContent=rows.filter(r=>r.status==='Coincide').length+' de '+rows.length+' identidades coinciden en los campos comprobados. Hay excepciones: no aprobar el lote.';demo.querySelector('#migration-results').hidden=false;});
})();
