package com.classhub.auth.service.impl;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.classhub.auth.entity.EmailOtp;
import com.classhub.auth.repository.EmailOtpRepository;
import com.classhub.auth.service.EmailService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final EmailOtpRepository otpRepository;

    @Override
    @Transactional
    public void sendOtp(String email) {

        // Delete old OTP if exists
        otpRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        EmailOtp emailOtp = EmailOtp.builder()
                .id(UUID.randomUUID())
                .email(email)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .verified(false)
                .build();

        otpRepository.save(emailOtp);

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("ClassHub Email Verification");

        message.setText(
                "Welcome to ClassHub!\n\n"
                        + "Your OTP is: "
                        + otp
                        + "\n\n"
                        + "This OTP is valid for 10 minutes.");

        mailSender.send(message);
    }
}