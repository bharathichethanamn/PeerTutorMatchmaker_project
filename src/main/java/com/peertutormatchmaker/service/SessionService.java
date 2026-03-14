package com.peertutormatchmaker.service;

import com.peertutormatchmaker.dto.SessionDto;
import com.peertutormatchmaker.entity.Session;
import com.peertutormatchmaker.entity.User;
import com.peertutormatchmaker.repository.SessionRepository;
import com.peertutormatchmaker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SessionService {
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;

    public Session createSession(SessionDto dto) {
        User tutor = userRepository.findById(dto.getTutorId())
            .orElseThrow(() -> new RuntimeException("Tutor not found"));
        User student = userRepository.findById(dto.getStudentId())
            .orElseThrow(() -> new RuntimeException("Student not found"));

        Session session = new Session();
        session.setTutor(tutor);
        session.setStudent(student);
        session.setSubject(dto.getSubject());
        session.setDateTime(dto.getDateTime());
        session.setStatus(Session.Status.PENDING);

        Session savedSession = sessionRepository.save(session);

        // Send notifications
        notificationService.createNotification(tutor, 
            "New session request from " + student.getName() + " for " + dto.getSubject());
        notificationService.createNotification(student, 
            "Session request sent to " + tutor.getName());

        return savedSession;
    }

    public Session updateSession(Long sessionId, SessionDto dto) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        if (dto.getSubject() != null) {
            session.setSubject(dto.getSubject());
        }
        if (dto.getDateTime() != null) {
            session.setDateTime(dto.getDateTime());
        }

        return sessionRepository.save(session);
    }

    public Session updateSessionStatus(Long sessionId, String status) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(Session.Status.valueOf(status.toUpperCase()));
        Session updatedSession = sessionRepository.save(session);

        // Send notifications
        String message = "Session " + status.toLowerCase() + ": " + session.getSubject();
        notificationService.createNotification(session.getTutor(), message);
        notificationService.createNotification(session.getStudent(), message);

        return updatedSession;
    }

    public void cancelSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(Session.Status.CANCELLED);
        sessionRepository.save(session);

        // Send notifications
        notificationService.createNotification(session.getTutor(), 
            "Session cancelled: " + session.getSubject());
        notificationService.createNotification(session.getStudent(), 
            "Session cancelled: " + session.getSubject());
    }

    public List<Session> getSessionsByTutor(Long tutorId) {
        return sessionRepository.findByTutor_UserId(tutorId);
    }

    public List<Session> getSessionsByStudent(Long studentId) {
        return sessionRepository.findByStudent_UserId(studentId);
    }

    public Optional<Session> findById(Long sessionId) {
        return sessionRepository.findById(sessionId);
    }
}