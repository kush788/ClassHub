package com.classhub.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResendOtpRequest {

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;
}