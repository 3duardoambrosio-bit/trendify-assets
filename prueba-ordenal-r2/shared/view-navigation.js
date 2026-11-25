(function(){
"use strict";
const main=document.getElementById("main")||document.querySelector("main");if(!main)return;
const views={inicio:"inicio",capacidades:"inicio","capacidad-verificable":"decisiones",decision:"decisiones",explorar:"soluciones",evidencia:"evidencia",presupuesto:"guia",contacto:"contacto",expediente:"intervencion"};
const labels={inicio:"Inicio",decisiones:"Decisiones",soluciones:"Soluciones",evidencia:"Evidencia",guia:"Precios y guía",contacto:"Contacto",intervencion:"Expediente"};
function viewFor(id){return views[id]||"inicio";}
const groups=[...main.querySelectorAll("[data-ord-view]")];if(!groups.length)return;
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
let active=null,lastHash=null,frame=0;
const nav=[...document.querySelectorAll(".navlinks a[href^='#'],.mobile-menu a[href^='#'],.mobile-dock a[href^='#'],.ord-viewbar a[href^='#']")];
const menu=document.querySelector(".mobile-menu");
const title=document.getElementById("ord-view-label"),bar=document.querySelector(".ord-viewbar");
function targetFor(hash){let id;try{id=decodeURIComponent((hash||"#inicio").slice(1));}catch{return null;}const t=document.getElementById(id||"inicio");return t&&main.contains(t)?t:null;}
function routeFor(t){if(!t||t===main)return active||"inicio";const root=t.closest("[data-ord-view]");return root?root.dataset.ordView:active||"inicio";}
function currentScene(){return document.querySelector("[data-scene][aria-pressed='true']")?.dataset.scene||null;}
function setScene(scene){if(!scene||currentScene()===scene)return;const btn=[...document.querySelectorAll("[data-scene]")].find(x=>x.dataset.scene===scene);if(btn){const detail=btn.closest("details");if(detail)detail.open=true;btn.click();}}
function navState(view,t){nav.forEach(a=>{const target=targetFor(a.hash),selected=target&&routeFor(target)===view;
 if(selected)a.setAttribute("data-view-active","true");else a.removeAttribute("data-view-active");
 if(selected&&(view!=="inicio"||a.hash==="#capacidades"))a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
 if(title)title.textContent=labels[view];if(bar)bar.hidden=view==="inicio";if(menu)menu.open=false;
}
function show(t,opts={}){
 if(!t)return false;
 const view=routeFor(t),changed=active!==view;
 groups.forEach(el=>{el.hidden=el.dataset.ordView!==view;el.classList.remove("ord-view-enter");});
 main.dataset.activeView=view;active=view;navState(view,t);
 if(opts.scene)setScene(opts.scene);
 if(changed&&opts.animate&&!reduced.matches)groups.filter(el=>!el.hidden).forEach(el=>el.classList.add("ord-view-enter"));
 if(t!==main){let parent=t.parentElement;while(parent&&parent!==main){if(parent.tagName==="DETAILS")parent.open=true;parent=parent.parentElement;}}
 if(opts.scroll!==false){
  const focus=opts.focus&&(changed||t===main);
  const node=t===main?groups.find(el=>!el.hidden):t;
  if(focus&&node){const heading=node.matches("section")?node.querySelector("h1,h2"):node.querySelector?.("h1,h2")||node;
   if(heading){if(!heading.hasAttribute("tabindex"))heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true});}}
  if(t.id==="inicio"||t===main&&active==="inicio"||changed&&view!=="inicio"&&t===groups.find(el=>!el.hidden))window.scrollTo({top:0,behavior:"instant"});
  else node?.scrollIntoView({block:"start",behavior:changed||reduced.matches?"instant":"smooth"});
 }
 if(changed)window.dispatchEvent(new Event("resize"));
 return true;
}
function navigate(hash,scene){
 const t=targetFor(hash);if(!t)return false;
 const normalized="#"+encodeURIComponent(t.id);
 const state={...history.state,ordScene:scene||currentScene()};
 if(location.hash!==normalized||scene&&history.state?.ordScene!==scene)history.pushState(state,"",normalized);
 lastHash=normalized;return show(t,{scene,animate:true,focus:true});
}
document.addEventListener("click",e=>{
 const a=e.target.closest?.("a[href^='#']");if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==="_blank")return;
 if(!targetFor(a.hash))return;e.preventDefault();navigate(a.hash,a.dataset.jumpScene);
});
document.addEventListener("click",e=>{
 const btn=e.target.closest?.("[data-scene]");if(!btn||active!=="soluciones")return;
 history.replaceState({...history.state,ordScene:btn.dataset.scene},"");
});
function restore(){const hash=location.hash||"#inicio";lastHash=hash;const t=targetFor(hash)||targetFor("#inicio");show(t,{scene:history.state?.ordScene,animate:false,focus:false});}
function schedule(){if(frame)return;frame=requestAnimationFrame(()=>{frame=0;restore();});}
window.addEventListener("popstate",schedule);window.addEventListener("hashchange",schedule);
if("scrollRestoration" in history)history.scrollRestoration="manual";
main.classList.add("ord-views-ready");
restore();
})();