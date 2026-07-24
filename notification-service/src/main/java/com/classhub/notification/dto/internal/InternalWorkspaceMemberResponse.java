package com.classhub.notification.dto.internal;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternalWorkspaceMemberResponse {

    private UUID membershipId;

    private UUID studentId;

    private LocalDateTime joinedAt;
}