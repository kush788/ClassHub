package com.classhub.resource.exception;

public class WorkspaceNotFoundForResourceException
        extends RuntimeException {

    public WorkspaceNotFoundForResourceException(
            String message) {

        super(message);
    }
}