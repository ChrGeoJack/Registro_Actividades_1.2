import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  PlusCircle,
  FileCheck,
  CalendarCheck,
  Award,
  Users,
  CheckCircle2,
  Clock,
  BookOpen,
  MessageSquare,
  Sparkles,
  School,
  Layers,
  GraduationCap,
  Calendar,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    subjects,
    classes,
    tasks,
    studentsList,
    createTask,
    createClass,
    gradeTaskSubmission,
    recordStudentAttendance,
    updateStudentGrade,
    grades,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'clases' | 'crear' | 'revisar' | 'asistencia' | 'calificador'>('clases');

  // Form: Create Class
  const [classForm, setClassForm] = useState({
    name: '',
    subjectName: subjects[0]?.name || 'Matemáticas',
    code: 'MAT-5A',
    schedule: 'Lun, Mie • 08:00 - 09:40 hrs',
    color: '#3B82F6',
  });
  const [classSuccess, setClassSuccess] = useState(false);

  // Form: Create Task
  const [taskForm, setTaskForm] = useState({
    classId: classes[0]?.id || 'cls-1',
    title: '',
    subjectName: classes[0]?.subjectName || subjects[0]?.name || 'Matemáticas',
    description: '',
    deadlineDate: '2026-10-31',
    deadlineTime: '23:59',
    partial: 1 as 1 | 2 | 3,
    maxPoints: 10,
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  // Review Submissions
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [gradingEmail, setGradingEmail] = useState<string>('');
  const [gradeInput, setGradeInput] = useState<number>(10);
  const [feedbackInput, setFeedbackInput] = useState<string>('Buen trabajo, cumple con los criterios.');
  const [gradeSuccess, setGradeSuccess] = useState(false);

  // Form: Attendance per Student
  const [attClassId, setAttClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [attDate, setAttDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<
    Record<string, { status: 'presente' | 'falta' | 'retardo' | 'justificada'; notes: string }>
  >(() => {
    const initial: Record<string, any> = {};
    studentsList.forEach((std) => {
      initial[std.email] = { status: 'presente', notes: '' };
    });
    return initial;
  });
  const [attSuccess, setAttSuccess] = useState(false);

  // Handle Create Class
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name.trim()) {
      alert('Escribe el nombre de la clase o grupo.');
      return;
    }
    createClass({
      name: classForm.name.trim(),
      subjectName: classForm.subjectName,
      teacherName: currentUser?.name || 'Prof. Roberto Mendoza',
      teacherEmail: currentUser?.email || 'Maestro@cetis101.org',
      code: classForm.code.trim().toUpperCase(),
      schedule: classForm.schedule.trim(),
      color: classForm.color,
    });
    setClassSuccess(true);
    setClassForm({
      name: '',
      subjectName: subjects[0]?.name || 'Matemáticas',
      code: 'NUEVA-CLASE',
      schedule: 'Mar, Jue • 10:00 - 11:40 hrs',
      color: '#10B981',
    });
    setTimeout(() => setClassSuccess(false), 3000);
  };

  // Handle task create
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !taskForm.description.trim()) {
      alert('Por favor completa el título y las instrucciones.');
      return;
    }

    const selectedCls = classes.find((c) => c.id === taskForm.classId);
    const chosenSubject = selectedCls ? selectedCls.subjectName : taskForm.subjectName;
    const matchingSubject = subjects.find((s) => s.name === chosenSubject) || subjects[0];

    createTask({
      title: taskForm.title.trim(),
      subjectId: matchingSubject.id,
      subjectName: chosenSubject,
      teacherName: currentUser?.name || 'Prof. Roberto Mendoza',
      classId: taskForm.classId,
      className: selectedCls ? selectedCls.name : 'Grupo General',
      description: taskForm.description.trim(),
      deadlineDate: taskForm.deadlineDate,
      deadlineTime: taskForm.deadlineTime,
      partial: taskForm.partial,
      maxPoints: Number(taskForm.maxPoints) || 10,
    });

    setCreateSuccess(true);
    setTaskForm({
      classId: classes[0]?.id || 'cls-1',
      title: '',
      subjectName: classes[0]?.subjectName || subjects[0]?.name || 'Matemáticas',
      description: '',
      deadlineDate: '2026-11-05',
      deadlineTime: '23:59',
      partial: 1,
      maxPoints: 10,
    });
    setTimeout(() => setCreateSuccess(false), 3000);
  };

  // Handle grade submission
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !gradingEmail) return;
    gradeTaskSubmission(selectedTaskId, gradingEmail, Number(gradeInput), feedbackInput.trim());
    setGradeSuccess(true);
    setTimeout(() => setGradeSuccess(false), 3000);
  };

  // Handle Save Attendance for Class
  const handleSaveClassAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCls = classes.find((c) => c.id === attClassId);
    const subjectName = selectedCls?.subjectName || 'Matemáticas';
    const teacherName = currentUser?.name || 'Prof. Roberto Mendoza';

    studentsList.forEach((std) => {
      const rec = studentAttendanceMap[std.email] || { status: 'presente', notes: '' };
      recordStudentAttendance(
        attDate,
        subjectName,
        teacherName,
        std.email,
        std.name,
        rec.status,
        rec.notes || 'Pase de lista regular'
      );
    });

    setAttSuccess(true);
    setTimeout(() => setAttSuccess(false), 3000);
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              👨‍🏫 Menú de Maestro
            </span>
            <span className="text-xs text-gray-400">
              {currentUser?.name} • {currentUser?.institution || 'CETIS 101'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-gray-800">
            Control Académico de Clases y Tareas
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Crea clases para diferentes materias y grupos, sube tareas con instrucciones y fechas límite, y realiza el pase de lista.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('clases')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'clases' ? 'bg-white text-purple-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mis Clases ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('crear')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'crear' ? 'bg-white text-purple-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            + Subir Tarea
          </button>
          <button
            onClick={() => setActiveTab('asistencia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'asistencia' ? 'bg-white text-purple-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pase de Lista
          </button>
          <button
            onClick={() => setActiveTab('revisar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'revisar' ? 'bg-white text-purple-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Revisar Entregas
          </button>
          <button
            onClick={() => setActiveTab('calificador')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'calificador' ? 'bg-white text-purple-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Acta de Notas
          </button>
        </div>
      </div>

      {/* TAB 1: GESTIÓN DE CLASES (VARIAS CLASES POR PROFE) */}
      {activeTab === 'clases' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of Classes */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-gray-800 text-lg">
                  Clases y Materias que Impartes
                </h3>
                <span className="text-xs text-gray-400">
                  {classes.length} clases activas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 uppercase tracking-wide">
                          {cls.subjectName}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 font-mono">
                          {cls.code}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-gray-900 mb-1">{cls.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">
                        Docente: <strong>{cls.teacherName}</strong>
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{cls.schedule}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-600 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {cls.studentsCount} alumnos inscritos
                      </span>
                      <button
                        onClick={() => {
                          setTaskForm((prev) => ({
                            ...prev,
                            classId: cls.id,
                            subjectName: cls.subjectName,
                          }));
                          setActiveTab('crear');
                        }}
                        className="text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
                      >
                        + Asignar tarea
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create New Class Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-4">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-800 text-base">Crear Nueva Clase</h4>
                  <p className="text-xs text-gray-400">Para impartir a otro grupo o materia</p>
                </div>
              </div>

              {classSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>¡Clase creada y agregada a tu lista!</span>
                </div>
              )}

              <form onSubmit={handleCreateClass} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nombre de la Clase y Grupo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Matemáticas V - Grupo 5°C"
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Materia</label>
                  <select
                    value={classForm.subjectName}
                    onChange={(e) => setClassForm({ ...classForm, subjectName: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Código de la Clase</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. MAT-5C"
                    value={classForm.code}
                    onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Horario de Clase</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Lun, Mie, Vie • 08:00 - 09:40 hrs"
                    value={classForm.schedule}
                    onChange={(e) => setClassForm({ ...classForm, schedule: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Registrar Clase</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBIR TAREAS CON INSTRUCCIONES, FECHA DE ENTREGA, MAESTRO Y MATERIA */}
      {activeTab === 'crear' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs max-w-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-800 text-lg">Subir Tarea para Alumnos</h3>
              <p className="text-xs text-gray-500">
                La tarea se colocará automáticamente en el <strong>Calendario Escolar</strong> y en el apartado de <strong>Tareas</strong> del alumno con tu nombre y materia.
              </p>
            </div>
          </div>

          {createSuccess && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¡Tarea publicada con éxito! Aparece ya en el calendario de los alumnos.</span>
            </div>
          )}

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Clase y Grupo Destino
                </label>
                <select
                  value={taskForm.classId}
                  onChange={(e) => {
                    const chosenId = e.target.value;
                    const c = classes.find((cl) => cl.id === chosenId);
                    setTaskForm({
                      ...taskForm,
                      classId: chosenId,
                      subjectName: c ? c.subjectName : taskForm.subjectName,
                    });
                  }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 font-semibold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.subjectName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Qué maestro la sube
                </label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser?.name || 'Prof. Roberto Mendoza'} (${currentUser?.institution || 'CETIS 101'})`}
                  className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-600 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Título de la Tarea
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Taller Práctico: Leyes de Conservación y Movimiento"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Instrucciones Detalladas para el Alumno
              </label>
              <textarea
                rows={4}
                required
                placeholder="Escribe paso a paso las instrucciones de la actividad, qué entregar (PDF, Word, Fotos de la libreta), criterios de evaluación o enlaces de apoyo..."
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Fecha de Entrega (Se coloca en el Calendario)
                </label>
                <input
                  type="date"
                  required
                  value={taskForm.deadlineDate}
                  onChange={(e) => setTaskForm({ ...taskForm, deadlineDate: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Hora Límite
                </label>
                <input
                  type="time"
                  required
                  value={taskForm.deadlineTime}
                  onChange={(e) => setTaskForm({ ...taskForm, deadlineTime: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Puntaje Máximo
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={taskForm.maxPoints}
                  onChange={(e) => setTaskForm({ ...taskForm, maxPoints: Number(e.target.value) })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 font-bold"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar Tarea en Calendario y Portal de Alumnos</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ASISTENCIAS DE CADA MATERIA (PASE DE LISTA POR ALUMNO) */}
      {activeTab === 'asistencia' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-800 text-lg">
                  Pase de Lista y Asistencia por Alumno
                </h3>
                <p className="text-xs text-gray-500">
                  Registra la asistencia diaria para cada alumno de tu clase. Se reflejará en su historial y semáforo de faltas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Clase / Materia</label>
                <select
                  value={attClassId}
                  onChange={(e) => setAttClassId(e.target.value)}
                  className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Fecha</label>
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                />
              </div>
            </div>
          </div>

          {attSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¡Pase de lista guardado con éxito para todos los alumnos seleccionados!</span>
            </div>
          )}

          <form onSubmit={handleSaveClassAttendance}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="p-3 font-bold text-gray-600">Alumno</th>
                    <th className="p-3 font-bold text-gray-600">Correo Institucional</th>
                    <th className="p-3 font-bold text-gray-600 text-center">Estatus de Asistencia</th>
                    <th className="p-3 font-bold text-gray-600">Observaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {studentsList.map((std) => {
                    const currentStatus = studentAttendanceMap[std.email]?.status || 'presente';
                    const currentNotes = studentAttendanceMap[std.email]?.notes || '';

                    return (
                      <tr key={std.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-gray-800 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                            {std.avatarInitial}
                          </div>
                          <span>{std.name}</span>
                        </td>
                        <td className="p-3 text-gray-500 font-mono text-[11px]">{std.email}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {[
                              { id: 'presente', label: 'Presente', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                              { id: 'falta', label: 'Falta', color: 'bg-red-100 text-red-800 border-red-300' },
                              { id: 'retardo', label: 'Retardo', color: 'bg-amber-100 text-amber-800 border-amber-300' },
                              { id: 'justificada', label: 'Justificada', color: 'bg-blue-100 text-blue-800 border-blue-300' },
                            ].map((st) => (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() =>
                                  setStudentAttendanceMap((prev) => ({
                                    ...prev,
                                    [std.email]: {
                                      status: st.id as any,
                                      notes: prev[std.email]?.notes || '',
                                    },
                                  }))
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                  currentStatus === st.id
                                    ? st.color + ' ring-2 ring-purple-400 font-black'
                                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {st.label}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            placeholder="Ej. Participó en clase / Justificante"
                            value={currentNotes}
                            onChange={(e) =>
                              setStudentAttendanceMap((prev) => ({
                                ...prev,
                                [std.email]: {
                                  status: prev[std.email]?.status || 'presente',
                                  notes: e.target.value,
                                },
                              }))
                            }
                            className="w-full p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-5 border-t border-gray-100 mt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Pase de Lista de la Clase</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: REVISAR ENTREGAS Y CALIFICAR */}
      {activeTab === 'revisar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Tasks */}
          <div className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs">
            <h3 className="font-extrabold text-gray-800 text-base mb-3">Selecciona una Tarea</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {tasks.map((t) => {
                const subCount = Object.keys(t.submissions).length;
                const isSelected = t.id === selectedTaskId;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTaskId(t.id);
                      const firstSub = Object.keys(t.submissions)[0];
                      if (firstSub) {
                        setGradingEmail(firstSub);
                        setGradeInput(t.submissions[firstSub].grade ?? 10);
                        setFeedbackInput(t.submissions[firstSub].feedback || '');
                      } else {
                        setGradingEmail('');
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50/50 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[10px] font-extrabold text-purple-700 uppercase">
                        {t.subjectName}
                      </span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                        {subCount} entrega(s)
                      </span>
                    </div>
                    <p className="font-bold text-xs text-gray-800 mt-1">{t.title}</p>
                    <p className="text-[11px] text-gray-400 mt-1">Límite: {t.deadlineDate}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submissions of selected task */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-extrabold text-gray-800 text-base">
                  Entregas recibidas: {selectedTask?.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedTask?.subjectName} • Valor: {selectedTask?.maxPoints} pts
                </p>
              </div>
            </div>

            {selectedTask && Object.keys(selectedTask.submissions).length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                Aún no hay entregas de alumnos para esta tarea. Cuando un alumno entregue su archivo o comentario, aparecerá aquí de inmediato.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  {Object.entries(selectedTask.submissions).map(([studentEmail, sub]) => {
                    const isSelectedForGrading = gradingEmail === studentEmail;
                    return (
                      <div
                        key={studentEmail}
                        onClick={() => {
                          setGradingEmail(studentEmail);
                          setGradeInput(sub.grade ?? 10);
                          setFeedbackInput(sub.feedback || 'Excelente trabajo.');
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelectedForGrading
                            ? 'border-purple-500 bg-purple-50/40'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-bold text-sm text-gray-800">{sub.studentName}</p>
                            <p className="text-xs text-gray-400">{sub.studentEmail}</p>
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              sub.grade !== undefined
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.grade !== undefined ? `Calificada: ${sub.grade}/10` : 'Pendiente de calificar'}
                          </span>
                        </div>

                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-700">
                          <p className="font-medium text-gray-500 text-[11px] mb-0.5">Contenido entregado:</p>
                          <p>{sub.content}</p>
                          {sub.attachmentName && (
                            <p className="text-blue-600 font-semibold mt-1">
                              📎 {sub.attachmentName}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Form to grade the selected student */}
                {gradingEmail && (
                  <form onSubmit={handleGradeSubmit} className="p-5 bg-purple-50/60 rounded-xl border border-purple-200 space-y-4">
                    <h4 className="font-bold text-sm text-purple-950 flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span>Calificar a: {selectedTask.submissions[gradingEmail]?.studentName}</span>
                    </h4>

                    {gradeSuccess && (
                      <p className="text-xs text-emerald-700 font-bold bg-emerald-100 p-2 rounded-lg">
                        ✅ ¡Calificación y retroalimentación guardadas con éxito!
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Calificación (0 - {selectedTask.maxPoints})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max={selectedTask.maxPoints}
                          value={gradeInput}
                          onChange={(e) => setGradeInput(parseFloat(e.target.value))}
                          className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Retroalimentación para el Alumno
                        </label>
                        <input
                          type="text"
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          placeholder="Escribe tus observaciones para el alumno..."
                          className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Guardar Calificación
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: ACTA DE CALIFICACIONES GENERAL */}
      {activeTab === 'calificador' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-gray-800 text-base">Acta de Calificaciones</h3>
              <p className="text-xs text-gray-500">
                Calificaciones de parciales editables por materia.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {studentsList.map((std) => {
              const stdGrades = grades[std.email] || [];
              return (
                <div key={std.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/40">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {std.avatarInitial}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">{std.name}</h4>
                        <p className="text-xs text-gray-400">{std.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs bg-white rounded-lg border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="p-2.5 font-semibold text-gray-600">Materia</th>
                          <th className="p-2.5 font-semibold text-gray-600">Parcial 1</th>
                          <th className="p-2.5 font-semibold text-gray-600">Parcial 2</th>
                          <th className="p-2.5 font-semibold text-gray-600">Parcial 3</th>
                          <th className="p-2.5 font-semibold text-gray-600">Promedio</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stdGrades.map((g) => {
                          const validScores = [g.p1, g.p2, g.p3].filter((v): v is number => v !== null);
                          const avg = validScores.length
                            ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
                            : '—';

                          return (
                            <tr key={g.subjectId}>
                              <td className="p-2.5 font-semibold text-gray-800">{g.subjectName}</td>
                              <td className="p-2.5">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  value={g.p1 ?? ''}
                                  onChange={(e) =>
                                    updateStudentGrade(
                                      std.email,
                                      g.subjectId,
                                      'p1',
                                      e.target.value ? parseFloat(e.target.value) : null
                                    )
                                  }
                                  className="w-16 p-1 border rounded text-xs font-bold text-gray-800"
                                />
                              </td>
                              <td className="p-2.5">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  placeholder="—"
                                  value={g.p2 ?? ''}
                                  onChange={(e) =>
                                    updateStudentGrade(
                                      std.email,
                                      g.subjectId,
                                      'p2',
                                      e.target.value ? parseFloat(e.target.value) : null
                                    )
                                  }
                                  className="w-16 p-1 border rounded text-xs font-bold text-gray-800"
                                />
                              </td>
                              <td className="p-2.5">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  placeholder="—"
                                  value={g.p3 ?? ''}
                                  onChange={(e) =>
                                    updateStudentGrade(
                                      std.email,
                                      g.subjectId,
                                      'p3',
                                      e.target.value ? parseFloat(e.target.value) : null
                                    )
                                  }
                                  className="w-16 p-1 border rounded text-xs font-bold text-gray-800"
                                />
                              </td>
                              <td className="p-2.5 font-bold text-blue-600">{avg}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
