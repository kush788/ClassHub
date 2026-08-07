package com.classhub.playground.controller;

import com.classhub.playground.dto.RunCodeRequest;
import com.classhub.playground.dto.response.RunCodeResponse;
import com.classhub.playground.security.AuthenticatedUser;
import com.classhub.playground.service.CodeExecutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/playground")
@RequiredArgsConstructor
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    @PostMapping("/run")
    public ResponseEntity<RunCodeResponse> runCode(
            @Valid @RequestBody RunCodeRequest request,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(
                codeExecutionService.runCode(
                        request,
                        user
                )
        );
    }
}