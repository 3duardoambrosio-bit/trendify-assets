'use strict';
(() => {
  const selections = document.querySelectorAll('.service[name="servicio"]');
  selections.forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    selections.forEach(other => { if (other !== item) other.open = false; });
  }));
  const mobileMenu = document.querySelector('.mobile-nav');
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mobileMenu.open = false; }));
  }
  const form = document.getElementById('scope-form');
  if (!form) return;
  const result = document.getElementById('prepared');
  const preview = document.getElementById('prepared-text');
  const mailLink = document.getElementById('open-mail');
  const status = document.getElementById('form-status');
  const copyButton = document.getElementById('copy-message');
  const area = form.elements.namedItem('area');
  const allow = ['datos', 'catalogos', 'investigacion', 'crecimiento', 'operaciones', 'calidad', 'otro'];
  const params = new URLSearchParams(window.location.search);
  const supplied = params.get('area');
  if (allow.includes(supplied)) area.value = supplied;
  const labels = { datos:'Datos y hojas de cálculo',catalogos:'Ecommerce y catálogos',investigacion:'Investigación estructurada',crecimiento:'Investigación de oferta y experimentación comercial',operaciones:'Operaciones y seguimiento',calidad:'Control de calidad de contenido',otro:'Otro trabajo por evaluar' };
  function invalidate() {
    result.hidden = true;
    mailLink.removeAttribute('href');
    preview.value = '';
    status.textContent = '';
  }
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const goal = String(data.get('objetivo') || '').trim();
    if (goal.length < 15) { status.textContent = 'Describe el objetivo con al menos 15 caracteres.'; form.elements.namedItem('objetivo').focus(); return; }
    const chosen = labels[String(data.get('area'))] || labels.otro;
    const fmt = String(data.get('formato') || 'Por confirmar');
    const volume = String(data.get('volumen') || '').trim();
    const timing = String(data.get('fecha') || '').trim();
    const details = [
      'Hola:', '',
      'Quisiera consultar si este encargo encaja con tu trabajo.', '',
      'Área: ' + chosen,
      'Objetivo: ' + goal,
      'Formato: ' + fmt,
      'Volumen aproximado: ' + (volume || 'Por confirmar'),
      'Fecha objetivo: ' + (timing || 'Por confirmar'),
      ...(['decision','referencia','restriccion'].map(k => [k, String(data.get(k)||'').trim()]).filter(([k,v]) => v).map(([k,v]) => ({decision:'Decisión que necesito tomar',referencia:'Fuente o referencia',restriccion:'Error que debemos evitar'})[k] + ': ' + v)), '',
      'Quedo pendiente de revisar alcance, precio y condiciones antes de comenzar.', '',
      'Gracias.'
    ].join('\n');
    const subject = 'Consulta de alcance | ' + chosen;
    preview.value = details;
    mailLink.href = 'mailto:3duardoambrosio@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(details);
    result.hidden = false;
    status.textContent = 'Consulta preparada. Todavía no se ha enviado. Abre el correo o copia el texto.';
    result.scrollIntoView({ behavior:'auto', block:'nearest' });
  });
  copyButton.addEventListener('click', async () => {
    if (!preview.value) return;
    try { await navigator.clipboard.writeText(preview.value); status.textContent = 'Texto copiado. Pégalo en tu correo y envíalo tú.'; }
    catch (_) { preview.focus(); preview.select(); status.textContent = 'Seleccioné el texto. Cópialo y pégalo en tu correo.'; }
  });
})();

// V4.3: selector de situaciones. Navega a información existente sin prometer asignación automática.
(() => {
  const choices = [...document.querySelectorAll('.finder-choice')];
  const services = [...document.querySelectorAll('.service-list>.service')];
  const status = document.getElementById('finder-status');
  if (!choices.length || !services.length || !status) return;
  choices.forEach(choice => {
    choice.setAttribute('aria-pressed', 'false');
    choice.addEventListener('click', () => {
      const index = Number(choice.dataset.service);
      if (!Number.isInteger(index) || !services[index]) return;
      services.forEach((item, i) => { item.open = i === index; });
      choices.forEach(item => item.setAttribute('aria-pressed', String(item === choice)));
      status.hidden = false;
      status.textContent = 'Qué podrías abordar: ' + (choice.dataset.answer || '') + ' Revisa el alcance y las opciones debajo.';
      const summary = services[index].querySelector(':scope > summary');
      if (summary) { summary.setAttribute('tabindex','-1'); summary.focus({preventScroll:true}); summary.scrollIntoView({behavior:'auto',block:'start'}); }
    });
  });
})();

