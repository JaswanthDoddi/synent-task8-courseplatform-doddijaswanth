const Course = require('../models/Course');

// @desc    Get all available courses (Public/Student Dashboard)
// @route   GET /api/courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching courses.', error: error.message });
    }
};

// @desc    Get single course detailed structure
// @route   GET /api/courses/:id
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found.' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// @desc    Create a new course (Admin Panel exclusive)
// @route   POST /api/courses
exports.createCourse = async (req, res) => {
    try {
        const { title, description, price, thumbnail, modules } = req.body;
        const newCourse = new Course({ title, description, price, thumbnail, modules });
        
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully!', course: newCourse });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create course.', error: error.message });
    }
};