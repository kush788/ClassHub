package com.classhub.auth.service;

import com.classhub.auth.dto.response.LogoutResponse;
import com.classhub.auth.dto.response.RefreshTokenResponse;
import com.classhub.auth.entity.User;

public interface RefreshTokenService {

    String createRefreshToken(User user);

    RefreshTokenResponse refreshAccessToken(String refreshToken);

    LogoutResponse logout(String refreshToken);
}