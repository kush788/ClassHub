package com.classhub.workspace.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegenerateJoinCodeResponse {

    private String message;

    private UUID workspaceId;

    private String oldJoinCode;

    private String newJoinCode;
}