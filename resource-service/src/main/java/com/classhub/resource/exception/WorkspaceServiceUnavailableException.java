package com.classhub.resource.exception;

public class WorkspaceServiceUnavailableException
        extends RuntimeException {

    public WorkspaceServiceUnavailableException(
            String message,
            Throwable cause) {

        super(message, cause);
    }
}