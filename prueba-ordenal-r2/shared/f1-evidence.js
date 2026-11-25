(function(){"use strict";
function evaluate(order){if(order!=="pay"&&order!=="collect")throw Error("Unknown sequence");const events=order==="pay"?[["Pago",-9000],["Cobro",10000]]:[["Cobro",10000],["Pago",-9000]];let balance=1000,min=balance;const rows=events.map(([label,amount],i)=>{balance+=amount;min=Math.min(min,balance);return {label,amount,balance,day:i+1};});return {rows,min,end:balance,feasible:min>=0};}
const fmt=n=>new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n);
function mount(){const root=document.getElementById("f1-ledger-proof");if(!root)return;const buttons=[...root.querySelectorAll("[data-f1-order]")],$=id=>document.getElementById(id);function render(order){const r=evaluate(order);buttons.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.f1Order===order)));$("f1-min").textContent=fmt(r.min);$("f1-min").dataset.risk=String(!r.feasible);$("f1-end").textContent=fmt(r.end);$("f1-ledger").replaceChildren(...r.rows.map(x=>{const row=document.createElement("div"),a=document.createElement("span"),b=document.createElement("b");a.textContent="Día "+x.day+" · "+x.label+" "+fmt(x.amount);b.textContent=fmt(x.balance);row.append(a,b);return row;}));$("f1-explain").textContent=r.feasible?"El saldo no baja de cero bajo estos supuestos.":"Faltan "+fmt(-r.min)+" para cubrir el pago sin financiación adicional.";}buttons.forEach(b=>b.addEventListener("click",()=>render(b.dataset.f1Order)));render("pay");}
function plotPoints(r){const y=n=>12+(11000-n)*72/19000;return [[30,y(1000)],[164,y(r.rows[0].balance)],[300,y(r.end)]];}
function plot(r){return plotPoints(r).map(p=>p.join(",")).join(" ");}
function mountHero(){
 const root=document.querySelector("[data-f1-hero]");if(!root)return;
 const tabs=[...root.querySelectorAll("[data-evolution]")],orders=[...root.querySelectorAll("[data-hero-order]")],$=id=>document.getElementById(id);
 let phase=0,order="pay";
 function render(){
  const pay=evaluate("pay"),collect=evaluate("collect"),r=evaluate(order);
  tabs.forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.evolution)===phase)));
  orders.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.heroOrder===order)));
  $("f1-hero-inputs").hidden=phase!==0;$("f1-hero-chart").hidden=phase===0;$("f1-hero-choices").hidden=phase!==1;
  $("f1-hero-pay").setAttribute("points",plot(pay));$("f1-hero-collect").setAttribute("points",plot(collect));
  $("f1-hero-pay").style.visibility=phase===2||order==="pay"?"visible":"hidden";
  $("f1-hero-collect").style.visibility=phase===2||order==="collect"?"visible":"hidden";
  $("f1-hero-point").style.visibility=phase===1?"visible":"hidden";
  $("f1-hero-point").setAttribute("cx",plotPoints(r)[1][0]);$("f1-hero-point").setAttribute("cy",plotPoints(r)[1][1]);
  $("hero-explain").textContent=phase===0?"Identificamos los movimientos y la restricción: no gastar más dinero del disponible.":phase===1?"Saldo mínimo: "+fmt(r.min)+" · saldo final: "+fmt(r.end)+".": "Ambas secuencias cierran en "+fmt(pay.end)+". Una exige "+fmt(-pay.min)+" adicionales; la otra conserva liquidez.";
  $("f1-hero-legend").hidden=phase!==2;
 }
 tabs.forEach(b=>b.addEventListener("click",()=>{phase=Number(b.dataset.evolution);render();}));
 orders.forEach(b=>b.addEventListener("click",()=>{order=b.dataset.heroOrder;render();}));render();
}
function mountEvidence(){
 document.querySelectorAll("[data-f1-carousel]").forEach(root=>{
 const track=root.querySelector(".f1-track"),prev=root.querySelector("[data-f1-prev]"),next=root.querySelector("[data-f1-next]"),cards=[...track.querySelectorAll(".f1-card")];
 const max=()=>Math.max(0,track.scrollWidth-track.clientWidth);
 function sync(){prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft>=max()-2;}
 function move(dir){const pos=track.scrollLeft;const offsets=cards.map(c=>c.offsetLeft-cards[0].offsetLeft);
 const target=dir>0?offsets.find(x=>x>pos+3):offsets.filter(x=>x<pos-3).pop();
 track.scrollTo({left:Math.min(max(),Math.max(0,target===undefined?(dir>0?max():0):target)),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}
 prev.addEventListener("click",()=>move(-1));next.addEventListener("click",()=>move(1));track.addEventListener("scroll",sync,{passive:true});window.addEventListener("resize",sync,{passive:true});sync();
 });
}
function start(){mount();mountHero();mountEvidence();}
if(typeof document!=="undefined"){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();}})();