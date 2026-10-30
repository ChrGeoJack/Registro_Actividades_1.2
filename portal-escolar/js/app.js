/**
 * PORTAL ESCOLAR CETIS 101 - JAVASCRIPT UNIFICADO
 * Funcionalidad completa para Maestro y Alumno en una sola página.
 * Cero errores de "página no disponible" gracias a navegación en memoria.
 */

// ==========================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================================
const AppState = {
  rolSeleccionado: null, // 'maestro' o 'alumno'
  usuarioActual: null,   // { email, nombre, rol }
  
  // Clases del Maestro
  clases: [
    {
      id: "c1",
      nombre: "Matemáticas V - Grupo 5°A",
      materia: "Matemáticas V",
      aula: "Edificio B - Aula 12",
      horario: "Lun, Mié, Vie • 07:00 - 08:40 hrs",
      alumnosTotal: 34
    },
    {
      id: "c2",
      nombre: "Cálculo Diferencial - Grupo 5°B",
      materia: "Cálculo Diferencial",
      aula: "Edificio B - Aula 14",
      horario: "Mar, Jue • 09:00 - 10:40 hrs",
      alumnosTotal: 32
    },
    {
      id: "c3",
      nombre: "Física II - Grupo 4°A",
      materia: "Física II",
      aula: "Laboratorio de Ciencias",
      horario: "Lun, Mié • 11:00 - 12:40 hrs",
      alumnosTotal: 30
    }
  ],

  // Alumnos registrados para pase de lista
  alumnosLista: [
    { id: 1, nombre: "Carlos Ramírez Soto", email: "Alumno@cetis101.org", estado: "presente", nota: "" },
    { id: 2, nombre: "Ana Sofía Morales", email: "ana.morales@cetis101.edu.mx", estado: "presente", nota: "" },
    { id: 3, nombre: "Diego Fernando Ruiz", email: "diego.ruiz@cetis101.edu.mx", estado: "presente", nota: "" },
    { id: 4, nombre: "Valeria Gómez Peña", email: "valeria.gomez@cetis101.edu.mx", estado: "falta", nota: "Justificante médico pendiente" },
    { id: 5, nombre: "Mateo Hernández Luna", email: "mateo.hdz@cetis101.edu.mx", estado: "presente", nota: "" },
    { id: 6, nombre: "Camila Torres Vega", email: "camila.torres@cetis101.edu.mx", estado: "presente", nota: "" }
  ],

  // Tareas publicadas por maestros (se muestran en Tareas y en Calendario del Alumno)
  tareas: [
    {
      id: "t1",
      titulo: "Taller: Resolución de Límites y Derivadas",
      materia: "Matemáticas V",
      maestro: "Prof. Roberto Mendoza",
      instrucciones: "Resolver del ejercicio 1 al 15 de la página 84 del libro oficial en hojas blancas cuadradas. Incluir procedimiento paso a paso y gráficas correspondientes.",
      fechaEntrega: "2026-11-06",
      horaEntrega: "23:59",
      puntos: 10,
      entregada: false
    },
    {
      id: "t2",
      titulo: "Reporte Experimental: Leyes de Termodinámica",
      materia: "Física II",
      maestro: "Prof. Roberto Mendoza",
      instrucciones: "Elaborar reporte en formato IEEE con portada institucional, marco teórico de al menos 2 cuartillas, registro fotográfico de la práctica de laboratorio y conclusiones personales.",
      fechaEntrega: "2026-11-12",
      horaEntrega: "23:59",
      puntos: 10,
      entregada: false
    },
    {
      id: "t3",
      titulo: "Ensayo: Impacto de la Revolución Industrial",
      materia: "Historia Contemporánea",
      maestro: "Profra. Martha Elena Rivas",
      instrucciones: "Redactar ensayo argumentativo de 3 a 5 páginas con citas bibliográficas en formato APA 7ma edición. Guardar en formato PDF.",
      fechaEntrega: "2026-11-18",
      horaEntrega: "20:00",
      puntos: 10,
      entregada: true
    }
  ],

  // Entregas para que el maestro revise
  entregas: [
    {
      id: "e1",
      alumno: "Carlos Ramírez Soto",
      email: "Alumno@cetis101.org",
      tareaTitulo: "Ensayo: Impacto de la Revolución Industrial",
      materia: "Historia Contemporánea",
      fechaEnvio: "04/11/2026 18:30",
      comentario: "Profesor, adjunto mi ensayo con citas en formato APA. Quedo atento a observaciones.",
      archivo: "Ensayo_CarlosRamirez_Hist.pdf",
      calificacion: 9.5,
      retroalimentacion: "Excelente análisis crítico y uso impecable de referencias."
    }
  ],

  tareaSeleccionadaParaEntrega: null,

  // SIMULADOR DE CALIFICACIONES (¿CON CUÁNTO PASO?)
  metaSimulador: 6.0,
  materiasSimulador: [
    { id: "m1", nombre: "Matemáticas V", maestro: "Prof. Roberto Mendoza", p1: 8.5, p2Simulado: null },
    { id: "m2", nombre: "Física II", maestro: "Prof. Roberto Mendoza", p1: 9.0, p2Simulado: null },
    { id: "m3", nombre: "Historia Contemporánea", maestro: "Profra. Martha Elena Rivas", p1: 8.0, p2Simulado: null },
    { id: "m4", nombre: "Inglés Avanzado", maestro: "Profra. Carmen Salgado", p1: 9.2, p2Simulado: null },
    { id: "m5", nombre: "Química Industrial", maestro: "Prof. Alejandro Fuentes", p1: 6.5, p2Simulado: null }
  ]
};

