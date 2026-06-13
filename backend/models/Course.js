const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }, // URL for video playback
    duration: { type: String } // e.g., "10:45"
});

const ModuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lessons: [LessonSchema] // Array of nested lessons
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    thumbnail: { type: String },
    modules: [ModuleSchema] // Modules -> Lessons nested structure
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);