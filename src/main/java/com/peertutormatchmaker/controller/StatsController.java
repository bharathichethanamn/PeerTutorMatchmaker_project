package com.peertutormatchmaker.controller;

import com.peertutormatchmaker.entity.User;
import com.peertutormatchmaker.service.UserService;
import com.peertutormatchmaker.service.SessionService;
import com.peertutormatchmaker.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private SessionService sessionService;
    
    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getApplicationStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Get all users and count by role
            List<User> allUsers = userService.findAllUsers();
            long tutorCount = allUsers.stream().filter(user -> "TUTOR".equals(user.getRole().toString())).count();
            long studentCount = allUsers.stream().filter(user -> "STUDENT".equals(user.getRole().toString())).count();
            
            // Get unique subjects from tutors
            Set<String> allSubjects = new HashSet<>();
            allUsers.stream()
                .filter(user -> "TUTOR".equals(user.getRole().toString()) && user.getProfile() != null)
                .forEach(user -> {
                    if (user.getProfile().getSubjects() != null) {
                        String[] subjects = user.getProfile().getSubjects().split(",");
                        for (String subject : subjects) {
                            if (subject.trim().length() > 0) {
                                allSubjects.add(subject.trim());
                            }
                        }
                    }
                });
            
            // Calculate average rating
            double avgRating = 4.2; // Default value
            try {
                avgRating = feedbackService.getAverageRating();
            } catch (Exception e) {
                // Use default if calculation fails
            }
            
            // Get total completed sessions count
            long completedSessions = 0;
            try {
                completedSessions = sessionService.getCompletedSessionsCount();
            } catch (Exception e) {
                // Use default if calculation fails
            }
            
            stats.put("activeTutors", tutorCount);
            stats.put("studentsHelped", Math.max(studentCount, completedSessions)); // Use whichever is higher
            stats.put("subjects", allSubjects.size());
            stats.put("avgRating", Math.round(avgRating * 10.0) / 10.0); // Round to 1 decimal
            stats.put("totalUsers", allUsers.size());
            stats.put("completedSessions", completedSessions);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            // Return default values if there's an error
            Map<String, Object> defaultStats = new HashMap<>();
            defaultStats.put("activeTutors", 0);
            defaultStats.put("studentsHelped", 0);
            defaultStats.put("subjects", 0);
            defaultStats.put("avgRating", 0.0);
            defaultStats.put("totalUsers", 0);
            defaultStats.put("completedSessions", 0);
            
            return ResponseEntity.ok(defaultStats);
        }
    }
}