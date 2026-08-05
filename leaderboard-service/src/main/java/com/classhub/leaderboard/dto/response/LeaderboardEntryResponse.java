package com.classhub.leaderboard.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryResponse {

    private Integer rank;
    private UUID studentId;
    private Integer totalMarks;
    private Integer gradedSubmissions;
    private BigDecimal averageMarks;
    private String studentName;

    private String studentEmail;
}