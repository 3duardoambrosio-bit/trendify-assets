function evaluatePortfolio(items,budget,hours,mode){
 if(!Array.isArray(items)||items.length!==3||!Number.isSafeInteger(budget)||budget<0||!Number.isSafeInteger(hours)||hours<0||!['base','conservative'].includes(mode))throw new Error('Entradas inválidas');
 for(const p of items){if(![p.cost,p.hours,p.units,p.contribution,p.down].every(Number.isSafeInteger)||p.cost<0||p.hours<0||p.units<0||p.contribution<0||p.down<0||p.down>p.units)throw new Error('Iniciativa inválida');}
 const plans=[];
 for(let mask=0;mask<8;mask++){
  const chosen=items.filter((_,i)=>mask&(1<<i));let cost=0,time=0,base=0,down=0;
  for(const p of chosen){cost+=p.cost;time+=p.hours;base+=p.units*p.contribution-p.cost;down+=p.down*p.contribution-p.cost;}
  if(cost<=budget&&time<=hours)plans.push({mask,cost,time,base,down});
 }
 const value=p=>mode==='base'?p.base:p.down;
 plans.sort((a,b)=>value(b)-value(a)||b.down-a.down||a.cost-b.cost||a.time-b.time||a.mask-b.mask);
 return plans;
}
(function(){
 const root=document.getElementById('decision-studio');if(!root)return;
 const $=id=>document.getElementById(id),currency=root.dataset.currency,isUSD=currency==='USD';
 const names=isUSD?['Prueba de colección','Nuevo canal de venta','Mejora operativa']:['Prueba comercial','Nuevo canal de distribución','Mejora operativa'];
 const seeds=isUSD?[[350,12,22,35,12],[280,9,16,30,8],[160,8,12,22,9]]:[[5000,12,35,260,21],[4200,9,28,230,16],[2500,8,20,180,14]];
 const labels=['Inversión fija','Horas','Unidades base','Contribución/unidad','Unidades conservadoras'];
 const fmt=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency,currencyDisplay:'code',maximumFractionDigits:2}).format(n/100);
 const create=(tag,txt)=>{const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;return e;};
 let snapshot=null;
 function seed(){
  $('st-budget').value=isUSD?750:12000;$('st-hours').value=24;$('st-mode').value='conservative';$('st-items').replaceChildren();
  seeds.forEach((row,i)=>{const d=create('div');d.className='studio-item';d.append(create('strong',names[i]));row.forEach((v,j)=>{const l=create('label',labels[j]),input=create('input');input.id='st-'+i+'-'+j;input.type='number';input.min='0';input.max=j===1?'10000':j===2||j===4?'10000':'1000000';input.step=j===0||j===3?'.01':'1';input.required=true;input.value=v;l.htmlFor=input.id;l.append(input);d.append(l);});$('st-items').append(d);});
 }
 function read(id,cents){const e=$(id),v=e.valueAsNumber;if(!e.checkValidity()||!Number.isFinite(v))throw Error('Comprueba los valores de entrada.');return cents?Math.round(v*100):v;}
 function invalidate(){snapshot=null;$('st-result').hidden=true;$('st-error').hidden=true;}
 function calculate(){
  invalidate();try{
   const budget=read('st-budget',true),hours=read('st-hours',false),mode=$('st-mode').value;
   const items=seeds.map((_,i)=>({cost:read('st-'+i+'-0',true),hours:read('st-'+i+'-1',false),units:read('st-'+i+'-2',false),contribution:read('st-'+i+'-3',true),down:read('st-'+i+'-4',false)}));
   if(items.some(p=>p.down>p.units))throw Error('Las unidades del escenario conservador no pueden superar las del escenario base.');
   const plans=evaluatePortfolio(items,budget,hours,mode),best=plans[0],title=p=>p.mask?names.filter((_,i)=>p.mask&(1<<i)).join(' + '):'No invertir todavía';
   $('st-title').textContent=title(best);$('st-description').textContent=best.mask?'Combinación con mayor resultado ilustrativo según el criterio elegido y los límites definidos.':'Con estos supuestos, conservar recursos tiene un resultado igual o mejor que las alternativas.';
   const kpis=[['Inversión utilizada',fmt(best.cost)],['Horas utilizadas',best.time+' / '+hours],['Resultado base',fmt(best.base)],['Resultado conservador',fmt(best.down)]];
   $('st-kpis').replaceChildren(...kpis.map(([a,b])=>{const d=create('div');d.append(create('small',a),create('b',b));return d;}));
   $('st-plans').replaceChildren(...plans.map(p=>{const li=create('li');li.append(create('span',title(p)),create('b',fmt(mode==='base'?p.base:p.down)));return li;}));
   $('st-caution').textContent=(best.down<0?'Atención: la combinación seleccionada pierde dinero en el escenario conservador. ':'')+'Se compararon '+plans.length+' de 8 combinaciones, incluida la opción de no invertir. Validar demanda, costes, capacidad y dependencia entre iniciativas antes de decidir.';
   snapshot={currency,budget,hours,mode,items:items.map((p,i)=>({...p,name:names[i]})),plans,best};
   $('st-result').hidden=false;
  }catch(e){$('st-error').textContent=e.message;$('st-error').hidden=false;$('st-assumptions').open=true;}
 }
 seed();$('studio-form').addEventListener('input',invalidate);$('studio-form').addEventListener('submit',e=>{e.preventDefault();calculate();});$('st-reset').addEventListener('click',()=>{seed();calculate();});
 $('st-download').addEventListener('click',()=>{if(!snapshot)return;const lines=['ORDENAL | Plan ilustrativo de decisión','No es una recomendación de inversión ni datos de cliente.','Moneda: '+currency+'; valores monetarios en centavos.','Validaciones previas: demanda, costes completos, capacidad, dependencias y aprobación humana.','Siguiente paso: confirmar objetivo, fuentes, alcance y criterio de aceptación.',JSON.stringify(snapshot,null,2)];const url=URL.createObjectURL(new Blob([lines.join('\n\n')],{type:'text/plain;charset=utf-8'}));const a=create('a');a.href=url;a.download='ORDENAL_plan_ilustrativo.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 $('st-contact').addEventListener('click',()=>{const t=$('objetivo');if(!t.value.trim()){t.value='Me interesa explorar una intervención para comparar iniciativas, presupuesto y capacidad de ejecución.';t.dispatchEvent(new Event('input',{bubbles:true}));}});
 calculate();
})();
