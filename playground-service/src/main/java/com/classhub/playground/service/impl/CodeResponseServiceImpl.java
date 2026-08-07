package com.classhub.playground.service.impl;

import com.classhub.playground.client.AuthClient;
import com.classhub.playground.client.WorkspaceClient;
import com.classhub.playground.client.dto.InternalUserResponse;
import com.classhub.playground.client.dto.WorkspaceAccessResponse;
import com.classhub.playground.dto.SaveCodeResponseRequest;
import com.classhub.playground.dto.response.CodeResponseResponse;
import com.classhub.playground.entity.CodeResponse;
import com.classhub.playground.entity.CodingQuestion;
import com.classhub.playground.exception.ResourceNotFoundException;
import com.classhub.playground.exception.UnauthorizedActionException;
import com.classhub.playground.repository.CodeResponseRepository;
import com.classhub.playground.repository.CodingQuestionRepository;
import com.classhub.playground.security.AuthenticatedUser;
import com.classhub.playground.service.CodeResponseService;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CodeResponseServiceImpl implements CodeResponseService {

    private final CodeResponseRepository responseRepository;
    private final CodingQuestionRepository questionRepository;
    private final WorkspaceClient workspaceClient;
    private final AuthClient authClient;

    @Override
    public CodeResponseResponse saveResponse(
            SaveCodeResponseRequest request,
            AuthenticatedUser user
    ) {
        requireStudent(user);

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
                || !access.isCanView()
                || !access.isMember()) {

            throw new UnauthorizedActionException(
                    "You do not have student access to this workspace."
            );
        }

        if (!question.getAllowedLanguages()
                .contains(request.getLanguage())) {

            throw new UnauthorizedActionException(
                    "Selected language is not allowed for this question."
            );
        }

        CodeResponse response = responseRepository
                .findByQuestionIdAndStudentId(
                        question.getId(),
                        user.userId()
                )
                .orElseGet(CodeResponse::new);

        response.setQuestionId(question.getId());
        response.setWorkspaceId(question.getWorkspaceId());
        response.setStudentId(user.userId());
        response.setLanguage(request.getLanguage());
        response.setSourceCode(request.getSourceCode());
        response.setStandardInput(request.getStandardInput());
        response.setOutput(request.getOutput());
        response.setCompileError(request.getCompileError());
        response.setRuntimeError(request.getRuntimeError());
        response.setExecutionStatus(request.getExecutionStatus());
        response.setExecutionTimeMs(request.getExecutionTimeMs());

        return mapToResponse(
                responseRepository.save(response)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CodeResponseResponse getMyResponse(
            UUID questionId,
            AuthenticatedUser user
    ) {
        requireStudent(user);

        CodeResponse response = responseRepository
                .findByQuestionIdAndStudentId(
                        questionId,
                        user.userId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Saved response not found."
                        )
                );

        return mapToResponse(response);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CodeResponseResponse> getMyWorkspaceResponses(
            UUID workspaceId,
            AuthenticatedUser user
    ) {
        requireStudent(user);

        WorkspaceAccessResponse access =
                workspaceClient.getWorkspaceAccess(workspaceId);

        if (access == null
                || !access.isActive()
                || !access.isCanView()
                || !access.isMember()) {

            throw new UnauthorizedActionException(
                    "You do not have access to this workspace."
            );
        }

        return responseRepository
                .findByWorkspaceIdAndStudentIdOrderByUpdatedAtDesc(
                        workspaceId,
                        user.userId()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CodeResponseResponse> getQuestionResponses(
            UUID questionId,
            AuthenticatedUser user
    ) {
        requireTeacher(user);

        CodingQuestion question = questionRepository
                .findById(questionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coding question not found."
                        )
                );

        WorkspaceAccessResponse access =
                workspaceClient.getWorkspaceAccess(
                        question.getWorkspaceId()
                );

        if (access == null
                || !access.isActive()
                || !access.isCanManage()) {

            throw new UnauthorizedActionException(
                    "You cannot view responses for this question."
            );
        }

        return responseRepository
                .findByQuestionIdOrderByUpdatedAtDesc(questionId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private void requireStudent(AuthenticatedUser user) {
        if (user == null
                || !"STUDENT".equalsIgnoreCase(user.role())) {

            throw new UnauthorizedActionException(
                    "Student access is required."
            );
        }
    }

    private void requireTeacher(AuthenticatedUser user) {
        if (user == null
                || !"TEACHER".equalsIgnoreCase(user.role())) {

            throw new UnauthorizedActionException(
                    "Teacher access is required."
            );
        }
    }

    private CodeResponseResponse mapToResponse(
            CodeResponse response
    ) {
        String studentName = "Unknown Student";
        String studentEmail = null;

        try {
            InternalUserResponse student =
                    authClient.getUserById(
                            response.getStudentId()
                    );

            if (student != null) {
                studentName = student.fullName();
                studentEmail = student.email();
            }

        } catch (FeignException exception) {
            // Keep fallback values if auth-service is unavailable
        }

        return CodeResponseResponse.builder()
                .id(response.getId())
                .questionId(response.getQuestionId())
                .workspaceId(response.getWorkspaceId())
                .studentId(response.getStudentId())
                .studentName(studentName)
                .studentEmail(studentEmail)
                .language(response.getLanguage())
                .sourceCode(response.getSourceCode())
                .standardInput(response.getStandardInput())
                .output(response.getOutput())
                .compileError(response.getCompileError())
                .runtimeError(response.getRuntimeError())
                .executionStatus(response.getExecutionStatus())
                .executionTimeMs(response.getExecutionTimeMs())
                .createdAt(response.getCreatedAt())
                .updatedAt(response.getUpdatedAt())
                .build();
    }
}