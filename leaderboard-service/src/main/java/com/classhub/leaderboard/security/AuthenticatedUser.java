package com.classhub.leaderboard.security;

import java.util.UUID;

public record AuthenticatedUser(
        UUID userId,
        String email,
        String role
) {
}