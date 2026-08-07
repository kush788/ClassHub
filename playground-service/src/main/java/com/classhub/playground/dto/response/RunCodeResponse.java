package com.classhub.playground.dto.response;

import com.classhub.playground.enums.ExecutionStatus;
import com.classhub.playground.enums.ProgrammingLanguage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RunCodeResponse {

    private UUID questionId;

    private ProgrammingLanguage language;

    private String output;

    private String compileError;

    private String runtimeError;

    private ExecutionStatus status;

    private Long executionTimeMs;

    private String executionToken;
}