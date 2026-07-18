package com.classhub.auth.service;

import com.classhub.auth.dto.ChangePasswordRequest;
import com.classhub.auth.dto.ForgotPasswordRequest;
import com.classhub.auth.dto.ResetPasswordRequest;
import com.classhub.auth.dto.response.ChangePasswordResponse;
import com.classhub.auth.dto.response.ForgotPasswordResponse;
import com.classhub.auth.dto.response.ResetPasswordResponse;

import com.classhub.auth.dto.LoginRequest;
import com.classhub.auth.dto.RegisterRequest;
import com.classhub.auth.dto.ResendOtpRequest;
import com.classhub.auth.dto.VerifyOtpRequest;
import com.classhub.auth.dto.response.LoginResponse;
import com.classhub.auth.dto.response.RegisterResponse;
import com.classhub.auth.dto.response.ResendOtpResponse;
import com.classhub.auth.dto.response.VerifyOtpResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
    
    ResendOtpResponse resendOtp(ResendOtpRequest request);
    
    VerifyOtpResponse verifyEmail(VerifyOtpRequest request);
    
    ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request);

    ResetPasswordResponse resetPassword(ResetPasswordRequest request);
    
    ChangePasswordResponse changePassword(ChangePasswordRequest request, String email);

}