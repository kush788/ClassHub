package com.classhub.playground.client.dto;

import java.util.UUID;

public record InternalUserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String role
) {
    public String fullName() {
        String first = firstName == null ? "" : firstName.trim();
        String last = lastName == null ? "" : lastName.trim();

        String name = (first + " " + last).trim();

        return name.isBlank() ? email : name;
    }
}