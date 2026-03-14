package com.peertutormatchmaker.repository;

import com.peertutormatchmaker.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByTutor_UserId(Long tutorId);
    List<Feedback> findByStudent_UserId(Long studentId);
}