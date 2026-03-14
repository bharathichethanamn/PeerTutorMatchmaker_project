package com.peertutormatchmaker.controller;

import com.peertutormatchmaker.entity.User;
import com.peertutormatchmaker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutors")
@CrossOrigin(origins = "*")
public class TutorController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllTutors(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) Double minRating) {
        
        try {
            List<User> tutors;
            
            if (subject != null && !subject.trim().isEmpty()) {
                tutors = userService.findTutorsBySubject(subject);
            } else if (minRating != null) {
                tutors = userService.findTutorsByRating(minRating);
            } else {
                tutors = userService.findTutors();
            }
            
            return ResponseEntity.ok(tutors);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(userService.findTutors());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getTutorById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}