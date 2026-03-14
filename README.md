# PeerTutorMatchmaker

An interactive peer tutoring platform that connects students seeking help with tutors who can teach specific subjects.

## Features

- **User Management**: Registration, login, and role-based access (Student, Tutor, Admin)
- **Matching System**: Recommends tutors based on subject expertise, availability, and ratings
- **Session Scheduling**: Book, reschedule, and cancel tutoring sessions
- **Feedback System**: Rate and review tutors after sessions
- **Notifications**: Real-time alerts for session requests and updates

## Tech Stack

- **Backend**: Spring Boot (Java 17)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MySQL
- **ORM**: Spring Data JPA
- **Authentication**: Spring Security
- **Build Tool**: Maven

## Setup Instructions

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Database Setup
1. Install MySQL and create a database:
```sql
CREATE DATABASE peer_tutor_db;
```

2. Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Running the Application
1. Clone the repository
2. Navigate to the project directory
3. Run the application:
```bash
mvn spring-boot:run
```

4. Access the application at `http://localhost:9090`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Authenticate user

### Tutors
- `GET /api/tutors` - Get list of tutors
- `GET /api/tutors?subject=Math` - Filter tutors by subject
- `GET /api/tutors?minRating=4` - Filter tutors by minimum rating

### Sessions
- `POST /api/sessions` - Create a tutoring session
- `PUT /api/sessions/{id}` - Update session
- `DELETE /api/sessions/{id}` - Cancel session
- `GET /api/sessions/tutor/{tutorId}` - Get sessions by tutor
- `GET /api/sessions/student/{studentId}` - Get sessions by student

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/{tutorId}` - Get tutor ratings

### Notifications
- `GET /api/notifications/{userId}` - Get user notifications
- `PUT /api/notifications/{notificationId}/read` - Mark as read

## Sample API Usage

### Register a Student
```bash
curl -X POST http://localhost:9090/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'
```

### Register a Tutor
```bash
curl -X POST http://localhost:9090/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "TUTOR",
    "subjects": "Math, Physics, Chemistry",
    "skillLevel": "Advanced",
    "availability": "Mon-Fri 6-8 PM"
  }'
```

### Book a Session
```bash
curl -X POST http://localhost:9090/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "tutorId": 2,
    "studentId": 1,
    "subject": "Math",
    "dateTime": "2024-01-15T18:00:00"
  }'
```

### Submit Feedback
```bash
curl -X POST http://localhost:9090/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": 1,
    "studentId": 1,
    "tutorId": 2,
    "rating": 5,
    "comments": "Excellent tutoring session!"
  }'
```

## Web Pages

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard (redirects based on role)
- `/student-dashboard` - Student interface
- `/tutor-dashboard` - Tutor interface
- `/feedback` - Feedback submission page
- `/notifications` - Notifications page

## Project Structure

```
src/
├── main/
│   ├── java/com/peertutormatchmaker/
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data transfer objects
│   │   └── config/         # Configuration classes
│   └── resources/
│       ├── templates/       # HTML templates
│       └── application.properties
```

## Security Features

- BCrypt password encoding
- Role-based access control
- CSRF protection disabled for API endpoints
- Session-based authentication

## Default Test Data

After running the application, you can create test users through the registration page or API endpoints. The application will automatically create the database tables on first run.