package com.classhub.playground.controller;

import com.classhub.playground.dto.CreateCodingQuestionRequest;
import com.classhub.playground.dto.UpdateCodingQuestionRequest;
import com.classhub.playground.dto.response.CodingQuestionResponse;
import com.classhub.playground.dto.response.MessageResponse;
import com.classhub.playground.security.AuthenticatedUser;
import com.classhub.playground.service.CodingQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/playground/questions")
@RequiredArgsConstructor
public class CodingQuestionController {

    private final CodingQuestionService codingQuestionService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<CodingQuestionResponse> createQuestion(
            @Valid @RequestBody CreateCodingQuestionRequest request,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        CodingQuestionResponse response =
                codingQuestionService.createQuestion(request, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<CodingQuestionResponse> updateQuestion(
            @PathVariable UUID questionId,
            @Valid @RequestBody UpdateCodingQuestionRequest request,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(
                codingQuestionService.updateQuestion(
                        questionId,
                        request,
                        user
                )
        );
    }

    @DeleteMapping("/{questionId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<MessageResponse> deleteQuestion(
            @PathVariable UUID questionId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        codingQuestionService.deleteQuestion(questionId, user);

        return ResponseEntity.ok(
                new MessageResponse(
                        "Coding question deleted successfully."
                )
        );
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<CodingQuestionResponse> getQuestion(
            @PathVariable UUID questionId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(
                codingQuestionService.getQuestionById(
                        questionId,
                        user
                )
        );
    }

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<CodingQuestionResponse>>
    getWorkspaceQuestions(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(
                codingQuestionService.getWorkspaceQuestions(
                        workspaceId,
                        user
                )
        );
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<CodingQuestionResponse>>
    getTeacherQuestions(
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(
                codingQuestionService.getTeacherQuestions(user)
        );
    }
}