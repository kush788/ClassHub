package com.classhub.auth.controller;
import org.springframework.security.core.Authentication;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.classhub.auth.dto.ChangePasswordRequest;
import com.classhub.auth.dto.ForgotPasswordRequest;
import com.classhub.auth.dto.LoginRequest;
import com.classhub.auth.dto.RefreshTokenRequest;
import com.classhub.auth.dto.RegisterRequest;
import com.classhub.auth.dto.ResendOtpRequest;
import com.classhub.auth.dto.ResetPasswordRequest;
import com.classhub.auth.dto.VerifyOtpRequest;
import com.classhub.auth.dto.response.ChangePasswordResponse;
import com.classhub.auth.dto.response.ForgotPasswordResponse;
import com.classhub.auth.dto.response.LoginResponse;
import com.classhub.auth.dto.response.LogoutResponse;
import com.classhub.auth.dto.response.RefreshTokenResponse;
import com.classhub.auth.dto.response.RegisterResponse;
import com.classhub.auth.dto.response.ResendOtpResponse;
import com.classhub.auth.dto.response.ResetPasswordResponse;
import com.classhub.auth.dto.response.VerifyOtpResponse;
import com.classhub.auth.service.AuthService;
import com.classhub.auth.service.RefreshTokenService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return new ResponseEntity<>(
                authService.register(request),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<VerifyOtpResponse> verifyEmail(
            @Valid @RequestBody VerifyOtpRequest request) {

        return ResponseEntity.ok(
                authService.verifyEmail(request));
    }

    @GetMapping("/me")
    public ResponseEntity<String> me() {
        return ResponseEntity.ok("JWT is valid. You are authenticated.");
    }
    
    @PostMapping("/resend-otp")
    public ResponseEntity<ResendOtpResponse> resendOtp(
            @Valid @RequestBody ResendOtpRequest request) {

        return ResponseEntity.ok(
                authService.resendOtp(request));
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        return ResponseEntity.ok(
                authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                authService.resetPassword(request));
    }
    
    @PutMapping("/change-password")
    public ResponseEntity<ChangePasswordResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        ChangePasswordResponse response =
                authService.changePassword(
                        request,
                        authentication.getName());

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {

        return ResponseEntity.ok(
                refreshTokenService.refreshAccessToken(
                        request.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(
            @Valid @RequestBody RefreshTokenRequest request) {

        return ResponseEntity.ok(
                refreshTokenService.logout(
                        request.getRefreshToken()));
    }
}