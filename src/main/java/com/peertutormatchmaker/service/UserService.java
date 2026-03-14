package com.peertutormatchmaker.service;

import com.peertutormatchmaker.dto.UserRegistrationDto;
import com.peertutormatchmaker.entity.Profile;
import com.peertutormatchmaker.entity.User;
import com.peertutormatchmaker.repository.ProfileRepository;
import com.peertutormatchmaker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(UserRegistrationDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(User.Role.valueOf(dto.getRole().toUpperCase()));

        User savedUser = userRepository.save(user);

        // Always create profile
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setSubjects(dto.getSubjects() != null ? dto.getSubjects() : "");
        profile.setSkillLevel(dto.getSkillLevel() != null ? dto.getSkillLevel() : "");
        profile.setAvailability(dto.getAvailability() != null ? dto.getAvailability() : "");
        profile.setRating(0.0);
        profile.setTotalRatings(0);
        profileRepository.save(profile);
        savedUser.setProfile(profile);

        return savedUser;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findTutors() {
        return userRepository.findByRoleWithProfile(User.Role.TUTOR);
    }

    public List<User> findTutorsBySubject(String subject) {
        if (subject == null || subject.trim().isEmpty()) {
            return findTutors();
        }
        return userRepository.findTutorsBySubject(subject.trim());
    }

    public List<User> findTutorsByRating(Double minRating) {
        return userRepository.findTutorsByMinRating(minRating);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}