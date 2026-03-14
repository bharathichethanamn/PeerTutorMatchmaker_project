package com.peertutormatchmaker.repository;

import com.peertutormatchmaker.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_UserIdOrderByTimestampDesc(Long userId);
    List<Notification> findByUser_UserIdAndIsReadFalse(Long userId);
}