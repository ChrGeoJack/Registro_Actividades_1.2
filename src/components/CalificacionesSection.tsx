import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  GraduationCap,
  Sparkles,
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const CalificacionesSection: React.FC = () => {
  const { grades, currentUser, getStudentAverage, setActiveSection } = useSchool();
  const studentEmail = currentUser?.email || 'carlos.ramirez@alumno.edu.mx';
  const studentGrades = grades[studentEmail] || grades['carlos.ramirez@alumno.edu.mx'] || [];

  const { p1Avg, generalAvg } = getStudentAverage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Mis Calificaciones Oficiales</h2>
          <p className="text-xs text-gray-500 mt-1">
            Historial de notas del ciclo 2026-A evaluadas por tus profesores.
          </p>
        </div>

        <button
          onClick={() => setActiveSection('simulador')}
          className="px-4 py-2 bg-blue-50 text-[#3B82F6] hover:bg-blue-100 font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer border border-blue-200"
        >
          <Calculator className="w-4 h-4" />
          <span>Abrir Simulador "¿Con cuánto paso?"</span>
        </button>
      </div>

      {/* Resumen por Materia (Table from user prototype) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <h3 className="font-bold text-gray-800 text-base mb-4">Resumen por Materia</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Materia</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Profesor</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Parcial 1</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Parcial 2</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Parcial 3</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Promedio</th>
                <th className="py-3 px-3 font-semibold text-[#9CA3AF]">Mínimo para 6.0</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {studentGrades.map((g) => {
                const p1 = g.p1 !== null ? g.p1 : '—';
                const p2 = g.p2 !== null ? g.p2 : '—';
                const p3 = g.p3 !== null ? g.p3 : '—';

                // Calculate required in P2+P3 for 6.0: (18 - P1) / 2
                const p1Val = g.p1 ?? 6.0;
                const minNeededAvg = Number((Math.max(0, 18 - p1Val) / 2).toFixed(1));

                return (
                  <tr key={g.subjectId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-gray-800">{g.subjectName}</td>
                    <td className="py-3.5 px-3 text-gray-500 text-xs">{g.teacher}</td>
                    <td className="py-3.5 px-3 font-bold text-gray-700">{p1}</td>
                    <td className="py-3.5 px-3 text-[#9CA3AF] italic">{p2}</td>
                    <td className="py-3.5 px-3 text-[#9CA3AF] italic">{p3}</td>
                    <td className="py-3.5 px-3 font-bold text-[#3B82F6]">{p1}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                        {minNeededAvg} en P2 y P3
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Total Row */}
              <tr className="bg-gray-50 font-bold border-t-2 border-[#E5E7EB]">
                <td className="py-3.5 px-3 text-gray-900" colSpan={2}>
                  Promedio General
                </td>
                <td className="py-3.5 px-3 text-gray-900">{p1Avg.toFixed(1)}</td>
                <td className="py-3.5 px-3 text-[#9CA3AF] italic">—</td>
                <td className="py-3.5 px-3 text-[#9CA3AF] italic">—</td>
                <td className="py-3.5 px-3 text-[#10B981] text-base">{generalAvg.toFixed(1)}</td>
                <td className="py-3.5 px-3 text-xs text-[#10B981]">
                  Aprobatorio (En meta)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Estado del Semestre Card (from user prototype .caja-verde) */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 p-6 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-emerald-100 text-[#10B981] rounded-xl shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#10B981] text-lg">Estado del Semestre: Favorable</h3>
              <p className="text-sm text-emerald-900 mt-1">
                Tu promedio actual es de <strong>{generalAvg.toFixed(1)}</strong> sobre 10. Con este ritmo escolar, mantienes tu condición regular y puedes aspirar a beca de aprovechamiento académico (requiere 8.0 mínimo).
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveSection('simulador')}
            className="px-4 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Ver con cuánto pasas cada materia</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
