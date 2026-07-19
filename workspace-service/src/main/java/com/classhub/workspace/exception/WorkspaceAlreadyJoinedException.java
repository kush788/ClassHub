package com.classhub.workspace.exception;

public class WorkspaceAlreadyJoinedException extends RuntimeException {

    public WorkspaceAlreadyJoinedException(String message) {
        super(message);
    }
}