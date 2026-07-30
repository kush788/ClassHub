package com.classhub.submission.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateSubmissionRequest {

    @NotBlank
    private String content;

    private String attachmentUrl;

}