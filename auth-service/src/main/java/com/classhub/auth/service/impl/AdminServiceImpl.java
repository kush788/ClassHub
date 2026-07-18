package com.classhub.auth.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.classhub.auth.dto.ChangeRoleRequest;
import com.classhub.auth.dto.response.UserResponse;
import com.classhub.auth.entity.User;
import com.classhub.auth.exception.CannotChangeOwnRoleException;
import com.classhub.auth.exception.CannotDeleteSelfException;
import com.classhub.auth.exception.CannotLockSelfException;
import com.classhub.auth.exception.UserNotFoundException;
import com.classhub.auth.repository.UserRepository;
import com.classhub.auth.service.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {

        User user = getUser(userId);

        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse changeUserRole(
            UUID userId,
            ChangeRoleRequest request,
            String currentAdminEmail) {

        User user = getUser(userId);

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new CannotChangeOwnRoleException(
                    "Admin cannot change their own role.");
        }

        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse lockUser(
            UUID userId,
            String currentAdminEmail) {

        User user = getUser(userId);

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new CannotLockSelfException(
                    "Admin cannot lock their own account.");
        }

        user.setAccountLocked(true);

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse unlockUser(UUID userId) {

        User user = getUser(userId);

        user.setAccountLocked(false);

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    @Override
    @Transactional
    public void deleteUser(
            UUID userId,
            String currentAdminEmail) {

        User user = getUser(userId);

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new CannotDeleteSelfException(
                    "Admin cannot delete their own account.");
        }

        userRepository.delete(user);
    }

    private User getUser(UUID userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId));
    }

    private UserResponse mapToResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .emailVerified(user.isEmailVerified())
                .accountLocked(user.isAccountLocked())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}