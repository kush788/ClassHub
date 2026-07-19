package com.classhub.workspace.security;

import java.security.Principal;
import java.util.UUID;

public record AuthenticatedUser(
        UUID userId,
        String email,
        String role
) implements Principal {

    @Override
    public String getName() {
        return email;
    }
}