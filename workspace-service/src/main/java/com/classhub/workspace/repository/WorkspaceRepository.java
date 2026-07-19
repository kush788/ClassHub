package com.classhub.workspace.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classhub.workspace.entity.Workspace;

public interface WorkspaceRepository
        extends JpaRepository<Workspace, UUID> {

    Optional<Workspace> findByJoinCode(String joinCode);

    boolean existsByJoinCode(String joinCode);

    List<Workspace> findByTeacherIdOrderByCreatedAtDesc(
            UUID teacherId);

    List<Workspace> findByTeacherIdAndActiveTrueOrderByCreatedAtDesc(
            UUID teacherId);
}