import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  Home,
  CheckSquare,
  CalendarCheck,
  GraduationCap,
  Bell,
  LogOut,
  UserCheck,
  Calculator,
  Shield,
  School,
  X,
  Calendar,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentUser, activeSection, setActiveSection, logout, switchRole, notifications } = useSchool();

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const isTeacher = currentUser?.role === 'profesor';

  const studentNavItems: NavItem[] = [
    { id: 'resumen', label: 'Resumen', icon: Home },
    { id: 'tareas', label: 'Tareas', icon: CheckSquare },
    { id: 'calendario', label: 'Calendario Escolar', icon: Calendar, badge: 'Fechas' },
    { id: 'asistencia', label: 'Asistencia', icon: CalendarCheck },
    { id: 'calificaciones', label: 'Calificaciones', icon: GraduationCap },
    { id: 'simulador', label: '¿Con cuánto paso?', icon: Calculator, badge: 'Calculadora' },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell, count: unreadNotifs },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'docente', label: 'Panel Docente', icon: Shield },
    { id: 'tareas', label: 'Tareas y Entregas', icon: CheckSquare },
    { id: 'asistencia', label: 'Pase de Lista', icon: CalendarCheck },
    { id: 'calificaciones', label: 'Calificador General', icon: GraduationCap },
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-[#E5E7EB] p-5 flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-base leading-tight">
                {currentUser?.institution || 'Mi Portal Escolar'}
              </h2>
              <p className="text-[11px] font-medium text-blue-600">
                {isTeacher ? 'Plataforma Docente' : 'Portal del Alumno'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-[#3B82F6] font-semibold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#3B82F6]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count && item.count > 0 ? (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                ) : null}
                {item.badge && !item.count ? (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Role Toggle & User Profile Footer */}
        <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
          {/* Quick Role Switcher Button */}
          <button
            onClick={() => switchRole(isTeacher ? 'alumno' : 'profesor')}
            className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-xs text-gray-700 flex items-center justify-between transition-colors cursor-pointer"
            title="Cambiar vista para probar ambos roles"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Ver como: <strong>{isTeacher ? 'Alumno' : 'Profesor'}</strong></span>
            </div>
            <span className="text-[10px] bg-white border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
              Cambiar
            </span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-[#3B82F6] flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser?.avatarInitial || 'A'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-gray-800 truncate">{currentUser?.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{currentUser?.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
