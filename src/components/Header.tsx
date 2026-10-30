import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Menu, Bell, Check, AlertTriangle, Info, CheckCircle2, ChevronRight, User } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead, setActiveSection } = useSchool();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (item: any) => {
    markNotificationAsRead(item.id);
    if (item.linkSection) {
      setActiveSection(item.linkSection);
      setShowNotifications(false);
    }
  };

  return (
    <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white border border-[#E5E7EB] text-gray-600 hover:bg-gray-50 cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              ¡Bienvenido, <span className="text-[#3B82F6]">{currentUser?.name.split(' ')[0] || 'Alumno'}</span>!
            </h1>
            {currentUser?.institution && (
              <span className="hidden sm:inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {currentUser.institution}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {currentUser?.institution ? `${currentUser.institution} • ` : ''}{currentUser?.semester || 'Semestre 2026-A • Parcial 1'} • {currentUser?.group || '5to Semestre - Grupo B'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full bg-white border border-[#E5E7EB] text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer shadow-xs"
            title="Notificaciones y Alertas"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-sm text-gray-800">Alertas y Notificaciones</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Check className="w-3 h-3" />
                    <span>Leer todas</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs">
                    No tienes alertas pendientes en este momento.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${
                        !item.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {item.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                        {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {item.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-xs font-bold text-gray-800 truncate">{item.title}</p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">{item.date}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-snug line-clamp-2">{item.message}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 self-center shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 bg-white border border-[#E5E7EB] py-1.5 px-3 rounded-full shadow-xs">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-[#3B82F6] flex items-center justify-center font-bold text-xs">
            {currentUser?.avatarInitial || 'A'}
          </div>
          <p className="text-xs font-semibold text-gray-700 max-w-[150px] truncate">
            {currentUser?.email || 'correo@ejemplo.com'}
          </p>
        </div>
      </div>
    </header>
  );
};
