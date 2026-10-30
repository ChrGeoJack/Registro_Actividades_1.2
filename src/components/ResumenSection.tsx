import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  TrendingUp,
  Clock,
  Calendar,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Calculator,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ResumenSectionProps {
  onOpenTaskModal: (taskId: string) => void;
}

export const ResumenSection: React.FC<ResumenSectionProps> = ({ onOpenTaskModal }) => {
  const { getStudentTasks, getStudentAverage, attendance, setActiveSection, notifications } = useSchool();

  const { submitted, pending } = getStudentTasks();
  const { p1Avg, generalAvg } = getStudentAverage();
  const p1Attendance = attendance[0] || { totalDays: 25, attended: 23, absences: 2, percentage: 92 };

  const urgentTasks = pending.slice(0, 3);
  const urgentAlert = notifications.find((n) => n.type === 'urgent');

  return (
    <div className="space-y-6">
      {/* Urgent Alert Banner */}
      {urgentAlert && (
        <div className="bg-amber-50 border-l-4 border-[#F59E0B] p-4 rounded-xl flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-amber-900">{urgentAlert.title}</p>
              <p className="text-xs text-amber-800 mt-0.5">{urgentAlert.message}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('tareas')}
            className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer"
          >
            Ver Tareas
          </button>
        </div>
      )}

      {/* Tarjetas Superiores (Matching prototype structure) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Promedio General */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <small className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Promedio General
            </small>
            <div className="p-2 rounded-lg bg-emerald-50 text-[#10B981]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 my-2">{generalAvg.toFixed(1)}</h2>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Vas aprobando satisfactoriamente</span>
          </div>
        </div>

        {/* Tareas Pendientes */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <small className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tareas Pendientes
            </small>
            <div className="p-2 rounded-lg bg-amber-50 text-[#F59E0B]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F59E0B] my-2">{pending.length}</h2>
          <p className="text-xs text-gray-500 font-medium">
            {submitted.length} entregadas en total
          </p>
        </div>

        {/* Asistencia Parcial 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <small className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Asistencia Parcial 1
            </small>
            <div className="p-2 rounded-lg bg-blue-50 text-[#3B82F6]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-[#3B82F6] my-2">{p1Attendance.percentage}%</h2>
          <p className="text-xs text-gray-500 font-medium">
            {p1Attendance.absences} faltas en total ({p1Attendance.attended} presentes)
          </p>
        </div>

        {/* ¿Con cuánto paso? Shortcut Widget */}
        <div
          onClick={() => setActiveSection('simulador')}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-xs cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start text-white/80">
            <small className="text-xs font-semibold uppercase tracking-wider">
              ¿Con cuánto paso?
            </small>
            <Calculator className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform" />
          </div>
          <h2 className="text-3xl font-extrabold text-white my-2">Simulador</h2>
          <div className="flex items-center justify-between text-xs text-blue-100 font-medium mt-1">
            <span>Calcular mínimo en P2 y P3</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Fila Doble (From user prototype: Próximas Entregas + Avance del Semestre) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Entregas */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-base">Próximas Entregas</h3>
              <button
                onClick={() => setActiveSection('tareas')}
                className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas ({pending.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {urgentTasks.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                🎉 ¡Felicidades! No tienes entregas pendientes en este momento.
              </div>
            ) : (
              <div className="space-y-3">
                {urgentTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onOpenTaskModal(t.id)}
                    className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 uppercase tracking-wide">
                          {t.subjectName}
                        </span>
                        <strong className="text-sm font-semibold text-gray-800 truncate block">
                          {t.title}
                        </strong>
                      </div>
                      <small className="text-xs text-gray-500 mt-1 block">
                        Entrega: {t.deadlineDate} • {t.deadlineTime} hrs
                      </small>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-[#F59E0B] shrink-0 group-hover:bg-amber-200 transition-colors">
                      Pendiente
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>¿Entregaste por fuera? Súbela para que tu docente la califique</span>
            <button
              onClick={() => setActiveSection('tareas')}
              className="text-[#3B82F6] font-semibold hover:underline cursor-pointer"
            >
              Ir a Mis Tareas
            </button>
          </div>
        </div>

        {/* Avance del Semestre */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800 text-base">Avance del Semestre</h3>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
              Semestre 2026-A
            </span>
          </div>

          <div className="space-y-4">
            {/* Parcial 1 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-700">Parcial 1 (Concluido)</span>
                <span className="text-[#3B82F6]">{p1Avg.toFixed(1)} / 10 pts</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3B82F6] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (p1Avg / 10) * 100)}%` }}
                />
              </div>
            </div>

            {/* Parcial 2 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-700">Parcial 2</span>
                <span className="text-gray-400">En curso (35% avanzado)</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-500"
                  style={{ width: '35%' }}
                />
              </div>
            </div>

            {/* Parcial 3 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-700">Parcial 3</span>
                <span className="text-gray-400">Pendiente</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-300 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>

            {/* Promedio Estimado */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-800">Promedio Estimado Final</span>
                <span className="text-[#10B981] font-bold">{generalAvg.toFixed(1)}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (generalAvg / 10) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
            <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
            <p>
              ¡Buen ritmo! Manteniendo un promedio de <strong>6.0</strong> en los parciales restantes, aprobarás el semestre holgadamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
