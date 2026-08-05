import http from "./http";

/**
 * Request body for creating an assignment.
 *
 * POST /api/v1/assignments
 */
export interface CreateAssignmentRequest {
  workspaceId: string;
  title: string;
  description?: string;
  instructions?: string;
  maxMarks: number;
  dueDate: string;
}

/**
 * Request body for updating an assignment.
 *
 * PUT /api/v1/assignments/{assignmentId}
 */
export interface UpdateAssignmentRequest {
  title: string;
  description?: string;
  instructions?: string;
  maxMarks: number;
  dueDate: string;
}

/**
 * Assignment data returned by the backend.
 */
export interface AssignmentResponse {
  id: string;
  workspaceId: string;
  teacherId: string;
  title: string;
  description: string | null;
  instructions: string | null;
  maxMarks: number;
  dueDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generic response returned after deletion.
 */
export interface MessageResponse {
  message?: string;
}

export const assignmentApi = {
  /**
   * Create an assignment.
   *
   * Teacher only.
   *
   * POST /api/v1/assignments
   */
  createAssignment: async (
    request: CreateAssignmentRequest,
  ): Promise<AssignmentResponse> => {
    const response =
      await http.post<AssignmentResponse>(
        "/api/v1/assignments",
        {
          workspaceId: request.workspaceId,
          title: request.title.trim(),
          description:
            request.description?.trim() || "",
          instructions:
            request.instructions?.trim() || "",
          maxMarks: request.maxMarks,
          dueDate: request.dueDate,
        },
      );

    return response.data;
  },

  /**
   * Get one assignment by ID.
   *
   * GET /api/v1/assignments/{assignmentId}
   */
  getAssignmentById: async (
    assignmentId: string,
  ): Promise<AssignmentResponse> => {
    const response =
      await http.get<AssignmentResponse>(
        `/api/v1/assignments/${assignmentId}`,
      );

    return response.data;
  },

  /**
   * Get all assignments for a workspace.
   *
   * GET /api/v1/assignments/workspace/{workspaceId}
   */
  getAssignmentsByWorkspace: async (
    workspaceId: string,
  ): Promise<AssignmentResponse[]> => {
    const response = await http.get<
      AssignmentResponse[]
    >(
      `/api/v1/assignments/workspace/${workspaceId}`,
    );

    return response.data;
  },

  /**
   * Update an assignment.
   *
   * Teacher only.
   *
   * PUT /api/v1/assignments/{assignmentId}
   */
  updateAssignment: async (
    assignmentId: string,
    request: UpdateAssignmentRequest,
  ): Promise<AssignmentResponse> => {
    const response =
      await http.put<AssignmentResponse>(
        `/api/v1/assignments/${assignmentId}`,
        {
          title: request.title.trim(),
          description:
            request.description?.trim() || "",
          instructions:
            request.instructions?.trim() || "",
          maxMarks: request.maxMarks,
          dueDate: request.dueDate,
        },
      );

    return response.data;
  },

  /**
   * Delete an assignment.
   *
   * Teacher only.
   *
   * DELETE /api/v1/assignments/{assignmentId}
   */
  deleteAssignment: async (
    assignmentId: string,
  ): Promise<MessageResponse> => {
    const response =
      await http.delete<MessageResponse>(
        `/api/v1/assignments/${assignmentId}`,
      );

    return response.data;
  },
};