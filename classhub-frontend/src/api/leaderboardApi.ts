import http from "./http";

export interface LeaderboardEntryResponse {
  rank: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  totalMarks: number;
  gradedSubmissions: number;
  averageMarks: number;
}

export const leaderboardApi = {
  getWorkspaceLeaderboard: async (
    workspaceId: string,
  ): Promise<LeaderboardEntryResponse[]> => {
    const response = await http.get<
      LeaderboardEntryResponse[]
    >(
      `/api/v1/leaderboards/workspace/${workspaceId}`,
    );

    return response.data;
  },
};