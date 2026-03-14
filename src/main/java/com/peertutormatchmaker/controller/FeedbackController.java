package com.peertutormatchmaker.controller;

import com.peertutormatchmaker.dto.FeedbackDto;
import com.peertutormatchmaker.entity.Feedback;
import com.peertutormatchmaker.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<?> createFeedback(@Valid @RequestBody FeedbackDto feedbackDto) {
        try {
            Feedback feedback = feedbackService.createFeedback(feedbackDto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Feedback submitted successfully");
            response.put("feedbackId", feedback.getFeedbackId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<Feedback>> getFeedbackByTutor(@PathVariable Long tutorId) {
        List<Feedback> feedbacks = feedbackService.getFeedbackByTutor(tutorId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Feedback>> getFeedbackByStudent(@PathVariable Long studentId) {
        List<Feedback> feedbacks = feedbackService.getFeedbackByStudent(studentId);
        return ResponseEntity.ok(feedbacks);
    }
}