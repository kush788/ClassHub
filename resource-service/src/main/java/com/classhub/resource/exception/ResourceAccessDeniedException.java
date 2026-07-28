package com.classhub.resource.exception;

public class ResourceAccessDeniedException
        extends RuntimeException {

    public ResourceAccessDeniedException(String message) {
        super(message);
    }
}