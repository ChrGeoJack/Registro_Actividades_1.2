// Clases del Maestro
let clases = JSON.parse(localStorage.getItem('clases_maestro')) || [
  { id: '1', nombre: 'Matemáticas V - Grupo 5°A', materia: 'Matemáticas V', horario: 'Lun, Mie • 08:00 - 09:40 hrs', alumnos: 38 },
  { id: '2', nombre: 'Cálculo Diferencial - Grupo 5°B', materia: 'Cálculo', horario: 'Mar, Jue • 10:00 - 11:40 hrs', alumnos: 35 },
  { id: '3', nombre: 'Física II - Grupo 4°A', materia: 'Física II', horario: 'Lun, Mie • 11:50 - 13:30 hrs', alumnos: 40 }
];

// Alumnos del Grupo para pase de lista
let alumnosGrupo = [
  { nombre: 'Carlos Ramírez', correo: 'Alumno@cetis101.org', estatus: 'presente' },
  { nombre: 'Sofía Martínez', correo: 'sofia.martinez@cetis101.org', estatus: 'presente' },
  { nombre: 'Alejandro Gómez', correo: 'alejandro.gomez@cetis101.org', estatus: 'presente' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderClases();
  renderAlumnosAsistencia();
  renderEntregas();
  document.getElementById('asistenciaFecha').value = new Date().toISOString().split('T')[0];
  document.getElementById('inputFechaEntrega').value = '2026-11-05';
});

function cambiarPestana(tab) {
  document.querySelectorAll('.seccion-tab').forEach(s => s.classList.add('oculto'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('activo'));

  if (tab === 'clases') {
    document.getElementById('tabClases').classList.remove('oculto');
  } else if (tab === 'subir-tarea') {
    document.getElementById('tabSubirTarea').classList.remove('oculto');
  } else if (tab === 'asistencia') {
    document.getElementById('tabAsistencia').classList.remove('oculto');
  } else if (tab === 'entregas') {
    document.getElementById('tabEntregas').classList.remove('oculto');
    renderEntregas();
  }
}

function renderClases() {
  const container = document.getElementById('listaClases');
  container.innerHTML = clases.map(c => `
    <div class="card-clase">
      <span class="badge-materia">${c.materia}</span>
      <h3 style="margin: 8px 0; font-size: 16px;">${c.nombre}</h3>
      <p style="font-size: 12px; color: #6B7280;"><i class="fa-regular fa-clock"></i> ${c.horario}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 12px; font-size: 12px;">
        <span style="color: #4B5563;">👥 ${c.alumnos} alumnos</span>
        <button onclick="seleccionarClaseParaTarea('${c.nombre}')" style="background:none; border:none; color:var(--morado); font-weight:bold; cursor:pointer;">
          + Asignar tarea
        </button>
      </div>
    </div>
  `).join('');

  // Actualizar select de tareas
  const select = document.getElementById('selectClaseTarea');
  if (select) {
    select.innerHTML = clases.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
  }
}

function seleccionarClaseParaTarea(nombreClase) {
  document.getElementById('selectClaseTarea').value = nombreClase;
  cambiarPestana('subir-tarea');
}

function abrirModalClase() {
  document.getElementById('modalNuevaClase').classList.remove('oculto');
}

function cerrarModalClase() {
  document.getElementById('modalNuevaClase').classList.add('oculto');
}

function crearClase(e) {
  e.preventDefault();
  const nombre = document.getElementById('nuevaClaseNombre').value;
  const materia = document.getElementById('nuevaClaseMateria').value;
  const horario = document.getElementById('nuevaClaseHorario').value;

  const nueva = {
    id: Date.now().toString(),
    nombre,
    materia,
    horario,
    alumnos: 35
  };

  clases.push(nueva);
  localStorage.setItem('clases_maestro', JSON.stringify(clases));
  renderClases();
  cerrarModalClase();
  alert('¡Clase agregada exitosamente!');
}

function renderAlumnosAsistencia() {
  const tbody = document.getElementById('filasAlumnosAsistencia');
  tbody.innerHTML = alumnosGrupo.map((alu, index) => `
    <tr>
      <td><strong>${alu.nombre}</strong></td>
      <td style="color:#6B7280; font-family:monospace; font-size: 11px;">${alu.correo}</td>
      <td style="text-align: center;">
        <button class="btn-tag ${alu.estatus === 'presente' ? 'activo-presente' : ''}" onclick="marcarEstatus(${index}, 'presente')">Presente</button>
        <button class="btn-tag ${alu.estatus === 'falta' ? 'activo-falta' : ''}" onclick="marcarEstatus(${index}, 'falta')">Falta</button>
      </td>
      <td><input type="text" placeholder="Observaciones..." style="padding: 4px 8px; border-radius: 6px; border:1px solid #E5E7EB; width: 100%;"></td>
    </tr>
  `).join('');
}

function marcarEstatus(index, estatus) {
  alumnosGrupo[index].estatus = estatus;
  renderAlumnosAsistencia();
}

function guardarAsistencia() {
  const fecha = document.getElementById('asistenciaFecha').value;
  const clase = document.getElementById('asistenciaClase').value;
  alert(`✅ Pase de lista guardado con éxito para ${clase} en fecha: ${fecha}.`);
}

// Guardar Tarea (se sincroniza con localStorage para el Alumno)
function guardarTarea(e) {
  e.preventDefault();
  const clase = document.getElementById('selectClaseTarea').value;
  const titulo = document.getElementById('inputTituloTarea').value;
  const instrucciones = document.getElementById('inputInstrucciones').value;
  const fecha = document.getElementById('inputFechaEntrega').value;
  const hora = document.getElementById('inputHoraEntrega').value;
  const maestro = document.getElementById('inputMaestroNombre').value;

  const nuevaTarea = {
    id: Date.now(),
    clase,
    titulo,
    instrucciones,
    fechaEntrega: fecha,
    horaEntrega: hora,
    maestro
  };

  let tareasGuardadas = JSON.parse(localStorage.getItem('tareas_compartidas') || '[]');
  tareasGuardadas.unshift(nuevaTarea);
  localStorage.setItem('tareas_compartidas', JSON.stringify(tareasGuardadas));

  alert(`¡Tarea publicada con éxito!\n\nSe agendó en el Calendario del Alumno para el día: ${fecha} a las ${hora} hrs.`);
  document.getElementById('formNuevaTarea').reset();
  cambiarPestana('clases');
}

function renderEntregas() {
  const container = document.getElementById('listaEntregas');
  container.innerHTML = `
    <div style="background:#F9FAFB; border:1px solid #E5E7EB; border-radius:12px; padding:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="font-size:14px; margin-bottom:4px;">Carlos Ramírez (Alumno@cetis101.org)</h4>
          <p style="font-size:12px; color:#6B7280;">Tarea: <strong>Ejercicios de Tiro Parabólico</strong></p>
          <p style="font-size:12px; color:#10B981; margin-top:4px;">📎 Archivo adjunto: <em>Ejercicios_CarlosRamirez.pdf</em></p>
        </div>
        <div style="text-align:right;">
          <input type="number" min="0" max="10" value="10" style="width:60px; padding:6px; font-weight:bold; border-radius:8px; border:1px solid #E5E7EB;">
          <button onclick="alert('Calificación de 10 asignada a Carlos Ramírez')" style="display:block; margin-top:6px; background:var(--verde); color:white; border:none; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:bold; cursor:pointer;">
            Calificar
          </button>
        </div>
      </div>
    </div>
  `;
}

function cerrarSesion() {
  localStorage.removeItem('sesion_activa');
  window.location.href = 'index.html';
}
