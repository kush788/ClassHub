package com.classhub.playground.service.impl;

import com.classhub.playground.client.WorkspaceClient;
import com.classhub.playground.client.dto.WorkspaceAccessResponse;
import com.classhub.playground.dto.CreateCodingQuestionRequest;
import com.classhub.playground.dto.UpdateCodingQuestionRequest;
import com.classhub.playground.dto.response.CodingQuestionResponse;
import com.classhub.playground.entity.CodingQuestion;
import com.classhub.playground.exception.ResourceNotFoundException;
import com.classhub.playground.exception.UnauthorizedActionException;
import com.classhub.playground.repository.CodeResponseRepository;
import com.classhub.playground.repository.CodingQuestionRepository;
import com.classhub.playground.security.AuthenticatedUser;
import com.classhub.playground.service.CodingQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CodingQuestionServiceImpl
        implements CodingQuestionService {

    private final CodingQuestionRepository questionRepository;
    private final CodeResponseRepository responseRepository;
    private final WorkspaceClient workspaceClient;

    @Override
    public CodingQuestionResponse createQuestion(
            CreateCodingQuestionRequest request,
            AuthenticatedUser user
    ) {
        requireTeacher(user);

        WorkspaceAccessResponse access =
                requireWorkspaceAccess(
                        request.getWorkspaceId()
                );

        if (!access.isCanManage()) {
            throw new UnauthorizedActionException(
                    "Only the workspace teacher can create coding questions."
            );
        }

        CodingQuestion question = CodingQuestion.builder()
                .workspaceId(request.getWorkspaceId())
                .teacherId(user.userId())
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .sampleInput(normalize(request.getSampleInput()))
                .sampleOutput(normalize(request.getSampleOutput()))
                .allowedLanguages(
                        new HashSet<>(
                                request.getAllowedLanguages()
                        )
                )
                .active(true)
                .build();

        return mapToResponse(
                questionRepository.save(question)
        );
    }

    @Override
    public CodingQuestionResponse updateQuestion(
            UUID questionId,
            UpdateCodingQuestionRequest request,
            AuthenticatedUser user
    ) {
        requireTeacher(user);

        CodingQuestion question =
                findTeacherQuestion(
                        questionId,
                        user.userId()
                );

        WorkspaceAccessResponse access =
                requireWorkspaceAccess(
                        question.getWorkspaceId()
                );

        if (!access.isCanManage()) {
            throw new UnauthorizedActionException(
                    "You cannot update this coding question."
            );
        }

        question.setTitle(
                request.getTitle().trim()
        );

        question.setDescription(
                request.getDescription().trim()
        );

        question.setSampleInput(
                normalize(request.getSampleInput())
        );

        question.setSampleOutput(
                normalize(request.getSampleOutput())
        );

        question.setAllowedLanguages(
                new HashSet<>(
                        request.getAllowedLanguages()
                )
        );

        question.setActive(
                request.isActive()
        );

        return mapToResponse(
                questionRepository.save(question)
        );
    }

    @Override
    public void deleteQuestion(
            UUID questionId,
            AuthenticatedUser user
    ) {
        requireTeacher(user);

        CodingQuestion question =
                findTeacherQuestion(
                        questionId,
                        user.userId()
                );

        WorkspaceAccessResponse access =
                requireWorkspaceAccess(
                        question.getWorkspaceId()
                );

        if (!access.isCanManage()) {
            throw new UnauthorizedActionException(
                    "You cannot delete this coding question."
            );
        }

        responseRepository.deleteByQuestionId(
                questionId
        );

        questionRepository.delete(
                question
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CodingQuestionResponse getQuestionById(
            UUID questionId,
            AuthenticatedUser user
    ) {
        CodingQuestion question =
                findQuestion(questionId);

        WorkspaceAccessResponse access =
                requireWorkspaceAccess(
                        question.getWorkspaceId()
                );

        if (!access.isCanView()) {
            throw new UnauthorizedActionException(
                    "You do not have access to this workspace."
            );
        }

        if (!question.isActive()
                && !access.isCanManage()) {

            throw new ResourceNotFoundException(
                    "Coding question is not available."
            );
        }

        return mapToResponse(question);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CodingQuestionResponse> getWorkspaceQuestions(
            UUID workspaceId,
            AuthenticatedUser user
    ) {
        WorkspaceAccessResponse access =
                requireWorkspaceAccess(
                        workspaceId
                );

        if (!access.isCanView()) {
            throw new UnauthorizedActionException(
                    "You do not have access to this workspace."
            );
        }

        List<CodingQuestion> questions;

        if (access.isCanManage()) {
            questions = questionRepository
                    .findByWorkspaceIdOrderByCreatedAtDesc(
                            workspaceId
                    );
        } else {
            questions = questionRepository
                    .findByWorkspaceIdAndActiveTrueOrderByCreatedAtDesc(
                            workspaceId
                    );
        }

        return questions.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CodingQuestionResponse> getTeacherQuestions(
            AuthenticatedUser user
    ) {
        requireTeacher(user);

        return questionRepository
                .findByTeacherIdOrderByCreatedAtDesc(
                        user.userId()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CodingQuestion findQuestion(
            UUID questionId
    ) {
        return questionRepository
                .findById(questionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coding question not found."
                        )
                );
    }

    private CodingQuestion findTeacherQuestion(
            UUID questionId,
            UUID teacherId
    ) {
        return questionRepository
                .findByIdAndTeacherId(
                        questionId,
                        teacherId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coding question not found."
                        )
                );
    }

    private WorkspaceAccessResponse requireWorkspaceAccess(
            UUID workspaceId
    ) {
        WorkspaceAccessResponse access =
                workspaceClient.getWorkspaceAccess(
                        workspaceId
                );

        if (access == null) {
            throw new UnauthorizedActionException(
                    "Unable to verify workspace access."
            );
        }

        if (!access.isActive()) {
            throw new UnauthorizedActionException(
                    "This workspace is inactive."
            );
        }

        return access;
    }

    private void requireTeacher(
            AuthenticatedUser user
    ) {
        if (user == null
                || !"TEACHER".equalsIgnoreCase(
                        user.role()
                )) {

            throw new UnauthorizedActionException(
                    "Teacher access is required."
            );
        }
    }

    private String normalize(
            String value
    ) {
        if (value == null) {
            return null;
        }

        String trimmed =
                value.trim();

        return trimmed.isEmpty()
                ? null
                : trimmed;
    }

    private CodingQuestionResponse mapToResponse(
            CodingQuestion question
    ) {
        return CodingQuestionResponse.builder()
                .id(question.getId())
                .workspaceId(
                        question.getWorkspaceId()
                )
                .teacherId(
                        question.getTeacherId()
                )
                .title(
                        question.getTitle()
                )
                .description(
                        question.getDescription()
                )
                .sampleInput(
                        question.getSampleInput()
                )
                .sampleOutput(
                        question.getSampleOutput()
                )
                .allowedLanguages(
                        new HashSet<>(
                                question.getAllowedLanguages()
                        )
                )
                .active(
                        question.isActive()
                )
                .createdAt(
                        question.getCreatedAt()
                )
                .updatedAt(
                        question.getUpdatedAt()
                )
                .build();
    }
}