package com.classhub.auth.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.classhub.auth.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private UUID id;

    private String firstName;

    private String lastName;

    private String email;

    private Role role;

    private boolean enabled;

    private boolean emailVerified;

    private boolean accountLocked;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}