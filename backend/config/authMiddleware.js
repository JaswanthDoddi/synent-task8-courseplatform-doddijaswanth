const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to verify a standard logged-in user via JWT
exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key');
            
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token invalid or expired.' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};

// Middleware to restrict access strictly to Admin accounts
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }
};