// ==========================================================
// INICIALIZACIÓN
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar fecha de hoy en el selector de asistencia
  const inputAsistenciaFecha = document.getElementById("asistenciaFecha");
  if (inputAsistenciaFecha) {
    const hoy = new Date().toISOString().split("T")[0];
    inputAsistenciaFecha.value = hoy;
  }

  // Inicializar fecha de entrega por defecto (5 días adelante)
  const inputFechaEntrega = document.getElementById("inputFechaEntrega");
  if (inputFechaEntrega) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 5);
    inputFechaEntrega.value = fecha.toISOString().split("T")[0];
  }

  // Renderizar vistas iniciales
  renderizarClasesMaestro();
  renderizarAsistenciaMaestro();
  renderizarEntregasMaestro();
  renderizarTareasAlumno();
  renderizarCalendarioAlumno();
  renderizarSimulador();
  calcularPaseLibre();
});


// ==========================================================
// 1. CONTROL DE ACCESO Y VALIDACIÓN DE CORREO
// ==========================================================
function elegirRol(rol) {
  AppState.rolSeleccionado = rol;

  // Cambiar vista en la tarjeta de autenticación
  document.getElementById("stepRoleSelect").classList.add("oculto");
  document.getElementById("stepEmailLogin").classList.remove("oculto");

  // Elementos de la interfaz según el rol
  const badge = document.getElementById("badgeRolActivo");
  const logoRol = document.getElementById("logoRol");
  const titulo = document.getElementById("tituloLogin");
  const subtitulo = document.getElementById("subtituloLogin");
  const input = document.getElementById("correoInput");
  const btnIngresar = document.getElementById("btnIngresar");
  const btnEjemplo = document.getElementById("btnEjemploRol");

  input.value = "";
  document.getElementById("mensajeValidacion").classList.add("oculto");
  document.getElementById("iconoCheck").classList.add("oculto");

  if (rol === "maestro") {
    badge.textContent = "Docente / Maestro";
    badge.className = "badge-rol maestro";
    logoRol.innerHTML = '<i class="fa-solid fa-chalkboard-user"></i>';
    logoRol.style.color = "var(--morado)";
    logoRol.style.background = "var(--morado-suave)";
    titulo.textContent = "Ingreso para Maestros";
    subtitulo.textContent = "Ingresa tu correo institucional asignado de docente (ej. Maestro@cetis101.org o @*.edu.mx)";
    input.placeholder = "Maestro@cetis101.org";
    btnIngresar.className = "btn-ingresar maestro";
    btnEjemplo.textContent = "👨‍🏫 Usar Maestro@cetis101.org";
  } else {
    badge.textContent = "Estudiante / Alumno";
    badge.className = "badge-rol alumno";
    logoRol.innerHTML = '<i class="fa-solid fa-graduation-cap"></i>';
    logoRol.style.color = "var(--azul)";
    logoRol.style.background = "var(--azul-suave)";
    titulo.textContent = "Ingreso para Alumnos";
    subtitulo.textContent = "Ingresa tu correo institucional escolar (ej. Alumno@cetis101.org o @*.edu.mx)";
    input.placeholder = "Alumno@cetis101.org";
    btnIngresar.className = "btn-ingresar";
    btnEjemplo.textContent = "👨‍🎓 Usar Alumno@cetis101.org";
  }

  input.focus();
}

