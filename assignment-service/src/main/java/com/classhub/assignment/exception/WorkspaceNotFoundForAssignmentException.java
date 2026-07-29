package com.classhub.assignment.exception;

public class WorkspaceNotFoundForAssignmentException
        extends RuntimeException {

    public WorkspaceNotFoundForAssignmentException(
            String message) {

        super(message);
    }
}