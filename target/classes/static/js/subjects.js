// Subject categories and suggestions for PeerTutorMatchmaker
const SUBJECT_CATEGORIES = {
    'STEM': [
        'Mathematics', 'Algebra', 'Calculus', 'Geometry', 'Statistics',
        'Physics', 'Chemistry', 'Biology', 'Biochemistry', 'Anatomy',
        'Computer Science', 'Programming', 'Web Development', 'Data Science',
        'Engineering', 'Robotics', 'Electronics'
    ],
    'Languages': [
        'English Literature', 'English Grammar', 'Writing', 'Creative Writing',
        'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese',
        'Arabic', 'Portuguese', 'Russian', 'Korean'
    ],
    'Social Sciences': [
        'History', 'World History', 'American History', 'Geography',
        'Psychology', 'Sociology', 'Political Science', 'Philosophy',
        'Anthropology', 'International Relations'
    ],
    'Business & Economics': [
        'Economics', 'Microeconomics', 'Macroeconomics', 'Business Studies',
        'Accounting', 'Finance', 'Marketing', 'Management', 'Entrepreneurship',
        'Business Law', 'International Business'
    ],
    'Arts & Humanities': [
        'Art', 'Drawing', 'Painting', 'Design', 'Graphic Design',
        'Photography', 'Music', 'Music Theory', 'Drama', 'Theater',
        'Film Studies', 'Art History'
    ],
    'Test Preparation': [
        'SAT Prep', 'ACT Prep', 'GRE Prep', 'GMAT Prep', 'TOEFL Prep',
        'IELTS Prep', 'AP Courses', 'IB Courses'
    ],
    'Professional Skills': [
        'Public Speaking', 'Presentation Skills', 'Research Methods',
        'Study Skills', 'Time Management', 'Academic Writing',
        'Critical Thinking', 'Problem Solving'
    ]
};

// Popular subject combinations
const POPULAR_COMBINATIONS = [
    ['Mathematics', 'Physics'],
    ['Chemistry', 'Biology'],
    ['Computer Science', 'Programming'],
    ['English Literature', 'Writing'],
    ['History', 'Geography'],
    ['Economics', 'Business Studies'],
    ['Spanish', 'French'],
    ['Art', 'Design']
];

// Get all subjects as a flat array
function getAllSubjects() {
    return Object.values(SUBJECT_CATEGORIES).flat();
}

// Search subjects by keyword
function searchSubjects(keyword) {
    const allSubjects = getAllSubjects();
    return allSubjects.filter(subject => 
        subject.toLowerCase().includes(keyword.toLowerCase())
    );
}

// Get subjects by category
function getSubjectsByCategory(category) {
    return SUBJECT_CATEGORIES[category] || [];
}

// Get random popular subjects
function getPopularSubjects(count = 10) {
    const popular = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
        'English Literature', 'History', 'Economics', 'Spanish', 'Art'
    ];
    return popular.slice(0, count);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUBJECT_CATEGORIES,
        POPULAR_COMBINATIONS,
        getAllSubjects,
        searchSubjects,
        getSubjectsByCategory,
        getPopularSubjects
    };
}