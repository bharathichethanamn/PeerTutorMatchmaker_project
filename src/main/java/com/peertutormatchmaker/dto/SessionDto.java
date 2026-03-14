package com.peertutormatchmaker.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class SessionDto {
    @NotNull(message = "Tutor ID is required")
    private Long tutorId;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Date and time is required")
    private LocalDateTime dateTime;

    // Constructors
    public SessionDto() {}

    public SessionDto(Long tutorId, Long studentId, String subject, LocalDateTime dateTime) {
        this.tutorId = tutorId;
        this.studentId = studentId;
        this.subject = subject;
        this.dateTime = dateTime;
    }

    // Getters and Setters
    public Long getTutorId() { return tutorId; }
    public void setTutorId(Long tutorId) { this.tutorId = tutorId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }
}