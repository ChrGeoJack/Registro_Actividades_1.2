import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  Calendar,
  FileText,
  Search,
  Upload,
  Award,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

interface TareasSectionProps {
  onOpenTaskModal: (taskId: string) => void;
}

export const TareasSection: React.FC<TareasSectionProps> = ({ onOpenTaskModal }) => {
  const { tasks, currentUser, subjects } = useSchool();
  const [filterTab, setFilterTab] = useState<'todas' | 'pendientes' | 'entregadas' | 'calificadas'>('todas');
  const [selectedSubject, setSelectedSubject] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const email = currentUser?.email || '';

  const filteredTasks = tasks.filter((t) => {
    const isSubmitted = !!t.submissions[email];
    const isGraded = isSubmitted && t.submissions[email]?.grade !== undefined;

    // Filter tab
    if (filterTab === 'pendientes' && isSubmitted) return false;
    if (filterTab === 'entregadas' && !isSubmitted) return false;
    if (filterTab === 'calificadas' && !isGraded) return false;

    // Subject
    if (selectedSubject !== 'todos' && t.subjectId !== selectedSubject) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.subjectName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const pendingList = tasks.filter((t) => !t.submissions[email]);
  const submittedList = tasks.filter((t) => !!t.submissions[email]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Mis Tareas Escolares</h2>
          <p className="text-xs text-gray-500">
            Revisa tareas asignadas por tus profesores, sube tus evidencias y consulta calificaciones.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setFilterTab('todas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'todas' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setFilterTab('pendientes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'pendientes'
                ? 'bg-amber-100 text-amber-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Pendientes ({pendingList.length})
          </button>
          <button
            onClick={() => setFilterTab('entregadas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'entregadas'
                ? 'bg-emerald-100 text-emerald-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Entregadas ({submittedList.length})
          </button>
          <button
            onClick={() => setFilterTab('calificadas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'calificadas'
                ? 'bg-blue-100 text-blue-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Calificadas
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative col-span-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar tarea por título o materia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full py-2.5 px-3 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="todos">Todas las materias</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two Column Layout matching User Prototype: Entregadas vs Pendientes (when in 'todas') */}
      {filterTab === 'todas' && !searchQuery && selectedSubject === 'todos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Entregadas */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#10B981] text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span>Entregadas ({submittedList.length})</span>
              </h3>
              <span className="text-xs text-gray-400">Parcial 1</span>
            </div>

            {submittedList.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No has entregado tareas aún.</p>
            ) : (
              <div className="space-y-3">
                {submittedList.map((t) => {
                  const sub = t.submissions[email];
                  const hasGrade = sub?.grade !== undefined;
                  return (
                    <div
                      key={t.id}
                      onClick={() => onOpenTaskModal(t.id)}
                      className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/60 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                              {t.subjectName}
                            </span>
                            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                              👨‍🏫 {t.teacherName}
                            </span>
                            {t.className && (
                              <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                {t.className}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-800 text-sm mt-1.5 group-hover:text-emerald-700 transition-colors">
                            {t.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{t.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Entregado: {sub?.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('es-MX') : 'Fecha no registrada'}
                            </span>
                            {sub?.attachmentName && (
                              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <FileText className="w-3 h-3" />
                                {sub.attachmentName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#10B981] inline-block mb-1.5">
                            {hasGrade ? `Calificada: ${sub.grade}/10` : 'Entregada'}
                          </span>
                          {hasGrade && (
                            <p className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                              <Award className="w-3.5 h-3.5" />
                              Nota: {sub.grade}
                            </p>
                          )}
                        </div>
                      </div>

                      {sub?.feedback && (
                        <div className="mt-3 pt-2.5 border-t border-emerald-100 text-xs text-gray-600 flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Comentario del profesor:</strong> "{sub.feedback}"
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Columna Pendientes */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#F59E0B] text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F59E0B]" />
                <span>Pendientes ({pendingList.length})</span>
              </h3>
              <span className="text-xs text-gray-400">Próximos vencimientos</span>
            </div>

            {pendingList.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                ¡Excelente! Todas tus tareas están entregadas.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingList.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onOpenTaskModal(t.id)}
                    className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 hover:bg-amber-50/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 uppercase tracking-wide">
                            {t.subjectName}
                          </span>
                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                            👨‍🏫 {t.teacherName}
                          </span>
                          {t.className && (
                            <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                              {t.className}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mt-1.5 group-hover:text-amber-800 transition-colors">
                          {t.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed bg-white/70 p-2 rounded-lg border border-amber-100">
                          <strong>Instrucciones:</strong> {t.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-900 font-bold">
                          <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>
                            Fecha de entrega: {t.deadlineDate} • {t.deadlineTime} hrs
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-[#F59E0B] inline-block mb-2">
                          Pendiente
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenTaskModal(t.id);
                          }}
                          className="w-full text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-1 px-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Entregar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Single grid view when filtered */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.length === 0 ? (
            <div className="col-span-2 bg-white p-12 text-center rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
              No se encontraron tareas con los filtros seleccionados.
            </div>
          ) : (
            filteredTasks.map((t) => {
              const isSubmitted = !!t.submissions[email];
              const sub = t.submissions[email];
              const hasGrade = sub?.grade !== undefined;

              return (
                <div
                  key={t.id}
                  onClick={() => onOpenTaskModal(t.id)}
                  className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-sm ${
                    isSubmitted ? 'border-emerald-200' : 'border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                        isSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.subjectName}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isSubmitted ? 'bg-emerald-100 text-[#10B981]' : 'bg-amber-100 text-[#F59E0B]'
                      }`}
                    >
                      {isSubmitted ? (hasGrade ? `Calificada: ${sub.grade}/10` : 'Entregada') : 'Pendiente'}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-800 text-base mt-2">{t.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{t.description}</p>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Límite: {t.deadlineDate} ({t.deadlineTime})
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTaskModal(t.id);
                      }}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      {isSubmitted ? 'Ver detalle' : 'Subir entrega'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
