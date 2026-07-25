package com.classhub.notification.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationTestController {

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testService() {

        return ResponseEntity.ok(
                Map.of(
                        "service", "notification-service",
                        "status", "running"
                )
        );
    }
}