// V4.4 — situaciones complejas y avance controlado. Sin redes ni cambios de producción.
(() => {
 const buttons=[...document.querySelectorAll('.scenario-option[data-route]')];
 const panels=[...document.querySelectorAll('.scenario-detail[data-route-panel]')];
 if (!buttons.length || buttons.length !== panels.length) return;
 function show(id){
  if (!panels.some(p=>p.dataset.routePanel===id))return;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===id)));
  panels.forEach(p=>{p.hidden=p.dataset.routePanel!==id});
 }
 buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.route)));
 show(buttons[0].dataset.route);
})();


// V4.5 — guided process, static transparent data only; no outbound network requests.
(() => {
 'use strict';
 const routeLabels={admin:'Seguimiento administrativo',growth:'Oportunidad comercial',multi:'Varios proveedores y canales',migration:'Migración de catálogo',recon:'Reportes que no coinciden',sourcing:'Comparación de proveedores',operations:'Seguimiento operativo',qa:'Control de calidad'};
 const cases={
  multi:[
   ['DIAGNÓSTICO','¿Qué fuente tiene la última palabra sobre cada dato?','Identificamos los archivos, sus fechas y las decisiones críticas antes de proponer cambios.','El costo puede venir del proveedor mientras que el precio público pertenece a la política comercial.','No damos por equivalente un SKU entre proveedores sin confirmar identidad.','Mapa de fuentes, campos críticos y dudas por resolver.'],
   ['ALCANCE','¿Qué se puede corregir y qué requiere aprobación?','Acordamos fuentes de autoridad, campos, moneda, unidades, ventanas de corte y criterios de aceptación.','La actualización de precios no autoriza reescribir títulos o variantes.','Separar cambios permitidos, bloqueados y pendientes por decisión.','Plan de revisión, criterios y presupuesto por lote.'],
   ['EJECUCIÓN','No mezclar productos diferentes por una referencia coincidente.','Comparamos archivos en ambos sentidos y aislamos colisiones de identificadores, costos y disponibilidad.','Un proveedor envía un SKU que la tienda ya utiliza para otro artículo.','Se conserva el original; no se fusionan dos artículos por suposición.','Matriz de diferencias por referencia y campo.'],
   ['VALIDACIÓN','¿Qué podría salir mal aunque el archivo abra correctamente?','Contrastamos cambios con ejemplos normales y adversariales; buscamos pérdidas, cambios inesperados y contradicciones.','Un precio nuevo tiene moneda ambigua; debe pasar a revisión.','Un caso dudoso no se convierte en modificación automática.','Incidencias reproducibles y razones de bloqueo.'],
   ['ENTREGA','Una decisión preparada para ejecutar, no un CSV a ciegas.','Entregamos reglas, diferencias, pendientes y instrucciones para que el responsable decida.','Aprobar precio, bloquear variantes sin identidad y confirmar stock antes de publicar.','El cliente conserva autoridad sobre cambios productivos.','Resumen ejecutivo, tabla de control y lista de decisiones.']],
  migration:[
   ['DIAGNÓSTICO','¿Qué debe sobrevivir a la migración?','Inventariamos origen, destino, atributos, variantes, imágenes y sistemas que intervienen.','Las variantes pueden depender de una relación padre-hijo que el destino modela distinto.','No tomamos un importador sin errores como prueba de integridad.','Lista de datos y relaciones críticas.'],
   ['ALCANCE','Definir equivalencia antes de convertir formatos.','Acordamos mapeo, pérdidas toleradas, regla de identidad y puntos de aceptación.','Un atributo personalizado no tiene campo equivalente en destino.','La pérdida debe identificarse y autorizarse o bloquear el avance.','Mapa origen-destino y criterios de paridad.'],
   ['EJECUCIÓN','La migración se prueba en copia, no directamente en producción.','Reconciliamos IDs, recuentos y relaciones; construimos un registro de excepciones.','Dos variantes terminan asociadas al producto equivocado.','No se aprueba la carga hasta resolver colisiones.','Comparación bidireccional y excepciones.'],
   ['VALIDACIÓN','No basta con que coincidan los recuentos totales.','Probamos identidad, relaciones, campos críticos y ejemplos adversariales.','Un catálogo conserva el número de filas pero perdió vínculos de fotos.','Un resultado agregado no oculta una pérdida localizada.','Pruebas de aceptación por clase de riesgo.'],
   ['ENTREGA','El equipo recibe un traspaso verificable.','Documentamos transformaciones permitidas, pérdidas y decisiones finales.','Publicar solo los lotes que aprobaron el criterio de paridad.','Cualquier paso en producción exige aprobación separada.','Matriz de paridad, reporte y guía de aceptación.']],
  recon:[
   ['DIAGNÓSTICO','¿Se están comparando realmente las mismas unidades?','Identificamos periodo, moneda, devoluciones, estados y fuentes de los dos reportes.','Ventas por fecha de pedido versus cobros por fecha de depósito.','No se atribuye una diferencia a fraude o error sin verificar los cortes.','Definición de universos y diferencias de origen.'],
   ['ALCANCE','Acordar reglas de conciliación antes de ajustar números.','Definimos llaves, tolerancias, tratamientos de devoluciones y fuentes autorizadas.','Una devolución puede estar en un periodo contable distinto.','No se reescriben libros oficiales para forzar coincidencia.','Reglas de comparación y excepciones permitidas.'],
   ['EJECUCIÓN','Relacionar partidas, no maquillar totales.','Detectamos muchos-a-uno, registros sin pareja, duplicados y diferencias de unidad.','Dos ventas comparten referencia pero no son un mismo movimiento.','Conservar la evidencia de cada correspondencia.','Conciliación por partida y casos sin match.'],
   ['VALIDACIÓN','Buscar diferencias que el total esconde.','Contrastamos sumas, recuentos y casos negativos con el material de origen.','Un ajuste puede equilibrar el total mientras oculta partidas no pareadas.','Los ajustes deben tener fundamento y autorización.','Prueba de consistencia y registro de ajustes.'],
   ['ENTREGA','Qué coincide, qué no y qué falta explicar.','Entregamos las diferencias con sus causas posibles y las decisiones que requieren al responsable.','Separar diferencia de corte, doble conteo y caso pendiente.','No se ofrece auditoría contable certificada.','Matriz y resumen para decidir el siguiente control.']],
  sourcing:[
   ['DIAGNÓSTICO','¿Qué condiciones hacen comparables dos cotizaciones?','Registramos especificaciones, volúmenes, moneda, vigencia y condiciones.','Una cotización incluye flete; otra solo precio unitario.','No declarar ganador sin igualar la base de comparación.','Requisitos y criterios comparables.'],
   ['ALCANCE','Establecer umbrales y exclusiones.','Acordamos requisitos mínimos, moneda, impuestos, entrega y disponibilidad a confirmar.','Una oferta muy barata no cumple la especificación técnica.','Las opciones no equivalentes quedan fuera o señaladas.','Matriz de evaluación y preguntas al proveedor.'],
   ['EJECUCIÓN','Cada afirmación debe poder rastrearse a una fuente.','Buscamos y verificamos condiciones, fechas y contradicciones.','El stock publicado no equivale a disponibilidad comprometida.','No inventamos inventario ni tiempos de entrega.','Comparativo con fuente, fecha y estado de confirmación.'],
   ['VALIDACIÓN','La tabla debe resistir una segunda lectura.','Revisamos unidades, conversiones, vigencia y atributos faltantes.','El costo final depende del MOQ o del flete por lote.','Marcar cifras estimadas; no presentarlas como cotización firme.','Controles de comparabilidad y casos abiertos.'],
   ['ENTREGA','Una lista corta que se pueda decidir.','Entregamos opciones condicionadas, riesgos, preguntas y razones de preferencia.','Elegir solo tras confirmar disponibilidad y especificación.','El comprador mantiene la decisión comercial final.','Matriz, fuentes y plan de confirmación.']],
  operations:[
   ['DIAGNÓSTICO','¿Dónde se pierde realmente una tarea?','Revisamos entradas, responsables, estados y transferencias de información.','Una incidencia queda en WhatsApp y no llega al tablero.','No asumir que falta esfuerzo: puede faltar un control de registro.','Mapa de puntos de pérdida y responsabilidades.'],
   ['ALCANCE','Una regla clara para cada estado.','Definimos responsable, evidencia mínima, fecha y escalamiento.','Una tarea marcada terminada aún espera aprobación externa.','No confundir ejecución con aceptación.','SOP y criterios para abrir/cerrar tareas.'],
   ['EJECUCIÓN','Mantener una cola de decisiones y bloqueos.','Registramos pendientes, dependencias, cambios y comunicaciones.','Una entrega depende de información que nadie confirmó.','Los bloqueos se señalan antes de la fecha límite.','Tracker y bitácora de excepciones.'],
   ['VALIDACIÓN','Una tarea cerrada debe dejar evidencia suficiente.','Auditamos campos, estados y decisiones con muestreo apropiado.','Estado “completo” sin archivo, enlace o aprobación verificable.','Cerrar una tarea no equivale a demostrar que se realizó.','Controles de cierre y defectos detectados.'],
   ['ENTREGA','El proceso continúa aunque cambie la persona.','Dejamos reglas, pendientes y responsables visibles.','El siguiente operador entiende qué hacer sin reconstruir conversaciones.','La automatización depende de repetición y prueba posterior.','SOP, tracker y reporte de continuidad.']],
  qa:[
   ['DIAGNÓSTICO','¿Qué significa correcto para este trabajo?','Obtenemos una regla de aceptación, ejemplos válidos y errores relevantes.','Una respuesta puede sonar plausible pero contradecir la fuente.','No aceptar por apariencia ni por un único porcentaje.','Criterios y casos adversariales.'],
   ['ALCANCE','Definir severidad y tratamiento de errores.','Acordamos qué bloquea, qué requiere revisión y quién decide.','Un error de identidad es más grave que una variación de estilo.','Los riesgos se clasifican antes de evaluar.','Matriz de severidades y alcance de prueba.'],
   ['EJECUCIÓN','Revisar fuentes y resultados por separado.','Contrastamos contenido, estructura, duplicados y contradicciones.','Un verificador admite un resultado imposible en un caso límite.','Una herramienta no puede darse aprobación a sí misma.','Registro reproducible de defectos.'],
   ['VALIDACIÓN','La segunda prueba busca fallar, no confirmar.','Ejecutamos negativos, límites, reversiones y revisión humana cuando corresponde.','Una prueba anterior pasó pero la combinación de campos falla.','No aprobar una entrega con defectos críticos conocidos.','Evidencia, veredicto y fallos pendientes.'],
   ['ENTREGA','La calidad se explica con decisiones, no con etiquetas.','Compartimos qué se verificó, qué no y qué riesgo permanece.','Liberar solo la parte con criterios satisfechos.','Sin reclamar certificaciones externas inexistentes.','Informe, incidencias y criterio de aceptación.']]
 };
 const methodButtons=[...document.querySelectorAll('[data-method-step]')];
 const scenarioButtons=[...document.querySelectorAll('.scenario-option[data-route]')];
 const scenarioPanels=[...document.querySelectorAll('.scenario-detail[data-route-panel]')];
 const routeLabel=document.getElementById('workbench-case');
 const bar=document.getElementById('scenario-progress-bar');
 const progress=document.getElementById('scenario-progress-label');
 const methodIds={phase:'method-phase',counter:'method-counter',title:'method-title',story:'method-story',artifactLabel:'method-artifact-label',artifact:'method-artifact',control:'method-control',result:'method-result'};
 const el=Object.fromEntries(Object.entries(methodIds).map(([key,id])=>[key,document.getElementById(id)]));
 if (!methodButtons.length || !scenarioButtons.length || !el.title) return;
 const phases=['ENTENDER','ACORDAR','ANALIZAR','VERIFICAR','ENTREGAR'];
 let currentRoute='multi';let currentStep=0;
 function setStep(next){
  if (!Number.isInteger(next) || next<0 || next>4)return;
  currentStep=next;
  const d=cases[currentRoute][next];
  el.phase.textContent=String(next+1).padStart(2,'0')+' / '+d[0];
  el.counter.textContent=(next+1)+' DE 5';
  el.title.textContent=d[1];el.story.textContent=d[2];el.artifact.textContent=d[3];
  el.control.textContent=d[4];el.result.textContent=d[5];
  el.artifactLabel.textContent='EJEMPLO · '+phases[next];
  methodButtons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.methodStep)===next)));
  document.getElementById('method-prev').disabled=next===0;
  const nxt=document.getElementById('method-next');nxt.disabled=next===4;nxt.textContent=next===4?'Fin del recorrido':'Siguiente etapa →';
  [...document.querySelectorAll('.method-stage-dots span')].forEach((s,i)=>s.classList.toggle('is-current',i===next));
 }
 function showRoute(id){
  if (!cases[id])return;
  currentRoute=id;
  scenarioButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===id)));
  scenarioPanels.forEach(p=>{p.hidden=p.dataset.routePanel!==id;});
  const idx=scenarioButtons.findIndex(b=>b.dataset.route===id)+1;
  if (progress)progress.textContent='SITUACIÓN '+String(idx).padStart(2,'0')+' DE '+String(scenarioButtons.length).padStart(2,'0');
  if (bar)bar.style.width=(idx/scenarioButtons.length*100).toFixed(2)+'%';
  if (routeLabel)routeLabel.textContent='CASO SELECCIONADO · '+({admin:'Seguimiento administrativo',multi:'Varios proveedores y canales',migration:'Migración o cambio de catálogo',recon:'Dos reportes no coinciden',sourcing:'Comparar proveedores',operations:'Seguimiento de tareas',growth:'Oportunidad comercial',qa:'Revisión de calidad'})[id];
  const outlet=document.getElementById('scenario-preview');
  if (outlet){outlet.dataset.switching='true';}
  setStep(0);
 }
 scenarioButtons.forEach(b=>b.addEventListener('click',()=>showRoute(b.dataset.route)));
 methodButtons.forEach(b=>b.addEventListener('click',()=>setStep(Number(b.dataset.methodStep))));
 const prev=document.getElementById('method-prev'),next=document.getElementById('method-next');
 if (prev)prev.addEventListener('click',()=>setStep(currentStep-1));
 if (next)next.addEventListener('click',()=>setStep(currentStep+1));
 document.querySelectorAll('[data-connect-method]').forEach(b=>b.addEventListener('click',()=>{
  showRoute(b.dataset.connectMethod);
  const section=document.getElementById('metodo');
  if(section){section.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
 }));
 // Read-only keyboard navigation for the scenario list; native button semantics remain intact.
 const switcher=document.querySelector('.scenario-switch');
 if (switcher)switcher.addEventListener('keydown',e=>{
  if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;
  if (!scenarioButtons.includes(document.activeElement))return;
  e.preventDefault();
  const i=scenarioButtons.indexOf(document.activeElement),delta=['ArrowDown','ArrowRight'].includes(e.key)?1:-1;
  const b=scenarioButtons[(i+delta+scenarioButtons.length)%scenarioButtons.length];
  b.focus();showRoute(b.dataset.route);
 });
 showRoute('multi');
})();

