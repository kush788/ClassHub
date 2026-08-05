import { User, Workspace, Resource, Assignment, Submission, AuthResponse, EmailNotification, LeaderboardEntry } from "../types";

// Constant keys for LocalStorage
const USERS_KEY = "classhub_users";
const WORKSPACES_KEY = "classhub_workspaces";
const RESOURCES_KEY = "classhub_resources";
const ASSIGNMENTS_KEY = "classhub_assignments";
const SUBMISSIONS_KEY = "classhub_submissions";
const NOTIFICATIONS_KEY = "classhub_notifications";
const LOGGED_IN_USER_KEY = "classhub_current_user";
const AUTH_TOKEN_KEY = "classhub_token";

// Interfaces for LocalMemory / LocalDB
interface UserRecord extends User {
  passwordHash: string;
}

// Initial Mock Data
const INITIAL_USERS: UserRecord[] = [
  {
    id: "t-1",
    name: "Dr. Sarah Jenkins",
    email: "teacher@classhub.com",
    role: "TEACHER",
    passwordHash: "password"
  },
  {
    id: "t-2",
    name: "Prof. Robert Lang",
    email: "robert@classhub.com",
    role: "TEACHER",
    passwordHash: "password"
  },
  {
    id: "s-1",
    name: "Alex Rivers",
    email: "student@classhub.com",
    role: "STUDENT",
    passwordHash: "password"
  },
  {
    id: "s-2",
    name: "Jane Doe",
    email: "jane@classhub.com",
    role: "STUDENT",
    passwordHash: "password"
  }
];

const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    name: "Advanced Mathematics",
    subject: "Calculus BC",
    joinCode: "MATH42",
    teacherId: "t-1",
    teacherName: "Dr. Sarah Jenkins",
    teacherEmail: "teacher@classhub.com",
    studentIds: ["s-1", "s-2"]
  },
  {
    id: "ws-2",
    name: "Creative Writing 101",
    subject: "English Literature",
    joinCode: "WRITE7",
    teacherId: "t-1",
    teacherName: "Dr. Sarah Jenkins",
    teacherEmail: "teacher@classhub.com",
    studentIds: ["s-2"]
  },
  {
    id: "ws-3",
    name: "Introduction to Physics",
    subject: "AP Physics",
    joinCode: "PHYS88",
    teacherId: "t-2",
    teacherName: "Prof. Robert Lang",
    teacherEmail: "robert@classhub.com",
    studentIds: ["s-1"]
  }
];

const INITIAL_RESOURCES: Resource[] = [
  {
    id: "res-1",
    workspaceId: "ws-1",
    title: "Syllabus & Lecture Schedule",
    description: "Course policies, textbook reading list, and grading scale breakdown for this semester.",
    fileName: "Calculus_BC_Syllabus.pdf",
    uploadedAt: "2026-06-01T10:00:00.000Z",
    uploadedBy: "Dr. Sarah Jenkins"
  },
  {
    id: "res-2",
    workspaceId: "ws-1",
    title: "Chapter 1: Limits & Continuity",
    description: "Handout containing graphic illustrations of one-sided limits and practice problems.",
    fileName: "Chapter_1_Limits_Review.pdf",
    uploadedAt: "2026-06-05T14:30:00.000Z",
    uploadedBy: "Dr. Sarah Jenkins"
  },
  {
    id: "res-3",
    workspaceId: "ws-2",
    title: "The Elements of Style Quick Guide",
    description: "A summary of standard grammatical rules, common principles of composition, and style guide.",
    fileName: "Elements_of_Style_Short.pdf",
    uploadedAt: "2026-06-02T09:15:00.000Z",
    uploadedBy: "Dr. Sarah Jenkins"
  }
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "as-1",
    workspaceId: "ws-1",
    title: "Problem Set 1 - Finding Limits",
    description: "Complete problems 1-15 on page 45 of the primary textbook. Show all intermediate direct substitution steps.",
    dueDate: "2026-06-20",
    createdAt: "2026-06-05T14:35:00.000Z"
  },
  {
    id: "as-2",
    workspaceId: "ws-1",
    title: "Problem Set 2 - The Chains Rule",
    description: "Practice worksheet applying derivative formulas to composite functions. Show the outer-inner logic.",
    dueDate: "2026-06-27",
    createdAt: "2026-06-10T11:00:00.000Z"
  },
  {
    id: "as-3",
    workspaceId: "ws-2",
    title: "Descriptive Narrative Essay Draft",
    description: "Write a 500-word descriptive essay detailing an early childhood memory with distinct sensory descriptions.",
    dueDate: "2026-06-18",
    createdAt: "2026-06-08T09:00:00.000Z"
  }
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    assignmentId: "as-1",
    workspaceId: "ws-1",
    studentId: "s-1",
    studentName: "Alex Rivers",
    studentEmail: "student@classhub.com",
    fileName: "Alex_Rivers_Limits_HW1.pdf",
    submittedAt: "2026-06-12T16:45:00.000Z"
  }
];

