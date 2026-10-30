import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  Check,
  ChevronRight,
} from 'lucide-react';

export const NotificacionesSection: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setActiveSection } = useSchool();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Centro de Notificaciones y Alertas</h2>
          <p className="text-xs text-gray-500 mt-1">
            Avisos de entregas próximas a vencer, tareas evaluadas y alertas de inasistencias.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3.5 py-1.5 bg-blue-50 text-[#3B82F6] hover:bg-blue-100 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Marcar todas como leídas</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs divide-y divide-gray-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            🎉 ¡Todo al día! No tienes notificaciones ni alertas pendientes.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationAsRead(item.id);
                if (item.linkSection) setActiveSection(item.linkSection);
              }}
              className={`p-4 sm:p-5 flex items-start gap-4 hover:bg-gray-50/70 transition-colors cursor-pointer ${
                !item.read ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="p-2.5 rounded-xl shrink-0 mt-0.5">
                {item.type === 'urgent' && (
                  <div className="p-2 bg-amber-100 text-[#F59E0B] rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
                {item.type === 'warning' && (
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
                {item.type === 'success' && (
                  <div className="p-2 bg-emerald-100 text-[#10B981] rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {item.type === 'info' && (
                  <div className="p-2 bg-blue-100 text-[#3B82F6] rounded-xl">
                    <Info className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
                  <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.message}</p>

                {item.linkSection && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline mt-2">
                    <span>Ir a {item.linkSection}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