// V4.6: deterministic buyer orientation. No collection, profiling, network, pricing or diagnosis claim.
(() => {
  'use strict';
  const select = id => document.getElementById(id);
  const form = select('v46-guide-form');
  if (!form) return;
  const cases = {
    admin: ['Control de operación y seguimiento','Identificar dónde se interrumpe el flujo de tareas y qué información debería recibir cada responsable.','Mapa de dependencias, procedimiento inicial y tablero de seguimiento por alcance.','No supone dirigir personal ni automatizar comunicaciones sin permiso.','operaciones'],
    growth: ['Evaluación preliminar de oportunidad comercial','Comparar audiencia, oferta, condiciones, hipótesis y señal de demanda antes de decidir una campaña o inversión.','Ficha de hipótesis, fuentes contrastadas, criterios de prueba y límites del experimento.','No incluye campañas pagadas, resultados garantizados ni acceso a cuentas de anuncios.','crecimiento'],
    multi: ['Control previo a actualización multicanal','Definir quién gobierna cada campo, conciliar fuentes y separar cambios admisibles de conflictos que requieren autorización.','Matriz de diferencias por artículo, mapa de fuentes y decisiones por aprobar.','No presupone sincronización automática ni acceso a tus tiendas.','catalogos'],
    migration: ['Revisión de paridad antes de migrar','Identificar relaciones que deben conservarse, campos que podrían perderse y una forma de comparar origen y destino.','Inventario de riesgos, muestra de equivalencias y criterios de aceptación.','No incluye publicar cambios ni migrar una tienda completa sin proyecto aprobado.','catalogos'],
    recon: ['Conciliación de datos críticos','Comparar periodos, monedas, unidades, definiciones y procedencia antes de reconciliar cifras contradictorias.','Reporte de diferencias, reconciliaciones justificadas y saldos pendientes.','No certifica estados financieros ni sustituye una auditoría contable.','datos'],
    sourcing: ['Comparación de alternativas con evidencia','Homologar cotizaciones por unidad, moneda, vigencia y condiciones; señalar lo que no puede comprobarse.','Matriz comparativa, referencias a fuentes y preguntas para decidir.','No garantiza disponibilidad, equivalencia técnica ni relación comercial con proveedores.','investigacion'],
    operations: ['Diseño de control operativo acotado','Reconstruir tareas, responsables, estados y escalamiento; comprobar primero dónde se interrumpe el flujo.','Tablero de seguimiento, registro de excepciones y procedimiento inicial.','No significa asumir la gestión completa del equipo ni automatizar todo el proceso.','operaciones'],
    qa: ['Revisión independiente por criterios','Definir qué debe cumplir una entrega y ejecutar casos normales y adversariales sobre el alcance acordado.','Reporte de defectos, pasos reproducibles y recomendación de aceptación o revisión.','No implica una certificación ni aprobación automática del resultado.','calidad']
  };
  const contexts = {
    decision:'Existe una decisión pendiente; la prioridad es aclarar quién puede autorizarla y con qué evidencia.',
    repeat:'Como el problema se repite, conviene registrar frecuencia y retrabajo antes de diseñar un control reutilizable.',
    launch:'Si hay una publicación o compra próxima, conviene separar primero los riesgos que podrían generar cambios difíciles de revertir.'
  };
  const priorities = {
    risk:'El primer entregable debe permitir identificar excepciones y evitar decisiones sin fuente suficiente.',
    capacity:'Hay que minimizar revisiones innecesarias para el responsable y dejar explícitos los puntos de intervención.',
    reusable:'Documentaremos qué partes podrían repetirse, pero no supondremos ahorro ni automatización sin medición.'
  };
  function render() {
    const key=select('v46-issue').value;
    const c=cases[key];
    if (!c) return;
    select('v46-result-title').textContent=c[0];
    select('v46-result-context').textContent=c[1]+' '+contexts[select('v46-trigger').value];
    select('v46-result-deliverable').textContent=c[2]+' '+priorities[select('v46-priority').value];
    select('v46-result-limit').textContent='Límite: '+c[3];
    select('v46-consult').setAttribute('href','consulta.html?area='+encodeURIComponent(c[4]));
  }
  form.addEventListener('change',render);
  select('v46-explore').addEventListener('click',()=>{
    const chosen=select('v46-issue').value;
    const route=chosen;
    const b=document.querySelector('.scenario-option[data-route="'+route+'"]');
    if (!b) return;
    b.click();
    const target=select('situaciones');
    if(target)target.scrollIntoView({behavior:'auto',block:'start'});
    b.focus({preventScroll:true});
  });
  render();
})();



