package com.classhub.auth.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.classhub.auth.dto.ChangePasswordRequest;
import com.classhub.auth.dto.ForgotPasswordRequest;
import com.classhub.auth.dto.LoginRequest;
import com.classhub.auth.dto.RegisterRequest;
import com.classhub.auth.dto.ResendOtpRequest;
import com.classhub.auth.dto.ResetPasswordRequest;
import com.classhub.auth.dto.VerifyOtpRequest;
import com.classhub.auth.dto.response.ChangePasswordResponse;
import com.classhub.auth.dto.response.ForgotPasswordResponse;
import com.classhub.auth.dto.response.LoginResponse;
import com.classhub.auth.dto.response.RegisterResponse;
import com.classhub.auth.dto.response.ResendOtpResponse;
import com.classhub.auth.dto.response.ResetPasswordResponse;
import com.classhub.auth.dto.response.VerifyOtpResponse;
import com.classhub.auth.entity.EmailOtp;
import com.classhub.auth.entity.User;
import com.classhub.auth.exception.EmailAlreadyRegisteredException;
import com.classhub.auth.exception.EmailAlreadyVerifiedException;
import com.classhub.auth.exception.EmailNotVerifiedException;
import com.classhub.auth.exception.IncorrectPasswordException;
import com.classhub.auth.exception.InvalidOtpException;
import com.classhub.auth.exception.OtpAlreadyUsedException;
import com.classhub.auth.exception.OtpExpiredException;
import com.classhub.auth.exception.SamePasswordException;
import com.classhub.auth.exception.UserNotFoundException;
import com.classhub.auth.repository.EmailOtpRepository;
import com.classhub.auth.repository.UserRepository;
import com.classhub.auth.service.AuthService;
import com.classhub.auth.service.EmailService;
import com.classhub.auth.service.JwtService;
import com.classhub.auth.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final EmailOtpRepository otpRepository;
    private final RefreshTokenService refreshTokenService;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyRegisteredException(
                    "Email is already registered.");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .emailVerified(false)
                .accountLocked(false)
                .build();

        userRepository.save(user);

        emailService.sendOtp(user.getEmail());

        return new RegisterResponse(
                "Registration Successful. OTP sent to your email.");
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException(
                    "Please verify your email before logging in.");
        }

        String accessToken = jwtService.generateToken(user);

        String refreshToken =
                refreshTokenService.createRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpiration())
                .id(user.getId().toString())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public VerifyOtpResponse verifyEmail(VerifyOtpRequest request) {

        EmailOtp emailOtp = otpRepository
                .findByEmailAndOtp(request.getEmail(), request.getOtp())
                .orElseThrow(() ->
                        new InvalidOtpException("Invalid OTP."));

        if (emailOtp.isVerified()) {
            throw new OtpAlreadyUsedException(
                    "OTP has already been verified.");
        }

        if (emailOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new OtpExpiredException(
                    "OTP has expired.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        user.setEmailVerified(true);
        userRepository.save(user);

        emailOtp.setVerified(true);
        otpRepository.save(emailOtp);

        return new VerifyOtpResponse(
                "Email verified successfully");
    }

    @Override
    public ResendOtpResponse resendOtp(ResendOtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        if (user.isEmailVerified()) {
        	throw new EmailAlreadyVerifiedException(
        	        "Email is already verified.");
        }

        otpRepository.deleteByEmail(user.getEmail());

        emailService.sendOtp(user.getEmail());

        return new ResendOtpResponse(
                "New OTP sent successfully.");
    }

    @Override
    public ForgotPasswordResponse forgotPassword(
            ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        otpRepository.deleteByEmail(user.getEmail());

        emailService.sendOtp(user.getEmail());

        return new ForgotPasswordResponse(
                "Password reset OTP sent successfully.");
    }

    @Override
    public ResetPasswordResponse resetPassword(
            ResetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        EmailOtp emailOtp = otpRepository
                .findByEmailAndOtp(
                        request.getEmail(),
                        request.getOtp())
                .orElseThrow(() ->
                        new InvalidOtpException("Invalid OTP."));

        if (emailOtp.isVerified()) {
            throw new OtpAlreadyUsedException(
                    "OTP has already been used.");
        }

        if (emailOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new OtpExpiredException(
                    "OTP has expired.");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        emailOtp.setVerified(true);
        otpRepository.save(emailOtp);

        return new ResetPasswordResponse(
                "Password reset successfully.");
    }

    @Override
    public ChangePasswordResponse changePassword(
            ChangePasswordRequest request,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new IncorrectPasswordException(
                    "Current password is incorrect.");
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new SamePasswordException(
                    "New password must be different from the current password.");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        return new ChangePasswordResponse(
                "Password changed successfully.");
    }
}