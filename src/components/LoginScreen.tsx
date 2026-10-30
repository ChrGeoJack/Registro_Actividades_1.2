import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  GraduationCap,
  School,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Building2,
  User,
  ArrowLeft,
  BookOpen,
  Calendar,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useSchool();
  const [selectedRole, setSelectedRole] = useState<'maestro' | 'alumno' | null>(null);
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [detectedInstitution, setDetectedInstitution] = useState('CETIS 101');
  const [detectedName, setDetectedName] = useState('');

  // Handle Role Selection (Step 1)
  const handleSelectRole = (role: 'maestro' | 'alumno') => {
    setSelectedRole(role);
    setEmail('');
    setErrorMsg('');
    setIsError(false);
    setIsValid(false);
  };

  const validateEmail = (value: string, role: 'maestro' | 'alumno') => {
    const trimmed = value.trim();
    if (!trimmed) {
      setErrorMsg('');
      setIsError(false);
      setIsValid(false);
      return false;
    }

    const cleanLower = trimmed.toLowerCase();

    // Direct match for requested credentials
    if (role === 'alumno' && cleanLower === 'alumno@cetis101.org') {
      setErrorMsg('✅ ¡Correo institucional de Alumno válido!');
      setDetectedInstitution('CETIS 101');
      setDetectedName('Carlos Ramírez (Alumno)');
      setIsError(false);
      setIsValid(true);
      return true;
    }

    if (role === 'maestro' && cleanLower === 'maestro@cetis101.org') {
      setErrorMsg('✅ ¡Correo institucional de Maestro válido!');
      setDetectedInstitution('CETIS 101');
      setDetectedName('Prof. Roberto Mendoza');
      setIsError(false);
      setIsValid(true);
      return true;
    }

    // General institutional format verification: nombre@(institucion).edu.mx OR .org
    const faltas: string[] = [];

    if (!trimmed.includes('@')) {
      faltas.push('Te falta @');
    }

    const parts = trimmed.split('@');
    const namePart = parts[0] || '';
    const domain = parts[1] || '';

    if (!namePart) {
      faltas.push('Te falta el nombre antes del @');
    }

    if (!domain.includes('.edu.mx') && !domain.includes('.org') && !domain.includes('.edu')) {
      faltas.push('Debe ser institucional (ej. @cetis101.org o @cetis101.edu.mx)');
    }

    if (faltas.length > 0) {
      setErrorMsg(faltas.join(' • '));
      setIsError(true);
      setIsValid(false);
      return false;
    }

    // Parse valid
    const instPart = domain.replace(/(\.edu)?\.mx$|\.org$/i, '');
    let prettyInst = instPart.toUpperCase() || 'CETIS 101';
    const matchNum = instPart.match(/^([a-zA-Z]+)(\d+)$/);
    if (matchNum) {
      prettyInst = `${matchNum[1].toUpperCase()} ${matchNum[2]}`;
    }

    let prettyName = namePart.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[._-]+/g, ' ');
    prettyName =
      prettyName
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ') || (role === 'maestro' ? 'Profesor' : 'Alumno');

    setDetectedInstitution(prettyInst);
    setDetectedName(prettyName);
    setErrorMsg(`✅ ¡Correo institucional válido!`);
    setIsError(false);
    setIsValid(true);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (selectedRole) {
      validateEmail(val, selectedRole);
    }
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMsg('⚠️ Escribe tu correo institucional por favor');
      setIsError(true);
      setIsValid(false);
      return;
    }

    if (!selectedRole) return;

    const valid = validateEmail(trimmed, selectedRole);
    if (!valid) return;

    login(trimmed, selectedRole === 'maestro' ? 'profesor' : 'alumno');
  };

  const quickLoginWithSample = (sample: string, role: 'maestro' | 'alumno') => {
    setSelectedRole(role);
    setEmail(sample);
    validateEmail(sample, role);
    login(sample, role === 'maestro' ? 'profesor' : 'alumno');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-4">
      {/* STEP 1: SELECCIONAR QUÉ ERES (MAESTRO O ALUMNO) */}
      {!selectedRole && (
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-150">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-[#3B82F6] mb-4 shadow-xs">
            <School className="w-9 h-9" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
            Portal Escolar CETIS 101
          </h1>
          <p className="text-base font-semibold text-blue-600 mb-1">
            ¿Qué eres en la institución?
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-md mx-auto">
            Selecciona tu perfil para acceder al sistema con tu correo institucional correspondiente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {/* Tarjeta Maestro */}
            <div
              onClick={() => handleSelectRole('maestro')}
              className="group p-6 rounded-2xl border-2 border-purple-200 bg-purple-50/30 hover:bg-purple-50 hover:border-purple-500 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-purple-950 mb-1">Soy Maestro</h3>
                <p className="text-xs text-purple-800 leading-relaxed mb-4">
                  Sube tareas con instrucciones, gestiona varias clases y materias, realiza el pase de lista de alumnos y califica entregas.
                </p>
              </div>

              <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-900">
                <span>Continuar como Maestro</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Tarjeta Alumno */}
            <div
              onClick={() => handleSelectRole('alumno')}
              className="group p-6 rounded-2xl border-2 border-blue-200 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#3B82F6] flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-blue-950 mb-1">Soy Alumno</h3>
                <p className="text-xs text-blue-800 leading-relaxed mb-4">
                  Consulta tus tareas de cada materia, entrega actividades, revisa el calendario escolar, asistencias y calificaciones.
                </p>
              </div>

              <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-bold text-[#3B82F6] group-hover:text-blue-800">
                <span>Continuar como Alumno</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Accesos directos rápidos */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-3">
              Ingreso rápido con cuentas de prueba:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => quickLoginWithSample('Maestro@cetis101.org', 'maestro')}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>👨‍🏫 Maestro@cetis101.org</span>
              </button>
              <button
                onClick={() => quickLoginWithSample('Alumno@cetis101.org', 'alumno')}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>👨‍🎓 Alumno@cetis101.org</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: INGRESO DE CORREO INSTITUCIONAL SEGÚN ROL */}
      {selectedRole && (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-150">
          {/* Back button */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => setSelectedRole(null)}
              className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cambiar rol</span>
            </button>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                selectedRole === 'maestro'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {selectedRole === 'maestro' ? '👨‍🏫 Modo Maestro' : '👨‍🎓 Modo Alumno'}
            </span>
          </div>

          <div
            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-xs ${
              selectedRole === 'maestro' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
            }`}
          >
            {selectedRole === 'maestro' ? (
              <GraduationCap className="w-8 h-8" />
            ) : (
              <School className="w-8 h-8" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {selectedRole === 'maestro' ? 'Acceso a Maestros' : 'Acceso a Alumnos'}
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            {selectedRole === 'maestro'
              ? 'Ingresa tu correo institucional docente para gestionar tus clases y tareas.'
              : 'Ingresa tu correo institucional escolar para consultar tus materias y actividades.'}
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Correo Institucional ({selectedRole === 'maestro' ? 'Docente' : 'Alumno'})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={handleInputChange}
                  placeholder={
                    selectedRole === 'maestro'
                      ? 'Maestro@cetis101.org'
                      : 'Alumno@cetis101.org'
                  }
                  className={`w-full px-4 py-3 border rounded-xl text-sm sm:text-base outline-none transition-all ${
                    isError
                      ? 'border-[#EF4444] bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-200'
                      : isValid
                      ? 'border-[#10B981] bg-emerald-50/30 text-gray-800 focus:ring-2 focus:ring-emerald-200'
                      : selectedRole === 'maestro'
                      ? 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                  autoFocus
                />
                {isValid && (
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] absolute right-3 top-3.5" />
                )}
              </div>

              {/* Error / Success message */}
              {errorMsg && (
                <div
                  className={`text-xs mt-2.5 p-2.5 rounded-lg font-medium flex items-center gap-2 ${
                    isValid
                      ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                      : 'bg-red-50 text-[#EF4444] border border-red-200'
                  }`}
                >
                  {!isValid ? (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Detected info badge */}
              {isValid && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-xs text-gray-700 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Institución: <strong>{detectedInstitution}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Nombre: <strong>{detectedName}</strong></span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-base text-white ${
                selectedRole === 'maestro'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-[#3B82F6] hover:bg-[#2563EB]'
              }`}
            >
              <span>{selectedRole === 'maestro' ? 'Entrar a Menú de Maestro' : 'Entrar a Menú de Alumno'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick test buttons for this role */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-left">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Haz clic para autocompletar:
            </span>

            {selectedRole === 'maestro' ? (
              <button
                type="button"
                onClick={() => {
                  setEmail('Maestro@cetis101.org');
                  validateEmail('Maestro@cetis101.org', 'maestro');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 transition-colors cursor-pointer text-xs"
              >
                <div>
                  <p className="font-bold text-purple-950">Maestro@cetis101.org</p>
                  <p className="text-[11px] text-purple-700">Prof. Roberto Mendoza • CETIS 101</p>
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-white border border-purple-200 px-2.5 py-0.5 rounded-lg">
                  Usar este
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEmail('Alumno@cetis101.org');
                  validateEmail('Alumno@cetis101.org', 'alumno');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition-colors cursor-pointer text-xs"
              >
                <div>
                  <p className="font-bold text-blue-950">Alumno@cetis101.org</p>
                  <p className="text-[11px] text-blue-700">Carlos Ramírez • CETIS 101</p>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-white border border-blue-200 px-2.5 py-0.5 rounded-lg">
                  Usar este
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-center">
        Sistema de Gestión Escolar • CETIS 101 • Semestre 2026-A
      </p>
    </div>
  );
};
