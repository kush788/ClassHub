package com.classhub.workspace.security;

import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    public Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public UUID extractUserId(String token) {

        Object idClaim = extractAllClaims(token).get("id");

        if (idClaim == null) {
            throw new IllegalArgumentException(
                    "JWT does not contain user id.");
        }

        return UUID.fromString(idClaim.toString());
    }

    public String extractRole(String token) {

        Object roleClaim = extractAllClaims(token).get("role");

        if (roleClaim == null) {
            throw new IllegalArgumentException(
                    "JWT does not contain role.");
        }

        return roleClaim.toString();
    }

    public boolean isTokenExpired(String token) {

        Date expiration =
                extractAllClaims(token).getExpiration();

        return expiration.before(new Date());
    }

    public boolean isTokenValid(String token) {

        String email = extractEmail(token);
        UUID userId = extractUserId(token);
        String role = extractRole(token);

        return email != null
                && !email.isBlank()
                && userId != null
                && role != null
                && !role.isBlank()
                && !isTokenExpired(token);
    }

    private SecretKey getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(secret);

        return Keys.hmacShaKeyFor(keyBytes);
    }
}