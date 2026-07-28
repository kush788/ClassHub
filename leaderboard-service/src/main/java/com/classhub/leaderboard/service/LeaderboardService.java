package com.classhub.leaderboard.service;

import java.util.List;
import java.util.UUID;

import com.classhub.leaderboard.dto.response.LeaderboardEntryResponse;

public interface LeaderboardService {

    List<LeaderboardEntryResponse> getWorkspaceLeaderboard(
            UUID workspaceId
    );
}