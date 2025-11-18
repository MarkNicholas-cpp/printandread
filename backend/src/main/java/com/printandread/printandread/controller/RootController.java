package com.printandread.printandread.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class RootController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "Print & Read API");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("timestamp", LocalDateTime.now());
        response.put("endpoints", Map.of(
            "health", "/api/health",
            "branches", "/api/branches",
            "subjects", "/api/subjects",
            "materials", "/api/materials",
            "regulations", "/api/regulations",
            "years", "/api/years",
            "semesters", "/api/semesters"
        ));
        return ResponseEntity.ok(response);
    }
}

