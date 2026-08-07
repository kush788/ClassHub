package com.classhub.playground.dto;

import com.classhub.playground.enums.ExecutionStatus;
import com.classhub.playground.enums.ProgrammingLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaveCodeResponseRequest {

    @NotNull(message = "Question ID is required")
    private UUID questionId;

    @NotNull(message = "Programming language is required")
    private ProgrammingLanguage language;

    @NotBlank(message = "Source code is required")
    private String sourceCode;

    private String standardInput;

    private String output;

    private String compileError;

    private String runtimeError;

    @NotNull(message = "Execution status is required")
    private ExecutionStatus executionStatus;

    private Long executionTimeMs;
}