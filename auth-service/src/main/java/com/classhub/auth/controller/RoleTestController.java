package com.classhub.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class RoleTestController {

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> studentEndpoint() {

        return ResponseEntity.ok(
                "Student access granted.");
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<String> teacherEndpoint() {

        return ResponseEntity.ok(
                "Teacher access granted.");
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminEndpoint() {

        return ResponseEntity.ok(
                "Admin access granted.");
    }

    @GetMapping("/teacher-or-admin")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<String> teacherOrAdminEndpoint() {

        return ResponseEntity.ok(
                "Teacher or Admin access granted.");
    }

    @GetMapping("/authenticated")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> authenticatedEndpoint() {

        return ResponseEntity.ok(
                "Authenticated access granted.");
    }
}