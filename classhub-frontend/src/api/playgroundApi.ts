import http from "./http";

/* =========================
   ENUM TYPES
========================= */

export type ProgrammingLanguage =
  | "JAVA"
  | "C"
  | "CPP"
  | "PYTHON";

export type ExecutionStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "INTERNAL_ERROR";

/* =========================
   CODING QUESTION
========================= */

export interface CodingQuestion {
  id: string;
  workspaceId: string;
  teacherId: string;
  title: string;
  description: string;
  sampleInput: string | null;
  sampleOutput: string | null;
  allowedLanguages: ProgrammingLanguage[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCodingQuestionRequest {
  workspaceId: string;
  title: string;
  description: string;
  sampleInput?: string;
  sampleOutput?: string;
  allowedLanguages: ProgrammingLanguage[];
}

export interface UpdateCodingQuestionRequest {
  title: string;
  description: string;
  sampleInput?: string;
  sampleOutput?: string;
  allowedLanguages: ProgrammingLanguage[];
  active: boolean;
}

/* =========================
   RUN CODE
========================= */

export interface RunCodeRequest {
  questionId: string;
  language: ProgrammingLanguage;
  sourceCode: string;
  standardInput?: string;
}

export interface RunCodeResponse {
  questionId: string;
  language: ProgrammingLanguage;
  output: string | null;
  compileError: string | null;
  runtimeError: string | null;
  status: ExecutionStatus;
  executionTimeMs: number | null;
  executionToken: string | null;
}

/* =========================
   SAVE CODE RESPONSE
========================= */

export interface SaveCodeResponseRequest {
  questionId: string;
  language: ProgrammingLanguage;
  sourceCode: string;
  standardInput?: string;
  output?: string | null;
  compileError?: string | null;
  runtimeError?: string | null;
  executionStatus: ExecutionStatus;
  executionTimeMs?: number | null;
}

export interface SavedCodeResponse {
  id: string;
  questionId: string;
  workspaceId: string;
  studentId: string;
  language: ProgrammingLanguage;
  sourceCode: string;
  standardInput: string | null;
  output: string | null;
  compileError: string | null;
  runtimeError: string | null;
  executionStatus: ExecutionStatus;
  executionTimeMs: number | null;
  createdAt: string;
  updatedAt: string;
  studentName: string | null;
  studentEmail: string | null;
}

/* =========================
   MESSAGE RESPONSE
========================= */

export interface MessageResponse {
  message: string;
}

/* =========================
   PLAYGROUND API
========================= */

export const playgroundApi = {
  /* ---------- Questions ---------- */

  getWorkspaceQuestions: async (
    workspaceId: string,
  ): Promise<CodingQuestion[]> => {
    const response = await http.get<CodingQuestion[]>(
      `/api/v1/playground/questions/workspace/${workspaceId}`,
    );

    return response.data;
  },

  getQuestionById: async (
    questionId: string,
  ): Promise<CodingQuestion> => {
    const response = await http.get<CodingQuestion>(
      `/api/v1/playground/questions/${questionId}`,
    );

    return response.data;
  },

  getTeacherQuestions: async (): Promise<
    CodingQuestion[]
  > => {
    const response = await http.get<CodingQuestion[]>(
      "/api/v1/playground/questions/teacher",
    );

    return response.data;
  },

  createQuestion: async (
    request: CreateCodingQuestionRequest,
  ): Promise<CodingQuestion> => {
    const response = await http.post<CodingQuestion>(
      "/api/v1/playground/questions",
      request,
    );

    return response.data;
  },

  updateQuestion: async (
    questionId: string,
    request: UpdateCodingQuestionRequest,
  ): Promise<CodingQuestion> => {
    const response = await http.put<CodingQuestion>(
      `/api/v1/playground/questions/${questionId}`,
      request,
    );

    return response.data;
  },

  deleteQuestion: async (
    questionId: string,
  ): Promise<MessageResponse> => {
    const response = await http.delete<MessageResponse>(
      `/api/v1/playground/questions/${questionId}`,
    );

    return response.data;
  },

  /* ---------- Code execution ---------- */

  runCode: async (
    request: RunCodeRequest,
  ): Promise<RunCodeResponse> => {
    const response = await http.post<RunCodeResponse>(
      "/api/v1/playground/run",
      request,
    );

    return response.data;
  },

  /* ---------- Student responses ---------- */

  saveResponse: async (
    request: SaveCodeResponseRequest,
  ): Promise<SavedCodeResponse> => {
    const response =
      await http.post<SavedCodeResponse>(
        "/api/v1/playground/responses",
        request,
      );

    return response.data;
  },

  getMyResponse: async (
    questionId: string,
  ): Promise<SavedCodeResponse> => {
    const response =
      await http.get<SavedCodeResponse>(
        `/api/v1/playground/responses/question/${questionId}/me`,
      );

    return response.data;
  },

  getMyWorkspaceResponses: async (
    workspaceId: string,
  ): Promise<SavedCodeResponse[]> => {
    const response = await http.get<
      SavedCodeResponse[]
    >(
      `/api/v1/playground/responses/workspace/${workspaceId}/me`,
    );

    return response.data;
  },

  /* ---------- Teacher response view ---------- */

  getQuestionResponses: async (
    questionId: string,
  ): Promise<SavedCodeResponse[]> => {
    const response = await http.get<
      SavedCodeResponse[]
    >(
      `/api/v1/playground/responses/question/${questionId}`,
    );

    return response.data;
  },
};