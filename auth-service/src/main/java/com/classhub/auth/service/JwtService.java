package com.classhub.auth.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.classhub.auth.entity.User;
import io.jsonwebtoken.Claims;

public interface JwtService {

    String generateToken(User user);

    String extractUsername(String token);

    boolean isTokenValid(String token, UserDetails userDetails);

    boolean isTokenExpired(String token);

    Claims extractAllClaims(String token);

    long getExpiration();
}