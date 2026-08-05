import http from "./http";

export type SubmissionStatus =
  | "SUBMITTED"
  | "GRADED";

export interface CreateSubmissionRequest {
  assignmentId: string;
  content: string;
  attachmentUrl?: string;
}

export interface UpdateSubmissionRequest {
  content: string;
  attachmentUrl?: string;
}

export interface GradeSubmissionRequest {
  marksObtained: number;
  feedback?: string;
}

export interface SubmissionResponse {
  id: string;
  assignmentId: string;
  workspaceId: string;
  studentId: string;
  content: string;
  attachmentUrl: string | null;
  marksObtained: number | null;
  feedback: string | null;
  status: SubmissionStatus;
  submittedAt: string;
  updatedAt: string;
}

export interface GradedSubmissionResponse {
  studentId: string;
  workspaceId: string;
  marksObtained: number;
}

export interface MessageResponse {
  message?: string;
}

export const submissionApi = {
  createSubmission: async (
    request: CreateSubmissionRequest,
  ): Promise<SubmissionResponse> => {
    const response =
      await http.post<SubmissionResponse>(
        "/api/v1/submissions",
        {
          assignmentId: request.assignmentId,
          content: request.content.trim(),
          attachmentUrl:
            request.attachmentUrl?.trim() || null,
        },
      );

    return response.data;
  },

  getSubmissionById: async (
    submissionId: string,
  ): Promise<SubmissionResponse> => {
    const response =
      await http.get<SubmissionResponse>(
        `/api/v1/submissions/${submissionId}`,
      );

    return response.data;
  },

  getMySubmissions: async (): Promise<
    SubmissionResponse[]
  > => {
    const response = await http.get<
      SubmissionResponse[]
    >("/api/v1/submissions/my");

    return response.data;
  },

  getSubmissionsByAssignment: async (
    assignmentId: string,
  ): Promise<SubmissionResponse[]> => {
    const response = await http.get<
      SubmissionResponse[]
    >(
      `/api/v1/submissions/assignment/${assignmentId}`,
    );

    return response.data;
  },

  updateSubmission: async (
    submissionId: string,
    request: UpdateSubmissionRequest,
  ): Promise<SubmissionResponse> => {
    const response =
      await http.put<SubmissionResponse>(
        `/api/v1/submissions/${submissionId}`,
        {
          content: request.content.trim(),
          attachmentUrl:
            request.attachmentUrl?.trim() || null,
        },
      );

    return response.data;
  },

  gradeSubmission: async (
    submissionId: string,
    request: GradeSubmissionRequest,
  ): Promise<SubmissionResponse> => {
    const response =
      await http.put<SubmissionResponse>(
        `/api/v1/submissions/${submissionId}/grade`,
        {
          marksObtained:
            request.marksObtained,
          feedback:
            request.feedback?.trim() || "",
        },
      );

    return response.data;
  },

  getGradedSubmissionsForWorkspace:
    async (
      workspaceId: string,
    ): Promise<
      GradedSubmissionResponse[]
    > => {
      const response = await http.get<
        GradedSubmissionResponse[]
      >(
        `/api/v1/submissions/internal/workspace/${workspaceId}/graded`,
      );

      return response.data;
    },

  deleteSubmission: async (
    submissionId: string,
  ): Promise<MessageResponse> => {
    const response =
      await http.delete<MessageResponse>(
        `/api/v1/submissions/${submissionId}`,
      );

    return response.data;
  },
};