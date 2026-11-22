"use strict";
(() => {
  const source = window.ORDENAL_ADMIN_DEMO;
  if (!source || !Array.isArray(source.solicitudes)) return;
  const requests = source.solicitudes;
  const rules = source.reglas;
  const state = { filter: "todos", area: "todas", rule: "", search: "", id: "SOL-008", raw: false };
  const requestedRecord = new URLSearchParams(location.search).get("registro");
  if (requests.some(request => request.id === requestedRecord)) state.id = requestedRecord;
  const byId = (id) => document.getElementById(id);
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
  const flagText = (code) => rules.find((item) => item.code === code)?.label ?? code;
  const countFlag = (code) => requests.filter((item) => item.flags.includes(code)).length;
  const flagged = (item) => item.flags.length > 0;

  function calculateTotals() {
    const total = requests.length;
    const exceptions = requests.filter(flagged).length;
    const alertCount = requests.reduce((n, row) => n + row.flags.length, 0);
    const fields = {
      "intro-total": total, "intro-review": exceptions, "metric-total": total,
      "metric-review": exceptions, "metric-owner": countFlag("SIN_RESPONSABLE"),
      "metric-due": countFlag("FECHA_VENCIDA"), "evidence-alerts": alertCount,
      "evidence-duplicate": countFlag("REFERENCIA_DUPLICADA"),
      "count-todos": total, "count-revision": exceptions, "count-listos": total - exceptions
    };
    Object.entries(fields).forEach(([key, val]) => { byId(key).textContent = val; });
  }

  function matches(row) {
    if (state.filter === "revision" && !flagged(row)) return false;
    if (state.filter === "listos" && flagged(row)) return false;
    if (state.area !== "todas" && state.area !== row.area) return false;
    if (state.rule && !row.flags.includes(state.rule)) return false;
    const terms = [row.id, row.area, row.asunto, row.solicitud, row.referencia,
      row.responsable, row.canal].join(" ").toLocaleLowerCase("es-MX");
    return terms.includes(state.search.toLocaleLowerCase("es-MX"));
  }

  function renderList() {
    const items = requests.filter(matches);
    if (items.length && !items.some((row) => row.id === state.id)) {
      state.id = items[0].id;
      state.raw = false;
    }
    if (!items.length) state.id = "";
    byId("shown-count").textContent = `${items.length} DE ${requests.length}`;
    byId("ticket-list").innerHTML = items.length ? items.map((r) => `
      <button type="button" class="admin-ticket" data-request="${safe(r.id)}"
       aria-controls="inspector" aria-current="${r.id === state.id}">
       <span class="admin-ticket-top">${safe(r.id)} / ${safe(r.area)}</span>
       <span class="admin-ticket-title">${safe(r.asunto)}</span>
       <span class="admin-ticket-status" data-state="${safe(r.riesgo)}">${flagged(r) ? "Revisar" : "Sin alertas"}</span>
       <span class="admin-ticket-meta"><span>${safe(r.canal)}</span>
        <span>${r.flags.length} ${r.flags.length === 1 ? "control" : "controles"}</span>
        <span>${safe(r.fecha_limite)}</span></span>
      </button>`).join("") : `<p class="admin-empty-results">No hay solicitudes con estos filtros.
      Puedes borrar la búsqueda o reiniciar la vista.</p>`;
    byId("ticket-list").querySelectorAll("[data-request]").forEach((button) => {
      button.addEventListener("click", () => selectRequest(button.dataset.request));
    });
  }

  function renderRules() {
    byId("rule-rail").innerHTML = `<button type="button" class="admin-rule"
       data-rule="" aria-pressed="${state.rule === ""}">Todos los controles</button>` +
      rules.map((rule) => `<button type="button" class="admin-rule" data-rule="${safe(rule.code)}"
       aria-pressed="${state.rule === rule.code}">${safe(rule.label)} <b>${countFlag(rule.code)}</b></button>`).join("");
    byId("rule-rail").querySelectorAll("[data-rule]").forEach((button) => {
      button.addEventListener("click", () => {
        state.rule = button.dataset.rule;
        state.filter = "todos";
        renderAll();
      });
    });
  }

  function inputFields(r) {
    const fields = [
      ["Canal de entrada", r.canal], ["Área indicada", r.area],
      ["Referencia informada", r.referencia], ["Responsable informado", r.responsable || "No registrado"],
      ["Estado de origen", r.estado_origen], ["Fecha límite", r.fecha_limite],
      ["Soporte de origen", r.soporte || "No registrado"],
      ["Dependencia registrada", r.dependencia || "Ninguna indicada"]
    ];
    return `<dl class="admin-field-list">${fields.map(([k, v]) => `
      <div><dt>${safe(k)}</dt><dd>${safe(v)}</dd></div>`).join("")}</dl>`;
  }

  function controlledFields(r) {
    const fields = [
      ["Folio de seguimiento", r.id], ["Estado de control", r.estado_control],
      ["Riesgo orientativo", r.riesgo], ["Responsable", r.responsable || "POR CONFIRMAR"],
      ["Controles activados", `${r.flags.length} de ${rules.length}`],
      ["Referencia de soporte declarada", r.soporte || "PENDIENTE"],
      ["Cambio autorizado", "NINGUNO; simulación de solo lectura"],
      ["Fecha del corte", source.fecha_corte]
    ];
    return `<dl class="admin-field-list">${fields.map(([k, v]) => `
      <div><dt>${safe(k)}</dt><dd>${safe(v)}</dd></div>`).join("")}</dl>`;
  }

  function renderInspector() {
    const r = requests.find((item) => item.id === state.id);
    if (!r) {
      byId("inspector").innerHTML = `<div class="admin-inspector-empty">No hay casos para examinar con estos filtros. Ajusta la búsqueda o reinicia la vista.</div>`;
      return;
    }
    const flagMarkup = r.flags.length ? r.flags.map((f) => `<span>${safe(flagText(f))}</span>`).join("") :
      "<span>Ninguna de las seis reglas se activó</span>";
    const risk = r.riesgo === "alto" ? "Revisión prioritaria" :
      (r.riesgo === "medio" ? "Revisión específica" : "Sin alertas de las reglas");
    byId("inspector").innerHTML = `
      <div class="admin-inspector-top"><span>${safe(r.id)} · ${safe(r.area)}</span><span>EXPEDIENTE FICTICIO</span></div>
      <h4>${safe(r.asunto)}</h4><p class="admin-inspector-lead">${safe(r.solicitud)}</p>
      <div class="admin-riskline" data-risk="${safe(r.riesgo)}"><strong>${safe(risk)}</strong>
        <p>${r.flags.length} ${r.flags.length === 1 ? "control requiere" : "controles requieren"} atención.
        Esta clasificación orienta la revisión: no sustituye la decisión del cliente.</p></div>
      <div class="admin-view-toggle" role="group" aria-label="Alternar información de la solicitud">
       <button type="button" data-view="raw" aria-pressed="${state.raw}">Como llegó</button>
       <button type="button" data-view="control" aria-pressed="${!state.raw}">Con controles</button>
      </div>
      ${state.raw ? inputFields(r) : controlledFields(r)}
      <div class="admin-flag-list" aria-label="Controles activados">${flagMarkup}</div>
      <div class="admin-inspector-panel"><h5>SIGUIENTE ACCIÓN PROPUESTA</h5>
        <p>${safe(r.proxima_accion)}</p></div>
      <div class="admin-inspector-panel"><h5>QUÉ DECIDE EL CLIENTE</h5>
        <p>${safe(r.decision_cliente)}</p></div>
      <p class="admin-inspector-source">Origen: ${safe(r.canal)} · Ref. ${safe(r.referencia)} ·
       ${safe(r.fecha_limite)}. Nada se ha autorizado ni modificado.</p>`;
    if (r.id === "SOL-031") {
      const next = document.createElement("nav");
      next.className = "case-exit";
      next.setAttribute("aria-label", "Siguientes pasos del traspaso");
      next.innerHTML = '<a href="consulta.html?caso=operations&amp;muestra=SOL-031">Consultar un traspaso similar</a><a href="index.html#caso=operations">Volver al caso de operaciones</a>';
      byId("inspector").append(next);
    }
    byId("inspector").querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => {
        state.raw = button.dataset.view === "raw";
        renderInspector();
      });
    });
  }

  function selectRequest(id) {
    if (!requests.some((row) => row.id === id)) return;
    state.id = id;
    state.raw = false;
    renderList();
    renderInspector();
  }

  function renderAll() {
    byId("area").value = state.area;
    byId("buscar").value = state.search;
    document.querySelectorAll("[data-filter]").forEach((node) => {
      node.setAttribute("aria-pressed", String(node.dataset.filter === state.filter));
    });
    renderRules();
    renderList();
    renderInspector();
  }

  function setUpEvents() {
    document.querySelectorAll("[data-filter]").forEach((node) => node.addEventListener("click", () => {
      state.filter = node.dataset.filter;
      state.rule = "";
      renderAll();
    }));
    byId("buscar").addEventListener("input", (event) => {
      state.search = event.target.value.trim();
      renderList();
      renderInspector();
    });
    byId("area").addEventListener("change", (event) => {
      state.area = event.target.value;
      renderAll();
    });
    byId("reset-view").addEventListener("click", () => {
      Object.assign(state, { filter: "todos", area: "todas", rule: "", search: "", id: "SOL-008", raw: false });
      renderAll();
    });
    byId("inspect-eight").addEventListener("click", () => {
      Object.assign(state, { filter: "todos", area: "todas", rule: "", search: "", id: "SOL-008", raw: false });
      renderAll();
    });
  }

  function setUpExercise() {
    const responses = {
      a: "El valor más reciente no es necesariamente la fuente autorizada. Publicarlo puede crear un compromiso falso con el comprador y alterar datos que el responsable no aprobó.",
      b: "Criterio defendible: conservar los dos valores, identificar cuál fuente tiene autoridad para inventario, documentar el conflicto y solicitar la decisión antes de modificar o prometer una entrega.",
      c: "Cancelar todos los pedidos traslada el problema sin validar su alcance. También requiere autorización y podría afectar pedidos que no están comprometidos."
    };
    document.querySelectorAll("[data-choice]").forEach((node) => node.addEventListener("click", () => {
      document.querySelectorAll("[data-choice]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button === node));
      });
      const good = node.dataset.choice === "b";
      byId("choice-result").innerHTML = `<strong>${good ? "DECISIÓN CON CONTROL" : "RIESGO DE ESTA OPCIÓN"}</strong><br>${safe(responses[node.dataset.choice])}`;
    }));
  }

  calculateTotals();
  setUpEvents();
  setUpExercise();
  renderAll();
})();
