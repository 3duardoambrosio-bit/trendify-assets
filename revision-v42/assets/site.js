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
  const allow = ['datos', 'catalogos', 'investigacion', 'operaciones', 'calidad', 'otro'];
  const params = new URLSearchParams(window.location.search);
  const supplied = params.get('area');
  if (allow.includes(supplied)) area.value = supplied;
  const labels = { datos:'Datos y hojas de cálculo',catalogos:'Ecommerce y catálogos',investigacion:'Investigación estructurada',operaciones:'Operaciones y seguimiento',calidad:'Control de calidad de contenido',otro:'Otro trabajo por evaluar' };
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