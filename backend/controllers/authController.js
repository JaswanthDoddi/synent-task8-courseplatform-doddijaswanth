const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Helper function to issue JWTs
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'your_super_secret_jwt_key',
        { expiresIn: '7d' }
    );
};

// @desc    Register new user account
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation: Verify if account already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Initialize user record
        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully!',
            token: generateToken(user),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};

// @desc    Authenticate user & return token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Locate user account
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Verify password match
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({
            message: 'Login successful!',
            token: generateToken(user),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during authentication.', error: error.message });
    }
};