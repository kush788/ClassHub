package com.classhub.auth.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classhub.auth.dto.ChangeRoleRequest;
import com.classhub.auth.dto.response.UserResponse;
import com.classhub.auth.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                adminService.getAllUsers());
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable UUID userId) {

        return ResponseEntity.ok(
                adminService.getUserById(userId));
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<UserResponse> changeRole(
            @PathVariable UUID userId,
            @Valid @RequestBody ChangeRoleRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                adminService.changeUserRole(
                        userId,
                        request,
                        authentication.getName()));
    }

    @PatchMapping("/users/{userId}/lock")
    public ResponseEntity<UserResponse> lockUser(
            @PathVariable UUID userId,
            Authentication authentication) {

        return ResponseEntity.ok(
                adminService.lockUser(
                        userId,
                        authentication.getName()));
    }

    @PatchMapping("/users/{userId}/unlock")
    public ResponseEntity<UserResponse> unlockUser(
            @PathVariable UUID userId) {

        return ResponseEntity.ok(
                adminService.unlockUser(userId));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable UUID userId,
            Authentication authentication) {

        adminService.deleteUser(
                userId,
                authentication.getName());

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}