function volverASeleccionRol() {
  document.getElementById("stepEmailLogin").classList.add("oculto");
  document.getElementById("stepRoleSelect").classList.remove("oculto");
  AppState.rolSeleccionado = null;
}

function llenarEjemplo() {
  const input = document.getElementById("correoInput");
  if (AppState.rolSeleccionado === "maestro") {
    input.value = "Maestro@cetis101.org";
  } else {
    input.value = "Alumno@cetis101.org";
  }
  validarEnVivo();
}

/**
 * Valida si el correo institucional cumple los requisitos
 */
function esCorreoValido(email) {
  const limpio = email.trim().toLowerCase();
  
  // Acepta correos clave directos
  if (limpio === "maestro@cetis101.org" || limpio === "alumno@cetis101.org") {
    return { valido: true, tipo: "oficial" };
  }

  // Expresión para correos institucionales: .edu.mx, .org, .gob.mx, cetis101
  const regexInstitucional = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*(edu\.mx|cetis101\.org|cetis101\.edu\.mx|dgeti\.sems\.gob\.mx|org)$/i;

  if (regexInstitucional.test(limpio)) {
    return { valido: true, tipo: "institucional" };
  }

  return { valido: false };
}

function validarEnVivo() {
  const correo = document.getElementById("correoInput").value.trim();
  const mensaje = document.getElementById("mensajeValidacion");
  const iconoCheck = document.getElementById("iconoCheck");

  if (!correo) {
    mensaje.classList.add("oculto");
    iconoCheck.classList.add("oculto");
    return;
  }

  const resultado = esCorreoValido(correo);

  if (resultado.valido) {
    mensaje.className = "mensaje-validacion exito";
    mensaje.innerHTML = `<i class="fa-solid fa-check"></i> Dominio institucional verificado correctamente.`;
    mensaje.classList.remove("oculto");
    iconoCheck.classList.remove("oculto");
  } else {
    mensaje.className = "mensaje-validacion error";
    mensaje.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Requiere correo institucional (@*.edu.mx o @cetis101.org).`;
    mensaje.classList.remove("oculto");
    iconoCheck.classList.add("oculto");
  }
}

function iniciarSesion() {
  const correo = document.getElementById("correoInput").value.trim();
  const validacion = esCorreoValido(correo);

  if (!validacion.valido) {
    const mensaje = document.getElementById("mensajeValidacion");
    mensaje.className = "mensaje-validacion error";
    mensaje.innerHTML = `⚠️ Correo no admitido. Usa un correo institucional como <strong>Maestro@cetis101.org</strong>, <strong>Alumno@cetis101.org</strong> o con dominio <strong>.edu.mx</strong>.`;
    mensaje.classList.remove("oculto");
    return;
  }

  // Generar sesión en memoria
  let nombre = correo.split("@")[0].replace(/[._-]/g, " ");
  nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

  if (correo.toLowerCase().includes("maestro")) {
    nombre = "Prof. Roberto Mendoza";
  } else if (correo.toLowerCase().includes("alumno")) {
    nombre = "Carlos Ramírez Soto";
  }

  AppState.usuarioActual = {
    email: correo,
    nombre: nombre,
    rol: AppState.rolSeleccionado
  };

  mostrarDashboard(AppState.rolSeleccionado);
}

function autoLogin(correo, rol) {
  AppState.rolSeleccionado = rol;
  AppState.usuarioActual = {
    email: correo,
    nombre: rol === "maestro" ? "Prof. Roberto Mendoza" : "Carlos Ramírez Soto",
    rol: rol
  };
  mostrarDashboard(rol);
}

function mostrarDashboard(rol) {
  // Ocultar pantalla de login
  document.getElementById("pantallaAuth").classList.add("oculto");

  if (rol === "maestro") {
    document.getElementById("pantallaMaestro").classList.remove("oculto");
    document.getElementById("pantallaAlumno").classList.add("oculto");
    cambiarPestanaMaestro("clases");
  } else {
    // Alumno
    document.getElementById("pantallaAlumno").classList.remove("oculto");
    document.getElementById("pantallaMaestro").classList.add("oculto");
    
    // Configurar encabezado del alumno
    document.getElementById("nombreAlumno").textContent = AppState.usuarioActual.nombre.split(" ")[0];
    document.getElementById("avatarInicial").textContent = AppState.usuarioActual.nombre.charAt(0).toUpperCase();
    document.getElementById("correoHeader").textContent = AppState.usuarioActual.email;
    document.getElementById("labelNombreAlumnoSidebar").textContent = AppState.usuarioActual.nombre;
    document.getElementById("labelCorreoAlumnoSidebar").textContent = AppState.usuarioActual.email;

    cambiarSeccionAlumno("resumen");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cerrarSesion() {
  AppState.usuarioActual = null;
  AppState.rolSeleccionado = null;

  document.getElementById("pantallaMaestro").classList.add("oculto");
  document.getElementById("pantallaAlumno").classList.add("oculto");
  document.getElementById("pantallaAuth").classList.remove("oculto");
  volverASeleccionRol();
}


// ==========================================================
// 2. FUNCIONALIDADES DEL MENÚ DE MAESTRO
// ==========================================================
function cambiarPestanaMaestro(pestana) {
  // Actualizar botones del sidebar
  const items = document.querySelectorAll("#pantallaMaestro .nav-item");
  items.forEach(btn => btn.classList.remove("activo"));

  const tabs = {
    "clases": { btnIndex: 0, secId: "tabMaestroClases" },
    "subir-tarea": { btnIndex: 1, secId: "tabMaestroSubirTarea" },
    "asistencia": { btnIndex: 2, secId: "tabMaestroAsistencia" },
    "entregas": { btnIndex: 3, secId: "tabMaestroEntregas" }
  };

  if (tabs[pestana]) {
    items[tabs[pestana].btnIndex].classList.add("activo");
    document.querySelectorAll(".seccion-maestro").forEach(sec => sec.classList.add("oculto"));
    document.getElementById(tabs[pestana].secId).classList.remove("oculto");
  }
}

function renderizarClasesMaestro() {
  const contenedor = document.getElementById("listaClases");
  if (!contenedor) return;

  contenedor.innerHTML = AppState.clases.map(c => `
    <div class="card-clase">
      <div>
        <h3>${c.nombre}</h3>
        <p><i class="fa-solid fa-location-dot" style="color:var(--morado);"></i> ${c.aula}</p>
        <p><i class="fa-solid fa-clock" style="color:var(--morado);"></i> ${c.horario}</p>
      </div>
      <div class="card-clase-meta">
        <span><strong>${c.alumnosTotal}</strong> Alumnos inscritos</span>
        <button class="btn-estado" onclick="cambiarPestanaMaestro('subir-tarea')">+ Tarea</button>
      </div>
    </div>
  `).join("");

  // Actualizar opciones del select de tareas
  const select = document.getElementById("selectClaseTarea");
  if (select) {
    select.innerHTML = AppState.clases.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join("");
  }
}

function abrirModalClase() {
  document.getElementById("modalNuevaClase").classList.remove("oculto");
}

function cerrarModalClase() {
  document.getElementById("modalNuevaClase").classList.add("oculto");
}

function crearClase(e) {
  e.preventDefault();
  const nombre = document.getElementById("nuevaClaseNombre").value.trim();
  const materia = document.getElementById("nuevaClaseMateria").value.trim();
  const horario = document.getElementById("nuevaClaseHorario").value.trim();

  const nuevaClase = {
    id: "c_" + Date.now(),
    nombre: nombre,
    materia: materia,
    aula: "Aula por asignar",
    horario: horario,
    alumnosTotal: 30
  };

  AppState.clases.push(nuevaClase);
  renderizarClasesMaestro();
  cerrarModalClase();

  alert(`Clase "${nombre}" agregada correctamente.`);
}

function guardarTarea(e) {
  e.preventDefault();

  const clase = document.getElementById("selectClaseTarea").value;
  const materia = clase.split(" - ")[0] || clase;
  const maestro = document.getElementById("inputMaestroNombre").value;
  const titulo = document.getElementById("inputTituloTarea").value.trim();
  const instrucciones = document.getElementById("inputInstrucciones").value.trim();
  const fecha = document.getElementById("inputFechaEntrega").value;
  const hora = document.getElementById("inputHoraEntrega").value;
  const puntos = parseInt(document.getElementById("inputPuntos").value) || 10;

  const nuevaTarea = {
    id: "t_" + Date.now(),
    titulo: titulo,
    materia: materia,
    maestro: maestro,
    instrucciones: instrucciones,
    fechaEntrega: fecha,
    horaEntrega: hora,
    puntos: puntos,
    entregada: false
  };

  AppState.tareas.push(nuevaTarea);

  // Actualizar tanto las vistas del maestro como las del alumno
  renderizarTareasAlumno();
  renderizarCalendarioAlumno();

  // Resetear formulario
  document.getElementById("inputTituloTarea").value = "";
  document.getElementById("inputInstrucciones").value = "";

  alert(`¡Tarea "${titulo}" publicada con éxito!\n\nSe ha colocado en el Calendario de Alumnos para la fecha ${fecha} y en su menú de tareas.`);
  cambiarPestanaMaestro("clases");
}

function renderizarAsistenciaMaestro() {
  const tbody = document.getElementById("filasAlumnosAsistencia");
  if (!tbody) return;

  tbody.innerHTML = AppState.alumnosLista.map(al => `
    <tr>
      <td><strong>${al.nombre}</strong></td>
      <td><small style="color:var(--texto-secundario);">${al.email}</small></td>
      <td style="text-align: center;">
        <button type="button" class="btn-estado ${al.estado === 'presente' ? 'activo-verde' : ''}" onclick="toggleAsistencia(${al.id}, 'presente')">
          ✓ Presente
        </button>
        <button type="button" class="btn-estado ${al.estado === 'falta' ? 'activo-rojo' : ''}" style="margin-left: 6px;" onclick="toggleAsistencia(${al.id}, 'falta')">
          ✗ Falta
        </button>
      </td>
      <td>
        <input type="text" value="${al.nota || ''}" placeholder="Nota..." style="padding: 4px 8px; border: 1px solid var(--borde); border-radius: 4px; font-size: 12px; width: 100%;" onchange="guardarNotaAlumno(${al.id}, this.value)">
      </td>
    </tr>
  `).join("");
}

function toggleAsistencia(id, nuevoEstado) {
  const al = AppState.alumnosLista.find(a => a.id === id);
  if (al) {
    al.estado = nuevoEstado;
    renderizarAsistenciaMaestro();
  }
}

function guardarNotaAlumno(id, valor) {
  const al = AppState.alumnosLista.find(a => a.id === id);
  if (al) al.nota = valor;
}

function guardarAsistencia() {
  const fecha = document.getElementById("asistenciaFecha").value;
  const clase = document.getElementById("asistenciaClase").value;
  alert(`Pase de lista guardado exitosamente para la clase "${clase}" con fecha ${fecha}.`);
}

function renderizarEntregasMaestro() {
  const cont = document.getElementById("listaEntregas");
  if (!cont) return;

  if (AppState.entregas.length === 0) {
    cont.innerHTML = "<p class='desc'>Aún no hay entregas enviadas por los alumnos.</p>";
    return;
  }

  cont.innerHTML = AppState.entregas.map(e => `
    <div style="border: 1px solid var(--borde); border-radius: 10px; padding: 16px; margin-bottom: 12px; background: #FAFAFA;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div>
          <strong style="font-size: 15px;">${e.tareaTitulo}</strong>
          <p style="font-size: 13px; color: var(--morado); font-weight: 600;">${e.materia}</p>
        </div>
        <span class="badge-ok">Calificada: ${e.calificacion} / 10</span>
      </div>
      <p style="font-size: 13px; color: var(--texto-secundario); margin-bottom: 8px;">
        <strong>Alumno:</strong> ${e.alumno} (${e.email}) • Envió: ${e.fechaEnvio}
      </p>
      <div style="background: white; padding: 10px; border-radius: 6px; font-size: 13px; border: 1px solid var(--borde-suave); margin-bottom: 10px;">
        <strong>Comentario del alumno:</strong> "${e.comentario}"
        <br><br>
        <i class="fa-solid fa-paperclip"></i> <a href="#" style="color:var(--azul); font-weight:600;">${e.archivo}</a>
      </div>
      <div style="font-size: 13px; color: var(--verde-texto); background: var(--verde-suave); padding: 8px 12px; border-radius: 6px;">
        <strong>Retroalimentación del Maestro:</strong> ${e.retroalimentacion}
      </div>
    </div>
  `).join("");
}


// ==========================================================
// 3. FUNCIONALIDADES DEL MENÚ DE ALUMNO
// ==========================================================
function cambiarSeccionAlumno(seccion) {
  const items = document.querySelectorAll("#pantallaAlumno .nav-item");
  items.forEach(btn => btn.classList.remove("activo"));

  const secciones = {
    "resumen": { btnIndex: 0, secId: "secAlumnoResumen" },
    "tareas": { btnIndex: 1, secId: "secAlumnoTareas" },
    "calendario": { btnIndex: 2, secId: "secAlumnoCalendario" },
    "asistencia": { btnIndex: 3, secId: "secAlumnoAsistencia" },
    "calificaciones": { btnIndex: 4, secId: "secAlumnoCalificaciones" }
  };

  if (secciones[seccion]) {
    items[secciones[seccion].btnIndex].classList.add("activo");
    document.querySelectorAll(".seccion-alumno").forEach(sec => sec.classList.add("oculto"));
    document.getElementById(secciones[seccion].secId).classList.remove("oculto");

    if (seccion === "calificaciones") {
      renderizarSimulador();
      calcularPaseLibre();
    }
  }
}

function renderizarTareasAlumno() {
  const cont = document.getElementById("contenedorTareas");
  const contResumen = document.getElementById("resumenProximasTareas");
  
  if (!cont) return;

  const tareasPendientes = AppState.tareas.filter(t => !t.entregada);
  const tareasEntregadas = AppState.tareas.filter(t => t.entregada);

  // Actualizar contadores del resumen
  const pendientesBadge = document.getElementById("numTareasPendientes");
  const entregadasLabel = document.getElementById("numTareasEntregadasLabel");
  if (pendientesBadge) pendientesBadge.textContent = tareasPendientes.length;
  if (entregadasLabel) entregadasLabel.textContent = `${tareasEntregadas.length} entregada(s)`;

  // Lista completa de tareas en la sección Tareas
  cont.innerHTML = AppState.tareas.map(t => `
    <div class="tarea-card">
      <div class="tarea-card-top">
        <div>
          <span class="tarea-materia">${t.materia}</span>
          <h3 style="font-size: 16px; margin-top: 4px;">${t.titulo}</h3>
        </div>
        <span class="badge-rol ${t.entregada ? 'alumno' : 'maestro'}">
          ${t.entregada ? '✓ Entregada' : '⏳ Pendiente'}
        </span>
      </div>

      <p class="tarea-profesor">
        Subida por: <strong>${t.maestro}</strong> • Valor: <strong>${t.puntos} puntos</strong>
      </p>

      <div class="tarea-instrucciones">
        <strong>Instrucciones del profesor:</strong><br>
        ${t.instrucciones}
      </div>

      <div class="tarea-footer">
        <span class="tarea-fecha">
          <i class="fa-regular fa-clock"></i> Fecha límite: <strong>${t.fechaEntrega} a las ${t.horaEntrega} hrs</strong>
        </span>
        <button class="btn-entregar ${t.entregada ? 'entregada' : ''}" onclick="abrirModalEntrega('${t.id}')">
          ${t.entregada ? '✓ Tarea Enviada' : 'Subir Entrega →'}
        </button>
      </div>
    </div>
  `).join("");

  // Resumen en la primera pestaña
  if (contResumen) {
    contResumen.innerHTML = tareasPendientes.slice(0, 3).map(t => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--borde-suave);">
        <div>
          <strong>${t.titulo}</strong>
          <p style="font-size: 12px; color: var(--texto-secundario);">
            ${t.materia} • Prof. ${t.maestro} • Límite: <strong>${t.fechaEntrega}</strong>
          </p>
        </div>
        <button class="btn-entregar" style="padding: 6px 12px; font-size: 12px;" onclick="cambiarSeccionAlumno('tareas')">
          Ver Tarea
        </button>
      </div>
    `).join("");
  }
}

