package com.classhub.assignment.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classhub.assignment.entity.Assignment;

public interface AssignmentRepository
        extends JpaRepository<Assignment, UUID> {

    Optional<Assignment> findByIdAndActiveTrue(
            UUID id);

    List<Assignment>
    findByWorkspaceIdAndActiveTrueOrderByDueDateAsc(
            UUID workspaceId);
}