// Tareas compartidas con lo que suben los maestros
let tareasAlumno = JSON.parse(localStorage.getItem('tareas_compartidas')) || [
  {
    id: 1,
    clase: 'Física II - Grupo 4°A',
    titulo: 'Reporte de Práctica: Tiro Parabólico',
    instrucciones: 'Elaborar reporte con gráficas de trayectoria y cálculo de errores experimentales.',
    fechaEntrega: '2026-11-04',
    horaEntrega: '23:59',
    maestro: 'Prof. Roberto Mendoza',
    entregada: false
  },
  {
    id: 2,
    clase: 'Matemáticas V - Grupo 5°A',
    titulo: 'Guía de Problemas: Límites y Continuidad',
    instrucciones: 'Resolver los 15 ejercicios del capítulo 3 a tinta en hojas milimétricas.',
    fechaEntrega: '2026-11-06',
    horaEntrega: '20:00',
    maestro: 'Prof. Roberto Mendoza',
    entregada: false
  },
  {
    id: 3,
    clase: 'Cálculo Diferencial - Grupo 5°B',
    titulo: 'Ejercicios de la Regla de la Cadena',
    instrucciones: 'Resolver ejercicios 1 al 10 con comprobación paso a paso.',
    fechaEntrega: '2026-11-10',
    horaEntrega: '23:59',
    maestro: 'Prof. Roberto Mendoza',
    entregada: false
  }
];

let metaSimulador = 6.0;
let materiasSimulador = [
  { id: "m1", nombre: "Matemáticas V", maestro: "Prof. Roberto Mendoza", p1: 8.5, p2Simulado: null },
  { id: "m2", nombre: "Física II", maestro: "Prof. Roberto Mendoza", p1: 9.0, p2Simulado: null },
  { id: "m3", nombre: "Historia Contemporánea", maestro: "Profra. Martha Elena Rivas", p1: 8.0, p2Simulado: null },
  { id: "m4", nombre: "Inglés Avanzado", maestro: "Profra. Carmen Salgado", p1: 9.2, p2Simulado: null },
  { id: "m5", nombre: "Química Industrial", maestro: "Prof. Alejandro Fuentes", p1: 6.5, p2Simulado: null }
];

document.addEventListener('DOMContentLoaded', () => {
  renderTareas();
  renderCalendario();
  renderProximasTareasResumen();
  renderizarSimulador();
  calcularPaseLibre();
});

