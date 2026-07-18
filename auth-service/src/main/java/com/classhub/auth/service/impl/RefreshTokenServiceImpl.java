package com.classhub.auth.service.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.classhub.auth.dto.response.LogoutResponse;
import com.classhub.auth.dto.response.RefreshTokenResponse;
import com.classhub.auth.entity.RefreshToken;
import com.classhub.auth.entity.User;
import com.classhub.auth.exception.InvalidRefreshTokenException;
import com.classhub.auth.exception.RefreshTokenExpiredException;
import com.classhub.auth.exception.RefreshTokenRevokedException;
import com.classhub.auth.repository.RefreshTokenRepository;
import com.classhub.auth.service.JwtService;
import com.classhub.auth.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private static final int TOKEN_BYTES = 64;

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    @Override
    @Transactional
    public String createRefreshToken(User user) {

        /*
         * Keep only one active refresh token per user.
         * Logging in again removes the previous refresh token.
         */
        refreshTokenRepository.deleteByUser(user);

        String tokenValue = generateSecureToken();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(tokenValue)
                .user(user)
                .expiryDate(
                        LocalDateTime.now()
                                .plusSeconds(refreshExpiration / 1000))
                .revoked(false)
                .createdAt(LocalDateTime.now())
                .build();

        refreshTokenRepository.save(refreshToken);

        return tokenValue;
    }

    @Override
    @Transactional(readOnly = true)
    public RefreshTokenResponse refreshAccessToken(String tokenValue) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(tokenValue)
                .orElseThrow(() ->
                        new InvalidRefreshTokenException(
                                "Invalid refresh token."));

        if (refreshToken.isRevoked()) {
            throw new RefreshTokenRevokedException(
                    "Refresh token has been revoked.");
        }

        if (refreshToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            throw new RefreshTokenExpiredException(
                    "Refresh token has expired. Please login again.");
        }

        User user = refreshToken.getUser();

        String newAccessToken =
                jwtService.generateToken(user);

        return RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpiration())
                .build();
    }

    @Override
    @Transactional
    public LogoutResponse logout(String tokenValue) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(tokenValue)
                .orElseThrow(() ->
                        new InvalidRefreshTokenException(
                                "Invalid refresh token."));

        if (refreshToken.isRevoked()) {
            throw new RefreshTokenRevokedException(
                    "Refresh token has already been revoked.");
        }

        refreshToken.setRevoked(true);

        refreshTokenRepository.save(refreshToken);

        return new LogoutResponse(
                "Logged out successfully.");
    }

    private String generateSecureToken() {

        byte[] randomBytes = new byte[TOKEN_BYTES];

        new SecureRandom().nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }
}