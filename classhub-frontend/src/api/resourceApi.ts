import http from "./http";

export type ResourceType =
  | "IMAGE"
  | "VIDEO"
  | "PDF"
  | "DOCUMENT"
  | "PRESENTATION"
  | "ARCHIVE"
  | "OTHER";

export interface ResourceResponse {
  id: string;
  workspaceId: string;
  uploadedBy: string;
  title: string;
  description: string | null;
  resourceType: ResourceType;
  fileUrl: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResourceRequest {
  workspaceId: string;
  title: string;
  description?: string;
  file: File;
}

export interface UpdateResourceRequest {
  title: string;
  description?: string;
}

export interface MessageResponse {
  message?: string;
}

export const resourceApi = {
  getResourcesByWorkspace: async (
    workspaceId: string,
  ): Promise<ResourceResponse[]> => {
    const response = await http.get<ResourceResponse[]>(
      `/api/v1/resources/workspace/${workspaceId}`,
    );

    return response.data;
  },

  getResourceById: async (
    resourceId: string,
  ): Promise<ResourceResponse> => {
    const response = await http.get<ResourceResponse>(
      `/api/v1/resources/${resourceId}`,
    );

    return response.data;
  },

  uploadResource: async (
    request: UploadResourceRequest,
  ): Promise<ResourceResponse> => {
    const formData = new FormData();

    formData.append(
      "workspaceId",
      request.workspaceId,
    );

    formData.append(
      "title",
      request.title.trim(),
    );

    formData.append(
      "description",
      request.description?.trim() || "",
    );

    formData.append("file", request.file);

    const response = await http.post<ResourceResponse>(
      "/api/v1/resources/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  updateResource: async (
    resourceId: string,
    request: UpdateResourceRequest,
  ): Promise<ResourceResponse> => {
    const response = await http.put<ResourceResponse>(
      `/api/v1/resources/${resourceId}`,
      {
        title: request.title.trim(),
        description:
          request.description?.trim() || "",
      },
    );

    return response.data;
  },

  deleteResource: async (
    resourceId: string,
  ): Promise<MessageResponse> => {
    const response = await http.delete<MessageResponse>(
      `/api/v1/resources/${resourceId}`,
    );

    return response.data;
  },
};