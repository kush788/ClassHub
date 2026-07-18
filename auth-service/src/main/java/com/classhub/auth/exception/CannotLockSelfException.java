package com.classhub.auth.exception;

public class CannotLockSelfException extends RuntimeException {

    public CannotLockSelfException(String message) {
        super(message);
    }
}