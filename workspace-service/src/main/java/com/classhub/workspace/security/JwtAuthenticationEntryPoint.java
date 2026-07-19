package com.classhub.workspace.security;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint
        implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(
            ObjectMapper objectMapper) {

        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception)
            throws IOException {

        response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED);

        response.setContentType(
                MediaType.APPLICATION_JSON_VALUE);

        UnauthorizedResponse errorResponse =
                new UnauthorizedResponse(
                        false,
                        401,
                        "Unauthorized",
                        "Authentication is required.",
                        request.getRequestURI(),
                        LocalDateTime.now());

        objectMapper.writeValue(
                response.getOutputStream(),
                errorResponse);
    }

    private record UnauthorizedResponse(
            boolean success,
            int status,
            String error,
            String message,
            String path,
            LocalDateTime timestamp) {
    }
}