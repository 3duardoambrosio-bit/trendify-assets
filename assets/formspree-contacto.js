"use strict";
(() => {
  const form = document.getElementById('scope-form');
  const send = document.getElementById('send-direct');
  const output = document.getElementById('direct-response');
  const status = document.getElementById('form-status');
  if (!form || !send || !output || !status) return;
  const params = new URLSearchParams(location.search);
  const caseData = window.ORDENAL || {};
  const cases = caseData.cases || {};
  const codes = Array.isArray(caseData.caps) ? caseData.caps : [];
  let busy = false;
  let delivered = false;
  const field = name => form.elements.namedItem(name);
  const text = key => String(field(key)?.value || '').trim();
  const notify = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle('error', isError);
  };
  const resetReceipt = () => {
    output.hidden = true;
    if (delivered) {
      delivered = false;
      send.disabled = false;
      send.textContent = 'Enviar consulta';
    }
  };
  form.addEventListener('input', resetReceipt);
  form.addEventListener('change', resetReceipt);
  const validate = () => {
    for (const control of [field('area'), field('objetivo'), field('email')]) {
      control.removeAttribute('aria-invalid');
    }
    if (!text('area')) return [field('area'), 'Selecciona un área.'];
    if (text('objetivo').length < 15) return [field('objetivo'), 'Describe el objetivo con al menos 15 caracteres.'];
    if (!text('email') || !field('email').checkValidity()) return [field('email'), 'Introduce un correo de respuesta válido.'];
    if (!form.checkValidity()) return [form.querySelector(':invalid'), 'Revisa los campos indicados.'];
    return null;
  };
  const buildMessage = payload => {
    const label = field('area').selectedOptions[0].textContent;
    const name = text('nombre');
    const id = params.get('caso');
    const cap = codes.find(item => item.code === params.get('cap'));
    const lines = ['Solicitud de alcance recibida desde ORDENAL', '',
      'Contacto: ' + (name || 'No indicado'), 'Correo: ' + text('email'),
      'Área: ' + label, 'Objetivo: ' + text('objetivo')];
    if (Object.hasOwn(cases, id)) {
      lines.push('Situación elegida: ' + cases[id].short);
      payload.set('situacion', cases[id].short);
    }
    if (cap) {
      lines.push('Capacidad consultada: ' + cap.code + ' — ' + cap.title);
      payload.set('capacidad', cap.code + ' — ' + cap.title);
    }
    for(const [key,label]of [['propuesta_origen','Propuesta'],['enfoque_propuesta','Enfoque de origen'],['ficha_propuesta','Ficha de referencia']]){const v=String(payload.get(key)||'').trim();if(v)lines.push(label+': '+v);}
    const modalities={revision:'Revisión focalizada',intervencion:'Intervención operativa',continuidad:'Mejora continua'};
    const mode=text('modalidad');
    if(Object.hasOwn(modalities,mode)){lines.push('Modalidad de interés: '+modalities[mode]);payload.set('modalidad',modalities[mode]);}
    const choices={mantener:'Conservar',revisar:'Revisar alternativas',contexto:'Necesito más contexto'};
    const choice=params.get('decision');if(Object.hasOwn(choices,choice)){lines.push('Decisión explorada: '+choices[choice]);payload.set('decision_explorada',choices[choice]);}
    const compare = params.get('comparar');
    if (Object.hasOwn(cases, compare)) {
      lines.push('Comparación de referencia: ' + cases[compare].short);
      payload.set('comparacion', cases[compare].short);
    }
    const sample = params.get('muestra');
    if (['S01','S08','SOL-031'].includes(sample)) {
      lines.push('Muestra explorada: ' + sample);
      payload.set('muestra', sample);
    }
    for (const [id, label] of [
      ['formato','Formato'], ['volumen','Volumen'], ['fecha','Fecha objetivo'],
      ['decision','Decisión'], ['referencia','Fuente'], ['restriccion','Riesgo']]) {
      const value = text(id);
      if (value) lines.push(label + ': ' + value);
    }
    lines.push('', 'Consulta inicial, sin autorización para modificar producción ni aceptación de contratación.');
    payload.set('message', lines.join('\n'));
    payload.set('_subject', 'ORDENAL · Nueva consulta' + (cap ? ' · ' + cap.code : '') + (Object.hasOwn(cases, id) ? ' · ' + cases[id].short : ''));
    payload.set('pagina_origen', location.href);
  };
  send.addEventListener('click', async () => {
    if (busy || delivered) return;
    resetReceipt();
    const invalid = validate();
    if (invalid) {
      const [control, message] = invalid;
      if (control) { control.setAttribute('aria-invalid','true'); control.focus(); }
      notify(message, true);
      return;
    }
    const payload = new FormData(form);
    buildMessage(payload);
    busy = true;
    send.disabled = true;
    send.textContent = 'Enviando…';
    notify('Enviando solicitud…');
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: payload,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        delivered = true;
        output.hidden = false;
        send.textContent = 'Consulta recibida';
        notify('El servicio confirmó la recepción de la consulta.');
        output.focus({ preventScroll: true });
        output.scrollIntoView({block:'nearest'});
      } else if (response.status === 429) {
        notify('Demasiados intentos. Espera antes de volver a enviar o usa la opción de correo.', true);
      } else {
        notify('El servicio no confirmó la recepción. Revisa los datos o usa la opción de correo.', true);
      }
    } catch (error) {
      notify('No pudimos confirmar la recepción. Comprueba Formspree antes de reenviar, para evitar duplicados. Como alternativa, prepara un correo.', true);
    } finally {
      busy = false;
      if (!delivered) {
        send.disabled = false;
        send.textContent = 'Enviar consulta';
      }
    }
  });
})();
