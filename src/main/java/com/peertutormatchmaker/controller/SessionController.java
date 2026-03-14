package com.peertutormatchmaker.controller;

import com.peertutormatchmaker.dto.SessionDto;
import com.peertutormatchmaker.entity.Session;
import com.peertutormatchmaker.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<?> createSession(@Valid @RequestBody SessionDto sessionDto) {
        try {
            Session session = sessionService.createSession(sessionDto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Session created successfully");
            response.put("sessionId", session.getSessionId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id, @RequestBody Map<String, Object> updateData) {
        try {
            Session session;
            if (updateData.containsKey("status")) {
                String status = (String) updateData.get("status");
                session = sessionService.updateSessionStatus(id, status);
            } else {
                SessionDto sessionDto = new SessionDto();
                if (updateData.containsKey("subject")) {
                    sessionDto.setSubject((String) updateData.get("subject"));
                }
                if (updateData.containsKey("dateTime")) {
                    sessionDto.setDateTime(java.time.LocalDateTime.parse((String) updateData.get("dateTime")));
                }
                session = sessionService.updateSession(id, sessionDto);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Session updated successfully");
            response.put("session", session);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelSession(@PathVariable Long id) {
        try {
            sessionService.cancelSession(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Session cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<Session>> getSessionsByTutor(@PathVariable Long tutorId) {
        List<Session> sessions = sessionService.getSessionsByTutor(tutorId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Session>> getSessionsByStudent(@PathVariable Long studentId) {
        List<Session> sessions = sessionService.getSessionsByStudent(studentId);
        return ResponseEntity.ok(sessions);
    }
}