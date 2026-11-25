(function(){"use strict";
function mount(){
 const $=id=>document.getElementById(id),flow=document.querySelector('.ord-feature .ord-flow');if(!flow||!$('lab-run')||!$('evo-run'))return;
 const node=(tag,text,cls)=>{const x=document.createElement(tag);if(text)x.textContent=text;if(cls)x.className=cls;return x;};
 const stages=[['Fuente','Una venta, una incidencia o una cotización deja información que puede servir para decidir.','#laboratorio','Recuperar información','trace'],['Contraste','Comparamos alternativas con las restricciones reales y revisamos qué evidencia cambia la decisión.','#laboratorio','Comprobar una decisión','plan'],['Expediente','Conservamos criterios, fuentes y excepciones para que la siguiente intervención no empiece desde cero.','#expediente','Explorar un expediente',null]];
 const holder=node('div','','ord-r8-flow');flow.before(holder);holder.append(flow);flow.setAttribute('role','group');flow.setAttribute('aria-label','Etapas de una intervención');const message=node('p'),link=node('a');message.setAttribute('role','status');holder.append(message,link);
 const buttons=Array.from(flow.children).filter(x=>x.tagName==='SPAN').map((span,i)=>{const b=node('button','','ord-r8-stage');b.type='button';b.append(node('i','0'+(i+1)),document.createTextNode(stages[i][0]));span.replaceWith(b);b.addEventListener('click',()=>select(i));return b;});
 function select(i){const s=stages[i];buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));message.textContent=s[1];link.href=s[2];link.textContent=s[3];if(s[4])link.dataset.labJump=s[4];else delete link.dataset.labJump;}
 select(0);
 const delta=node('div','','ord-r8-delta');delta.hidden=true;delta.setAttribute('role','status');$('lab-explain').before(delta);
 const modes=[['plan','Operación bajo presión','#laboratorio'],['trace','Información contradictoria','#laboratorio'],['learn','Aprendizaje comercial','#laboratorio'],['recovery','Continuidad de una operación','#evo-recovery']],seen=new Set(),prior=new Map();
 const notebook=node('details','','ord-r8-journey'),summary=node('summary','Mi recorrido de pruebas'),list=node('ul'),note=node('p','Solo registra pruebas ejecutadas en esta pestaña. No es una evaluación empresarial ni se envían datos.'),reset=node('button','Reiniciar recorrido','button secondary');reset.type='button';notebook.append(summary,list,note,reset);document.querySelector('.lab-benefit').after(notebook);
 const statuses=new Map();modes.forEach(([key,label,href])=>{const row=node('li'),a=node('a',label),s=node('small','Por explorar');a.href=href;if(key!=='recovery')a.dataset.labJump=key;statuses.set(key,s);row.append(a,s);list.append(row);});
 function update(){summary.textContent='Mi recorrido de pruebas · '+seen.size+'/4';statuses.forEach((s,k)=>s.textContent=seen.has(k)?'Ejecutada':'Por explorar');}
 function record(k){seen.add(k);update();}reset.addEventListener('click',()=>{seen.clear();update();});update();
 const mode=()=>document.querySelector('[data-lab-mode][aria-pressed="true"]')?.dataset.labMode;
 const snap=()=>Array.from(document.querySelectorAll('#lab-metrics > div')).map(x=>[x.querySelector('small').textContent,x.querySelector('strong').textContent]);
 function remember(){const k=mode();if(k&&!$('lab-export').disabled)prior.set(k,snap());delta.hidden=true;}
 remember();document.querySelectorAll('[data-lab-mode]').forEach(b=>b.addEventListener('click',remember));document.querySelectorAll('#laboratorio input').forEach(i=>i.addEventListener('input',()=>delta.hidden=true));
 $('lab-run').addEventListener('click',()=>{if($('lab-export').disabled){delta.hidden=true;return;}const k=mode(),now=snap(),old=prior.get(k);record(k);prior.set(k,now);const changes=old?now.filter(([label,value])=>old.some(o=>o[0]===label&&o[1]!==value)).map(([label,value])=>label+': '+old.find(o=>o[0]===label)[1]+' → '+value):[];delta.replaceChildren(node('strong','CAMBIO DESDE LA PRUEBA ANTERIOR'),node('p',changes.length?changes.join(' · '):'Los indicadores principales no cambiaron. Consulta la tabla para revisar las condiciones y resultados.'));delta.hidden=false;});
 $('evo-run').addEventListener('click',()=>{if(!$('evo-export').disabled)record('recovery');});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();})();
