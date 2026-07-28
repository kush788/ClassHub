package com.classhub.resource.repository;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classhub.resource.entity.Resource;

public interface ResourceRepository
        extends JpaRepository<Resource, UUID> {

    List<Resource> findByWorkspaceIdAndActiveTrueOrderByCreatedAtDesc(
            UUID workspaceId);
    Optional<Resource> findByIdAndActiveTrue(UUID id);
}