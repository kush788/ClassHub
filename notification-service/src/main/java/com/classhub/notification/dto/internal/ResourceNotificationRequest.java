package com.classhub.notification.dto.internal;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceNotificationRequest {

    @NotNull
    private UUID workspaceId;

    @NotNull
    private UUID uploadedBy;

    @NotBlank
    private String resourceTitle;

    @NotBlank
    private String resourceType;

    private String originalFileName;
}