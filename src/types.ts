export type UserRole = 'alumno' | 'profesor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitial: string;
  group: string;
  semester: string;
  matricula?: string;
  institution?: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  code: string;
  color: string;
}

export interface ClassGroup {
  id: string;
  name: string; // e.g. "Matemáticas V - Grupo 5°A"
  subjectName: string;
  teacherName: string;
  teacherEmail: string;
  code: string;
  schedule: string;
  color: string;
  studentsCount: number;
}

export interface TaskSubmission {
  studentEmail: string;
  studentName: string;
  submittedAt: string;
  content: string;
  attachmentName?: string;
  grade?: number;
  maxPoints?: number;
  feedback?: string;
  gradedAt?: string;
}

export interface Task {
  id: string;
  subjectId: string;
  subjectName: string;
  teacherName: string;
  classId?: string;
  className?: string;
  title: string;
  description: string;
  deadlineDate: string; // YYYY-MM-DD
  deadlineTime: string; // HH:mm
  partial: 1 | 2 | 3;
  maxPoints: number;
  createdAt: string;
  submissions: Record<string, TaskSubmission>; // keyed by student email
}

export interface AttendanceRecord {
  partial: 1 | 2 | 3;
  totalDays: number;
  attended: number;
  absences: number;
  tardies: number;
  percentage: number;
}

export interface AttendanceLog {
  id: string;
  date: string;
  subjectName: string;
  teacherName?: string;
  studentEmail?: string;
  studentName?: string;
  status: 'presente' | 'falta' | 'retardo' | 'justificada';
  notes?: string;
}

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  teacher: string;
  p1: number | null;
  p2: number | null;
  p3: number | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  date: string;
  read: boolean;
  linkSection?: 'tareas' | 'asistencia' | 'calificaciones' | 'calendario';
}
