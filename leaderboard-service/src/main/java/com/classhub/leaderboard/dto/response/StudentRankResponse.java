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
public class StudentRankResponse {

    private UUID workspaceId;

    private UUID studentId;

    private String studentName;

    private Integer rank;

    private Integer totalStudents;

    private Integer totalMarks;

    private Integer gradedSubmissions;

    private BigDecimal averageMarks;

    private BigDecimal percentage;
}