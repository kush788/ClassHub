package com.classhub.playground.service;

import com.classhub.playground.dto.SaveCodeResponseRequest;
import com.classhub.playground.dto.response.CodeResponseResponse;
import com.classhub.playground.security.AuthenticatedUser;

import java.util.List;
import java.util.UUID;

public interface CodeResponseService {

    CodeResponseResponse saveResponse(
            SaveCodeResponseRequest request,
            AuthenticatedUser user
    );

    CodeResponseResponse getMyResponse(
            UUID questionId,
            AuthenticatedUser user
    );

    List<CodeResponseResponse> getMyWorkspaceResponses(
            UUID workspaceId,
            AuthenticatedUser user
    );

    List<CodeResponseResponse> getQuestionResponses(
            UUID questionId,
            AuthenticatedUser user
    );
}