const INITIAL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: "notif-1",
    senderName: "Dr. Sarah Jenkins",
    senderEmail: "teacher@classhub.com",
    recipientId: "s-1",
    recipientEmail: "student@classhub.com",
    workspaceId: "ws-1",
    workspaceName: "Advanced Mathematics",
    type: "ASSIGNMENT",
    title: "Problem Set 2 - The Chains Rule",
    subject: "New Assignment: Problem Set 2 - The Chains Rule",
    body: "Dr. Sarah Jenkins posted a new homework assignment 'Problem Set 2 - The Chains Rule' in Advanced Mathematics. Due date: 2026-06-27.",
    createdAt: "2026-06-10T11:00:00.000Z",
    read: false,
    toastAlerted: false
  },
  {
    id: "notif-2",
    senderName: "Dr. Sarah Jenkins",
    senderEmail: "teacher@classhub.com",
    recipientId: "s-1",
    recipientEmail: "student@classhub.com",
    workspaceId: "ws-1",
    workspaceName: "Advanced Mathematics",
    type: "RESOURCE",
    title: "Chapter 1: Limits & Continuity",
    subject: "New Resource Material: Chapter 1: Limits & Continuity",
    body: "Dr. Sarah Jenkins uploaded new study material 'Chapter 1: Limits & Continuity' (Chapter_1_Limits_Review.pdf) in Advanced Mathematics.",
    createdAt: "2026-06-05T14:30:00.000Z",
    read: true,
    toastAlerted: true
  }
];

// Database Helper
const getDB = <T>(key: string, initial: T): T => {
  const value = localStorage.getItem(key);
  if (!value) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(value);
  } catch {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
};

const setDB = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize db lists from LocalStorage or seed defaults
const getUsers = (): UserRecord[] => getDB<UserRecord[]>(USERS_KEY, INITIAL_USERS);
const getWorkspaces = (): Workspace[] => getDB<Workspace[]>(WORKSPACES_KEY, INITIAL_WORKSPACES);
const getResources = (): Resource[] => getDB<Resource[]>(RESOURCES_KEY, INITIAL_RESOURCES);
const getAssignments = (): Assignment[] => getDB<Assignment[]>(ASSIGNMENTS_KEY, INITIAL_ASSIGNMENTS);
const getSubmissions = (): Submission[] => getDB<Submission[]>(SUBMISSIONS_KEY, INITIAL_SUBMISSIONS);
const getNotifications = (): EmailNotification[] => getDB<EmailNotification[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);

