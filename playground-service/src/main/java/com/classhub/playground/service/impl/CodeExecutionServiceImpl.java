package com.classhub.playground.service.impl;

import com.classhub.playground.client.Judge0Client;
import com.classhub.playground.client.WorkspaceClient;
import com.classhub.playground.client.dto.Judge0ResultResponse;
import com.classhub.playground.client.dto.Judge0StatusResponse;
import com.classhub.playground.client.dto.Judge0SubmissionRequest;
import com.classhub.playground.client.dto.Judge0TokenResponse;
import com.classhub.playground.client.dto.WorkspaceAccessResponse;
import com.classhub.playground.dto.RunCodeRequest;
import com.classhub.playground.dto.response.RunCodeResponse;
import com.classhub.playground.entity.CodingQuestion;
import com.classhub.playground.enums.ExecutionStatus;
import com.classhub.playground.exception.CodeExecutionException;
import com.classhub.playground.exception.InvalidProgrammingLanguageException;
import com.classhub.playground.exception.ResourceNotFoundException;
import com.classhub.playground.exception.UnauthorizedActionException;
import com.classhub.playground.repository.CodingQuestionRepository;
import com.classhub.playground.security.AuthenticatedUser;
import com.classhub.playground.service.CodeExecutionService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CodeExecutionServiceImpl
        implements CodeExecutionService {

    private static final int MAX_POLL_ATTEMPTS = 20;
    private static final long POLL_DELAY_MS = 500L;

    private final CodingQuestionRepository questionRepository;
    private final WorkspaceClient workspaceClient;
    private final Judge0Client judge0Client;
    private final Judge0LanguageResolver languageResolver;

    @Override
    public RunCodeResponse runCode(
            RunCodeRequest request,
            AuthenticatedUser user
    ) {
        if (user == null) {
            throw new UnauthorizedActionException(
                    "Authentication is required."
            );
        }

        CodingQuestion question = questionRepository
                .findById(request.getQuestionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coding question not found."
                        )
                );

        if (!question.isActive()) {
            throw new ResourceNotFoundException(
                    "Coding question is not active."
            );
        }

        WorkspaceAccessResponse access =
                workspaceClient.getWorkspaceAccess(
                        question.getWorkspaceId()
                );

        if (access == null
                || !access.isActive()
                || !access.isCanView()) {

            throw new UnauthorizedActionException(
                    "You do not have access to this coding question."
            );
        }

        if (!question.getAllowedLanguages()
                .contains(request.getLanguage())) {

            throw new InvalidProgrammingLanguageException(
                    request.getLanguage()
                            + " is not allowed for this question."
            );
        }

        int languageId =
                languageResolver.resolve(
                        request.getLanguage()
                );

        Judge0SubmissionRequest judgeRequest =
                new Judge0SubmissionRequest(
                        request.getSourceCode(),
                        languageId,
                        normalizeInput(
                                request.getStandardInput()
                        ),
                        3.0,
                        128000
                );

        try {
            Judge0TokenResponse tokenResponse =
                    judge0Client.createSubmission(
                            false,
                            false,
                            judgeRequest
                    );

            if (tokenResponse == null
                    || tokenResponse.token() == null
                    || tokenResponse.token().isBlank()) {

                throw new CodeExecutionException(
                        "Judge0 did not return an execution token."
                );
            }

            String executionToken =
                    tokenResponse.token();

            Judge0ResultResponse result =
                    waitForResult(executionToken);

            return mapResult(
                    request,
                    executionToken,
                    result
            );

        } catch (FeignException exception) {

            throw new CodeExecutionException(
                    "Unable to execute code using Judge0. "
                            + extractFeignMessage(exception),
                    exception
            );
        }
    }

    private Judge0ResultResponse waitForResult(
            String token
    ) {
        for (
                int attempt = 1;
                attempt <= MAX_POLL_ATTEMPTS;
                attempt++
        ) {
        	Judge0ResultResponse result =
        	        judge0Client.getSubmission(
        	                token,
        	                false,
        	                "stdout,time,memory,stderr,token,compile_output,message,status"
        	        );

            if (result != null
                    && result.status() != null
                    && !isProcessing(
                            result.status().id()
                    )) {

                return result;
            }

            sleep();
        }

        throw new CodeExecutionException(
                "Code execution timed out while waiting for Judge0."
        );
    }

    private boolean isProcessing(
            Integer statusId
    ) {
        return statusId == null
                || statusId == 1
                || statusId == 2;
    }

    private RunCodeResponse mapResult(
            RunCodeRequest request,
            String token,
            Judge0ResultResponse result
    ) {
        Judge0StatusResponse status =
                result.status();

        Integer statusId =
                status == null
                        ? null
                        : status.id();

        ExecutionStatus executionStatus =
                mapExecutionStatus(statusId);

        String output = null;
        String compileError = null;
        String runtimeError = null;

        if (executionStatus
                == ExecutionStatus.SUCCESS) {

            output = result.stdout();

        } else if (
                executionStatus
                        == ExecutionStatus.COMPILATION_ERROR
        ) {
            compileError =
                    firstNonBlank(
                            result.compileOutput(),
                            result.message()
                    );

        } else {
            runtimeError =
                    firstNonBlank(
                            result.stderr(),
                            result.message(),
                            result.compileOutput()
                    );
        }

        return RunCodeResponse.builder()
                .questionId(
                        request.getQuestionId()
                )
                .language(
                        request.getLanguage()
                )
                .output(output)
                .compileError(compileError)
                .runtimeError(runtimeError)
                .status(executionStatus)
                .executionTimeMs(
                        convertSecondsToMilliseconds(
                                result.time()
                        )
                )
                .executionToken(token)
                .build();
    }

    private ExecutionStatus mapExecutionStatus(
            Integer statusId
    ) {
        if (statusId == null) {
            return ExecutionStatus.INTERNAL_ERROR;
        }

        return switch (statusId) {
            case 1 -> ExecutionStatus.PENDING;
            case 2 -> ExecutionStatus.RUNNING;
            case 3 -> ExecutionStatus.SUCCESS;
            case 5 -> ExecutionStatus.TIME_LIMIT_EXCEEDED;
            case 6 -> ExecutionStatus.COMPILATION_ERROR;
            case 7, 8, 9, 10, 11, 12 ->
                    ExecutionStatus.RUNTIME_ERROR;
            default -> ExecutionStatus.INTERNAL_ERROR;
        };
    }

    private Long convertSecondsToMilliseconds(
            String seconds
    ) {
        if (seconds == null
                || seconds.isBlank()) {
            return null;
        }

        try {
            double value =
                    Double.parseDouble(seconds);

            return Math.round(
                    value * 1000
            );

        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private String normalizeInput(
            String input
    ) {
        return input == null
                ? ""
                : input;
    }

    private String firstNonBlank(
            String... values
    ) {
        if (values == null) {
            return null;
        }

        for (String value : values) {
            if (value != null
                    && !value.isBlank()) {

                return value;
            }
        }

        return null;
    }

    private void sleep() {
        try {
            Thread.sleep(POLL_DELAY_MS);

        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();

            throw new CodeExecutionException(
                    "Code execution was interrupted.",
                    exception
            );
        }
    }

    private String extractFeignMessage(
            FeignException exception
    ) {
        String content =
                exception.contentUTF8();

        if (content == null
                || content.isBlank()) {

            return exception.getMessage();
        }

        return content;
    }
}