function renderizarCalendarioAlumno() {
  const grid = document.getElementById("diasCalendario");
  if (!grid) return;

  // Renderizar los 30 días de Noviembre 2026
  // El 1 de Noviembre de 2026 es Domingo
  let celdasHTML = "";

  for (let dia = 1; dia <= 30; dia++) {
    const diaStr = dia < 10 ? `0${dia}` : `${dia}`;
    const fechaCompleta = `2026-11-${diaStr}`;

    // Buscar si hay tareas cuya fecha de entrega coincida
    const tareasDelDia = AppState.tareas.filter(t => t.fechaEntrega === fechaCompleta);

    let tareasChips = "";
    tareasDelDia.forEach(t => {
      tareasChips += `
        <div class="chip-tarea-cal" title="${t.titulo} - ${t.maestro}" onclick="cambiarSeccionAlumno('tareas')">
          📌 ${t.materia.split(" ")[0]}: ${t.titulo.substring(0, 14)}...
        </div>
      `;
    });

    const esHoy = dia === 5; // Simulación del día actual

    celdasHTML += `
      <div class="dia-celda ${esHoy ? 'hoy' : ''}">
        <span class="dia-numero">${dia}</span>
        ${tareasChips}
      </div>
    `;
  }

  grid.innerHTML = celdasHTML;
}

