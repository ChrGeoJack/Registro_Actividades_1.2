import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  BookOpen,
} from 'lucide-react';

interface CalendarioSectionProps {
  onOpenTaskModal: (taskId: string) => void;
}

export const CalendarioSection: React.FC<CalendarioSectionProps> = ({ onOpenTaskModal }) => {
  const { tasks, currentUser } = useSchool();
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = Octubre 2026
  const [currentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-28');

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const email = currentUser?.email || 'Alumno@cetis101.org';

  // Compute days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun

  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  // Group tasks by date
  const tasksByDate: Record<string, typeof tasks> = {};
  tasks.forEach((t) => {
    if (!tasksByDate[t.deadlineDate]) {
      tasksByDate[t.deadlineDate] = [];
    }
    tasksByDate[t.deadlineDate].push(t);
  });

  const selectedDateTasks = tasksByDate[selectedDate] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span>Calendario de Entregas y Fechas Límite</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Visualiza las fechas límite de todas las tareas subidas por tus maestros y organiza tu tiempo escolar.
          </p>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setCurrentMonth((prev) => Math.max(0, prev - 1))}
            className="p-1.5 rounded-lg bg-white text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-extrabold px-3 py-1 text-gray-800 min-w-[120px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={() => setCurrentMonth((prev) => Math.min(11, prev + 1))}
            className="p-1.5 rounded-lg bg-white text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-gray-400 uppercase">
            <span>Dom</span>
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2">
            {blankDays.map((i) => (
              <div key={`blank-${i}`} className="min-h-[75px] rounded-xl bg-gray-50/50 p-1" />
            ))}

            {dayNumbers.map((day) => {
              const formattedDay = day < 10 ? `0${day}` : `${day}`;
              const formattedMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
              const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

              const dayTasks = tasksByDate[dateStr] || [];
              const isSelected = selectedDate === dateStr;
              const hasTasks = dayTasks.length > 0;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-[85px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-200'
                      : hasTasks
                      ? 'border-amber-200 bg-amber-50/20 hover:bg-amber-50/60'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : hasTasks
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </span>
                    {hasTasks && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </div>

                  {/* Task pills in calendar cell */}
                  <div className="space-y-1 mt-1">
                    {dayTasks.slice(0, 2).map((t) => {
                      const isSub = !!t.submissions[email];
                      return (
                        <div
                          key={t.id}
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded truncate ${
                            isSub
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                          title={`${t.subjectName}: ${t.title} (${t.teacherName})`}
                        >
                          {t.subjectName}: {t.title}
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-gray-400 font-bold block text-right">
                        +{dayTasks.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Panel (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Fecha Seleccionada
                </span>
                <h3 className="font-extrabold text-gray-800 text-base">{selectedDate}</h3>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full">
                {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'tarea' : 'tareas'}
              </span>
            </div>

            {selectedDateTasks.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p>No hay entregas programadas para este día.</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Selecciona otro día con punto amarillo en el calendario.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((t) => {
                  const isSubmitted = !!t.submissions[email];
                  const sub = t.submissions[email];

                  return (
                    <div
                      key={t.id}
                      onClick={() => onOpenTaskModal(t.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        isSubmitted
                          ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50'
                          : 'border-amber-200 bg-amber-50/30 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-800">
                          {t.subjectName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSubmitted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isSubmitted ? 'Entregada' : 'Pendiente'}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">
                        {t.title}
                      </h4>

                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                        {t.description}
                      </p>

                      <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                        <span className="flex items-center gap-1 font-semibold text-gray-700">
                          <User className="w-3 h-3 text-purple-600" />
                          {t.teacherName}
                        </span>
                        <span className="flex items-center gap-1 text-amber-900 font-semibold">
                          <Clock className="w-3 h-3" />
                          {t.deadlineTime} hrs
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <span className="block font-semibold text-gray-700 mb-1">💡 Código de Colores:</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Pendiente</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Entregada</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
