package com.classhub.assignment.exception.handler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.classhub.assignment.exception.AssignmentAccessDeniedException;
import com.classhub.assignment.exception.AssignmentNotFoundException;
import com.classhub.assignment.exception.InvalidAssignmentOperationException;
import com.classhub.assignment.exception.WorkspaceNotFoundForAssignmentException;
import com.classhub.assignment.exception.WorkspaceServiceUnavailableException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>>
            handleRequestBodyValidation(
                    MethodArgumentNotValidException exception,
                    HttpServletRequest request) {

        return buildValidationResponse(
                exception.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .collect(
                                LinkedHashMap::new,
                                (map, error) ->
                                        map.put(
                                                error.getField(),
                                                error.getDefaultMessage()),
                                LinkedHashMap::putAll),
                request);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<Map<String, Object>>
            handleBindingValidation(
                    BindException exception,
                    HttpServletRequest request) {

        return buildValidationResponse(
                exception.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .collect(
                                LinkedHashMap::new,
                                (map, error) ->
                                        map.put(
                                                error.getField(),
                                                error.getDefaultMessage()),
                                LinkedHashMap::putAll),
                request);
    }

    @ExceptionHandler(AssignmentNotFoundException.class)
    public ResponseEntity<Map<String, Object>>
            handleAssignmentNotFound(
                    AssignmentNotFoundException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildBody(
                        HttpStatus.NOT_FOUND,
                        exception.getMessage(),
                        request));
    }

    @ExceptionHandler(
            WorkspaceNotFoundForAssignmentException.class)
    public ResponseEntity<Map<String, Object>>
            handleWorkspaceNotFound(
                    WorkspaceNotFoundForAssignmentException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildBody(
                        HttpStatus.NOT_FOUND,
                        exception.getMessage(),
                        request));
    }

    @ExceptionHandler(AssignmentAccessDeniedException.class)
    public ResponseEntity<Map<String, Object>>
            handleAccessDenied(
                    AssignmentAccessDeniedException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(buildBody(
                        HttpStatus.FORBIDDEN,
                        exception.getMessage(),
                        request));
    }

    @ExceptionHandler(InvalidAssignmentOperationException.class)
    public ResponseEntity<Map<String, Object>>
            handleInvalidOperation(
                    InvalidAssignmentOperationException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .badRequest()
                .body(buildBody(
                        HttpStatus.BAD_REQUEST,
                        exception.getMessage(),
                        request));
    }

    @ExceptionHandler(
            WorkspaceServiceUnavailableException.class)
    public ResponseEntity<Map<String, Object>>
            handleWorkspaceUnavailable(
                    WorkspaceServiceUnavailableException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(buildBody(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        exception.getMessage(),
                        request));
    }

    @ExceptionHandler(
            MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>>
            handleTypeMismatch(
                    MethodArgumentTypeMismatchException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .badRequest()
                .body(buildBody(
                        HttpStatus.BAD_REQUEST,
                        "Invalid value for '"
                                + exception.getName()
                                + "'.",
                        request));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>>
            handleGenericException(
                    Exception exception,
                    HttpServletRequest request) {

        exception.printStackTrace();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildBody(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Something went wrong.",
                        request));
    }

    private ResponseEntity<Map<String, Object>>
            buildValidationResponse(
                    Map<String, String> validationErrors,
                    HttpServletRequest request) {

        Map<String, Object> response =
                buildBody(
                        HttpStatus.BAD_REQUEST,
                        "Validation failed.",
                        request);

        response.put(
                "validationErrors",
                validationErrors);

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    private Map<String, Object> buildBody(
            HttpStatus status,
            String message,
            HttpServletRequest request) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("success", false);
        response.put("status", status.value());
        response.put("error", status.getReasonPhrase());
        response.put("message", message);
        response.put("path", request.getRequestURI());
        response.put("timestamp", LocalDateTime.now());

        return response;
    }
}