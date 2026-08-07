package com.classhub.playground.exception;

import com.classhub.playground.dto.response.ErrorResponse;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException exception
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                null
        );
    }
    
    

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedAction(
            UnauthorizedActionException exception
    ) {
        return buildResponse(
                HttpStatus.FORBIDDEN,
                exception.getMessage(),
                null
        );
    }

    @ExceptionHandler(InvalidProgrammingLanguageException.class)
    public ResponseEntity<ErrorResponse> handleInvalidLanguage(
            InvalidProgrammingLanguageException exception
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                null
        );
    }

    @ExceptionHandler(CodeExecutionException.class)
    public ResponseEntity<ErrorResponse> handleExecutionException(
            CodeExecutionException exception
    ) {
        return buildResponse(
                HttpStatus.BAD_GATEWAY,
                exception.getMessage(),
                null
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed.",
                errors
        );
    }

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<ErrorResponse> handleFeignNotFound(
            FeignException.NotFound exception
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                "Workspace was not found.",
                null
        );
    }

    @ExceptionHandler(FeignException.Forbidden.class)
    public ResponseEntity<ErrorResponse> handleFeignForbidden(
            FeignException.Forbidden exception
    ) {
        return buildResponse(
                HttpStatus.FORBIDDEN,
                "You do not have access to this workspace.",
                null
        );
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeignException(
            FeignException exception
    ) {
        return buildResponse(
                HttpStatus.BAD_GATEWAY,
                "Unable to communicate with another service.",
                null
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception exception
    ) {
        exception.printStackTrace();

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred.",
                null
        );
    }

    private ResponseEntity<ErrorResponse> buildResponse(
            HttpStatus status,
            String message,
            Map<String, String> validationErrors
    ) {
        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .message(message)
                .status(status.value())
                .timestamp(LocalDateTime.now())
                .validationErrors(validationErrors)
                .build();

        return ResponseEntity
                .status(status)
                .body(response);
    }
}