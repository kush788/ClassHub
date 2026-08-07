package com.classhub.playground.service;

import com.classhub.playground.dto.CreateCodingQuestionRequest;
import com.classhub.playground.dto.UpdateCodingQuestionRequest;
import com.classhub.playground.dto.response.CodingQuestionResponse;
import com.classhub.playground.security.AuthenticatedUser;

import java.util.List;
import java.util.UUID;

public interface CodingQuestionService {

    CodingQuestionResponse createQuestion(
            CreateCodingQuestionRequest request,
            AuthenticatedUser user
    );

    CodingQuestionResponse updateQuestion(
            UUID questionId,
            UpdateCodingQuestionRequest request,
            AuthenticatedUser user
    );

    void deleteQuestion(
            UUID questionId,
            AuthenticatedUser user
    );

    CodingQuestionResponse getQuestionById(
            UUID questionId,
            AuthenticatedUser user
    );

    List<CodingQuestionResponse> getWorkspaceQuestions(
            UUID workspaceId,
            AuthenticatedUser user
    );

    List<CodingQuestionResponse> getTeacherQuestions(
            AuthenticatedUser user
    );
}