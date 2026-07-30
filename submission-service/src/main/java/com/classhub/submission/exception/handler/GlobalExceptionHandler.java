package com.classhub.submission.exception.handler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.classhub.submission.dto.response.ErrorResponse;
import com.classhub.submission.exception.AssignmentNotFoundForSubmissionException;
import com.classhub.submission.exception.AssignmentServiceUnavailableException;
import com.classhub.submission.exception.DuplicateSubmissionException;
import com.classhub.submission.exception.InvalidSubmissionOperationException;
import com.classhub.submission.exception.SubmissionAccessDeniedException;
import com.classhub.submission.exception.SubmissionDeadlinePassedException;
import com.classhub.submission.exception.SubmissionNotFoundException;
import com.classhub.submission.exception.WorkspaceServiceUnavailableException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SubmissionNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleSubmissionNotFound(
            SubmissionNotFoundException exception,
            WebRequest request) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request
        );
    }

    @ExceptionHandler(AssignmentNotFoundForSubmissionException.class)
    public ResponseEntity<ErrorResponse> handleAssignmentNotFound(
            AssignmentNotFoundForSubmissionException exception,
            WebRequest request) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request
        );
    }

    @ExceptionHandler(SubmissionAccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            SubmissionAccessDeniedException exception,
            WebRequest request) {

        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                exception.getMessage(),
                request
        );
    }

    @ExceptionHandler(DuplicateSubmissionException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateSubmission(
            DuplicateSubmissionException exception,
            WebRequest request) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                exception.getMessage(),
                request
        );
    }

    @ExceptionHandler(SubmissionDeadlinePassedException.class)
    public ResponseEntity<ErrorResponse> handleDeadlinePassed(
            SubmissionDeadlinePassedException exception,
            WebRequest request) {

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request
        );
    }

    @ExceptionHandler(InvalidSubmissionOperationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidOperation(
            InvalidSubmissionOperationException exception,
            WebRequest request) {

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request
        );
    }

    @ExceptionHandler({
            AssignmentServiceUnavailableException.class,
            WorkspaceServiceUnavailableException.class
    })
    public ResponseEntity<ErrorResponse> handleServiceUnavailable(
            RuntimeException exception,
            WebRequest request) {

        return buildErrorResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                exception.getMessage(),
                request
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException exception,
            WebRequest request) {

        Map<String, String> validationErrors = new LinkedHashMap<>();

        for (FieldError fieldError :
                exception.getBindingResult().getFieldErrors()) {

            validationErrors.put(
                    fieldError.getField(),
                    fieldError.getDefaultMessage()
            );
        }

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message("Validation failed")
                .path(extractPath(request))
                .validationErrors(validationErrors)
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(
            Exception exception,
            WebRequest request) {

        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred",
                request
        );
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus status,
            String message,
            WebRequest request) {

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(extractPath(request))
                .validationErrors(null)
                .build();

        return ResponseEntity.status(status).body(response);
    }

    private String extractPath(WebRequest request) {

        return request.getDescription(false)
                .replace("uri=", "");
    }
}