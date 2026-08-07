package com.classhub.playground.dto.response;

import com.classhub.playground.enums.ProgrammingLanguage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodingQuestionResponse {

    private UUID id;

    private UUID workspaceId;

    private UUID teacherId;

    private String title;

    private String description;

    private String sampleInput;

    private String sampleOutput;

    private Set<ProgrammingLanguage> allowedLanguages;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}