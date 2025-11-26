package com.printandread.printandread.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "https://printandread-frontend.onrender.com", 
             allowCredentials = "true",
             maxAge = 3600)
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "Print & Read API");
        return ResponseEntity.ok(health);
    }
    
    @GetMapping("/cors-check")
    public ResponseEntity<Map<String, Object>> corsCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "CORS configured");
        response.put("timestamp", System.currentTimeMillis());
        response.put("message", "If you can see this, CORS is working!");
        response.put("allowedOrigin", "https://printandread-frontend.onrender.com");
        return ResponseEntity.ok(response);
    }
}

