package com.classhub.resource.exception.handler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.classhub.resource.exception.CloudinaryOperationException;
import com.classhub.resource.exception.InvalidResourceFileException;
import com.classhub.resource.exception.ResourceAccessDeniedException;
import com.classhub.resource.exception.ResourceNotFoundException;
import com.classhub.resource.exception.WorkspaceNotFoundForResourceException;
import com.classhub.resource.exception.WorkspaceServiceUnavailableException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BindException.class)
    public ResponseEntity<Map<String, Object>>
            handleValidationException(
                    BindException exception,
                    HttpServletRequest request) {

        Map<String, String> validationErrors =
                new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        validationErrors.put(
                                error.getField(),
                                error.getDefaultMessage()));

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

    @ExceptionHandler(InvalidResourceFileException.class)
    public ResponseEntity<Map<String, Object>>
            handleInvalidResourceFile(
                    InvalidResourceFileException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .badRequest()
                .body(buildBody(
                        HttpStatus.BAD_REQUEST,
                        exception.getMessage(),
                        request));
    }

    @ExceptionHandler(ResourceAccessDeniedException.class)
    public ResponseEntity<Map<String, Object>>
            handleAccessDenied(
                    ResourceAccessDeniedException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(buildBody(
                        HttpStatus.FORBIDDEN,
                        exception.getMessage(),
                        request));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>>
            handleMaximumUploadSize(
                    MaxUploadSizeExceededException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .badRequest()
                .body(buildBody(
                        HttpStatus.BAD_REQUEST,
                        "Uploaded request exceeds the maximum allowed size.",
                        request));
    }

    @ExceptionHandler(CloudinaryOperationException.class)
    public ResponseEntity<Map<String, Object>>
            handleCloudinaryOperation(
                    CloudinaryOperationException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(buildBody(
                        HttpStatus.BAD_GATEWAY,
                        exception.getMessage(),
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

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>>
            handleTypeMismatch(
                    MethodArgumentTypeMismatchException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .badRequest()
                .body(buildBody(
                        HttpStatus.BAD_REQUEST,
                        "Invalid value for '"
                                + exception.getName() + "'.",
                        request));
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>>
    handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildBody(
                        HttpStatus.NOT_FOUND,
                        ex.getMessage(),
                        request));
    }
    
    @ExceptionHandler(
            WorkspaceNotFoundForResourceException.class)
    public ResponseEntity<Map<String, Object>>
            handleWorkspaceNotFound(
                    WorkspaceNotFoundForResourceException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildBody(
                        HttpStatus.NOT_FOUND,
                        exception.getMessage(),
                        request));
    }
    
    @ExceptionHandler(
            WorkspaceServiceUnavailableException.class)
    public ResponseEntity<Map<String, Object>>
            handleWorkspaceServiceUnavailable(
                    WorkspaceServiceUnavailableException exception,
                    HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(buildBody(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        exception.getMessage(),
                        request));
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