package com.peertutormatchmaker.dto;

public class TutorDto {
    private Long userId;
    private String name;
    private String email;
    private String subjects;
    private String skillLevel;
    private String availability;
    private Double rating;
    private Integer totalRatings;

    public TutorDto() {}

    public TutorDto(Long userId, String name, String email, String subjects, 
                   String skillLevel, String availability, Double rating, Integer totalRatings) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.subjects = subjects;
        this.skillLevel = skillLevel;
        this.availability = availability;
        this.rating = rating;
        this.totalRatings = totalRatings;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubjects() { return subjects; }
    public void setSubjects(String subjects) { this.subjects = subjects; }

    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalRatings() { return totalRatings; }
    public void setTotalRatings(Integer totalRatings) { this.totalRatings = totalRatings; }
}