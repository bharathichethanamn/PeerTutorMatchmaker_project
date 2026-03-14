package com.peertutormatchmaker.repository;

import com.peertutormatchmaker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.profile WHERE u.role = :role")
    List<User> findByRoleWithProfile(@Param("role") User.Role role);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.profile p WHERE u.role = com.peertutormatchmaker.entity.User$Role.TUTOR AND (p.subjects LIKE CONCAT('%', :subject, '%') OR :subject = '')")
    List<User> findTutorsBySubject(@Param("subject") String subject);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.profile p WHERE u.role = com.peertutormatchmaker.entity.User$Role.TUTOR AND p.rating >= :minRating")
    List<User> findTutorsByMinRating(@Param("minRating") Double minRating);
}