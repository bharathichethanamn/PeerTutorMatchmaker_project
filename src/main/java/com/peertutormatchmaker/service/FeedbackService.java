package com.peertutormatchmaker.service;

import com.peertutormatchmaker.dto.FeedbackDto;
import com.peertutormatchmaker.entity.Feedback;
import com.peertutormatchmaker.entity.Profile;
import com.peertutormatchmaker.entity.Session;
import com.peertutormatchmaker.entity.User;
import com.peertutormatchmaker.repository.FeedbackRepository;
import com.peertutormatchmaker.repository.ProfileRepository;
import com.peertutormatchmaker.repository.SessionRepository;
import com.peertutormatchmaker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProfileRepository profileRepository;

    public Feedback createFeedback(FeedbackDto dto) {
        Session session = sessionRepository.findById(dto.getSessionId())
            .orElseThrow(() -> new RuntimeException("Session not found"));
        User student = userRepository.findById(dto.getStudentId())
            .orElseThrow(() -> new RuntimeException("Student not found"));
        User tutor = userRepository.findById(dto.getTutorId())
            .orElseThrow(() -> new RuntimeException("Tutor not found"));

        Feedback feedback = new Feedback();
        feedback.setSession(session);
        feedback.setStudent(student);
        feedback.setTutor(tutor);
        feedback.setRating(dto.getRating());
        feedback.setComments(dto.getComments());

        Feedback savedFeedback = feedbackRepository.save(feedback);

        // Update tutor's average rating
        updateTutorRating(tutor.getUserId());

        return savedFeedback;
    }

    private void updateTutorRating(Long tutorId) {
        List<Feedback> feedbacks = feedbackRepository.findByTutor_UserId(tutorId);
        if (!feedbacks.isEmpty()) {
            double avgRating = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

            Profile profile = profileRepository.findByUser_UserId(tutorId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
            profile.setRating(avgRating);
            profile.setTotalRatings(feedbacks.size());
            profileRepository.save(profile);
        }
    }

    public List<Feedback> getFeedbackByTutor(Long tutorId) {
        return feedbackRepository.findByTutor_UserId(tutorId);
    }

    public List<Feedback> getFeedbackByStudent(Long studentId) {
        return feedbackRepository.findByStudent_UserId(studentId);
    }

    public double getAverageRating() {
        List<Feedback> allFeedbacks = feedbackRepository.findAll();
        if (allFeedbacks.isEmpty()) {
            return 4.2; // Default rating
        }
        
        return allFeedbacks.stream()
            .mapToInt(Feedback::getRating)
            .average()
            .orElse(4.2);
    }
}