package com.classhub.playground.dto;

import com.classhub.playground.enums.ProgrammingLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCodingQuestionRequest {

    @NotBlank(message = "Question title is required")
    @Size(
            max = 200,
            message = "Question title cannot exceed 200 characters"
    )
    private String title;

    @NotBlank(message = "Question description is required")
    private String description;

    private String sampleInput;

    private String sampleOutput;

    @NotEmpty(message = "At least one programming language is required")
    private Set<ProgrammingLanguage> allowedLanguages;

    private boolean active;
}