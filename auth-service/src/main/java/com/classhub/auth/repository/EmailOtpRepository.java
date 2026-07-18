package com.classhub.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.classhub.auth.entity.EmailOtp;

public interface EmailOtpRepository
        extends JpaRepository<EmailOtp, UUID> {

    Optional<EmailOtp> findTopByEmailOrderByExpiryTimeDesc(String email);

    Optional<EmailOtp> findByEmailAndOtp(String email, String otp);

    @Transactional
    @Modifying
    void deleteByEmail(String email);
}