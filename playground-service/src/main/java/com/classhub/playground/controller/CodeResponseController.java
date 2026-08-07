package com.classhub.playground.controller;

import com.classhub.playground.dto.SaveCodeResponseRequest;
import com.classhub.playground.dto.response.CodeResponseResponse;
import com.classhub.playground.security.AuthenticatedUser;
import com.classhub.playground.service.CodeResponseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/playground/responses")
@RequiredArgsConstructor
public class CodeResponseController {

    private final CodeResponseService codeResponseService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CodeResponseResponse> saveResponse(
            @Valid @RequestBody SaveCodeResponseRequest request,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(
                codeResponseService.saveResponse(request, user)
        );
    }

    @GetMapping("/question/{questionId}/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CodeResponseResponse> getMyResponse(
            @PathVariable UUID questionId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(
                codeResponseService.getMyResponse(
                        questionId,
                        user
                )
        );
    }

    @GetMapping("/workspace/{workspaceId}/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CodeResponseResponse>>
    getMyWorkspaceResponses(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(
                codeResponseService.getMyWorkspaceResponses(
                        workspaceId,
                        user
                )
        );
    }

    @GetMapping("/question/{questionId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<CodeResponseResponse>>
    getQuestionResponses(
            @PathVariable UUID questionId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(
                codeResponseService.getQuestionResponses(
                        questionId,
                        user
                )
        );
    }
}