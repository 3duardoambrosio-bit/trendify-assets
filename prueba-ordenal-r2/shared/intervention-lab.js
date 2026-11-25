(function(root){
"use strict";
const orders=[{id:"P1",sku:0,qty:8,due:3,value:1450,weight:5},{id:"P2",sku:1,qty:9,due:3,value:1800,weight:6},{id:"P3",sku:0,qty:12,due:5,value:2450,weight:8},{id:"P4",sku:1,qty:8,due:7,value:1700,weight:5},{id:"P5",sku:0,qty:6,due:8,value:1100,weight:3}];
const buys=[{id:"C1",sku:0,qty:8,cost:950,day:2,fragile:true},{id:"C2",sku:1,qty:10,cost:1250,day:2,fragile:true},{id:"C3",sku:0,qty:12,cost:1550,day:4,pay:3,fragile:false},{id:"C4",sku:1,qty:8,cost:1150,day:5,pay:4,fragile:false},{id:"C5",sku:0,qty:8,cost:1200,day:2,fragile:false},{id:"C6",sku:1,qty:10,cost:900,day:2,fragile:false,needsProof:true},{id:"C7",sku:0,qty:6,cost:780,day:6,pay:5,fragile:true}];
const scenarios=[{name:"Normal",delay:0,late:0},{name:"Proveedor tarde",delay:2,late:0},{name:"Cobro tarde",delay:0,late:3},{name:"Ambos retrasos",delay:2,late:3}];
const pick=(a,m)=>a.filter((_,i)=>m&(1<<i));
function simulate(cash,bs,os,s){
 let stock=[12,8],balance=cash,min=cash,issues=[],timeline=[cash];
 for(let d=0;d<=13;d++){
  for(const o of os)if(o.due+1+s.late===d)balance+=o.value;
  for(const p of bs)if(d===(p.pay||0))balance-=p.cost;
  min=Math.min(min,balance);if(balance<0&&(!issues.some(x=>x.type==="caja")))issues.push({type:"caja",day:d,short:-balance});
  for(const p of bs)if(p.day+(p.fragile?s.delay:0)===d)stock[p.sku]+=p.qty;
  for(const o of os)if(o.due===d){stock[o.sku]-=o.qty;if(stock[o.sku]<0)issues.push({type:"inventario",day:d,order:o.id,short:-stock[o.sku]});}
  timeline.push(balance);
 }
 return {scenario:s.name,ok:!issues.length,min,end:balance,issues,timeline};
}
function solve(cash,proof,robust){
 if(!Number.isSafeInteger(cash)||cash<0||cash>10000)throw Error("Capital fuera de rango");
 let best=null,checked=0,feasible=0;
 for(let i=0;i<128;i++){const bs=pick(buys,i);for(let j=0;j<32;j++){checked++;const os=pick(orders,j);
 if(!proof&&bs.some(p=>p.needsProof))continue;
 const outcomes=scenarios.map(s=>simulate(cash,bs,os,s));
 if(!(robust?outcomes:outcomes.slice(0,1)).every(x=>x.ok))continue;
 feasible++;const score=os.reduce((n,o)=>n+o.weight,0),net=os.reduce((n,o)=>n+o.value,0)-bs.reduce((n,p)=>n+p.cost,0);
 const plan={score,net,buys:bs.map(x=>x.id),orders:os.map(x=>x.id),outcomes,min:Math.min(...outcomes.map(x=>x.min))};
 if(!best||score>best.score||score===best.score&&(net>best.net||net===best.net&&plan.min>best.min))best=plan;
 }}
 return {checked,feasible,best};
}
const records=[{id:"R01",ordered:12,dispatch:12,paid:12,receipt:true,age:1},{id:"R02",ordered:10,dispatch:10,paid:8,receipt:true,age:3},{id:"R03",ordered:6,dispatch:6,paid:6,receipt:false,age:2},{id:"R04",ordered:8,dispatch:0,paid:8,receipt:false,age:5},{id:"R05",ordered:4,dispatch:4,paid:4,receipt:true,age:1},{id:"R06",ordered:9,dispatch:9,paid:null,receipt:true,age:4},{id:"R07",ordered:5,dispatch:5,paid:5,receipt:true,age:2},{id:"R08",ordered:7,dispatch:9,paid:7,receipt:true,age:3}];
function reconcile(paymentEvidence,deliveryEvidence){
 const source=records.map(r=>({...r})),result=source.map(r=>{
 const paid=r.id==="R06"&&paymentEvidence?9:r.paid,receipt=r.id==="R03"&&deliveryEvidence?true:r.receipt;
 const flags=[];if(r.dispatch!==r.ordered)flags.push("Cantidad enviada no coincide");if(paid===null)flags.push("Cobro sin confirmar");else if(paid!==r.ordered)flags.push("Cobro no coincide");if(!receipt)flags.push("Falta evidencia de entrega");
 return {...r,paid,receipt,flags,ready:flags.length===0,priority:flags.length?r.age*flags.length:0};
 }).sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id));
 return {source,confirmations:{paymentEvidence,deliveryEvidence},result,ready:result.filter(r=>r.ready).length,pending:result.filter(r=>!r.ready).length};
}
const channels=[{id:"A",name:"Canal A",n:10,k:5,cost:20,holdN:100,holdK:20},{id:"B",name:"Canal B",n:100,k:32,cost:20,holdN:100,holdK:31},{id:"C",name:"Canal C",n:45,k:15,cost:23,holdN:100,holdK:29}];
function lower(k,n){if(!n)return 0;const z=1.96,p=k/n,d=1+z*z/n;return Math.max(0,(p+z*z/(2*n)-z*Math.sqrt((p*(1-p)+z*z/(4*n))/n))/d);}
function learn(reveal){
 const rows=channels.map(x=>{const n=x.n+(reveal?x.holdN:0),k=x.k+(reveal?x.holdK:0);return {id:x.id,name:x.name,n,k,cost:x.cost,rate:k/n,lower:lower(k,n),naive:k/n*100-x.cost,conservative:lower(k,n)*100-x.cost};});
 const choose=key=>rows.slice().sort((a,b)=>b[key]-a[key]||a.id.localeCompare(b.id))[0];
 return {rows,naive:choose("naive"),conservative:choose("conservative"),reveal,holdout:reveal?channels.map(x=>({id:x.id,n:x.holdN,k:x.holdK})):null};
}
const api={simulate,solve,reconcile,learn,lower,orders,buys,scenarios};
if(typeof module!=="undefined")module.exports=api;else root.ORDENALLab=api;
if(typeof document==="undefined")return;
function mount(){
 const el=document.getElementById("laboratorio");if(!el)return;
 const $=id=>document.getElementById(id),mx=n=>new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n),pct=n=>(n*100).toFixed(1)+"%";
 let mode="plan",report=null;
 const context=el.dataset.context;
 const words={general:["pedidos","registros","canales"],azztlan:["pedidos de colección","registros de piezas","canales de venta"],almaloginter:["compromisos logísticos","registros de movimientos","canales de captación"],enterprise:["compromisos por referencia","registros operativos","canales de un piloto"]}[context]||["pedidos","registros","canales"];
 $("lab-context").textContent="Muestras ficticias de "+words.join(", ")+". Sin datos de clientes.";
 function table(head,rows){const t=document.createElement("table"),h=document.createElement("thead"),tr=document.createElement("tr");for(const v of head){const th=document.createElement("th");th.scope="col";th.textContent=v;tr.append(th);}h.append(tr);t.append(h);const body=document.createElement("tbody");for(const row of rows){const tr=document.createElement("tr");for(const v of row){const td=document.createElement("td");td.textContent=String(v);tr.append(td);}body.append(tr);}t.append(body);$("lab-table").replaceChildren(t);}
 function metrics(vals){$("lab-metrics").replaceChildren(...vals.map(([label,value])=>{const d=document.createElement("div"),s=document.createElement("small"),b=document.createElement("strong");s.textContent=label;b.textContent=value;d.append(s,b);return d;}));}
 function details(lines){$("lab-detail").replaceChildren(...lines.map(v=>{const li=document.createElement("li");li.textContent=v;return li;}));}
 function run(){
  if(mode==="plan"){
   const cash=Number($("lab-cash").value),proof=$("lab-proof").checked;
   if(!Number.isSafeInteger(cash)||cash<0||cash>10000||$("lab-cash").value===""){$("lab-explain").textContent="Introduce capital entero entre 0 y 10,000 MXN.";return;}
   const normal=solve(cash,proof,false),robust=solve(cash,proof,true),a=normal.best,b=robust.best;
   report={mode,inputs:{cash,proof,orders,buys,scenarios},normal,robust};
   metrics([["Planes evaluados",robust.checked.toLocaleString("es-MX")],["Planes resistentes",robust.feasible],["Compromisos elegidos",b.orders.length]]);
   table(["Escenario","Plan normal","Plan resistente","Caja mínima resistente"],scenarios.map((s,i)=>[s.name,a.outcomes[i].ok?"Cumple":"Falla",b.outcomes[i].ok?"Cumple":"Falla",mx(b.outcomes[i].min)]));
   $("lab-explain").textContent="El plan resistente elige "+(b.orders.join(", ")||"ningún pedido")+" y "+(b.buys.join(", ")||"ninguna compra")+". El plan normal supera "+a.outcomes.filter(s=>s.ok).length+"/4 escenarios; el resistente, 4/4.";
   details(["Objetivo: maximizar prioridad de pedidos, luego contribución y peor caja; no se supone demanda adicional.","Plan normal: "+(a.orders.join(", ")||"sin pedidos")+"; contribución "+mx(a.net)+". Plan resistente: "+mx(b.net)+".","Pedidos no elegidos: "+(orders.filter(o=>!b.orders.includes(o.id)).map(o=>o.id).join(", ")||"ninguno")+". Pueden renegociarse; no se aceptan automáticamente.","La fuente C6 solo entra cuando confirmas su disponibilidad. Las compras tienen fechas de pago y llegada; las entregas y cobros tienen fechas explícitas. Los cobros del día preceden a los pagos del mismo día en esta simulación."]);
  }else if(mode==="trace"){
   const r=reconcile($("lab-pay").checked,$("lab-receipt").checked);report={mode,...r};
   metrics([["Registros cruzados",r.result.length],["Listos para revisión",r.ready],["Excepciones abiertas",r.pending]]);
   table(["Referencia","Pedido / envío / cobro","Estado","Prioridad"],r.result.map(x=>[x.id,[x.ordered,x.dispatch,x.paid??"?"].join(" / "),x.ready?"Listo para revisión":x.flags.join("; "),x.priority]));
   $("lab-explain").textContent="De "+r.result.length+" referencias, "+r.pending+" siguen abiertas. Las confirmaciones resuelven únicamente sus incidencias específicas; no sustituyen el resto de los controles.";
   details(["La fuente original permanece intacta en el expediente.","Se cruzan cantidades de pedido, envío, cobro y acuse de entrega.","La prioridad usa antigüedad × número de incidencias como regla ilustrativa; no equivale a impacto monetario.","Los registros listos para revisión no son entregas aprobadas."]);
  }else{
   const r=learn($("lab-reveal").checked);report={mode,...r};
   metrics([["Canal por promedio",r.naive.id],["Canal por límite inferior",r.conservative.id],["Observaciones",r.rows.reduce((n,x)=>n+x.n,0)]]);
   table(["Canal","Éxitos / pruebas","Tasa observada","Límite inferior 95%","Contribución conservadora*"],r.rows.map(x=>[x.name,x.k+" / "+x.n,pct(x.rate),pct(x.lower),mx(x.conservative)]));
   $("lab-explain").textContent="La tasa observada favorece "+r.naive.name+"; al penalizar incertidumbre por tamaño de muestra, la decisión favorece "+r.conservative.name+". "+(r.reveal?"Se incorporó una segunda ronda de resultados ficticios.":"Activa la segunda ronda para revisar la decisión con evidencia adicional.");
   details(["*Ingreso supuesto de $100 MXN por éxito, menos coste por intento; no es una previsión.","Límite inferior de Wilson bilateral al 95% para una proporción binomial; requiere observaciones comparables e independientes.","La segunda ronda es fija y ficticia. No es una prueba de aprendizaje autónomo ni validación de mercado.","Registrar resultados permite actualizar la decisión sin confundir una muestra pequeña con una oportunidad comprobada."]);
  }
  $("lab-export").disabled=false;
 }
 function select(next){mode=next;el.querySelectorAll("[data-lab-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.labMode===mode)));el.querySelectorAll("[data-lab-panel]").forEach(p=>p.hidden=p.dataset.labPanel!==mode);$("lab-result-title").textContent={plan:"Qué compromisos sostener",trace:"Qué información falta resolver",learn:"Qué cambia con más evidencia"}[mode];$("lab-export").disabled=true;report=null;run();}
 el.querySelectorAll("[data-lab-mode]").forEach(b=>b.addEventListener("click",()=>select(b.dataset.labMode)));
 el.querySelectorAll("input").forEach(x=>x.addEventListener("input",()=>{report=null;$("lab-export").disabled=true;$("lab-explain").textContent="Hay cambios pendientes. Ejecuta la prueba para actualizar el resultado.";}));
 $("lab-run").addEventListener("click",run);
 $("lab-export").addEventListener("click",()=>{if(!report)return;const a=document.createElement("a"),url=URL.createObjectURL(new Blob([JSON.stringify({schema:"ordenal.lab.v1",synthetic:true,...report},null,2)],{type:"application/json"}));a.href=url;a.download="ordenal-"+mode+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 select("plan");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(typeof window==="undefined"?globalThis:window);