// V4.7: breadth of buyer needs. Content is deterministic and read-only;
// no network request, automatic diagnosis, or promise of unvalidated services.
(() => {
 'use strict';
 const domains={
  administracion: {tag:'01 / OPERACIÓN',statusTag:'Evaluación por alcance',title:'Que el trabajo avance sin depender de perseguir a todo el mundo.',lead:'Cuando los pendientes viven entre mensajes, hojas y personas, los responsables terminan coordinando manualmente lo que debería ser visible.',problem:'Responsabilidades, solicitudes, fechas y cierres dispersos. Se pierde tiempo reconstruyendo estatus y escalando bloqueos tarde.',action:'Revisar el circuito de entrada, asignación, seguimiento, evidencia y cierre; proponer un procedimiento y una cola de excepciones ajustada al tamaño del equipo.',output:'SOP operativo, tablero de estados, responsables, bloqueos y reporte de seguimiento, según el encargo.',limits:'Sin asumir dirección integral de personal, decisiones financieras ni automatización sin pruebas y permisos.',status:'Capacidades de soporte identificadas; cada entrega necesita un ensayo proporcional a su alcance.',area:'operaciones'},
  inteligencia: {tag:'02 / DECISIONES',statusTag:'Investigación por validar',title:'Investigar bien antes de comprometer recursos.',lead:'Elegir una opción no debería depender de una lista superficial de enlaces: importan condiciones, comparabilidad, vigencia y el costo de equivocarse.',problem:'Alternativas incomparables, cotizaciones incompletas y afirmaciones comerciales sin una fuente contrastable.',action:'Definir criterios; revisar fuentes, fecha, unidades, condiciones, incertidumbres y alternativas antes de producir una recomendación condicionada.',output:'Matriz de decisión, fuentes documentadas, diferencias, supuestos y preguntas pendientes para proveedor o responsable.',limits:'No garantizamos disponibilidad, precios negociados, solvencia de terceros ni resultados financieros.',status:'Método investigativo y muestra documental; proyectos completos sujetos a prueba y verificación específica.',area:'investigacion'},
  ecommerce: {tag:'03 / COMERCIO',statusTag:'QA acotado demostrado',title:'Coordinar producto, proveedor y canal sin perder la referencia.',lead:'La operación comercial depende de lo que el proveedor dice, lo que la tienda muestra y lo que un canal permite publicar. Una revisión debe respetar esas diferencias.',problem:'Datos de producto, variantes, precios, costos o existencias que no coinciden antes de actualizar un canal de venta.',action:'Reconciliar fuentes y campos críticos, separar cambios autorizables de excepciones y preparar una entrega para revisión humana.',output:'Diferencias por producto o variante, datos de entrada preservados, bitácora y criterios de aceptación.',limits:'La muestra de 180 registros prueba controles concretos; no acredita migraciones completas ni publicación autónoma.',status:'QA de datos sintéticos demostrado en alcance limitado; otros trabajos requieren prueba previa.',area:'catalogos'},
  crecimiento: {tag:'04 / EXPERIMENTACIÓN',statusTag:'Frente en evaluación',title:'Crecer empieza por elegir qué vale la pena probar.',lead:'Antes de invertir en una campaña o ampliar surtido, conviene comprobar para quién es la oferta, qué hipótesis la sostiene y cómo sabremos si funciona.',problem:'Ideas comerciales sin criterios de comparación, audiencia definida ni señal concreta de cuándo continuar o detenerse.',action:'Investigar mercado y alternativas públicas, formular una hipótesis de oferta y diseñar criterios de un experimento pequeño, sin ejecutar gasto sin autorización.',output:'Brief de oportunidad, hipótesis explícita, variables, métricas, riesgos y criterio de continuar o detener.',limits:'Planeación y análisis por evaluar. No ofrecemos por esta muestra gestión certificada de publicidad, automatización de campañas ni retorno garantizado.',status:'Capacidad conceptual del sistema; requiere caso independiente antes de vender ejecución de marketing.',area:'crecimiento'},
  calidad: {tag:'05 / CONTROL TRANSVERSAL',statusTag:'Muestra sintética acotada',title:'Que una entrega sea comprobable antes de darla por buena.',lead:'Una hoja, una página, un informe o un proceso puede parecer terminado y aún ocultar un problema crítico. La revisión debe buscar errores, no confirmar apariencias.',problem:'Salidas no conciliadas, reglas poco claras o aceptación sin criterios independientes.',action:'Definir qué significa correcto, probar situaciones normales y adversariales y registrar defectos, severidad y excepciones.',output:'Criterios de revisión, pruebas reproducibles, bitácora de hallazgos y recomendación de aceptación o corrección.',limits:'No es certificación, pentest ni aprobador automático; el comprobador experimental no autoriza producción.',status:'Controles acotados de catálogo demostrados; QA de otros dominios requiere pruebas adicionales.',area:'calidad'}
 };
 const buttons=[...document.querySelectorAll('.v47-domain-pick')];
 const field=k=>document.getElementById('v47-domain-'+k);
 const link=field('consult');
 if (!buttons.length||!field('title'))return;
 function render(id){const d=domains[id];if(!d)return;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v47Domain===id)));
  for(const k of ['index','maturity','title','lead','problem','intervention','deliverable','limits','status']){
    const e=field(k);if(!e)continue;const map={index:'tag',maturity:'statusTag',intervention:'action',deliverable:'output'};
    e.textContent=d[map[k]||k];
  }
  link.href='consulta.html?area='+encodeURIComponent(d.area);
 }
 buttons.forEach(b=>b.addEventListener('click',()=>render(b.dataset.v47Domain)));
 const container=document.querySelector('.v47-domain-picks');
 if(container)container.addEventListener('keydown',e=>{
  if(!['ArrowDown','ArrowUp'].includes(e.key)||!buttons.includes(document.activeElement))return;
  e.preventDefault();const i=buttons.indexOf(document.activeElement),delta=e.key==='ArrowDown'?1:-1;
  const next=buttons[(i+delta+buttons.length)%buttons.length];next.focus();render(next.dataset.v47Domain);
 });
 render('administracion');
 const hero={
  admin:['Tu equipo está ocupado. <br><span>El trabajo necesita estructura.</span>','Las tareas se repiten, pero la responsabilidad y el seguimiento se dispersan. El valor está en identificar dónde se pierde continuidad.','Puntos de entrada y responsables','Qué llega, quién lo toma y dónde se pierde','Flujo, bloqueos y prioridades','Estados, dependencias y criterios de cierre','Procedimiento y seguimiento','Responsable, evidencia y próximo paso'],
  intelligence:['No todas las opciones <br><span>son comparables todavía.</span>','Investigar no es acumular páginas. Es reconocer los supuestos, normalizar criterios y dejar clara la incertidumbre antes de decidir.','Alternativas y condiciones','Precio, vigencia, especificación y fuentes','Comparación con criterios','Separar confirmaciones de supuestos','Matriz para decidir','Preguntas y riesgos pendientes'],
  commerce:['La tienda, el proveedor <br><span>y el canal deben coincidir.</span>','Un cambio de información puede afectar costos, identidad, inventario o disponibilidad. La prioridad es proteger la integridad antes de aplicar.','Proveedor, tienda y canal','Versiones, campos y responsables','Excepciones controladas','Evitar sobrescrituras o mezclas de producto','Revisión por referencia','Qué puede actualizarse y qué no'],
  growth:['Una oportunidad <br><span>debe poder ponerse a prueba.</span>','Antes de escalar inversión conviene formular la hipótesis comercial, qué señal de demanda observar y cuándo detener el experimento.','Audiencia, oferta y señal','Lo que sabemos y lo que falta','Hipótesis y criterios de prueba','Métricas, límites y condiciones','Plan de evaluación','Sin prometer ventas ni ROAS']
 };
 const heroBtns=[...document.querySelectorAll('[data-hero-area]')];
 const heroIds=['title','copy','source','source-note','action','action-note','output','output-note'];
 function showHero(k){const d=hero[k];if(!d)return;
  heroBtns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.heroArea===k)));
  heroIds.forEach((name,i)=>{const e=document.getElementById('v47-hero-'+name);if(!e)return;
   if(name==='title'){e.textContent='';const parts=d[i].split('<br><span>');e.append(document.createTextNode(parts[0]));e.append(document.createElement('br'));const span=document.createElement('span');span.textContent=(parts[1]||'').replace('</span>','');e.append(span);}
   else e.textContent=d[i];
  });
 }
 heroBtns.forEach(b=>b.addEventListener('click',()=>showHero(b.dataset.heroArea)));
 showHero('admin');
})();
