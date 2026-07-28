package com.classhub.leaderboard.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classhub.leaderboard.dto.response.LeaderboardEntryResponse;
import com.classhub.leaderboard.service.LeaderboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/leaderboards")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<LeaderboardEntryResponse>>
    getWorkspaceLeaderboard(
            @PathVariable UUID workspaceId) {

        return ResponseEntity.ok(
                leaderboardService.getWorkspaceLeaderboard(
                        workspaceId
                )
        );
    }
}