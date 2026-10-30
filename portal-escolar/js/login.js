let rolActivo = null;

// Paso 1: Elegir rol
function elegirRol(rol) {
  rolActivo = rol;
  document.getElementById('stepRoleSelect').classList.add('oculto');
  document.getElementById('stepEmailLogin').classList.remove('oculto');

  const titulo = document.getElementById('tituloLogin');
  const sub = document.getElementById('subtituloLogin');
  const badge = document.getElementById('badgeRolActivo');
  const logo = document.getElementById('logoRol');
  const input = document.getElementById('correoInput');
  const btn = document.getElementById('btnIngresar');
  const btnEj = document.getElementById('btnEjemploRol');

  if (rol === 'maestro') {
    badge.textContent = '👨‍🏫 Modo Maestro';
    badge.className = 'badge-rol badge-maestro';
    logo.className = 'logo-circulo morado';
    logo.innerHTML = '<i class="fa-solid fa-chalkboard-user"></i>';
    titulo.textContent = 'Acceso a Maestros';
    sub.textContent = 'Ingresa tu correo institucional docente para gestionar tus clases y tareas.';
    input.placeholder = 'Maestro@cetis101.org';
    btn.textContent = 'Entrar al Menú de Maestro';
    btn.className = 'btn-ingresar maestro';
    btnEj.innerHTML = '<strong>Maestro@cetis101.org</strong><br><small>Prof. Roberto Mendoza • CETIS 101</small>';
  } else {
    badge.textContent = '👨‍🎓 Modo Alumno';
    badge.className = 'badge-rol badge-alumno';
    logo.className = 'logo-circulo';
    logo.innerHTML = '<i class="fa-solid fa-graduation-cap"></i>';
    titulo.textContent = 'Acceso a Alumnos';
    sub.textContent = 'Ingresa tu correo institucional escolar para consultar tus materias y actividades.';
    input.placeholder = 'Alumno@cetis101.org';
    btn.textContent = 'Entrar al Menú de Alumno';
    btn.className = 'btn-ingresar';
    btnEj.innerHTML = '<strong>Alumno@cetis101.org</strong><br><small>Carlos Ramírez • CETIS 101</small>';
  }

  input.value = '';
  document.getElementById('mensajeValidacion').classList.add('oculto');
  document.getElementById('iconoCheck').classList.add('oculto');
}

function volverASeleccionRol() {
  rolActivo = null;
  document.getElementById('stepEmailLogin').classList.add('oculto');
  document.getElementById('stepRoleSelect').classList.remove('oculto');
}

function llenarEjemplo() {
  const correo = rolActivo === 'maestro' ? 'Maestro@cetis101.org' : 'Alumno@cetis101.org';
  document.getElementById('correoInput').value = correo;
  validarEnVivo();
}

// Validación institucional en tiempo real
function validarEnVivo() {
  const correo = document.getElementById('correoInput').value.trim();
  const msg = document.getElementById('mensajeValidacion');
  const check = document.getElementById('iconoCheck');

  if (!correo) {
    msg.classList.add('oculto');
    check.classList.add('oculto');
    return false;
  }

  const clean = correo.toLowerCase();

  // Casos directos solicitados
  if (rolActivo === 'maestro' && clean === 'maestro@cetis101.org') {
    msg.textContent = '✅ ¡Correo institucional de Maestro válido! • CETIS 101';
    msg.className = 'mensaje-validacion valido';
    msg.classList.remove('oculto');
    check.classList.remove('oculto');
    return true;
  }

  if (rolActivo === 'alumno' && clean === 'alumno@cetis101.org') {
    msg.textContent = '✅ ¡Correo institucional de Alumno válido! • CETIS 101';
    msg.className = 'mensaje-validacion valido';
    msg.classList.remove('oculto');
    check.classList.remove('oculto');
    return true;
  }

  // Validación de faltas
  let faltas = [];
  if (!correo.includes('@')) faltas.push('Te falta @');
  if (!correo.includes('.edu') && !correo.includes('.org')) faltas.push('Debe ser institucional (.edu.mx o .org)');
  if (!correo.includes('cetis101') && !correo.includes('cbtis') && !correo.includes('alumno') && !correo.includes('docente')) {
    faltas.push('Indica tu institución (ej. cetis101)');
  }

  if (faltas.length > 0) {
    msg.textContent = '⚠️ ' + faltas.join(' | ');
    msg.className = 'mensaje-validacion error';
    msg.classList.remove('oculto');
    check.classList.add('oculto');
    return false;
  }

  msg.textContent = '✅ ¡Correo institucional reconocido!';
  msg.className = 'mensaje-validacion valido';
  msg.classList.remove('oculto');
  check.classList.remove('oculto');
  return true;
}

function iniciarSesion() {
  if (!validarEnVivo()) {
    alert('Por favor ingresa un correo institucional válido.');
    return;
  }

  const correo = document.getElementById('correoInput').value.trim();
  localStorage.setItem('sesion_activa', JSON.stringify({ correo, rol: rolActivo }));

  // Si estamos en la versión todo-en-uno (SPA), cambiar de vista en la misma pantalla sin redirección 404
  const pantallaMaestro = document.getElementById('pantallaMaestro');
  const pantallaAlumno = document.getElementById('pantallaAlumno');
  const pantallaAuth = document.getElementById('pantallaAuth');

  if (pantallaMaestro && pantallaAlumno && pantallaAuth) {
    pantallaAuth.classList.add('oculto');
    if (rolActivo === 'maestro') {
      pantallaMaestro.classList.remove('oculto');
      pantallaAlumno.classList.add('oculto');
      if (typeof cambiarPestanaMaestro === 'function') cambiarPestanaMaestro('clases');
    } else {
      pantallaAlumno.classList.remove('oculto');
      pantallaMaestro.classList.add('oculto');
      if (typeof cambiarSeccionAlumno === 'function') cambiarSeccionAlumno('resumen');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Redireccionar al menú correspondiente si son archivos separados
  if (rolActivo === 'maestro') {
    window.location.href = 'maestro.html';
  } else {
    window.location.href = 'alumno.html';
  }
}

function autoLogin(correo, rol) {
  elegirRol(rol);
  document.getElementById('correoInput').value = correo;
  validarEnVivo();
  iniciarSesion();
}
