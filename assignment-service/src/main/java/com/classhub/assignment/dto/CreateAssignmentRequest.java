package com.classhub.assignment.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAssignmentRequest {

    @NotNull(message = "Workspace ID is required")
    private UUID workspaceId;

    @NotBlank(message = "Title is required")
    @Size(
            max = 200,
            message = "Title must not exceed 200 characters")
    private String title;

    @Size(
            max = 2000,
            message = "Description must not exceed 2000 characters")
    private String description;

    @Size(
            max = 5000,
            message = "Instructions must not exceed 5000 characters")
    private String instructions;

    @NotNull(message = "Maximum marks are required")
    @Positive(message = "Maximum marks must be greater than zero")
    private Integer maxMarks;

    @NotNull(message = "Due date is required")
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;
}