// Helper function to send simulated email notifications to all students in a workspace
const dispatchEmailNotificationsForWorkspace = (payload: {
  workspaceId: string;
  type: "ASSIGNMENT" | "RESOURCE";
  title: string;
  description: string;
  senderName: string;
  senderEmail: string;
  dueDate?: string;
  fileName?: string;
}): EmailNotification[] => {
  const workspaces = getWorkspaces();
  const workspace = workspaces.find((w) => w.id === payload.workspaceId);
  if (!workspace) return [];

  const users = getUsers();
  const enrolledStudents = users.filter((u) => workspace.studentIds.includes(u.id));
  const notifications = getNotifications();

  const newNotifications: EmailNotification[] = [];

  for (const student of enrolledStudents) {
    const isAssign = payload.type === "ASSIGNMENT";
    const subject = isAssign
      ? `New Assignment Posted: ${payload.title}`
      : `New Resource Uploaded: ${payload.title}`;

    const body = isAssign
      ? `${payload.senderName} posted a new assignment '${payload.title}' in ${workspace.name}. ${payload.dueDate ? `Due date: ${payload.dueDate}.` : ''}\n\nPrompt: ${payload.description}`
      : `${payload.senderName} published new class material '${payload.title}' (${payload.fileName || 'Material'}) in ${workspace.name}.\n\nDetails: ${payload.description}`;

    const notif: EmailNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      senderName: payload.senderName,
      senderEmail: payload.senderEmail,
      recipientId: student.id,
      recipientEmail: student.email,
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      type: payload.type,
      title: payload.title,
      subject,
      body,
      createdAt: new Date().toISOString(),
      read: false,
      toastAlerted: false
    };

    notifications.push(notif);
    newNotifications.push(notif);
  }

  setDB(NOTIFICATIONS_KEY, notifications);
  return newNotifications;
};

// Simulated Network delay helper
const delay = (ms?: number) => {
  const waitMs = ms ?? Math.floor(Math.random() * 300) + 200; // 200 - 500ms delay
  return new Promise((resolve) => setTimeout(resolve, waitMs));
};

// Generate highly unique classroom codes
const generateJoinCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Ensure uniqueness
  const workspaces = getWorkspaces();
  if (workspaces.some((w) => w.joinCode === code)) {
    return generateJoinCode();
  }
  return code;
};

