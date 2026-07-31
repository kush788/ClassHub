package com.classhub.submission.exception;

public class SubmissionDeadlinePassedException extends RuntimeException {

    public SubmissionDeadlinePassedException(String message) {
        super(message);
    }
}