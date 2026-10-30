import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Task,
  SubjectGrade,
  AttendanceRecord,
  AttendanceLog,
  NotificationItem,
  Subject,
  TaskSubmission,
  ClassGroup,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_TASKS,
  INITIAL_GRADES,
  INITIAL_ATTENDANCE,
  INITIAL_ATTENDANCE_LOGS,
} from '../data/initialData';

interface SchoolContextType {
  currentUser: UserProfile | null;
  studentsList: UserProfile[];
  teachersList: UserProfile[];
  subjects: Subject[];
  classes: ClassGroup[];
  tasks: Task[];
  grades: Record<string, SubjectGrade[]>;
  attendance: AttendanceRecord[];
  attendanceLogs: AttendanceLog[];
  notifications: NotificationItem[];
  activeSection: string;
  setActiveSection: (sec: string) => void;
  login: (email: string, forcedRole?: 'alumno' | 'profesor') => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (newRole: 'alumno' | 'profesor', specificEmail?: string) => void;
  submitTask: (taskId: string, content: string, attachmentName?: string) => void;
  unsubmitTask: (taskId: string) => void;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'submissions'>) => void;
  createClass: (classData: Omit<ClassGroup, 'id' | 'studentsCount'>) => void;
  gradeTaskSubmission: (taskId: string, studentEmail: string, grade: number, feedback: string) => void;
  updateStudentGrade: (studentEmail: string, subjectId: string, partial: 'p1' | 'p2' | 'p3', value: number | null) => void;
  recordAttendance: (date: string, subjectName: string, status: AttendanceLog['status'], notes?: string) => void;
  recordStudentAttendance: (
    date: string,
    subjectName: string,
    teacherName: string,
    studentEmail: string,
    studentName: string,
    status: AttendanceLog['status'],
    notes?: string
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  // Computed helpers
  getStudentTasks: (studentEmail?: string) => {
    submitted: Task[];
    pending: Task[];
    all: Task[];
  };
  getStudentAverage: (studentEmail?: string) => {
    p1Avg: number;
    p2Avg: number | null;
    p3Avg: number | null;
    generalAvg: number;
    status: 'aprobado' | 'en_riesgo' | 'reprobado';
  };
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'portal_escolar_user',
  CLASSES: 'portal_escolar_classes',
  TASKS: 'portal_escolar_tasks',
  GRADES: 'portal_escolar_grades',
  ATTENDANCE: 'portal_escolar_attendance',
  ATTENDANCE_LOGS: 'portal_escolar_att_logs',
  NOTIFICATIONS: 'portal_escolar_notifs',
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null; // Starts at selection screen
  });

  const [activeSection, setActiveSection] = useState<string>('resumen');
  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [studentsList] = useState<UserProfile[]>(INITIAL_STUDENTS);
  const [teachersList] = useState<UserProfile[]>(INITIAL_TEACHERS);

  const [classes, setClasses] = useState<ClassGroup[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CLASSES;
      }
    }
    return INITIAL_CLASSES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TASKS;
      }
    }
    return INITIAL_TASKS;
  });

  const [grades, setGrades] = useState<Record<string, SubjectGrade[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_GRADES;
      }
    }
    return INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ATTENDANCE;
      }
    }
    return INITIAL_ATTENDANCE;
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ATTENDANCE_LOGS;
      }
    }
    return INITIAL_ATTENDANCE_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_LOGS, JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  // Dynamic alerts
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'alumno') return;

    const notifs: NotificationItem[] = [];
    const today = new Date();

    tasks.forEach((task) => {
      const isSubmitted = !!task.submissions[currentUser.email];
      if (!isSubmitted) {
        const deadline = new Date(`${task.deadlineDate}T${task.deadlineTime || '23:59'}`);
        const diffHours = (deadline.getTime() - today.getTime()) / (1000 * 60 * 60);

        if (diffHours > 0 && diffHours <= 48) {
          notifs.push({
            id: `notif-urgent-${task.id}`,
            title: `⚠️ Entrega Próxima: ${task.title}`,
            message: `La tarea de ${task.subjectName} (${task.teacherName}) vence el ${task.deadlineDate} a las ${task.deadlineTime} hrs.`,
            type: 'urgent',
            date: 'Hoy',
            read: false,
            linkSection: 'tareas',
          });
        } else if (diffHours > 48 && diffHours <= 120) {
          notifs.push({
            id: `notif-warning-${task.id}`,
            title: `⏰ Tarea Pendiente: ${task.title}`,
            message: `Asignada por ${task.teacherName} para el ${task.deadlineDate}.`,
            type: 'warning',
            date: 'Próxima',
            read: false,
            linkSection: 'tareas',
          });
        }
      } else {
        const sub = task.submissions[currentUser.email];
        if (sub.grade !== undefined) {
          notifs.push({
            id: `notif-grade-${task.id}`,
            title: `✅ Tarea Calificada: ${task.title}`,
            message: `Obtuviste ${sub.grade}/${task.maxPoints} pts en ${task.subjectName} por ${task.teacherName}. Comentarios: "${sub.feedback || 'Sin comentarios'}"`,
            type: 'success',
            date: 'Reciente',
            read: false,
            linkSection: 'tareas',
          });
        }
      }
    });

    const p1 = attendance[0];
    if (p1 && p1.absences >= 2) {
      notifs.push({
        id: 'notif-att-warning',
        title: '⚠️ Aviso de Asistencia - Parcial 1',
        message: `Acumulas ${p1.absences} faltas en el parcial (${p1.percentage}% asistencia). Mínimo requerido: 80%.`,
        type: 'warning',
        date: 'Parcial 1',
        read: false,
        linkSection: 'asistencia',
      });
    }

    setNotifications(notifs);
  }, [tasks, currentUser, attendance]);

  // Auth actions
  const login = (email: string, forcedRole?: 'alumno' | 'profesor') => {
    const rawEmail = email.trim();
    const cleanEmail = rawEmail.toLowerCase();

    // Exact match for requested accounts
    if (cleanEmail === 'alumno@cetis101.org') {
      setCurrentUser(INITIAL_STUDENTS[0]);
      setActiveSection('resumen');
      return { success: true };
    }

    if (cleanEmail === 'maestro@cetis101.org') {
      setCurrentUser(INITIAL_TEACHERS[0]);
      setActiveSection('docente');
      return { success: true };
    }

    // Check existing teachers in list
    const teacherFound = teachersList.find((t) => t.email.toLowerCase() === cleanEmail);
    if (teacherFound || forcedRole === 'profesor') {
      if (teacherFound) {
        setCurrentUser(teacherFound);
      } else {
        const [nPart, dPart = ''] = rawEmail.split('@');
        let fName = nPart.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[._-]+/g, ' ') || 'Maestro';
        setCurrentUser({
          id: `tch-${Date.now()}`,
          name: fName,
          email: rawEmail,
          role: 'profesor',
          avatarInitial: fName.charAt(0).toUpperCase() || 'M',
          group: 'Academia General • CETIS 101',
          semester: 'Semestre 2026-A',
          institution: 'CETIS 101',
        });
      }
      setActiveSection('docente');
      return { success: true };
    }

    // Check existing students
    const studentFound = studentsList.find((s) => s.email.toLowerCase() === cleanEmail);
    if (studentFound || forcedRole === 'alumno') {
      if (studentFound) {
        setCurrentUser(studentFound);
      } else {
        const [nPart, dPart = ''] = rawEmail.split('@');
        let fName = nPart.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[._-]+/g, ' ') || 'Alumno';
        setCurrentUser({
          id: `std-${Date.now()}`,
          name: fName,
          email: rawEmail,
          role: 'alumno',
          avatarInitial: fName.charAt(0).toUpperCase() || 'A',
          group: 'Grupo 5°A • CETIS 101',
          semester: 'Semestre 2026-A • Parcial 1',
          matricula: `CET-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          institution: 'CETIS 101',
        });
      }
      setActiveSection('resumen');
      return { success: true };
    }

    // Determine role if forced or by keywords
    const isTeacher =
      forcedRole === 'profesor' ||
      cleanEmail.includes('maestro') ||
      cleanEmail.includes('docente') ||
      cleanEmail.includes('prof');

    // Parse name and institution
    const [namePart, domainPart = ''] = rawEmail.split('@');
    let formattedName = namePart.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[._-]+/g, ' ');
    formattedName =
      formattedName
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ') || (isTeacher ? 'Maestro' : 'Alumno');

    const institutionSub = domainPart.replace(/(\.edu)?\.mx$|\.org$/i, '').trim();
    let formattedInstitution = 'CETIS 101';
    if (institutionSub) {
      const matchNum = institutionSub.match(/^([a-zA-Z]+)(\d+)$/);
      if (matchNum) {
        formattedInstitution = `${matchNum[1].toUpperCase()} ${matchNum[2]}`;
      } else {
        formattedInstitution = institutionSub.toUpperCase();
      }
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: formattedName,
      email: rawEmail,
      role: isTeacher ? 'profesor' : 'alumno',
      avatarInitial: formattedName.charAt(0).toUpperCase() || (isTeacher ? 'M' : 'A'),
      group: isTeacher ? `Academia • ${formattedInstitution}` : `Grupo 5°A • ${formattedInstitution}`,
      semester: 'Semestre 2026-A • Parcial 1',
      matricula: isTeacher ? undefined : `CET-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      institution: formattedInstitution,
    };

    // Initialize grades if new student
    if (!isTeacher && !grades[cleanEmail] && !grades[rawEmail]) {
      setGrades((prev) => ({
        ...prev,
        [rawEmail]: INITIAL_GRADES['Alumno@cetis101.org'] || INITIAL_GRADES['carlos.ramirez@alumno.edu.mx'],
        [cleanEmail]: INITIAL_GRADES['Alumno@cetis101.org'] || INITIAL_GRADES['carlos.ramirez@alumno.edu.mx'],
      }));
    }

    setCurrentUser(newUser);
    setActiveSection(isTeacher ? 'docente' : 'resumen');
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setCurrentUser(null);
  };

  const switchRole = (newRole: 'alumno' | 'profesor', specificEmail?: string) => {
    if (specificEmail) {
      const match = [...studentsList, ...teachersList].find((u) => u.email === specificEmail);
      if (match) {
        setCurrentUser(match);
        setActiveSection(match.role === 'profesor' ? 'docente' : 'resumen');
        return;
      }
    }

    if (newRole === 'profesor') {
      setCurrentUser(INITIAL_TEACHERS[0]);
      setActiveSection('docente');
    } else {
      setCurrentUser(INITIAL_STUDENTS[0]);
      setActiveSection('resumen');
    }
  };

  // Student Task Actions
  const submitTask = (taskId: string, content: string, attachmentName?: string) => {
    if (!currentUser) return;
    const email = currentUser.email;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSubmission: TaskSubmission = {
            studentEmail: email,
            studentName: currentUser.name,
            submittedAt: new Date().toISOString(),
            content,
            attachmentName: attachmentName || 'Tarea_Entregada.pdf',
          };
          return {
            ...t,
            submissions: {
              ...t.submissions,
              [email]: newSubmission,
            },
          };
        }
        return t;
      })
    );
  };

  const unsubmitTask = (taskId: string) => {
    if (!currentUser) return;
    const email = currentUser.email;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const copy = { ...t.submissions };
          delete copy[email];
          return {
            ...t,
            submissions: copy,
          };
        }
        return t;
      })
    );
  };

  // Teacher Task & Class Actions
  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'submissions'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      submissions: {},
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const createClass = (classData: Omit<ClassGroup, 'id' | 'studentsCount'>) => {
    const newClass: ClassGroup = {
      ...classData,
      id: `cls-${Date.now()}`,
      studentsCount: 36,
    };
    setClasses((prev) => [newClass, ...prev]);
  };

  const gradeTaskSubmission = (taskId: string, studentEmail: string, grade: number, feedback: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.submissions[studentEmail]) {
          return {
            ...t,
            submissions: {
              ...t.submissions,
              [studentEmail]: {
                ...t.submissions[studentEmail],
                grade,
                feedback,
                gradedAt: new Date().toISOString(),
              },
            },
          };
        }
        return t;
      })
    );
  };

  const updateStudentGrade = (studentEmail: string, subjectId: string, partial: 'p1' | 'p2' | 'p3', value: number | null) => {
    setGrades((prev) => {
      const studentGrades = prev[studentEmail] || prev['Alumno@cetis101.org'] || [];
      const updated = studentGrades.map((sg) => {
        if (sg.subjectId === subjectId) {
          return {
            ...sg,
            [partial]: value,
          };
        }
        return sg;
      });
      return {
        ...prev,
        [studentEmail]: updated,
      };
    });
  };

  const recordAttendance = (date: string, subjectName: string, status: AttendanceLog['status'], notes?: string) => {
    const newLog: AttendanceLog = {
      id: `att-${Date.now()}`,
      date,
      subjectName,
      teacherName: currentUser?.name || 'Profesor',
      status,
      notes,
    };
    setAttendanceLogs((prev) => [newLog, ...prev]);

    setAttendance((prev) => {
      const p1 = { ...prev[0] };
      p1.totalDays += 1;
      if (status === 'presente') p1.attended += 1;
      if (status === 'falta') p1.absences += 1;
      if (status === 'retardo') p1.tardies += 1;
      p1.percentage = Math.round((p1.attended / p1.totalDays) * 100);
      return [p1, prev[1], prev[2]];
    });
  };

  const recordStudentAttendance = (
    date: string,
    subjectName: string,
    teacherName: string,
    studentEmail: string,
    studentName: string,
    status: AttendanceLog['status'],
    notes?: string
  ) => {
    const newLog: AttendanceLog = {
      id: `att-${Date.now()}`,
      date,
      subjectName,
      teacherName,
      studentEmail,
      studentName,
      status,
      notes,
    };
    setAttendanceLogs((prev) => [newLog, ...prev]);

    // If marked for the current student, adjust their counters
    setAttendance((prev) => {
      const p1 = { ...prev[0] };
      p1.totalDays += 1;
      if (status === 'presente') p1.attended += 1;
      if (status === 'falta') p1.absences += 1;
      if (status === 'retardo') p1.tardies += 1;
      p1.percentage = Math.round((p1.attended / p1.totalDays) * 100);
      return [p1, prev[1], prev[2]];
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Helpers
  const getStudentTasks = (studentEmail?: string) => {
    const email = studentEmail || currentUser?.email || 'Alumno@cetis101.org';
    const submitted: Task[] = [];
    const pending: Task[] = [];

    tasks.forEach((t) => {
      if (t.submissions[email]) {
        submitted.push(t);
      } else {
        pending.push(t);
      }
    });

    return { submitted, pending, all: tasks };
  };

  const getStudentAverage = (studentEmail?: string) => {
    const email = studentEmail || currentUser?.email || 'Alumno@cetis101.org';
    const list = grades[email] || grades['Alumno@cetis101.org'] || grades['carlos.ramirez@alumno.edu.mx'] || [];

    if (!list.length) {
      return { p1Avg: 8.6, p2Avg: null, p3Avg: null, generalAvg: 8.6, status: 'aprobado' as const };
    }

    const p1Values = list.filter((g) => g.p1 !== null).map((g) => g.p1 as number);
    const p1Avg = p1Values.length ? Number((p1Values.reduce((a, b) => a + b, 0) / p1Values.length).toFixed(1)) : 8.6;

    const p2Values = list.filter((g) => g.p2 !== null).map((g) => g.p2 as number);
    const p2Avg = p2Values.length ? Number((p2Values.reduce((a, b) => a + b, 0) / p2Values.length).toFixed(1)) : null;

    const p3Values = list.filter((g) => g.p3 !== null).map((g) => g.p3 as number);
    const p3Avg = p3Values.length ? Number((p3Values.reduce((a, b) => a + b, 0) / p3Values.length).toFixed(1)) : null;

    const activeAverages = [p1Avg, p2Avg, p3Avg].filter((v): v is number => v !== null);
    const generalAvg = activeAverages.length
      ? Number((activeAverages.reduce((a, b) => a + b, 0) / activeAverages.length).toFixed(1))
      : 8.6;

    let status: 'aprobado' | 'en_riesgo' | 'reprobado' = 'aprobado';
    if (generalAvg < 6.0) status = 'reprobado';
    else if (generalAvg < 7.0) status = 'en_riesgo';

    return { p1Avg, p2Avg, p3Avg, generalAvg, status };
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        studentsList,
        teachersList,
        subjects,
        classes,
        tasks,
        grades,
        attendance,
        attendanceLogs,
        notifications,
        activeSection,
        setActiveSection,
        login,
        logout,
        switchRole,
        submitTask,
        unsubmitTask,
        createTask,
        createClass,
        gradeTaskSubmission,
        updateStudentGrade,
        recordAttendance,
        recordStudentAttendance,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getStudentTasks,
        getStudentAverage,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
