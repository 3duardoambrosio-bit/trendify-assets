// Superficie comercial local. Sin red, almacenamiento ni envío de formularios.
'use strict';
const form = document.getElementById('briefForm');
const typeField = document.getElementById('type');
const statusField = document.getElementById('formStatus');
const panel = document.getElementById('preparedPanel');
const message = document.getElementById('preparedMessage');
const mailLink = document.getElementById('openMail');
const allowed = [...typeField.options].map(option => option.value).filter(Boolean);
function invalidateMessage() {
  if (!panel.hidden) statusField.textContent = 'Cambiaste la consulta. Vuelve a preparar el mensaje.';
  panel.hidden = true;
  message.value = '';
  mailLink.href = 'mailto:3duardoambrosio@gmail.com';
}
function chooseFamily(value) {
  if (!allowed.includes(value)) return;
  invalidateMessage();
  typeField.value = value;
  const pending = ['investigacion','operaciones','calidad'].includes(value);
  document.getElementById('familyContext').textContent = pending
    ? 'Esta área requiere una muestra y prueba específicas antes de comprometer la entrega. Puedes consultar el alcance.'
    : 'La demostración disponible cubre controles de catálogo. Confirmaré el alcance de tu archivo antes de aceptar el trabajo.';
}
form.hidden = false;
form.addEventListener('input', invalidateMessage);
form.addEventListener('change', invalidateMessage);
typeField.addEventListener('change', () => chooseFamily(typeField.value));
form.onsubmit = event => {
  event.preventDefault();
  invalidateMessage();
  const need = document.getElementById('need').value.trim();
  if (!form.reportValidity() || !allowed.includes(typeField.value) || !need) {
    statusField.textContent = 'Completa área, volumen y tarea para preparar el mensaje.';
    return;
  }
  const title = typeField.selectedOptions[0].textContent;
  const subject = 'Consulta de alcance — ' + title;
  const body = ['Hola Eduardo,','','Área: ' + title,
    'Volumen: ' + document.getElementById('vol').value,'Tarea: ' + need,
    'Fuente disponible: ' + (document.getElementById('sourceRef').value.trim() || 'Por confirmar'),
    'Fecha necesaria: ' + (document.getElementById('deadline').value || 'Por confirmar'),'',
    'Quisiera confirmar viabilidad, entregables, criterios de aceptación, precio y condiciones de pago.',
    'No adjunto datos sensibles ni autorizo cambios en producción.'].join('\n');
  message.value = 'Para: 3duardoambrosio@gmail.com\nAsunto: ' + subject + '\n\n' + body;
  mailLink.href = 'mailto:3duardoambrosio@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  panel.hidden = false;
  statusField.textContent = 'Mensaje preparado. Todavía NO enviado. Cópialo o abre tu programa de correo.';
};
document.querySelectorAll('[data-family]').forEach(link => link.addEventListener('click', () => chooseFamily(link.dataset.family)));
chooseFamily(new URLSearchParams(location.search).get('familia'));
function inspectRecord(id) {
  document.getElementById('q').value = id;
  search = id.toLowerCase(); filter = 'all'; page = 0;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === 'all')));
  render(); select(id);
}
document.querySelectorAll('.inspect-record').forEach(link => link.addEventListener('click', () => inspectRecord(link.dataset.record)));
function showDeskCase(id) {
  const issue = DATA.issues.find(item => item.record_id === id && (id !== 'P-0102' || item.field === 'supplier_price'));
  if (!issue) return;
  document.querySelectorAll('[data-case]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.case === id)));
  const root = document.getElementById('deskCase');
  root.innerHTML = '<div class="case-caption"><b>' + esc(id) + ' · ' + esc(issue.field) + '</b><span>Datos sintéticos</span></div><div class="review-steps">' +
    [['Origen', JSON.stringify(issue.before)], ['Hallazgo', issue.finding], ['Decisión', issue.note], ['Salida', JSON.stringify(issue.after) + ' · ' + issue.decision]]
      .map(([label, value]) => '<div class="review-step"><b>' + label + '</b><p>' + esc(value) + '</p></div>').join('') + '</div>' +
    (id === 'P-0102' ? '<p class="note">Este registro también tiene un SKU duplicado. Abre el expediente para ver ambos hallazgos.</p>' : '') +
    '<a class="inspect-record" href="#muestra">Abrir ' + esc(id) + ' en la muestra →</a>';
  root.querySelector('a').addEventListener('click', () => inspectRecord(id));
}
document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => showDeskCase(button.dataset.case)));
if (document.getElementById('deskCase')) showDeskCase('P-0102');