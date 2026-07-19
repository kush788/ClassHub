package com.classhub.workspace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinWorkspaceRequest {

    @NotBlank(message = "Join code is required")
    @Size(
            min = 6,
            max = 6,
            message = "Join code must contain exactly 6 characters"
    )
    private String joinCode;
}