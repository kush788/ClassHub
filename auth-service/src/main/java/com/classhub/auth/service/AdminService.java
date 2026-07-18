package com.classhub.auth.service;

import java.util.List;
import java.util.UUID;

import com.classhub.auth.dto.ChangeRoleRequest;
import com.classhub.auth.dto.response.UserResponse;

public interface AdminService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(UUID userId);

    UserResponse changeUserRole(
            UUID userId,
            ChangeRoleRequest request,
            String currentAdminEmail);

    UserResponse lockUser(
            UUID userId,
            String currentAdminEmail);

    UserResponse unlockUser(UUID userId);

    void deleteUser(
            UUID userId,
            String currentAdminEmail);
}