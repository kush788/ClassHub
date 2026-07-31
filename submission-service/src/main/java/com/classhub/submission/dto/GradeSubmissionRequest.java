package com.classhub.submission.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GradeSubmissionRequest {

    @NotNull
    @Min(0)
    private Integer marksObtained;

    private String feedback;

}