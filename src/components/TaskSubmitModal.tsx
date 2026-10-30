import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  X,
  Clock,
  Calendar,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  MessageSquare,
  Award,
  Link as LinkIcon,
  AlertTriangle,
} from 'lucide-react';

interface TaskSubmitModalProps {
  taskId: string | null;
  onClose: () => void;
}

export const TaskSubmitModal: React.FC<TaskSubmitModalProps> = ({ taskId, onClose }) => {
  const { tasks, currentUser, submitTask, unsubmitTask } = useSchool();
  const [content, setContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('Reporte_Final.pdf');
  const [fileSelected, setFileSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!taskId) return null;

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  const email = currentUser?.email || '';
  const submission = task.submissions[email];
  const isSubmitted = !!submission;
  const isGraded = isSubmitted && submission.grade !== undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !fileSelected) {
      alert('Por favor escribe un mensaje o selecciona un archivo para entregar tu tarea.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitTask(
        task.id,
        content.trim() || 'Entrega de tarea completada por el alumno.',
        fileSelected ? attachmentName : undefined
      );
      setIsSubmitting(false);
    }, 400);
  };

  const handleUnsubmit = () => {
    if (confirm('¿Estás seguro de anular la entrega? Tu profesor no podrá ver tu trabajo hasta que lo vuelvas a entregar.')) {
      unsubmitTask(task.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4 bg-gray-50/70">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                {task.subjectName}
              </span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                👨‍🏫 Maestro: {task.teacherName}
              </span>
              {task.className && (
                <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {task.className}
                </span>
              )}
              <span className="text-xs text-gray-400">• Parcial {task.partial}</span>
              <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                Valor: {task.maxPoints} pts
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Due date and teacher info */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
            <span className="flex items-center gap-1.5 font-medium text-blue-900">
              <Clock className="w-4 h-4 text-blue-500" />
              Fecha límite: <strong>{task.deadlineDate} a las {task.deadlineTime} hrs</strong>
            </span>
            <span className="flex items-center gap-1.5 text-purple-800 font-semibold">
              <span>Docente: <strong>{task.teacherName}</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <Calendar className="w-4 h-4 text-gray-400" />
              Asignada: {task.createdAt}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Instrucciones de la Actividad
            </h4>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {task.description}
            </div>
          </div>

          {/* Graded section if teacher graded */}
          {isGraded && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <Award className="w-5 h-5 text-[#10B981]" />
                  Calificación Asignada
                </span>
                <span className="text-lg font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
                  {submission.grade} / {task.maxPoints} pts
                </span>
              </div>
              {submission.feedback && (
                <div className="pt-2 border-t border-emerald-200/60 text-xs">
                  <span className="font-semibold block text-emerald-800 mb-0.5">
                    Retroalimentación del docente:
                  </span>
                  <p className="italic">"{submission.feedback}"</p>
                </div>
              )}
            </div>
          )}

          {/* Submission Area */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Tu Entrega
            </h4>

            {isSubmitted ? (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#10B981] font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Entregada el {new Date(submission.submittedAt).toLocaleString('es-MX')}</span>
                  </div>
                  {!isGraded && (
                    <button
                      onClick={handleUnsubmit}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Anular entrega</span>
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-500 text-[11px] mb-1">Comentario o texto enviado:</p>
                  <p>{submission.content}</p>
                </div>

                {submission.attachmentName && (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-900 font-medium">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Archivo adjunto: <strong>{submission.attachmentName}</strong></span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Descripción o Comentario de Entrega
                  </label>
                  <textarea
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escribe un breve resumen de tu trabajo, enlaces a Google Drive/GitHub, o dudas para tu profesor..."
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Simulated file upload button */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Archivo de Evidencia (PDF, Word, ZIP o Imágenes)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFileSelected(true);
                        setAttachmentName(`${task.title.replace(/\s+/g, '_')}_CarlosR.pdf`);
                      }}
                      className="px-3.5 py-2 border border-dashed border-blue-400 bg-blue-50/40 hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{fileSelected ? 'Cambiar archivo' : 'Adjuntar archivo escolar'}</span>
                    </button>

                    {fileSelected && (
                      <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{attachmentName}</span>
                        <button
                          type="button"
                          onClick={() => setFileSelected(false)}
                          className="text-gray-400 hover:text-red-500 ml-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isSubmitting ? 'Enviando...' : 'Completar y Entregar Tarea'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
