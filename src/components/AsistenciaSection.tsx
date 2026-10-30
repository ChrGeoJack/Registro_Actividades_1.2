import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const AsistenciaSection: React.FC = () => {
  const { attendance, attendanceLogs } = useSchool();
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  const p1 = attendance[0] || { totalDays: 25, attended: 23, absences: 2, tardies: 1, percentage: 92 };
  const maxAllowedAbsences = Math.floor(p1.totalDays * 0.2); // 20% max absences allowed (80% attendance required)
  const remainingAllowedAbsences = Math.max(0, maxAllowedAbsences - p1.absences);
  const isAtRisk = remainingAllowedAbsences <= 1;

  const filteredLogs = attendanceLogs.filter((log) => {
    if (filterStatus === 'todos') return true;
    return log.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <h2 className="text-xl font-bold text-gray-800">Mi Registro de Asistencia</h2>
        <p className="text-xs text-gray-500 mt-1">
          Seguimiento oficial de asistencias, inasistencias y retardos por parcial para el ciclo 2026-A.
        </p>
      </div>

      {/* Tarjetas por Parcial (Directly from user prototype) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Parcial 1 */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <small className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Parcial 1
          </small>
          <h2 className="text-3xl font-extrabold text-[#3B82F6] my-2">{p1.percentage}%</h2>
          <p className="text-xs text-gray-500 mb-3">
            Presentes: <strong className="text-[#10B981]">{p1.attended}</strong> • Faltas:{' '}
            <strong className="text-[#EF4444]">{p1.absences}</strong>
          </p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3B82F6] rounded-full transition-all duration-500"
              style={{ width: `${p1.percentage}%` }}
            />
          </div>
        </div>

        {/* Parcial 2 */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <small className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Parcial 2
          </small>
          <h2 className="text-3xl font-extrabold text-[#9CA3AF] my-2">—</h2>
          <p className="text-xs text-gray-400">En curso • Captura en proceso</p>
        </div>

        {/* Parcial 3 */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <small className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Parcial 3
          </small>
          <h2 className="text-3xl font-extrabold text-[#9CA3AF] my-2">—</h2>
          <p className="text-xs text-gray-400">Pendiente • Inicia Noviembre 2026</p>
        </div>
      </div>

      {/* Alerta / Semáforo de Faltas (Permitidas antes de perder derecho) */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isAtRisk
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl ${
              isAtRisk ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {isAtRisk ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-sm">
              {isAtRisk ? '¡Atención con tus faltas!' : 'Tu derecho a examen está protegido'}
            </h4>
            <p className="text-xs opacity-90 mt-0.5 max-w-xl">
              El reglamento escolar estipula un mínimo de <strong>80% de asistencia</strong> (máximo 5 inasistencias en 25 sesiones). Actualmente tienes {p1.absences} faltas: <strong>te restan {remainingAllowedAbsences} faltas permitidas</strong>.
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-white/80 py-2 px-4 rounded-xl border border-gray-200/60 text-center">
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">
            Margen de Faltas
          </span>
          <span
            className={`text-xl font-extrabold ${isAtRisk ? 'text-amber-600' : 'text-emerald-600'}`}
          >
            {remainingAllowedAbsences} restantes
          </span>
        </div>
      </div>

      {/* Detalle del Semestre (Table from prototype) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <h3 className="font-bold text-gray-800 text-base mb-4">Detalle del Semestre</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Parcial</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Días Totales</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Asistencias</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Faltas</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Retardos</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">% Cumplido</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-800">Parcial 1</td>
                <td className="py-3 px-3 text-gray-700">{p1.totalDays}</td>
                <td className="py-3 px-3 font-bold text-[#10B981]">{p1.attended}</td>
                <td className="py-3 px-3 font-bold text-[#EF4444]">{p1.absences}</td>
                <td className="py-3 px-3 text-[#F59E0B] font-semibold">{p1.tardies}</td>
                <td className="py-3 px-3 font-bold text-[#3B82F6]">{p1.percentage}%</td>
                <td className="py-3 px-3">
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    Con derecho
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-400">Parcial 2</td>
                <td colSpan={6} className="py-3 px-3 text-[#9CA3AF] italic">
                  Aún no disponible (En curso)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-400">Parcial 3</td>
                <td colSpan={6} className="py-3 px-3 text-[#9CA3AF] italic">
                  Aún no disponible (Pendiente)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial Diario de Asistencias */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="font-bold text-gray-800 text-base">Historial de Asistencia por Sesión</h3>
            <p className="text-xs text-gray-500">Últimos pases de lista registrados en el sistema</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus('todos')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                filterStatus === 'todos' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('falta')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                filterStatus === 'falta' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-700'
              }`}
            >
              Solo Faltas
            </button>
            <button
              onClick={() => setFilterStatus('presente')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                filterStatus === 'presente' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              Asistencias
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {log.status === 'presente' && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                {log.status === 'falta' && <XCircle className="w-4 h-4 text-[#EF4444]" />}
                {log.status === 'retardo' && <Clock className="w-4 h-4 text-[#F59E0B]" />}
                {log.status === 'justificada' && <Info className="w-4 h-4 text-blue-500" />}
                <div>
                  <span className="font-bold text-gray-800 mr-2">{log.subjectName}</span>
                  <span className="text-gray-500">{log.notes || 'Pase de lista regular'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-mono">{log.date}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold capitalize ${
                    log.status === 'presente'
                      ? 'bg-emerald-50 text-emerald-700'
                      : log.status === 'falta'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
