package com.classhub.auth.dto.response;

import com.classhub.auth.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    
    private String refreshToken;

    private String tokenType;

    private Long expiresIn;

    private String id;

    private String firstName;

    private String lastName;

    private String email;

    private Role role;

}