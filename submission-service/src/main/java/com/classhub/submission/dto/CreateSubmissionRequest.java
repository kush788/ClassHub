package com.classhub.submission.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateSubmissionRequest {

    @NotNull
    private UUID assignmentId;

    @NotBlank
    private String content;

    private String attachmentUrl;

}