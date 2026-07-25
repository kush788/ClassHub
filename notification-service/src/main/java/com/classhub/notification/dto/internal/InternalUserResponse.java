package com.classhub.notification.dto.internal;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternalUserResponse {

    private UUID id;

    private String firstName;

    private String lastName;

    private String email;

    private String role;

    private boolean enabled;
}