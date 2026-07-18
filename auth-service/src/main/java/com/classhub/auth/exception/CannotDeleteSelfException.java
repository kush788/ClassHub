package com.classhub.auth.exception;

public class CannotDeleteSelfException extends RuntimeException {

    public CannotDeleteSelfException(String message) {
        super(message);
    }
}