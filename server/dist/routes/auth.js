"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const mongoose_1 = __importDefault(require("mongoose"));
const validateRequest_1 = require("../middleware/validateRequest");
const auth_schema_1 = require("../schemas/auth.schema");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
// Store verification codes temporarily (in production, use Redis or similar)
const verificationCodes = new Map();
// Mock email sending for development
const mockSendEmail = async (to, code) => {
    console.log(`[DEV] Verification code for ${to}: ${code}`);
    return Promise.resolve();
};
// Send verification code
router.post('/verify/send', (0, express_validator_1.body)('email').isEmail(), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        verificationCodes.set(email, { code, expires });
        // In development, just log the code
        await mockSendEmail(email, code);
        return res.json({
            success: true,
            message: 'Verification code sent successfully',
        });
    }
    catch (error) {
        console.error('Error sending verification code:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send verification code'
        });
    }
}));
// Verify code
router.post('/verify/code', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('code').isLength({ min: 6, max: 6 }),
], (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, code } = req.body;
        console.log('Verifying code:', { email, code });
        console.log('Stored codes:', Array.from(verificationCodes.entries()));
        const storedData = verificationCodes.get(email);
        console.log('Stored data for email:', storedData);
        if (!storedData) {
            console.log('No verification code found for email:', email);
            return res.status(400).json({ error: 'No verification code found' });
        }
        if (new Date() > storedData.expires) {
            console.log('Code expired. Current time:', new Date(), 'Expiry:', storedData.expires);
            verificationCodes.delete(email);
            return res.status(400).json({ error: 'Verification code expired' });
        }
        if (storedData.code !== code) {
            console.log('Code mismatch. Received:', code, 'Stored:', storedData.code);
            return res.status(400).json({ error: 'Invalid verification code' });
        }
        return res.json({ success: true, message: 'Code verified successfully' });
    }
    catch (error) {
        console.error('Error verifying code:', error);
        return res.status(500).json({ error: 'Failed to verify code' });
    }
}));
// Register new user
router.post('/register', (0, validateRequest_1.validateRequest)(auth_schema_1.registerSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        // Verify the verification code first
        const storedData = verificationCodes.get(email);
        console.log('Registration verification check:', {
            email,
            storedData,
            allStoredCodes: Array.from(verificationCodes.entries())
        });
        if (!storedData) {
            console.log('No verification code found for email:', email);
            return res.status(400).json({ error: 'No verification code found' });
        }
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash password
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        // Create user
        const user = new User_1.User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
        // Save user to database
        try {
            await user.save();
            console.log('User saved successfully:', email);
        }
        catch (saveError) {
            console.error('Error saving user:', {
                error: saveError.message,
                code: saveError.code,
                keyPattern: saveError.keyPattern,
                keyValue: saveError.keyValue
            });
            throw saveError;
        }
        // Clear verification code
        verificationCodes.delete(email);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, config_1.config.jwtSecret, { expiresIn: '24h' });
        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ error: 'User already exists' });
        }
        return res.status(500).json({ error: 'Failed to register user' });
    }
}));
// Login
router.post('/login', (0, validateRequest_1.validateRequest)(auth_schema_1.loginSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, config_1.config.jwtSecret, { expiresIn: '24h' });
        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Failed to login' });
    }
}));
// Get user profile
router.get('/profile', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    }
    catch (error) {
        console.error('Profile error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
}));
exports.default = router;
