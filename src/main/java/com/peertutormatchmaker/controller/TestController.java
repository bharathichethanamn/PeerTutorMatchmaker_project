package com.peertutormatchmaker.controller;

import com.peertutormatchmaker.entity.User;
import com.peertutormatchmaker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private UserService userService;

    @GetMapping("/tutors")
    public ResponseEntity<?> testTutors() {
        try {
            List<User> tutors = userService.findTutors();
            Map<String, Object> response = new HashMap<>();
            response.put("count", tutors.size());
            response.put("tutors", tutors);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "API is working");
        return ResponseEntity.ok(response);
    }
}