function abrirModalEntrega(tareaId) {
  const tarea = AppState.tareas.find(t => t.id === tareaId);
  if (!tarea) return;

  if (tarea.entregada) {
    alert("Esta tarea ya fue entregada anteriormente.");
    return;
  }

  AppState.tareaSeleccionadaParaEntrega = tarea;
  document.getElementById("modalTareaTitulo").textContent = `Entregar: ${tarea.titulo}`;
  document.getElementById("modalTareaInstrucciones").innerHTML = `
    <strong>Materia:</strong> ${tarea.materia}<br>
    <strong>Maestro:</strong> ${tarea.maestro}<br>
    <strong>Fecha Límite:</strong> ${tarea.fechaEntrega} (${tarea.horaEntrega} hrs)<br><br>
    <strong>Instrucciones:</strong> ${tarea.instrucciones}
  `;
  document.getElementById("entregaComentario").value = "";
  document.getElementById("modalEntregaTarea").classList.remove("oculto");
}

function cerrarModalEntrega() {
  document.getElementById("modalEntregaTarea").classList.add("oculto");
  AppState.tareaSeleccionadaParaEntrega = null;
}

function completarEntrega(e) {
  e.preventDefault();
  if (!AppState.tareaSeleccionadaParaEntrega) return;

  const comentario = document.getElementById("entregaComentario").value.trim();
  const tarea = AppState.tareaSeleccionadaParaEntrega;
  tarea.entregada = true;

  // Registrar en entregas del maestro
  AppState.entregas.push({
    id: "e_" + Date.now(),
    alumno: AppState.usuarioActual.nombre,
    email: AppState.usuarioActual.email,
    tareaTitulo: tarea.titulo,
    materia: tarea.materia,
    fechaEnvio: "Hoy a las 10:15",
    comentario: comentario || "Entrega realizada por el alumno.",
    archivo: "Trabajo_Adjunto.pdf",
    calificacion: "Pendiente",
    retroalimentacion: "En espera de revisión por el docente."
  });

  renderizarTareasAlumno();
  renderizarEntregasMaestro();
  cerrarModalEntrega();

  alert(`¡Tarea enviada con éxito al profesor ${tarea.maestro}!`);
}

