package com.classhub.playground.service;

import com.classhub.playground.dto.RunCodeRequest;
import com.classhub.playground.dto.response.RunCodeResponse;
import com.classhub.playground.security.AuthenticatedUser;

public interface CodeExecutionService {

    RunCodeResponse runCode(
            RunCodeRequest request,
            AuthenticatedUser user
    );
}