package com.classhub.auth.exception;

public class CannotChangeOwnRoleException extends RuntimeException {

    public CannotChangeOwnRoleException(String message) {
        super(message);
    }
}