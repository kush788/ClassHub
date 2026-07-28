package com.classhub.resource.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.classhub.resource.entity.ResourceType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {

    private UUID id;

    private UUID workspaceId;

    private UUID uploadedBy;

    private String title;

    private String description;

    private ResourceType resourceType;

    private String fileUrl;

    private String originalFileName;

    private String contentType;

    private Long fileSize;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}