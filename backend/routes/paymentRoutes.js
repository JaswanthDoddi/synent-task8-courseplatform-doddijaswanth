const express = require('express');
const router = express.Router();
const { checkout, paymentVerification } = require('../controllers/paymentController');
const { protect } = require('../config/authMiddleware');

// Secure payment actions behind our standard JWT verification layer
router.post('/checkout', protect, checkout);
router.post('/verify', protect, paymentVerification);

module.exports = router;
