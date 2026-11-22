'use strict';
(() => {
  const save = document.getElementById('save-copy');
  if (!save) return;
  save.hidden = false;
  save.addEventListener('click', () => {
    const prepared = document.getElementById('prepared');
    const message = document.getElementById('prepared-text').value;
    if (prepared.hidden || !message) return;
    const mail = new URL(document.getElementById('open-mail').href);
    const address = mail.pathname;
    const subject = mail.searchParams.get('subject');
    const body = 'Para: ' + address + '\r\nAsunto: ' + subject + '\r\n\r\n' + message;
    const url = URL.createObjectURL(new Blob([body], {type:'text/plain;charset=utf-8'}));
    const download = document.createElement('a');
    download.href = url;
    download.download = 'consulta-ordenal.txt';
    download.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    document.getElementById('form-status').textContent = 'Texto preparado para descargar. Todavía debes enviarlo desde tu correo.';
  });
})();
