'use strict';
(() => {
  const profiles = {
    azztlan: {
      eyebrow: 'Propuesta exploratoria para Azztlan · Información pública',
      title: 'Tu identidad artística merece información igual de precisa.',
      intro: 'Azztlan combina joyería, diseño y expresión personal. Al revisar Cuban Chain, Rosebush y la portada encontramos señales que vale la pena conversar contigo antes de proponer ningún cambio.',
      honesty: 'Observaciones de páginas públicas; no es una auditoría integral ni implica vínculo contractual con Azztlan. Las decisiones pueden ser deliberadas y deben confirmarse.',
      caseId: 'multi',
      issues: [
        {
          title: 'Cuban Chain · intención de búsqueda',
          observation: 'La ficha presenta una cadena de $230 USD; el título de la página para buscadores describe “Cuban Cut Hairstyle – Modern Fade Barber Style”.',
          question: '¿Se eligió ese título deliberadamente para probar búsquedas, o no corresponde con la estrategia actual? Si fue una prueba, ¿qué resultado buscaban medir?',
          option: 'Si la intención es atraer compradores de joyería, evaluar un título específico del producto y comprobarlo antes de modificarlo.',
          source: 'https://azztlan.com/products/cuban-cut-hairstyle',
          sourceLabel: 'Ver ficha pública de Cuban Chain'
        },
        {
          title: 'Rosebush · presentación en buscadores',
          observation: 'La página describe una pieza de joyería de $185 USD, mientras el título de búsqueda habla de consejos para cultivar rosales.',
          question: '¿Existe un motivo comercial para mantener esa referencia a jardinería? ¿Cómo esperan que llegue el cliente adecuado a esta pieza?',
          option: 'Comparar el título actual con uno centrado en la pieza, su material y su propuesta artística; definir qué indicador justificaría el ajuste.',
          source: 'https://azztlan.com/products/rosebush',
          sourceLabel: 'Ver ficha pública de Rosebush'
        },
        {
          title: 'Portada · experiencia de marca',
          observation: 'La sección “AZZTLAN vision” muestra el texto “Button label”.',
          question: '¿Es un elemento provisional, una decisión de diseño o un texto que todavía quieren sustituir?',
          option: 'Si es provisional, plantear un enlace y un mensaje coherentes con el recorrido que quieran ofrecer a sus compradores.',
          source: 'https://azztlan.com/',
          sourceLabel: 'Ver la portada pública'
        }
      ],
      scope: 'Podríamos empezar con cinco fichas y la portada: registrar qué aparece, validar la intención detrás de cada decisión, plantear opciones en inglés y dejar las correcciones a tu aprobación. El primer diagnóstico acotado podría realizarse sin costo.',
      deliverables: ['Registro de observaciones con enlace a cada fuente.', 'Preguntas abiertas para distinguir una estrategia deliberada de una inconsistencia.', 'Propuestas de títulos, descripciones y textos, con prioridad y riesgos.', 'Cambios propuestos sin tocar Shopify hasta recibir autorización.']
    },
    ecommerce: {
      eyebrow: 'Ruta de trabajo · Ecommerce',
      title: 'Una ficha puede estar publicada y todavía dejar decisiones abiertas.',
      intro: 'Antes de atribuir problemas a una plataforma, revisamos cómo se identifican productos, variantes, precios y descripciones.',
      caseId: 'multi',
      issues: [
        {title:'Variantes y referencias',observation:'SKU y variantes pueden representar artículos distintos según su fuente.',question:'¿Qué campo identifica realmente un producto y qué excepciones acepta el negocio?',option:'Proponer una matriz de correspondencias con casos por revisar.'},
        {title:'Información visible',observation:'Catálogo, ficha y documento de proveedor pueden tener distintos cortes.',question:'¿Cuál es la fuente autorizada y en qué momento se compara?',option:'Documentar diferencias por registro y dejar cambios sujetos a aprobación.'},
        {title:'Recepción del trabajo',observation:'Una publicación completa no demuestra por sí sola que todas las reglas se cumplen.',question:'¿Cómo determina tu equipo que una ficha puede aceptarse?',option:'Definir un lote piloto con criterios de aceptación reproducibles.'}
      ],
      scope:'Elegir una muestra de fichas, identificar campos críticos y entregar un registro de hallazgos, preguntas y correcciones propuestas.',
      deliverables:['Fuentes y reglas de comparación.', 'Hallazgos reproducibles y excepciones.', 'Opciones de mejora con responsable de aprobación.']
    },
    operaciones: {
      eyebrow:'Ruta de trabajo · Operaciones',
      title:'Que cada pendiente tenga una decisión y una persona responsable.',
      intro:'Una tarea puede parecer cerrada y seguir abierta para otro equipo. Primero buscamos qué significa realmente completarla.',
      caseId:'operations',
      issues:[
        {title:'Traspasos',observation:'Los cambios de responsable pueden perder el estado del trabajo.',question:'¿Quién confirma que recibió lo pendiente y con qué evidencia?',option:'Definir un registro mínimo de aceptación del traspaso.'},
        {title:'Seguimiento',observation:'Las solicitudes suelen entrar por distintos canales.',question:'¿Qué estados permiten priorizar sin duplicar trabajo?',option:'Diseñar un tablero simple basado en fuentes verificables.'},
        {title:'Cierre',observation:'Un estado “terminado” puede significar cosas distintas.',question:'¿Qué evidencia exigirías para considerarlo aceptado?',option:'Crear criterios de cierre y una lista de excepciones.'}
      ],
      scope:'Revisar una muestra acotada de solicitudes, traspasos y criterios de aceptación, sin reorganizar todo el negocio de entrada.',
      deliverables:['Mapa de estados y responsables.', 'Excepciones y dependencias identificadas.', 'Procedimiento propuesto y prueba piloto.']
    },
    investigacion: {
      eyebrow:'Ruta de trabajo · Investigación comercial',
      title:'Comparar opciones sin mezclar hechos con promesas.',
      intro:'Antes de elegir proveedores, productos o mercados conviene comparar las condiciones que realmente cambiarán la decisión.',
      caseId:'sourcing',
      issues:[
        {title:'Fuentes',observation:'Una ficha comercial puede omitir restricciones de compra.',question:'¿Qué condiciones necesitas confirmar directamente con cada proveedor?',option:'Crear registro de fuentes fechadas y supuestos.'},
        {title:'Alternativas',observation:'Dos ofertas no necesariamente incluyen lo mismo.',question:'¿Qué criterios hacen comparables las opciones?',option:'Preparar una matriz de especificaciones, cantidades, plazos y límites.'},
        {title:'Incertidumbre',observation:'Algunas condiciones no pueden verificarse públicamente.',question:'¿Qué decisión quedaría detenida hasta confirmar una respuesta?',option:'Separar hechos, inferencias y pendientes de validación.'}
      ],
      scope:'Comparar un grupo reducido de opciones, conservar las fuentes y destacar preguntas decisivas antes de invertir.',
      deliverables:['Matriz de comparación.', 'Fuentes y fechas de consulta.', 'Preguntas pendientes y recomendación condicionada.']
    },
    calidad: {
      eyebrow:'Ruta de trabajo · Datos y QA',
      title:'No basta con encontrar diferencias. Hay que entenderlas.',
      intro:'Una anomalía puede ser legítima. La clave es conservar el origen, reproducirla y acordar quién decide.',
      caseId:'qa',
      issues:[
        {title:'Hallazgos',observation:'Dos registros pueden discrepar por formato, corte o reglas diferentes.',question:'¿Qué parte es un defecto y qué parte una excepción autorizada?',option:'Clasificar hallazgos con criterios explícitos.'},
        {title:'Trazabilidad',observation:'Sobrescribir valores impide reconstruir decisiones.',question:'¿Qué datos deben mantenerse intactos como evidencia?',option:'Separar originales, propuestas y aprobaciones.'},
        {title:'Aceptación',observation:'Un resultado puede parecer correcto sin pasar la prueba exigida.',question:'¿Qué caso adversarial debería rechazar la entrega?',option:'Diseñar una pequeña batería de comprobaciones y un acta de aceptación.'}
      ],
      scope:'Evaluar una muestra representativa y entregar un informe con pruebas reproducibles, límites y decisiones pendientes.',
      deliverables:['Hallazgos y fuentes de origen.', 'Criterios y casos de prueba.', 'Recomendaciones con límites de uso.']
    }
  };
  const params = new URLSearchParams(window.location.search);
  const key = Object.hasOwn(profiles, params.get('perfil')) ? params.get('perfil') : 'ecommerce';
  const data = profiles[key];
  const el = id => document.getElementById(id);
  const setText = (id, value) => {const node = el(id); if (node) node.textContent = value;};
  setText('route-eyebrow',data.eyebrow);
  setText('route-title',data.title);
  setText('route-intro',data.intro);
  if (data.honesty) setText('route-honesty',data.honesty);
  setText('route-count',data.issues.length+' puntos para conversar');
  setText('route-scope',data.scope);
  document.title = (key==='azztlan'?'Azztlan · ':'')+'Revisión contextual | ORDENAL';
  const container = el('route-signals');
  container.replaceChildren();
  data.issues.forEach((issue, index) => {
    const article = document.createElement('article');
    article.className = 'route-signal';
    const title = document.createElement('h3');
    title.textContent = String(index+1).padStart(2,'0')+' · '+issue.title;
    article.append(title);
    const dl = document.createElement('dl');
    [['Qué observamos', issue.observation],['Qué queremos entender',issue.question],['Qué podríamos evaluar',issue.option]].forEach(([label,value]) => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = value;
      dl.append(dt,dd);
    });
    article.append(dl);
    if (issue.source && issue.source.startsWith('https://azztlan.com/')) {
      const a = document.createElement('a');
      a.href = issue.source;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = issue.sourceLabel || 'Ver fuente pública';
      article.append(a);
    }
    container.append(article);
  });
  const list=el('route-deliverables');
  list.replaceChildren();
  data.deliverables.forEach(item=>{const li=document.createElement('li');li.textContent=item;list.append(li);});
  const href='consulta.html?caso='+encodeURIComponent(data.caseId);
  el('route-primary').href=href;
  el('route-consult').href=href;
})();