export const mockApi = {
  // 1. AUTHENTICATION SERVICE
  auth: {
    async register(payload: { name: string; email: string; passwordHash: string; role: "TEACHER" | "STUDENT" }): Promise<User> {
      await delay();
      const users = getUsers();
      
      const emailLower = payload.email.trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === emailLower)) {
        throw new Error("An account with this email address already exists.");
      }

      const newUser: UserRecord = {
        id: `user-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: payload.name.trim(),
        email: emailLower,
        role: payload.role,
        passwordHash: payload.passwordHash
      };

      users.push(newUser);
      setDB(USERS_KEY, users);

      // Return user without passwordHash
      const { passwordHash, ...userResponse } = newUser;
      return userResponse;
    },

    async login(payload: { email: string; passwordHash: string }): Promise<AuthResponse> {
      await delay();
      const users = getUsers();
      const emailLower = payload.email.trim().toLowerCase();
      
      const matched = users.find(
        (u) => u.email.toLowerCase() === emailLower && u.passwordHash === payload.passwordHash
      );

      if (!matched) {
        throw new Error("Invalid email or password combination.");
      }

      const mockToken = `jwt-${matched.id}-${Date.now()}`;
      
      // Store in LocalStorage token context
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(matched));
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);

      const { passwordHash, ...userResponse } = matched;
      return {
        token: mockToken,
        user: userResponse
      };
    },

    logout(): void {
      localStorage.removeItem(LOGGED_IN_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    },

    getCurrentUser(): User | null {
      const userStr = localStorage.getItem(LOGGED_IN_USER_KEY);
      if (!userStr) return null;
      try {
        const u = JSON.parse(userStr);
        if (u && u.id) {
          const { passwordHash, ...userResponse } = u;
          return userResponse;
        }
        return null;
      } catch {
        return null;
      }
    },

    getToken(): string | null {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
  },

  // 2. WORKSPACE SERVICE
  workspaces: {
    async getAll(): Promise<Workspace[]> {
      await delay();
      const workspaces = getWorkspaces();
      const currentUser = mockApi.auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error("Unauthorized access. Please log in first.");
      }

      if (currentUser.role === "TEACHER") {
        return workspaces.filter((w) => w.teacherId === currentUser.id);
      } else {
        return workspaces.filter((w) => w.studentIds.includes(currentUser.id));
      }
    },

    async create(payload: { name: string; subject: string }): Promise<Workspace> {
      await delay();
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser || currentUser.role !== "TEACHER") {
        throw new Error("Permission denied. Only teachers can spawn workspaces.");
      }

      const workspaces = getWorkspaces();
      const newWorkspace: Workspace = {
        id: `ws-${Date.now()}`,
        name: payload.name.trim(),
        subject: payload.subject.trim(),
        joinCode: generateJoinCode(),
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        teacherEmail: currentUser.email,
        studentIds: []
      };

      workspaces.push(newWorkspace);
      setDB(WORKSPACES_KEY, workspaces);
      return newWorkspace;
    },

    async join(payload: { joinCode: string }): Promise<Workspace> {
      await delay();
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser || currentUser.role !== "STUDENT") {
        throw new Error("Permission denied. Only students can enroll in workspaces.");
      }

      const workspaces = getWorkspaces();
      const targetCode = payload.joinCode.trim().toUpperCase();
      
      const targetWorkspaceIndex = workspaces.findIndex((w) => w.joinCode.toUpperCase() === targetCode);
      if (targetWorkspaceIndex === -1) {
        throw new Error("Classroom not found. Please review the join code and try again.");
      }

      const workspace = workspaces[targetWorkspaceIndex];
      if (workspace.studentIds.includes(currentUser.id)) {
        throw new Error("You are already enrolled in this workspace.");
      }

      // Add student
      workspace.studentIds.push(currentUser.id);
      workspaces[targetWorkspaceIndex] = workspace;
      setDB(WORKSPACES_KEY, workspaces);

      return workspace;
    },

    async getById(id: string): Promise<Workspace & { students: User[] }> {
      await delay();
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser) throw new Error("Authentication credential required.");

      const workspaces = getWorkspaces();
      const workspace = workspaces.find((w) => w.id === id);
      if (!workspace) throw new Error("Workspace not found.");

      // Check access permission
      const hasAccess = 
        workspace.teacherId === currentUser.id || 
        workspace.studentIds.includes(currentUser.id);
      
      if (!hasAccess) {
        throw new Error("Access Denied. You do not belong to this workspace.");
      }

      // Populate students
      const users = getUsers();
      const students: User[] = users
        .filter((u) => workspace.studentIds.includes(u.id))
        .map(({ passwordHash, ...safeUser }) => safeUser);

      return {
        ...workspace,
        students
      };
    },

    async removeStudent(workspaceId: string, studentId: string): Promise<void> {
      await delay();
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser || currentUser.role !== "TEACHER") {
        throw new Error("Unauthorized. Only teachers can remove students.");
      }

      const workspaces = getWorkspaces();
      const workspaceIndex = workspaces.findIndex((w) => w.id === workspaceId);
      if (workspaceIndex === -1) {
        throw new Error("Workspace not found.");
      }

      const workspace = workspaces[workspaceIndex];
      if (workspace.teacherId !== currentUser.id) {
        throw new Error("Unauthorized workspace access.");
      }

      // Remove student ID
      workspace.studentIds = workspace.studentIds.filter((id) => id !== studentId);
      workspaces[workspaceIndex] = workspace;
      setDB(WORKSPACES_KEY, workspaces);
    }
  },

  // 3. RESOURCES SERVICE
  resources: {
    async getByWorkspaceId(id: string): Promise<Resource[]> {
      await delay();
      // Ensure user belongs to workspace
      await mockApi.workspaces.getById(id);
      
      const resources = getResources();
      return resources.filter((r) => r.workspaceId === id);
    },

    async create(workspaceId: string, payload: { title: string; description: string; fileName: string }): Promise<Resource> {
      await delay();
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser || currentUser.role !== "TEACHER") {
        throw new Error("Unauthorized. Only teachers can upload resources.");
      }

      // Verify the teacher owns the workspace
      const workspace = await mockApi.workspaces.getById(workspaceId);
      if (workspace.teacherId !== currentUser.id) {
        throw new Error("Unauthorized access to this classroom.");
      }

      const resources = getResources();
      const newResource: Resource = {
        id: `res-${Date.now()}`,
        workspaceId,
        title: payload.title.trim(),
        description: payload.description.trim(),
        fileName: payload.fileName,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser.name
      };

      resources.push(newResource);
      setDB(RESOURCES_KEY, resources);

      // Trigger simulated email notification dispatch to enrolled students
      dispatchEmailNotificationsForWorkspace({
        workspaceId,
        type: "RESOURCE",
        title: payload.title.trim(),
        description: payload.description.trim(),
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        fileName: payload.fileName
      });

      return newResource;
    }
  },

  // 4. ASSIGNMENTS SERVICE
  assignments: {
    async getByWorkspaceId(id: string): Promise<Assignment[]> {
      await delay();
      // Ensure user belongs to workspace
      await mockApi.workspaces.getById(id);
      
      const assignments = getAssignments();
      return assignments.filter((a) => a.workspaceId === id);
    },

    async create(workspaceId: string, payload: { title: string; description: string; dueDate: string }): Promise<Assignment> {
      await delay();
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser || currentUser.role !== "TEACHER") {
        throw new Error("Unauthorized. Only teachers can publish assignments.");
      }

      // Verify ownership
      const workspace = await mockApi.workspaces.getById(workspaceId);
      if (workspace.teacherId !== currentUser.id) {
        throw new Error("Unauthorized workspace access.");
      }

      const assignments = getAssignments();
      const newAssignment: Assignment = {
        id: `as-${Date.now()}`,
        workspaceId,
        title: payload.title.trim(),
        description: payload.description.trim(),
        dueDate: payload.dueDate,
        createdAt: new Date().toISOString()
      };

      assignments.push(newAssignment);
      setDB(ASSIGNMENTS_KEY, assignments);

      // Trigger simulated email notification dispatch to enrolled students
      dispatchEmailNotificationsForWorkspace({
        workspaceId,
        type: "ASSIGNMENT",
        title: payload.title.trim(),
        description: payload.description.trim(),
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        dueDate: payload.dueDate
      });

      return newAssignment;
    },

    // 5. SUBMISSIONS SERVICE
    async getSubmissionsByWorkspace(workspaceId: string): Promise<Submission[]> {
      await delay();
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser) throw new Error("Unauthorized");

      const submissions = getSubmissions();
      // Teachers see all submissions for a workspace; students see only their own
      if (currentUser.role === "TEACHER") {
        return submissions.filter((s) => s.workspaceId === workspaceId);
      } else {
        return submissions.filter((s) => s.workspaceId === workspaceId && s.studentId === currentUser.id);
      }
    },

    async submit(assignmentId: string, payload: { fileName: string }): Promise<Submission> {
      await delay();
      const currentUser = mockApi.auth.getCurrentUser();
      if (!currentUser || currentUser.role !== "STUDENT") {
        throw new Error("Only students can submit assignments.");
      }

      // Find assignment & workspace to log correctness
      const assignments = getAssignments();
      const assignment = assignments.find((a) => a.id === assignmentId);
      if (!assignment) {
        throw new Error("Assignment not found.");
      }

      const submissions = getSubmissions();
      
      // Determine if they've already submitted; if so, replace it (update) or add new
      const existingIdx = submissions.findIndex(
        (s) => s.assignmentId === assignmentId && s.studentId === currentUser.id
      );

      const newSubmission: Submission = {
        id: existingIdx !== -1 ? submissions[existingIdx].id : `sub-${Date.now()}`,
        assignmentId,
        workspaceId: assignment.workspaceId,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        fileName: payload.fileName,
        submittedAt: new Date().toISOString()
      };

      if (existingIdx !== -1) {
        submissions[existingIdx] = newSubmission;
      } else {
        submissions.push(newSubmission);
      }

      setDB(SUBMISSIONS_KEY, submissions);
      return newSubmission;
    }
  },

  // 6. EMAIL NOTIFICATION SERVICE
  notifications: {
    async getForUser(userId: string): Promise<EmailNotification[]> {
      await delay(100);
      const list = getNotifications();
      return list
        .filter((n) => n.recipientId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    async getUnreadCount(userId: string): Promise<number> {
      const list = getNotifications();
      return list.filter((n) => n.recipientId === userId && !n.read).length;
    },

    async markAsRead(notificationId: string): Promise<void> {
      const list = getNotifications();
      const idx = list.findIndex((n) => n.id === notificationId);
      if (idx !== -1) {
        list[idx].read = true;
        setDB(NOTIFICATIONS_KEY, list);
      }
    },

    async markAllAsRead(userId: string): Promise<void> {
      const list = getNotifications();
      let updated = false;
      for (const n of list) {
        if (n.recipientId === userId && !n.read) {
          n.read = true;
          updated = true;
        }
      }
      if (updated) {
        setDB(NOTIFICATIONS_KEY, list);
      }
    },

    async getPendingToastAlerts(userId: string): Promise<EmailNotification[]> {
      const list = getNotifications();
      return list.filter((n) => n.recipientId === userId && !n.toastAlerted);
    },

    async markToastAlerted(notificationIds: string[]): Promise<void> {
      const list = getNotifications();
      let updated = false;
      for (const n of list) {
        if (notificationIds.includes(n.id)) {
          n.toastAlerted = true;
          updated = true;
        }
      }
      if (updated) {
        setDB(NOTIFICATIONS_KEY, list);
      }
    }
  },

  // 7. DYNAMIC LEADERBOARD SERVICE
  leaderboard: {
    async getLeaderboard(workspaceId?: string): Promise<LeaderboardEntry[]> {
      await delay(150);
      const users = getUsers().filter((u) => u.role === "STUDENT");
      const workspaces = getWorkspaces();
      const submissions = getSubmissions();
      const assignments = getAssignments();

      let targetStudents = users;

      if (workspaceId) {
        const ws = workspaces.find((w) => w.id === workspaceId);
        if (ws) {
          targetStudents = users.filter((u) => ws.studentIds.includes(u.id));
        }
      }

      const entries: LeaderboardEntry[] = targetStudents.map((student) => {
        // Find workspaces enrolled
        const studentWorkspaces = workspaces.filter((w) => w.studentIds.includes(student.id));
        
        // Find submissions
        const studentSubmissions = workspaceId
          ? submissions.filter((s) => s.studentId === student.id && s.workspaceId === workspaceId)
          : submissions.filter((s) => s.studentId === student.id);

        let xp = 0;
        
        // Base XP for enrollment: +25 XP per workspace
        xp += studentWorkspaces.length * 25;

        // Base XP per submission: +100 XP
        xp += studentSubmissions.length * 100;

        // Timeliness check: +50 XP if submitted on or before due date
        let onTimeCount = 0;
        for (const sub of studentSubmissions) {
          const assign = assignments.find((a) => a.id === sub.assignmentId);
          if (assign && assign.dueDate) {
            const subDate = new Date(sub.submittedAt);
            const dueDate = new Date(assign.dueDate + "T23:59:59");
            if (subDate <= dueDate) {
              xp += 50;
              onTimeCount++;
            }
          }
        }

        // Calculate badges
        const badges: string[] = [];
        if (studentSubmissions.length >= 1) badges.push("Early Bird");
        if (studentSubmissions.length >= 2) badges.push("Assignment Master");
        if (studentWorkspaces.length >= 2) badges.push("Multi-Class Scholar");
        if (onTimeCount >= 1) badges.push("On-Time Ace");

        const level = Math.floor(xp / 150) + 1;

        // Recent activity
        const lastSub = [...studentSubmissions].sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        )[0];

        const lastActive = lastSub
          ? `Submitted HW on ${new Date(lastSub.submittedAt).toLocaleDateString()}`
          : studentWorkspaces.length > 0
          ? `Enrolled in ${studentWorkspaces.length} class(es)`
          : "Recently joined ClassHub";

        return {
          rank: 0,
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          xp,
          level,
          submissionsCount: studentSubmissions.length,
          enrolledWorkspacesCount: studentWorkspaces.length,
          badges,
          lastActive
        };
      });

      // Sort descending by XP, then submissions count
      entries.sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp;
        return b.submissionsCount - a.submissionsCount;
      });

      // Assign ranks and top badges
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
        if (entry.rank === 1 && entry.xp > 0) {
          if (!entry.badges.includes("Class Champ")) {
            entry.badges.unshift("Class Champ");
          }
        }
      });

      return entries;
    }
  }
};

