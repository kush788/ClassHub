package com.classhub.playground.dto.response;

import com.classhub.playground.enums.ExecutionStatus;
import com.classhub.playground.enums.ProgrammingLanguage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeResponseResponse {

    private UUID id;

    private UUID questionId;

    private UUID workspaceId;

    private UUID studentId;
    
    private String studentName;

    private String studentEmail;

    private ProgrammingLanguage language;

    private String sourceCode;

    private String standardInput;

    private String output;

    private String compileError;

    private String runtimeError;

    private ExecutionStatus executionStatus;

    private Long executionTimeMs;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}