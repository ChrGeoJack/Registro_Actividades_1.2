# 🏫 Portal Escolar CETIS 101 (Maestro y Alumno)

Proyecto escolar web completo en archivos independientes `.html`, `.css` y `.js`, listo para abrir y editar en **Visual Studio Code**.

---

## 📁 Estructura de la Carpeta

```text
portal-escolar/
│
├── index.html            <- 🌟 APLICACIÓN COMPLETA UNIFICADA (Login, Maestro y Alumno en una sola página sin errores 404)
├── maestro.html          <- Menú del Maestro independiente
├── alumno.html           <- Menú del Alumno independiente
│
├── css/
│   ├── estilos.css       <- Estilos globales unificados para index.html
│   ├── login.css         <- Estilos del selector de roles y login
│   ├── maestro.css       <- Estilos del portal docente y pase de lista
│   └── alumno.css        <- Estilos del portal del alumno, tareas y calendario
│
└── js/
    ├── app.js            <- Lógica unificada para index.html (sin redirecciones que fallen)
    ├── login.js          <- Validación institucional y navegación inteligente
    ├── maestro.js        <- Gestión de clases, publicación de tareas y pase de lista
    └── alumno.js         <- Sincronización de tareas, calendario de entregas y simulador
```

---

## 🚀 ¿Cómo abrirlo en Visual Studio Code?

1. Abre **Visual Studio Code**.
2. Ve al menú superior: **File (Archivo) -> Open Folder (Abrir carpeta)** y selecciona la carpeta `portal-escolar`.
3. Para probar la aplicación con recarga en vivo:
   - Instala la extensión **Live Server** (creada por *Ritwick Dey*) en Visual Studio Code.
   - Haz clic derecho sobre el archivo `index.html` y selecciona **"Open with Live Server"**.
   - ¡Listo! Se abrirá automáticamente en tu navegador web.

---

## 🔑 Cuentas de Acceso Rápido Incluidas:

- **👨‍🏫 Maestro**: `Maestro@cetis101.org`
  - Puedes crear múltiples clases (ej. Matemáticas V, Cálculo, Física II).
  - Al publicar una tarea, indicas instrucciones, fecha y hora límite de entrega, materia y tu nombre.
  - La tarea se agenda automáticamente en el Calendario del Alumno.
  - Realizas el pase de lista de tus alumnos (Presente, Falta, etc.).

- **👨‍🎓 Alumno**: `Alumno@cetis101.org`
  - Consulta las tareas subidas por cada maestro.
  - Revisa el **Calendario Escolar** con las fechas de entrega.
  - Consulta sus faltas acumuladas y su margen antes de perder derecho.
  - Utiliza el simulador de calificaciones: *¿Con cuánto paso el semestre?*.