// ==========================================================
// 4. FUNCIONALIDADES DEL SIMULADOR ("¿CON CUÁNTO PASO?")
// ==========================================================
function cambiarMetaSimulador(nuevaMeta) {
  AppState.metaSimulador = parseFloat(nuevaMeta);
  const label = document.getElementById("labelMetaActiva");
  if (label) label.textContent = AppState.metaSimulador.toFixed(1);
  
  // Actualizar botones
  document.querySelectorAll(".btn-meta").forEach(btn => {
    if (parseFloat(btn.dataset.meta) === AppState.metaSimulador) {
      btn.classList.add("activo");
    } else {
      btn.classList.remove("activo");
    }
  });

  renderizarSimulador();
}

function ajustarP2Simulado(materiaId, valor) {
  const num = parseFloat(valor);
  const mat = AppState.materiasSimulador.find(m => m.id === materiaId);
  if (mat) {
    mat.p2Simulado = num;
    renderizarSimulador();
  }
}

function restablecerSimulador() {
  AppState.metaSimulador = 6.0;
  AppState.materiasSimulador.forEach(m => m.p2Simulado = null);
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

  const meta = AppState.metaSimulador;
  const puntosTotales = meta * 3; // (P1 + P2 + P3) >= meta * 3

  cont.innerHTML = AppState.materiasSimulador.map(m => {
    const p1 = m.p1;
    const p2 = m.p2Simulado;

    // Si aún no simula P2: promedio necesario en P2 y P3
    const faltanP2P3 = Math.max(0, puntosTotales - p1);
    const promNecesarioP2P3 = Number((faltanP2P3 / 2).toFixed(1));

    // Si ya simuló P2: necesario en P3
    let necesarioP3 = null;
    if (p2 !== null) {
      necesarioP3 = Number(Math.max(0, puntosTotales - p1 - p2).toFixed(1));
    }

    const testScore = p2 !== null ? necesarioP3 : promNecesarioP2P3;

    let badgeClass = "verde";
    let badgeTexto = "Muy accesible";
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
        <!-- Info Materia y Parciales -->
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

        <!-- Slider Interactivo de Parcial 2 -->
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

        <!-- Dictamen y Resultado -->
        <div class="resultado-sim-box">
          <span class="meta-label">Para promediar ${meta.toFixed(1)}:</span>
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
    // Solo P1
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
