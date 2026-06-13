const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const User = require('../models/user');

// Initialize Razorpay Instance with credentials from environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'your_razorpay_test_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_test_key_secret'
});

// @desc    Initiate a secure checkout order
// @route   POST /api/payments/checkout
exports.checkout = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Target course not found.' });
        }

        // Razorpay expects monetary values in the lowest currency unit (Paise for INR)
        const options = {
            amount: Number(course.price * 100), 
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Razorpay order generation failed.', error: error.message });
    }
};

// @desc    Verify incoming signature and register course enrollment
// @route   POST /api/payments/verify
exports.paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

        // Recreate the expected signature securely to prevent request tampering
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_test_key_secret')
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Find user and append the new course to their enrolled profile array
            await User.findByIdAndUpdate(req.user.id, {
                $addToSet: { enrolledCourses: courseId } // Prevents duplicate enrollments
            });

            res.status(200).json({
                success: true,
                message: "Payment successfully verified! Course added to your dashboard."
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Signature mismatch. Transaction verification failed."
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server verification error.', error: error.message });
    }
};
