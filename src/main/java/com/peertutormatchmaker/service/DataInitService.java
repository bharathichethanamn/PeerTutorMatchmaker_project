package com.peertutormatchmaker.service;

import com.peertutormatchmaker.entity.Profile;
import com.peertutormatchmaker.entity.User;
import com.peertutormatchmaker.repository.ProfileRepository;
import com.peertutormatchmaker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataInitService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            createSampleData();
        }
    }

    private void createSampleData() {
        // Create multiple tutors with diverse subjects
        createTutor("John Smith", "tutor@example.com", "Mathematics, Physics, Chemistry", "Expert", "Mon-Fri 6-8 PM, Weekends 10 AM-4 PM", 4.8, 25);
        createTutor("Sarah Johnson", "sarah.tutor@example.com", "Computer Science, Programming, Web Development", "Advanced", "Weekdays 7-9 PM, Saturday mornings", 4.6, 18);
        createTutor("Michael Chen", "michael.tutor@example.com", "Biology, Anatomy, Biochemistry", "Expert", "Flexible schedule, prefer evenings", 4.9, 32);
        createTutor("Emily Davis", "emily.tutor@example.com", "English Literature, Writing, Grammar", "Advanced", "Mon-Wed-Fri 5-7 PM", 4.7, 22);
        createTutor("David Wilson", "david.tutor@example.com", "History, Geography, Social Studies", "Intermediate", "Weekends and evenings", 4.4, 15);
        createTutor("Lisa Rodriguez", "lisa.tutor@example.com", "Spanish, French, Language Arts", "Expert", "Daily 4-6 PM", 4.8, 28);
        createTutor("James Brown", "james.tutor@example.com", "Economics, Business Studies, Statistics", "Advanced", "Tuesday-Thursday evenings", 4.5, 20);
        createTutor("Anna Kim", "anna.tutor@example.com", "Art, Design, Photography", "Intermediate", "Weekends only", 4.3, 12);

        // Create multiple students with different learning needs
        createStudent("Jane Doe", "student@example.com", "Mathematics, Physics", "Beginner", "Evenings and weekends");
        createStudent("Alex Thompson", "alex.student@example.com", "Computer Science, Programming", "Intermediate", "Weekday evenings");
        createStudent("Maria Garcia", "maria.student@example.com", "Biology, Chemistry", "Beginner", "Flexible schedule");
        createStudent("Robert Lee", "robert.student@example.com", "English Literature, Writing", "Intermediate", "Afternoons preferred");
        createStudent("Sophie Miller", "sophie.student@example.com", "History, Social Studies", "Beginner", "Weekend mornings");
        createStudent("Kevin Park", "kevin.student@example.com", "Spanish, French", "Beginner", "Evening classes");

        System.out.println("Sample data created with diverse subjects:");
        System.out.println("=== TUTORS ===");
        System.out.println("Math/Science: tutor@example.com / password");
        System.out.println("Programming: sarah.tutor@example.com / password");
        System.out.println("Biology: michael.tutor@example.com / password");
        System.out.println("English: emily.tutor@example.com / password");
        System.out.println("History: david.tutor@example.com / password");
        System.out.println("Languages: lisa.tutor@example.com / password");
        System.out.println("Business: james.tutor@example.com / password");
        System.out.println("Art: anna.tutor@example.com / password");
        System.out.println("=== STUDENTS ===");
        System.out.println("Main Student: student@example.com / password");
        System.out.println("+ 5 more students with various subjects");
    }

    private void createTutor(String name, String email, String subjects, String skillLevel, String availability, double rating, int totalRatings) {
        User tutor = new User();
        tutor.setName(name);
        tutor.setEmail(email);
        tutor.setPassword(passwordEncoder.encode("password"));
        tutor.setRole(User.Role.TUTOR);
        tutor = userRepository.save(tutor);

        Profile tutorProfile = new Profile();
        tutorProfile.setUser(tutor);
        tutorProfile.setSubjects(subjects);
        tutorProfile.setSkillLevel(skillLevel);
        tutorProfile.setAvailability(availability);
        tutorProfile.setRating(rating);
        tutorProfile.setTotalRatings(totalRatings);
        profileRepository.save(tutorProfile);
    }

    private void createStudent(String name, String email, String subjects, String skillLevel, String availability) {
        User student = new User();
        student.setName(name);
        student.setEmail(email);
        student.setPassword(passwordEncoder.encode("password"));
        student.setRole(User.Role.STUDENT);
        student = userRepository.save(student);

        Profile studentProfile = new Profile();
        studentProfile.setUser(student);
        studentProfile.setSubjects(subjects);
        studentProfile.setSkillLevel(skillLevel);
        studentProfile.setAvailability(availability);
        studentProfile.setRating(0.0);
        studentProfile.setTotalRatings(0);
        profileRepository.save(studentProfile);
    }
}