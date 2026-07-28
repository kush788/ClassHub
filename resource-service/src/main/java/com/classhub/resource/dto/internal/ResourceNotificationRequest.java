package com.classhub.resource.dto.internal;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceNotificationRequest {

    private UUID workspaceId;

    private UUID uploadedBy;

    private String resourceTitle;

    private String resourceType;

    private String originalFileName;
}