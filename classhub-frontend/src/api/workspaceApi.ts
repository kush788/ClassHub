import http from "./http";

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  subject: string;
}

export interface JoinWorkspaceRequest {
  joinCode: string;
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  joinCode: string;
  teacherId: string;
  active: boolean;
  enrolledStudentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberResponse {
  membershipId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  joinedAt: string;
}

export interface JoinWorkspaceResponse {
  message?: string;
  workspaceId?: string;
  workspaceName?: string;
  joinedAt?: string;
}

export interface RegenerateJoinCodeResponse {
  joinCode?: string;
  message?: string;
}

export interface WorkspaceAccessResponse {
  workspaceId?: string;
  userId?: string;
  role?: string;
  hasAccess?: boolean;
  teacher?: boolean;
  student?: boolean;
}

export const workspaceApi = {
  createWorkspace: async (
    request: CreateWorkspaceRequest,
  ): Promise<WorkspaceResponse> => {
    const response = await http.post<WorkspaceResponse>(
      "/api/v1/workspaces",
      request,
    );

    return response.data;
  },

  getMyWorkspaces: async (): Promise<WorkspaceResponse[]> => {
    const response = await http.get<WorkspaceResponse[]>(
      "/api/v1/workspaces/my",
    );

    return response.data;
  },

  getJoinedWorkspaces: async (): Promise<WorkspaceResponse[]> => {
    const response = await http.get<WorkspaceResponse[]>(
      "/api/v1/workspaces/joined",
    );

    return response.data;
  },

  joinWorkspace: async (
    joinCode: string,
  ): Promise<JoinWorkspaceResponse> => {
    const response = await http.post<JoinWorkspaceResponse>(
      "/api/v1/workspaces/join",
      {
        joinCode: joinCode.trim().toUpperCase(),
      },
    );

    return response.data;
  },

  getWorkspaceById: async (
    workspaceId: string,
  ): Promise<WorkspaceResponse> => {
    const response = await http.get<WorkspaceResponse>(
      `/api/v1/workspaces/${workspaceId}`,
    );

    return response.data;
  },

  updateWorkspace: async (
    workspaceId: string,
    request: CreateWorkspaceRequest,
  ): Promise<WorkspaceResponse> => {
    const response = await http.put<WorkspaceResponse>(
      `/api/v1/workspaces/${workspaceId}`,
      request,
    );

    return response.data;
  },

  deleteWorkspace: async (
    workspaceId: string,
  ): Promise<void> => {
    await http.delete(`/api/v1/workspaces/${workspaceId}`);
  },

  getWorkspaceMembers: async (
    workspaceId: string,
  ): Promise<WorkspaceMemberResponse[]> => {
    const response = await http.get<WorkspaceMemberResponse[]>(
      `/api/v1/workspaces/${workspaceId}/members`,
    );

    return response.data;
  },

  removeStudent: async (
    workspaceId: string,
    studentId: string,
  ): Promise<void> => {
    await http.delete(
      `/api/v1/workspaces/${workspaceId}/members/${studentId}`,
    );
  },

  regenerateJoinCode: async (
    workspaceId: string,
  ): Promise<RegenerateJoinCodeResponse> => {
    const response =
      await http.put<RegenerateJoinCodeResponse>(
        `/api/v1/workspaces/${workspaceId}/regenerate-code`,
      );

    return response.data;
  },

  getWorkspaceAccess: async (
    workspaceId: string,
  ): Promise<WorkspaceAccessResponse> => {
    const response = await http.get<WorkspaceAccessResponse>(
      `/api/v1/workspaces/${workspaceId}/access`,
    );

    return response.data;
  },
};