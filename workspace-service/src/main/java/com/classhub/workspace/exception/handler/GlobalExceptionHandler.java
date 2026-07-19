package com.classhub.workspace.exception.handler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.classhub.workspace.exception.InvalidJoinCodeException;
import com.classhub.workspace.exception.WorkspaceAccessDeniedException;
import com.classhub.workspace.exception.WorkspaceAlreadyJoinedException;
import com.classhub.workspace.exception.WorkspaceMemberNotFoundException;
import com.classhub.workspace.exception.WorkspaceNotFoundException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {

        Map<String, String> validationErrors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        validationErrors.put(
                                error.getField(),
                                error.getDefaultMessage()));

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        response.put("message", "Validation failed.");
        response.put("path", request.getRequestURI());
        response.put("timestamp", LocalDateTime.now());
        response.put("validationErrors", validationErrors);

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<Map<String, Object>> handleMissingRequestHeader(
            MissingRequestHeaderException exception,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        response.put(
                "message",
                "Required header '" +
                        exception.getHeaderName() +
                        "' is missing.");
        response.put("path", request.getRequestURI());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(
            MethodArgumentTypeMismatchException exception,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        response.put(
                "message",
                "Invalid value for '" +
                        exception.getName() +
                        "'.");
        response.put("path", request.getRequestURI());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .badRequest()
                .body(response);
    }
    
    @ExceptionHandler(WorkspaceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleWorkspaceNotFound(
            WorkspaceNotFoundException exception,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.NOT_FOUND.value());
        response.put("error", HttpStatus.NOT_FOUND.getReasonPhrase());
        response.put("message", exception.getMessage());
        response.put("path", request.getRequestURI());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }
    
    @ExceptionHandler(WorkspaceAccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleWorkspaceAccessDenied(
            WorkspaceAccessDeniedException exception,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.FORBIDDEN.value());
        response.put("error", HttpStatus.FORBIDDEN.getReasonPhrase());
        response.put("message", exception.getMessage());
        response.put("path", request.getRequestURI());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }
    
    @ExceptionHandler(WorkspaceMemberNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleWorkspaceMemberNotFound(
            WorkspaceMemberNotFoundException exception,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.NOT_FOUND.value());
        response.put("error", HttpStatus.NOT_FOUND.getReasonPhrase());
        response.put("message", exception.getMessage());
        response.put("path", request.getRequestURI());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception exception,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put(
                "error",
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        response.put("message", "Something went wrong.");
        response.put("path", request.getRequestURI());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
    @ExceptionHandler({
        InvalidJoinCodeException.class,
        WorkspaceAlreadyJoinedException.class
})
public ResponseEntity<Map<String, Object>> handleJoinWorkspaceException(
        RuntimeException exception,
        HttpServletRequest request) {

    Map<String, Object> response = new HashMap<>();

    response.put("success", false);
    response.put("status", HttpStatus.BAD_REQUEST.value());
    response.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
    response.put("message", exception.getMessage());
    response.put("path", request.getRequestURI());
    response.put("timestamp", LocalDateTime.now());

    return ResponseEntity
            .badRequest()
            .body(response);
}
}