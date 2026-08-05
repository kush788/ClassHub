export type UserRole = "TEACHER" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Workspace {
  id: string;
  name: string;
  subject: string;
  joinCode: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  studentIds: string[]; // List of enrolled student IDs
}

export interface Resource {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string; // Name of teacher
}

export interface Assignment {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  workspaceId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  fileName: string;
  submittedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface EmailNotification {
  id: string;
  senderName: string;
  senderEmail: string;
  recipientId: string;
  recipientEmail: string;
  workspaceId: string;
  workspaceName: string;
  type: "ASSIGNMENT" | "RESOURCE";
  title: string;
  subject: string;
  body: string;
  createdAt: string;
  read: boolean;
  toastAlerted?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  xp: number;
  level: number;
  submissionsCount: number;
  enrolledWorkspacesCount: number;
  badges: string[];
  lastActive: string;
}
