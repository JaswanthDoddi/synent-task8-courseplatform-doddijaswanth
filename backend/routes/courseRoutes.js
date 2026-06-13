const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse } = require('../controllers/courseController');
const { protect, adminOnly } = require('../config/authMiddleware');

// Student endpoints (Protected so they must be logged in to view details)
router.get('/', protect, getCourses);
router.get('/:id', protect, getCourseById);

// Admin exclusive endpoints
router.post('/', protect, adminOnly, createCourse);

module.exports = router;
