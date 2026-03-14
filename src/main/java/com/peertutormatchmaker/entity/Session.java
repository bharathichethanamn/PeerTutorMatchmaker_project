package com.peertutormatchmaker.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private User tutor;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private String subject;
    private LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, CONFIRMED, COMPLETED, CANCELLED
    }

    // Constructors
    public Session() {}

    public Session(User tutor, User student, String subject, LocalDateTime dateTime) {
        this.tutor = tutor;
        this.student = student;
        this.subject = subject;
        this.dateTime = dateTime;
    }

    // Getters and Setters
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public User getTutor() { return tutor; }
    public void setTutor(User tutor) { this.tutor = tutor; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}