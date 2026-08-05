package com.classhub.leaderboard.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.classhub.leaderboard.client.AuthServiceClient;
import com.classhub.leaderboard.client.SubmissionClient;
import com.classhub.leaderboard.client.WorkspaceClient;
import com.classhub.leaderboard.dto.GradedSubmissionData;
import com.classhub.leaderboard.dto.external.InternalUserResponse;
import com.classhub.leaderboard.dto.WorkspaceMemberData;
import com.classhub.leaderboard.dto.response.LeaderboardEntryResponse;
import com.classhub.leaderboard.service.LeaderboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl
        implements LeaderboardService {

    private final SubmissionClient submissionClient;
    private final WorkspaceClient workspaceClient;
    private final AuthServiceClient authServiceClient;

    @Override
    public List<LeaderboardEntryResponse>
    getWorkspaceLeaderboard(UUID workspaceId) {

        /*
         * Fetch all students who joined the workspace.
         */
        List<WorkspaceMemberData> members =
                workspaceClient.getWorkspaceMembers(
                        workspaceId
                );

        /*
         * Fetch all graded submissions from the
         * Submission Service.
         */
        List<GradedSubmissionData> gradedSubmissions =
                submissionClient
                        .getGradedSubmissionsByWorkspace(
                                workspaceId
                        );

        /*
         * Group graded submissions by student ID.
         */
        Map<UUID, List<GradedSubmissionData>>
        submissionsByStudent =
                gradedSubmissions.stream()
                        .collect(
                                Collectors.groupingBy(
                                        GradedSubmissionData
                                                ::getStudentId
                                )
                        );

        /*
         * Create leaderboard entries for all workspace
         * members, including students with no graded
         * submissions.
         */
        List<LeaderboardEntryResponse> leaderboard =
                members.stream()
                        .map(member ->
                                createLeaderboardEntry(
                                        member,
                                        submissionsByStudent
                                                .getOrDefault(
                                                        member.getStudentId(),
                                                        List.of()
                                                )
                                )
                        )
                        .sorted(
                                Comparator
                                        .comparing(
                                                LeaderboardEntryResponse
                                                        ::getTotalMarks
                                        )
                                        .reversed()
                                        .thenComparing(
                                                LeaderboardEntryResponse
                                                        ::getAverageMarks,
                                                Comparator.reverseOrder()
                                        )
                                        .thenComparing(
                                                LeaderboardEntryResponse
                                                        ::getStudentId
                                        )
                        )
                        .collect(
                                Collectors.toList()
                        );

        assignRanks(leaderboard);

        return leaderboard;
    }

    private LeaderboardEntryResponse
    createLeaderboardEntry(
            WorkspaceMemberData member,
            List<GradedSubmissionData> submissions) {

        int totalMarks =
                submissions.stream()
                        .map(
                                GradedSubmissionData
                                        ::getMarksObtained
                        )
                        .filter(Objects::nonNull)
                        .mapToInt(Integer::intValue)
                        .sum();

        int gradedSubmissions =
                (int) submissions.stream()
                        .map(
                                GradedSubmissionData
                                        ::getMarksObtained
                        )
                        .filter(Objects::nonNull)
                        .count();

        BigDecimal averageMarks =
                gradedSubmissions == 0
                        ? BigDecimal.ZERO.setScale(
                                2,
                                RoundingMode.HALF_UP
                        )
                        : BigDecimal
                                .valueOf(totalMarks)
                                .divide(
                                        BigDecimal.valueOf(
                                                gradedSubmissions
                                        ),
                                        2,
                                        RoundingMode.HALF_UP
                                );

        /*
         * Fetch student name and email from Auth Service.
         */
        InternalUserResponse student =
                authServiceClient.getInternalUserById(
                        member.getStudentId()
                );

        String studentName =
                buildStudentName(student);

        return LeaderboardEntryResponse.builder()
                .rank(0)
                .studentId(member.getStudentId())
                .studentName(studentName)
                .studentEmail(student.getEmail())
                .totalMarks(totalMarks)
                .gradedSubmissions(gradedSubmissions)
                .averageMarks(averageMarks)
                .build();
    }

    private String buildStudentName(
            InternalUserResponse student) {

        String firstName =
                student.getFirstName() == null
                        ? ""
                        : student.getFirstName().trim();

        String lastName =
                student.getLastName() == null
                        ? ""
                        : student.getLastName().trim();

        String fullName =
                (firstName + " " + lastName)
                        .trim();

        if (!fullName.isBlank()) {
            return fullName;
        }

        if (
                student.getEmail() != null &&
                !student.getEmail().isBlank()
        ) {
            return student.getEmail();
        }

        return "Unknown Student";
    }

    private void assignRanks(
            List<LeaderboardEntryResponse> leaderboard) {

        int currentRank = 0;

        Integer previousTotalMarks = null;

        BigDecimal previousAverageMarks = null;

        for (
                int index = 0;
                index < leaderboard.size();
                index++
        ) {

            LeaderboardEntryResponse currentEntry =
                    leaderboard.get(index);

            boolean sameScore =
                    Objects.equals(
                            previousTotalMarks,
                            currentEntry.getTotalMarks()
                    )
                    &&
                    Objects.equals(
                            previousAverageMarks,
                            currentEntry.getAverageMarks()
                    );

            if (!sameScore) {
                currentRank = index + 1;

                previousTotalMarks =
                        currentEntry.getTotalMarks();

                previousAverageMarks =
                        currentEntry.getAverageMarks();
            }

            currentEntry.setRank(currentRank);
        }
    }
}