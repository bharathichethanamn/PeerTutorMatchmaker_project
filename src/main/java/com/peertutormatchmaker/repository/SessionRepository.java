package com.peertutormatchmaker.repository;

import com.peertutormatchmaker.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    @Query("SELECT s FROM Session s LEFT JOIN FETCH s.tutor LEFT JOIN FETCH s.student WHERE s.tutor.userId = :tutorId ORDER BY s.dateTime DESC")
    List<Session> findByTutor_UserId(@Param("tutorId") Long tutorId);
    
    @Query("SELECT s FROM Session s LEFT JOIN FETCH s.tutor LEFT JOIN FETCH s.student WHERE s.student.userId = :studentId ORDER BY s.dateTime DESC")
    List<Session> findByStudent_UserId(@Param("studentId") Long studentId);
    
    List<Session> findByStatus(Session.Status status);
}