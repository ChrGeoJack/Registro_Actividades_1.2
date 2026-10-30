import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  Calculator,
  Target,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

export const SimuladorPaso: React.FC = () => {
  const { grades, currentUser } = useSchool();
  const studentEmail = currentUser?.email || 'carlos.ramirez@alumno.edu.mx';
  const studentGrades = grades[studentEmail] || grades['carlos.ramirez@alumno.edu.mx'] || [];

  // Configurable target grade to pass or achieve
  const [targetGrade, setTargetGrade] = useState<number>(6.0);

  // Hypothetical test scores for Parcial 2 (to project required Parcial 3)
  const [hypotheticalP2, setHypotheticalP2] = useState<Record<string, number>>({});

  const handleP2Change = (subId: string, val: number) => {
    setHypotheticalP2((prev) => ({
      ...prev,
      [subId]: val,
    }));
  };

  const resetSimulation = () => {
    setHypotheticalP2({});
    setTargetGrade(6.0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Simulador: ¿Con cuánto paso el Semestre?</h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                Calcula la calificación exacta que necesitas obtener en el Parcial 2 y Parcial 3 para aprobar o alcanzar tu meta.
              </p>
            </div>
          </div>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer self-end sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>

        {/* Target Grade Selector */}
        <div className="mt-6 pt-5 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-200 block mb-1">
              Selecciona tu Meta de Aprobación / Promedio:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Pase Mínimo (6.0)', val: 6.0 },
                { label: 'Buen Desempeño (7.5)', val: 7.5 },
                { label: 'Para Beca (8.0)', val: 8.0 },
                { label: 'Excelencia (9.0)', val: 9.0 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setTargetGrade(opt.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    targetGrade === opt.val
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-blue-200 uppercase font-semibold block">Meta Activa</span>
            <span className="text-2xl font-extrabold text-white">{targetGrade.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Info formula explanation */}
      <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl flex items-start gap-3 text-xs text-blue-900">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong>¿Cómo se calcula?</strong> El promedio semestral oficial es la media aritmética de los tres parciales: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px] font-bold">(P1 + P2 + P3) ÷ 3 ≥ Meta</code>. Dado que ya tienes tu calificación del Parcial 1, aquí puedes simular cuánto requieres en los siguientes parciales.
        </p>
      </div>

      {/* Materias Calculation Cards */}
      <div className="grid grid-cols-1 gap-4">
        {studentGrades.map((g) => {
          const p1 = g.p1 ?? 7.0;
          const p2Simulated = hypotheticalP2[g.subjectId] !== undefined ? hypotheticalP2[g.subjectId] : null;

          // Target total points needed = targetGrade * 3
          const totalPointsNeeded = targetGrade * 3;

          // If no P2 yet: needed average across both P2 and P3
          const pointsRemainingForP2andP3 = Math.max(0, totalPointsNeeded - p1);
          const neededAvgP2P3 = Number((pointsRemainingForP2andP3 / 2).toFixed(1));

          // If student has simulated P2: needed in P3
          let neededP3: number | null = null;
          if (p2Simulated !== null) {
            neededP3 = Number(Math.max(0, totalPointsNeeded - p1 - p2Simulated).toFixed(1));
          }

          // Difficulty rating for needed grade
          const testNeeded = p2Simulated !== null ? (neededP3 ?? 0) : neededAvgP2P3;
          let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          let statusText = '¡Aprobación muy segura!';
          let Icon = CheckCircle2;

          if (testNeeded <= 6.0) {
            badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            statusText = 'Muy accesible (requiere ≤ 6.0)';
          } else if (testNeeded <= 7.5) {
            badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
            statusText = 'Normal (requiere entre 6.0 y 7.5)';
          } else if (testNeeded <= 9.0) {
            badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
            statusText = 'Exigente (requiere entre 7.5 y 9.0)';
            Icon = AlertTriangle;
          } else if (testNeeded <= 10.0) {
            badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
            statusText = '¡Alto esfuerzo requerido! (≥ 9.0)';
            Icon = AlertTriangle;
          } else {
            badgeColor = 'bg-red-100 text-red-800 border-red-200';
            statusText = 'Imposible alcanzar esta meta (requiere > 10.0)';
            Icon = AlertTriangle;
          }

          return (
            <div
              key={g.subjectId}
              className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Subject Info */}
              <div className="md:w-1/3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Semestre 2026-A
                  </span>
                  <span className="text-xs text-gray-400">• {g.teacher}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-base mt-1">{g.subjectName}</h3>

                <div className="flex items-center gap-3 mt-3">
                  <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Parcial 1</span>
                    <span className="text-base font-extrabold text-[#3B82F6]">{p1.toFixed(1)}</span>
                  </div>
                  <div className="text-gray-300 font-bold">+</div>
                  <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">P2 Simulado</span>
                    <span className="text-base font-extrabold text-indigo-600">
                      {p2Simulated !== null ? p2Simulated.toFixed(1) : '—'}
                    </span>
                  </div>
                  <div className="text-gray-300 font-bold">+</div>
                  <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">P3 Necesario</span>
                    <span className={`text-base font-extrabold ${testNeeded > 10 ? 'text-red-600' : 'text-[#10B981]'}`}>
                      {p2Simulated !== null ? (neededP3! > 10 ? '>10' : neededP3!.toFixed(1)) : `${neededAvgP2P3} c/u`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider for What-If Simulator */}
              <div className="md:w-1/3 bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-gray-600">¿Y si saco esto en Parcial 2?</span>
                  <span className="font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    {p2Simulated !== null ? p2Simulated.toFixed(1) : 'Mueve el slider'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={p2Simulated !== null ? p2Simulated : 7.0}
                  onChange={(e) => handleP2Change(g.subjectId, parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>0 pts</span>
                  <span>5.0</span>
                  <span>10.0 pts</span>
                </div>
              </div>

              {/* Result Summary */}
              <div className="md:w-1/4 text-left md:text-right flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Para lograr {targetGrade.toFixed(1)}:
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-gray-800 mt-0.5">
                    {p2Simulated !== null ? (
                      neededP3! > 10 ? (
                        <span className="text-red-600">Inalcanzable</span>
                      ) : neededP3! <= 0 ? (
                        <span className="text-[#10B981]">¡Ya la pasaste!</span>
                      ) : (
                        <span>
                          Necesitas <strong className="text-blue-600">{neededP3!.toFixed(1)}</strong> en P3
                        </span>
                      )
                    ) : (
                      <span>
                        Necesitas promedio de <strong className="text-blue-600">{neededAvgP2P3}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{statusText}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
