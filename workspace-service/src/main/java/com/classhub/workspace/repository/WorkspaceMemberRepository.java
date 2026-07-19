package com.classhub.workspace.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classhub.workspace.entity.Workspace;
import com.classhub.workspace.entity.WorkspaceMember;

public interface WorkspaceMemberRepository
        extends JpaRepository<WorkspaceMember, UUID> {

    boolean existsByWorkspaceAndStudentId(
            Workspace workspace,
            UUID studentId);

    Optional<WorkspaceMember> findByWorkspaceAndStudentId(
            Workspace workspace,
            UUID studentId);

    List<WorkspaceMember> findByWorkspaceOrderByJoinedAtAsc(
            Workspace workspace);

    List<WorkspaceMember> findByStudentIdOrderByJoinedAtDesc(
            UUID studentId);

    long countByWorkspace(Workspace workspace);
    
    List<WorkspaceMember> findByStudentId(UUID studentId);

    void deleteByWorkspaceAndStudentId(
            Workspace workspace,
            UUID studentId);
    
    
}