function cambiarSeccion(seccion) {
  document.querySelectorAll('.seccion-alumno').forEach(s => s.classList.add('oculto'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('activo'));

  if (seccion === 'resumen') document.getElementById('secResumen').classList.remove('oculto');
  if (seccion === 'tareas') document.getElementById('secTareas').classList.remove('oculto');
  if (seccion === 'calendario') document.getElementById('secCalendario').classList.remove('oculto');
  if (seccion === 'asistencia') document.getElementById('secAsistencia').classList.remove('oculto');
  if (seccion === 'calificaciones') {
    document.getElementById('secCalificaciones').classList.remove('oculto');
    renderizarSimulador();
    calcularPaseLibre();
  }
}

function renderTareas() {
  const container = document.getElementById('contenedorTareas');
  container.innerHTML = tareasAlumno.map(t => `
    <div class="item-tarea ${t.entregada ? 'entregada' : ''}">
      <div class="meta-tags">
        <span class="tag-materia">${t.clase}</span>
        <span class="tag-profe">👨‍🏫 ${t.maestro}</span>
        <span style="font-size:11px; font-weight:bold; color:${t.entregada ? 'var(--verde)' : 'var(--amarillo)'};">
          ${t.entregada ? '✅ Entregada' : '⏳ Pendiente'}
        </span>
      </div>
      <h3 style="margin-bottom: 6px; font-size: 15px;">${t.titulo}</h3>
      <p style="font-size: 13px; color: #4B5563; margin-bottom: 10px; line-height: 1.4;">
        <strong>Instrucciones:</strong> ${t.instrucciones}
      </p>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size: 12px;">
        <span style="font-weight: bold; color: #92400E;">
          ⏰ Fecha límite: ${t.fechaEntrega} a las ${t.horaEntrega} hrs
        </span>
        ${
          t.entregada
            ? '<span style="color:var(--verde); font-weight:bold;">Tarea Completada</span>'
            : `<button class="btn-entregar-tarea" onclick="abrirModalEntrega(${t.id})">Entregar Tarea</button>`
        }
      </div>
    </div>
  `).join('');

  // Contador de pendientes
  const pendientes = tareasAlumno.filter(t => !t.entregada).length;
  document.getElementById('numTareasPendientes').textContent = pendientes;
}

function renderProximasTareasResumen() {
  const container = document.getElementById('resumenProximasTareas');
  const pendientes = tareasAlumno.filter(t => !t.entregada).slice(0, 2);

  if (pendientes.length === 0) {
    container.innerHTML = '<p style="color:#6B7280; font-size:12px;">🎉 No tienes entregas pendientes en este momento.</p>';
    return;
  }

  container.innerHTML = pendientes.map(t => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #E5E7EB; font-size:13px;">
      <div>
        <strong>${t.titulo}</strong>
        <p style="font-size:11px; color:#6B7280;">${t.clase} • ${t.maestro}</p>
      </div>
      <span style="color:#B45309; font-weight:bold; font-size:12px;">Entrega: ${t.fechaEntrega}</span>
    </div>
  `).join('');
}

// Renderizado del Calendario con las Tareas
function renderCalendario() {
  const container = document.getElementById('diasCalendario');
  let html = '';

  // Días de Noviembre (1 al 30)
  // 1 de Noviembre 2026 empieza en Domingo (offset 0)
  for (let d = 1; d <= 30; d++) {
    const formattedDay = d < 10 ? `0${d}` : `${d}`;
    const fecha = `2026-11-${formattedDay}`;
    const tareasDelDia = tareasAlumno.filter(t => t.fechaEntrega === fecha);

    html += `
      <div class="dia-celda ${tareasDelDia.length > 0 ? 'con-tarea' : ''}">
        <strong>${d}</strong>
        ${tareasDelDia.map(t => `
          <div class="pill-tarea-cal" title="${t.clase}: ${t.titulo} (${t.maestro})">
            ${t.clase.split(' - ')[0]}: ${t.titulo}
          </div>
        `).join('')}
      </div>
    `;
  }
  container.innerHTML = html;
}

function abrirModalEntrega(id) {
  tareaSeleccionadaId = id;
  const tarea = tareasAlumno.find(t => t.id === id);
  if (!tarea) return;

  document.getElementById('modalTareaTitulo').textContent = `Entregar: ${tarea.titulo}`;
  document.getElementById('modalTareaInstrucciones').textContent = `Instrucciones del ${tarea.maestro}: ${tarea.instrucciones}`;
  document.getElementById('modalEntregaTarea').classList.remove('oculto');
}

function cerrarModalEntrega() {
  document.getElementById('modalEntregaTarea').classList.add('oculto');
}

function completarEntrega(e) {
  e.preventDefault();
  const index = tareasAlumno.findIndex(t => t.id === tareaSeleccionadaId);
  if (index !== -1) {
    tareasAlumno[index].entregada = true;
    localStorage.setItem('tareas_compartidas', JSON.stringify(tareasAlumno));
    renderTareas();
    renderProximasTareasResumen();
    cerrarModalEntrega();
    alert('¡Tarea entregada con éxito! Tu profesor ya puede revisarla.');
  }
}

function cerrarSesion() {
  localStorage.removeItem('sesion_activa');
  window.location.href = 'index.html';
}

// ==========================================
// SIMULADOR: ¿CON CUÁNTO PASO EL SEMESTRE?
// ==========================================
function cambiarMetaSimulador(nuevaMeta) {
  metaSimulador = parseFloat(nuevaMeta);
  const label = document.getElementById("labelMetaActiva");
  if (label) label.textContent = metaSimulador.toFixed(1);

  document.querySelectorAll(".btn-meta").forEach(btn => {
    if (parseFloat(btn.dataset.meta) === metaSimulador) {
      btn.classList.add("activo");
    } else {
      btn.classList.remove("activo");
    }
  });

  renderizarSimulador();
}

function ajustarP2Simulado(materiaId, valor) {
  const num = parseFloat(valor);
  const mat = materiasSimulador.find(m => m.id === materiaId);
  if (mat) {
    mat.p2Simulado = num;
    renderizarSimulador();
  }
}

function restablecerSimulador() {
  metaSimulador = 6.0;
  materiasSimulador.forEach(m => m.p2Simulado = null);
  const label = document.getElementById("labelMetaActiva");
  if (label) label.textContent = "6.0";
  document.querySelectorAll(".btn-meta").forEach(btn => {
    btn.classList.toggle("activo", parseFloat(btn.dataset.meta) === 6.0);
  });
  renderizarSimulador();
}

function renderizarSimulador() {
  const cont = document.getElementById("listaMateriasSimulador");
  if (!cont) return;

  const puntosTotales = metaSimulador * 3;

  cont.innerHTML = materiasSimulador.map(m => {
    const p1 = m.p1;
    const p2 = m.p2Simulado;
    const faltanP2P3 = Math.max(0, puntosTotales - p1);
    const promNecesarioP2P3 = Number((faltanP2P3 / 2).toFixed(1));

    let necesarioP3 = null;
    if (p2 !== null) {
      necesarioP3 = Number(Math.max(0, puntosTotales - p1 - p2).toFixed(1));
    }

    const testScore = p2 !== null ? necesarioP3 : promNecesarioP2P3;

    let badgeClass = "verde";
    let badgeTexto = "Muy accesible (≤ 6.0)";
    let icono = "fa-circle-check";

    if (testScore <= 6.0) {
      badgeClass = "verde";
      badgeTexto = "Muy accesible (≤ 6.0)";
      icono = "fa-circle-check";
    } else if (testScore <= 7.5) {
      badgeClass = "azul";
      badgeTexto = "Accesible / Normal";
      icono = "fa-thumbs-up";
    } else if (testScore <= 9.0) {
      badgeClass = "amarillo";
      badgeTexto = "Exigente (7.5 a 9.0)";
      icono = "fa-triangle-exclamation";
    } else if (testScore <= 10.0) {
      badgeClass = "naranja";
      badgeTexto = "¡Máximo esfuerzo requerido!";
      icono = "fa-fire";
    } else {
      badgeClass = "rojo";
      badgeTexto = "Inalcanzable para esta meta (> 10.0)";
      icono = "fa-circle-xmark";
    }

    const valorSlider = p2 !== null ? p2 : 7.0;

    return `
      <div class="card-materia-sim">
        <div class="materia-info">
          <h4>${m.nombre}</h4>
          <small><i class="fa-solid fa-chalkboard-user"></i> ${m.maestro}</small>
          
          <div class="desglose-parciales">
            <div class="bloque-nota azul">
              <small>Parcial 1</small>
              <strong>${p1.toFixed(1)}</strong>
            </div>
            <span style="font-weight:bold; color:var(--texto-apagado);">+</span>
            <div class="bloque-nota indigo">
              <small>P2 Estimado</small>
              <strong>${p2 !== null ? p2.toFixed(1) : "—"}</strong>
            </div>
            <span style="font-weight:bold; color:var(--texto-apagado);">+</span>
            <div class="bloque-nota ${testScore > 10 ? 'rojo' : 'verde'}">
              <small>P3 Requerido</small>
              <strong>${p2 !== null ? (necesarioP3 > 10 ? '>10' : necesarioP3.toFixed(1)) : `${promNecesarioP2P3} c/u`}</strong>
            </div>
          </div>
        </div>

        <div class="slider-sim-box">
          <div class="slider-header">
            <span>¿Cuánto estimas en Parcial 2?</span>
            <span class="badge-valor-slider">${p2 !== null ? p2.toFixed(1) : "Mueve el control"}</span>
          </div>
          <input 
            type="range" 
            class="slider-sim" 
            min="0" 
            max="10" 
            step="0.5" 
            value="${valorSlider}" 
            oninput="ajustarP2Simulado('${m.id}', this.value)"
          >
          <div class="slider-escalas">
            <span>0.0</span>
            <span>5.0</span>
            <span>10.0</span>
          </div>
        </div>

        <div class="resultado-sim-box">
          <span class="meta-label">Para promediar ${metaSimulador.toFixed(1)}:</span>
          <div class="nota-requerida">
            ${p2 !== null ? (
              necesarioP3 > 10 
                ? '<span style="color:var(--rojo);">Inalcanzable</span>' 
                : necesarioP3 <= 0 
                  ? '<span style="color:var(--verde);">¡Ya pasaste!</span>'
                  : `Necesitas <strong style="color:var(--azul);">${necesarioP3.toFixed(1)}</strong> en P3`
            ) : (
              `Necesitas promedio de <strong style="color:var(--azul);">${promNecesarioP2P3}</strong>`
            )}
          </div>
          <span class="badge-estatus-pase ${badgeClass}">
            <i class="fa-solid ${icono}"></i> ${badgeTexto}
          </span>
        </div>
      </div>
    `;
  }).join("");
}

function calcularPaseLibre() {
  const p1Input = document.getElementById("calcP1");
  const p2Input = document.getElementById("calcP2");
  const metaSelect = document.getElementById("calcMeta");

  if (!p1Input || !metaSelect) return;

  const p1 = parseFloat(p1Input.value) || 0;
  const p2Raw = p2Input ? p2Input.value.trim() : "";
  const p2 = p2Raw !== "" && !isNaN(parseFloat(p2Raw)) ? parseFloat(p2Raw) : null;
  const meta = parseFloat(metaSelect.value) || 6.0;

  const box = document.getElementById("resultadoCalcLibre");
  if (!box) return;

  const puntosTotales = meta * 3;

  if (p2 !== null) {
    const p3Necesario = Number((puntosTotales - p1 - p2).toFixed(1));
    const acumulado = Number((p1 + p2).toFixed(1));

    if (p3Necesario > 10) {
      box.innerHTML = `
        <div class="resultado-libre-texto">
          <strong style="color:var(--rojo);">⚠️ Meta inalcanzable para este semestre</strong>
          <p>Con P1 (${p1.toFixed(1)}) y P2 (${p2.toFixed(1)}) sumas ${acumulado} pts. Necesitarías ${p3Necesario} en el Parcial 3 (el máximo es 10.0).</p>
        </div>
        <span class="badge-estatus-pase rojo"><i class="fa-solid fa-circle-xmark"></i> Requiere más de 10.0</span>
      `;
    } else if (p3Necesario <= 0) {
      box.innerHTML = `
        <div class="resultado-libre-texto">
          <strong style="color:var(--verde);">🎉 ¡Felicidades! Ya aseguraste tu meta de ${meta.toFixed(1)}</strong>
          <p>Llevas acumulados ${acumulado} puntos de los ${puntosTotales} requeridos. Incluso con 0 en Parcial 3 apruebas.</p>
        </div>
        <span class="badge-estatus-pase verde"><i class="fa-solid fa-circle-check"></i> Meta Asegurada</span>
      `;
    } else {
      const color = p3Necesario <= 6.0 ? 'verde' : p3Necesario <= 8.0 ? 'azul' : 'amarillo';
      box.innerHTML = `
        <div class="resultado-libre-texto">
          <strong style="color:var(--azul);">Necesitas obtener ${p3Necesario.toFixed(1)} en el Parcial 3</strong>
          <p>Tienes ${acumulado} pts acumulados. Te faltan exactamente ${p3Necesario.toFixed(1)} puntos para promediar ${meta.toFixed(1)}.</p>
        </div>
        <span class="badge-estatus-pase ${color}"><i class="fa-solid fa-bullseye"></i> Meta de ${meta.toFixed(1)} alcanzable</span>
      `;
    }
  } else {
    const faltanP2P3 = Math.max(0, puntosTotales - p1);
    const promedioNecesario = Number((faltanP2P3 / 2).toFixed(1));

    if (promedioNecesario > 10) {
      box.innerHTML = `
        <div class="resultado-libre-texto">
          <strong style="color:var(--rojo);">Meta no alcanzable</strong>
          <p>Requerirías un promedio superior a 10.0 en los parciales 2 y 3.</p>
        </div>
        <span class="badge-estatus-pase rojo">Inalcanzable</span>
      `;
    } else {
      const color = promedioNecesario <= 6.0 ? 'verde' : promedioNecesario <= 8.0 ? 'azul' : 'amarillo';
      box.innerHTML = `
        <div class="resultado-libre-texto">
          <strong style="color:var(--azul);">Promedio sugerido: ${promedioNecesario.toFixed(1)} en Parcial 2 y 3</strong>
          <p>Con tu Parcial 1 de ${p1.toFixed(1)}, requieres sumar ${faltanP2P3.toFixed(1)} puntos entre P2 y P3 para promediar ${meta.toFixed(1)}.</p>
        </div>
        <span class="badge-estatus-pase ${color}"><i class="fa-solid fa-calculator"></i> ${promedioNecesario.toFixed(1)} en c/u</span>
      `;
    }
  }
}
