import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ResumenSection } from './components/ResumenSection';
import { TareasSection } from './components/TareasSection';
import { AsistenciaSection } from './components/AsistenciaSection';
import { CalificacionesSection } from './components/CalificacionesSection';
import { SimuladorPaso } from './components/SimuladorPaso';
import { NotificacionesSection } from './components/NotificacionesSection';
import { TeacherDashboard } from './components/TeacherDashboard';
import { CalendarioSection } from './components/CalendarioSection';
import { TaskSubmitModal } from './components/TaskSubmitModal';

const MainLayout: React.FC = () => {
  const { currentUser, activeSection } = useSchool();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTaskIdModal, setActiveTaskIdModal] = useState<string | null>(null);

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <Header onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        {/* Section Views */}
        {activeSection === 'resumen' && (
          <ResumenSection onOpenTaskModal={(id) => setActiveTaskIdModal(id)} />
        )}

        {activeSection === 'tareas' && (
          <TareasSection onOpenTaskModal={(id) => setActiveTaskIdModal(id)} />
        )}

        {activeSection === 'calendario' && (
          <CalendarioSection onOpenTaskModal={(id) => setActiveTaskIdModal(id)} />
        )}

        {activeSection === 'asistencia' && <AsistenciaSection />}

        {activeSection === 'calificaciones' && <CalificacionesSection />}

        {activeSection === 'simulador' && <SimuladorPaso />}

        {activeSection === 'notificaciones' && <NotificacionesSection />}

        {activeSection === 'docente' && <TeacherDashboard />}

        {/* Task Details and Submission Modal */}
        <TaskSubmitModal
          taskId={activeTaskIdModal}
          onClose={() => setActiveTaskIdModal(null)}
        />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainLayout />
    </SchoolProvider>
  );
}
